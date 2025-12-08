// frontend/src/app/admin/bookings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Eye
} from 'lucide-react'

interface Booking {
  id: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  bookingDate: string
  duration: number
  totalPrice: number
  notes?: string
  clientNotes?: string
  confirmationSent: boolean
  client: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  service: {
    id: number
    name: string
    category: string
    price: number
    duration: number 
  }
  timeSlot: {
    id: number
    date: string
    startTime: string
    endTime: string
  }
  createdAt: string
}

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'confirmed', label: 'Confirmée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'completed', label: 'Terminée', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
  { value: 'no_show', label: 'Absent', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
]

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Charger les réservations
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        window.location.href = '/admin/login'
        return
      }
      
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (dateFilter) params.append('date', dateFilter)
      
      const response = await fetch(`http://localhost:5000/api/admin/bookings?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBookings(Array.isArray(data.data) ? data.data : [])
      } else {
        setBookings([])
      }
    } catch (error) {
      console.error('Erreur chargement réservations:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [statusFilter, dateFilter])

  // Filtrer les réservations
  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase()
    return (
      booking.client?.firstName?.toLowerCase().includes(searchLower) ||
      booking.client?.lastName?.toLowerCase().includes(searchLower) ||
      booking.client?.email?.toLowerCase().includes(searchLower) ||
      booking.service?.name?.toLowerCase().includes(searchLower)
    )
  })

  // Mettre à jour le statut d'une réservation
  const updateBookingStatus = async (bookingId: number, newStatus: string, notes?: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, notes })
      })

      if (response.ok) {
        await fetchBookings()
        setShowModal(false)
        setSelectedBooking(null)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
      alert('Erreur de connexion')
    }
  }

  // Ouvrir le modal de détails
  const openDetailsModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non définie'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--'
    return timeString.slice(0, 5)
  }

  // ⭐ NOUVELLE FONCTION : Calculer l'heure de fin réelle du service
  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime) return '--:--'
    
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="text-gray-600">{bookings.length} réservation(s) au total</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher client ou service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.map(status => {
          const count = bookings.filter(b => b.status === status.value).length
          const Icon = status.icon
          return (
            <div key={status.value} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Icon className={`h-5 w-5 mr-2 ${status.value === 'pending' ? 'text-yellow-500' : 
                  status.value === 'confirmed' ? 'text-green-500' :
                  status.value === 'completed' ? 'text-blue-500' :
                  status.value === 'cancelled' ? 'text-red-500' : 'text-gray-500'}`} />
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-gray-600">{status.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Liste des réservations */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || statusFilter || dateFilter 
                ? 'Aucune réservation ne correspond à vos critères' 
                : 'Aucune réservation pour le moment'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const statusInfo = getStatusInfo(booking.status)
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.client?.firstName} {booking.client?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.client?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.service?.name}</div>
                        <div className="text-sm text-gray-500">{booking.service?.duration || booking.duration} min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.timeSlot ? (
                          <>
                            <div className="text-sm text-gray-900">
                              {formatDate(booking.timeSlot.date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {/* ⭐ CORRECTION : Afficher heure de début + durée du service */}
                              {formatTime(booking.timeSlot.startTime)} - {calculateEndTime(booking.timeSlot.startTime, booking.duration)}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Créneau non défini
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.totalPrice}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Détails de la réservation #{selectedBooking.id}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations client */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Client</h4>
                <div className="space-y-2">
                  {/* ⭐ CORRECTION : Texte en noir au lieu de gris clair */}
                  <div className="flex items-center text-sm text-gray-900">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{selectedBooking.client?.firstName} {selectedBooking.client?.lastName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{selectedBooking.client?.email}</span>
                  </div>
                  {selectedBooking.client?.phone && (
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedBooking.client.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations réservation */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Réservation</h4>
                <div className="space-y-2">
                  {selectedBooking.timeSlot ? (
                    <>
                      {/* ⭐ CORRECTION : Texte en noir */}
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{formatDate(selectedBooking.timeSlot.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        {/* ⭐ CORRECTION : Afficher heure de début + durée du service */}
                        <span>{formatTime(selectedBooking.timeSlot.startTime)} - {calculateEndTime(selectedBooking.timeSlot.startTime, selectedBooking.duration)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">
                      Créneau non défini
                    </div>
                  )}
                  <div className="text-sm text-gray-900">
                    <strong>Service:</strong> {selectedBooking.service?.name}
                  </div>
                  <div className="text-sm text-gray-900">
                    <strong>Prix:</strong> {selectedBooking.totalPrice}€
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(selectedBooking.clientNotes || selectedBooking.notes) && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-2">Notes</h4>
                {selectedBooking.clientNotes && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-900">
                      <strong>Client:</strong> {selectedBooking.clientNotes}
                    </p>
                  </div>
                )}
                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm text-gray-900">
                      <strong>Admin:</strong> {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {statusOptions.map(status => {
                if (status.value !== selectedBooking.status) {
                  return (
                    <button
                      key={status.value}
                      onClick={() => updateBookingStatus(selectedBooking.id, status.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                        status.value === 'confirmed' ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' :
                        status.value === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' :
                        status.value === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' :
                        status.value === 'no_show' ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200'
                      }`}
                    >
                      Marquer comme {status.label}
                    </button>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}