'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { API_URL } from '@/lib/config' 
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  MessageSquare, 
  Sparkles,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // ✅ TOUS les hooks EN PREMIER (avant toute condition)
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Condition APRÈS les hooks
  useEffect(() => {
    // Ne pas faire la vérification pour la page login
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/verify', {
          headers: { 'Authorization': 'Bearer ' + token }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.data.user)
        } else {
          localStorage.removeItem('adminToken')
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Erreur vérification auth:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

 const handleLogout = async () => {
  try {
    const token = localStorage.getItem('adminToken')
    
    await fetch(`${API_URL}/api/admin/logout`, {  // ✅ Utilise API_URL
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  } catch (error) {
    console.error('Erreur logout:', error)
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }
}
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: Sparkles },
    { name: 'Créneaux', href: '/admin/timeslots', icon: Calendar },
    { name: 'Réservations', href: '/admin/bookings', icon: Users },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Statistiques', href: '/admin/stats', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ]

  // ✅ Condition de rendu APRÈS tous les hooks
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ... reste du code identique ... */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:flex lg:flex-col`}>
        
        <div className="flex items-center justify-between h-16 px-6 bg-slate-900 border-b border-slate-700">
          <div className="text-white font-bold text-xl">BEL Admin</div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="mt-auto p-4 bg-slate-900 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate" title={user?.email}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0" title="Se déconnecter">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="px-4 h-16 flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-sm font-medium text-gray-700">BEL Admin</span>
            <div className="w-6" />
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}