// frontend/src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Euro,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface Stats {
  services: { total: number; active: number }
  formations: { total: number; active: number }
  contacts: { total: number; unread: number; recent: number }
}

interface Booking {
  id: number
  bookingDate: string
  status: string
  client: {
    firstName: string
    lastName: string
    email: string
  }
  service: {
    name: string
    price: number
  }
  timeSlot: {
    date: string
    startTime: string
  }
}

interface BookingStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  thisMonth: number
  monthlyRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        window.location.href = '/admin/login'
        return
      }
      
      try {
        // Récupérer les statistiques générales
        const statsRes = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          if (statsData.success) {
            setStats(statsData.data)
          }
        }

        // Récupérer les statistiques de réservations
        const bookingStatsRes = await fetch('http://localhost:5000/api/bookings/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (bookingStatsRes.ok) {
          const bookingStatsData = await bookingStatsRes.json()
          if (bookingStatsData.success) {
            setBookingStats(bookingStatsData.data)
          }
        }

        // Récupérer les réservations récentes
        const bookingsRes = await fetch('http://localhost:5000/api/bookings?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          if (bookingsData.success) {
            // ✅ Protection : toujours un tableau
            setRecentBookings(Array.isArray(bookingsData.data) ? bookingsData.data : [])
          }
        }
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
        setRecentBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    }
    
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue sur votre espace administrateur BEL Institut
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Réservations totales */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-90">Réservations</p>
            <p className="text-3xl font-bold">{bookingStats?.total ?? 0}</p>
            <p className="text-xs opacity-75">Ce mois: {bookingStats?.thisMonth ?? 0}</p>
          </div>
        </div>

        {/* Réservations en attente */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <AlertCircle className="h-5 w-5 opacity-80" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-90">En attente</p>
            <p className="text-3xl font-bold">{bookingStats?.pending ?? 0}</p>
            <p className="text-xs opacity-75">À confirmer</p>
          </div>
        </div>

        {/* Messages non lus */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Nouveau</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-90">Messages</p>
            <p className="text-3xl font-bold">{stats?.contacts?.unread ?? 0}</p>
            <p className="text-xs opacity-75">Non lus</p>
          </div>
        </div>

        {/* Revenus du mois */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Euro className="h-6 w-6" />
            </div>
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-90">Revenus du mois</p>
            <p className="text-3xl font-bold">{bookingStats?.monthlyRevenue?.toFixed(0) ?? 0}€</p>
            <p className="text-xs opacity-75">{bookingStats?.completed ?? 0} prestations</p>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/bookings" className="group">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Gérer les réservations</h3>
            <p className="text-sm text-gray-600">Consulter et modifier les rendez-vous</p>
          </div>
        </Link>

        <Link href="/admin/timeslots" className="group">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Créneaux horaires</h3>
            <p className="text-sm text-gray-600">Gérer les disponibilités</p>
          </div>
        </Link>

        <Link href="/admin/contacts" className="group">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Messages clients</h3>
            <p className="text-sm text-gray-600">{stats?.contacts?.unread ?? 0} message(s) non lu(s)</p>
          </div>
        </Link>
      </div>

      {/* Réservations récentes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Réservations récentes</h2>
          <Link href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Voir tout →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune réservation récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {booking.client?.firstName} {booking.client?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {booking.service?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.timeSlot?.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {booking.timeSlot?.startTime}
                    </p>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    {getStatusBadge(booking.status)}
                  </div>

                  <p className="font-semibold text-gray-900 min-w-[60px] text-right">
                    {booking.service?.price}€
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}