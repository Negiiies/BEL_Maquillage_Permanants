'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Calendar, LogOut, Mail, Phone, Edit } from 'lucide-react'
import { API_URL } from '@/lib/config'
export default function MonComptePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('clientToken')
      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.data)
        } else {
          localStorage.removeItem('clientToken')
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Erreur:', error)
        localStorage.removeItem('clientToken')
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem('clientToken')
    
    await fetch(`${API_URL}/api/auth/logout`, {  // ✅ Changé ici
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    localStorage.removeItem('clientToken')
    window.location.href = '/'
  } catch (error) {
    console.error('Erreur logout:', error)
    localStorage.removeItem('clientToken')
    window.location.href = '/'
  }
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    // Ajout de pt-24 (padding-top: 6rem = 96px) pour compenser la navbar (h-20 = 80px + marge)
    <div className="min-h-screen bg-gray-50 pt-24 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Mon compte</h1>
              <p className="text-gray-600 text-sm">Gérez vos informations personnelles</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>

          {/* Informations personnelles */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            {user?.phone && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {user?.dateOfBirth && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Date de naissance</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.dateOfBirth).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/reserver"
            className="bg-black text-white p-6 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <Calendar className="h-8 w-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Prendre rendez-vous</h3>
            <p className="text-sm text-gray-300">Réserver une nouvelle prestation</p>
          </Link>

          <Link
            href="/mes-reservations"
            className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-black transition-colors group"
          >
            <Calendar className="h-8 w-8 mb-3 text-gray-600 group-hover:text-black transition-colors" />
            <h3 className="font-semibold text-lg mb-1 text-gray-900">Mes réservations</h3>
            <p className="text-sm text-gray-600">Consulter mon historique</p>
          </Link>
        </div>
      </div>
    </div>
  )
}