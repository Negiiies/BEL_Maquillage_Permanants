// frontend/src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Calendar, 
  Sparkles, 
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react'

interface DashboardStats {
  services: { total: number; active: number }
  formations: { total: number; active: number }
  contacts: { total: number; unread: number; recent: number }
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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        
        // Dashboard stats
        const dashboardResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json()
          setDashboardStats(dashboardData.data)
        }
        
        // Booking stats
        try {
          const bookingResponse = await fetch('http://localhost:5000/api/admin/bookings/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (bookingResponse.ok) {
            const bookingData = await bookingResponse.json()
            setBookingStats(bookingData.data)
          }
        } catch (bookingError) {
          console.log('Booking stats non disponibles')
        }
        
      } catch (error) {
        console.error('Erreur chargement stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre institut de beauté</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services Actifs</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardStats?.services?.active || 0}
              </p>
              <p className="text-sm text-gray-500">
                sur {dashboardStats?.services?.total || 0} total
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations</p>
              <p className="text-3xl font-bold text-gray-900">
                {bookingStats?.confirmed || 0}
              </p>
              <p className="text-sm text-gray-500">
                {bookingStats?.thisMonth || 0} ce mois
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus du mois</p>
              <p className="text-3xl font-bold text-gray-900">
                {bookingStats?.monthlyRevenue || 0}€
              </p>
              <p className="text-sm text-green-600">
                +12% vs mois dernier
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages non lus</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardStats?.contacts?.unread || 0}
              </p>
              <p className="text-sm text-gray-500">
                sur {dashboardStats?.contacts?.total || 0} total
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Statuts des réservations */}
      {bookingStats && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">État des réservations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.pending}</p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.confirmed}</p>
              <p className="text-sm text-gray-600">Confirmées</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.completed}</p>
              <p className="text-sm text-gray-600">Terminées</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides et activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions rapides</h2>
          <div className="space-y-4">
            <Link 
              href="/admin/services" 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">Gérer les services</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link 
              href="/admin/bookings" 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">Voir les réservations</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link 
              href="/admin/contacts" 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Messages clients</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Activité récente</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Nouvelle réservation confirmée</p>
                <p className="text-xs text-gray-500">il y a 5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Service "Extensions volume" mis à jour</p>
                <p className="text-xs text-gray-500">il y a 1 heure</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Nouveau message de contact reçu</p>
                <p className="text-xs text-gray-500">il y a 2 heures</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Créneaux générés pour la semaine</p>
                <p className="text-xs text-gray-500">il y a 3 heures</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message de bienvenue si pas de données */}
      {!dashboardStats && !bookingStats && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bienvenue dans votre espace admin</h3>
          <p className="text-gray-600 mb-4">
            Commencez par configurer vos services et créer vos premiers créneaux.
          </p>
          <Link 
            href="/admin/services" 
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un service
          </Link>
        </div>
      )}
    </div>
  )
}