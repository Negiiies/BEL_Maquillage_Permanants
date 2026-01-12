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
  LogOut,
  Menu,
  X,
  BookOpen,
  Clock
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ne pas vérifier pour les pages login et verify-2fa
    if (pathname === '/admin/login' || pathname === '/admin/verify-2fa') {
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
        // ✅ Vérifier que le token est toujours valide
        const response = await fetch(`${API_URL}/admin/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.data.user)
        } else {
          // Token invalide ou expiré
          localStorage.removeItem('adminToken')
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Erreur vérification auth:', error)
        localStorage.removeItem('adminToken')
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
      
      await fetch(`${API_URL}/admin/logout`, {
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
    { name: 'Formations', href: '/admin/formations', icon: BookOpen },
    { name: 'Créneaux', href: '/admin/timeslots', icon: Clock },
    { name: 'Réservations', href: '/admin/bookings', icon: Users },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ]

  // Ne pas afficher le layout pour les pages login et verify-2fa
  if (pathname === '/admin/login' || pathname === '/admin/verify-2fa') {
    return <>{children}</>
  }

  // Afficher le loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-serif font-light">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si pas d'utilisateur après le chargement, ne rien afficher (redirection en cours)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex font-serif">
      
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-neutral-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:flex lg:flex-col`}>
        
        {/* Header sidebar */}
        <div className="flex items-center justify-between h-16 px-6 bg-neutral-900 border-b-2 border-neutral-900">
          <div className="text-white font-light text-2xl">BEL Admin</div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white hover:text-neutral-300">
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-light transition-colors border-l-2 ${
                    isActive 
                      ? 'bg-neutral-900 text-white border-neutral-900' 
                      : 'text-neutral-700 hover:bg-neutral-100 border-transparent hover:border-neutral-300'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info + Logout */}
        <div className="mt-auto p-4 bg-neutral-100 border-t border-neutral-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="h-8 w-8 border border-neutral-900 flex items-center justify-center flex-shrink-0">
                <span className="text-neutral-900 text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-neutral-900 truncate" title={user?.email}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="text-neutral-600 hover:text-neutral-900 p-2 hover:bg-neutral-200 transition-colors flex-shrink-0" 
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile header */}
        <div className="bg-white shadow-sm border-b border-neutral-300 lg:hidden">
          <div className="px-4 h-16 flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-900 hover:text-neutral-700">
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <span className="text-sm font-light text-neutral-900">BEL Admin</span>
            <div className="w-6" />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}