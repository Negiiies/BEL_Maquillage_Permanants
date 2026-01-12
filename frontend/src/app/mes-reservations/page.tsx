'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Phone, Mail, X, CheckCircle } from 'lucide-react'

interface Booking {
  id: number
  status: string
  bookingDate: string
  duration: number
  totalPrice: number
  clientNotes: string
  service: {
    name: string
    description: string
    category: string
  }
  timeSlot: {
    date: string
    startTime: string
    endTime: string
  }
}

// Composant qui utilise useSearchParams
function MesReservationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('clientToken')
      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch('/api/bookings/my-bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setBookings(data.data || [])
        } else {
          console.error('Erreur chargement réservations')
        }
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [router])

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      no_show: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

    const token = localStorage.getItem('clientToken')
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cancellationReason: 'Annulé par le client'
        })
      })

      if (response.ok) {
        // Recharger les réservations
        window.location.reload()
      } else {
        const data = await response.json()
        alert(data.message || 'Erreur lors de l\'annulation')
      }
    } catch (error) {
      console.error('Erreur annulation:', error)
      alert('Erreur de connexion')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Message de succès */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">
              Réservation confirmée ! Nous vous enverrons un email de confirmation.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
            <Link
              href="/reserver"
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Nouvelle réservation
            </Link>
          </div>
          <p className="text-gray-600 text-sm">
            Retrouvez l&apos;historique de vos rendez-vous chez BEL Institut
          </p>
        </div>

        {/* Liste des réservations */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune réservation
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n&apos;avez pas encore de rendez-vous. Réservez votre première prestation !
            </p>
            <Link
              href="/reserver"
              className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Prendre rendez-vous
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.service.name}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {booking.service.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {booking.totalPrice}€
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.timeSlot.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Heure</p>
                      <p className="font-medium text-gray-900">
                        {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.clientNotes && (
                  <div className="py-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Vos remarques :</p>
                    <p className="text-sm text-gray-900 italic">&quot;{booking.clientNotes}&quot;</p>
                  </div>
                )}

                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler cette réservation</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Informations de contact */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Besoin d&apos;aide ?</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">123 Rue de la Beauté, 75001 Paris</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">01 23 45 67 89</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">contact@bel-institut.fr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal avec Suspense
export default function MesReservationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <MesReservationsContent />
    </Suspense>
  )
}