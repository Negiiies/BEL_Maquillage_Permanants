// 5. Hooks personnalisés - frontend/src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/config'

interface User {
  id: number
  email: string
  role: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setLoading(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/verify`, {  // ✅ Changé ici
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.data.user)
        } else {
          localStorage.removeItem('adminToken')
        }
      } catch (error) {
        console.error('Erreur vérification token:', error)
        localStorage.removeItem('adminToken')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  const logout = async () => {  // ✅ Ajouté async
    try {
      const token = localStorage.getItem('adminToken')
      
      // ✅ Appeler l'API de logout
      await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      localStorage.removeItem('adminToken')
      setUser(null)
      router.push('/admin/login')
    } catch (error) {
      console.error('Erreur logout:', error)
      // Même en cas d'erreur, on déconnecte quand même
      localStorage.removeItem('adminToken')
      setUser(null)
      router.push('/admin/login')
    }
  }

  return { user, loading, logout }
}