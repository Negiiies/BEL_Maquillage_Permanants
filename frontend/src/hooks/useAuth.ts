// 5. Hooks personnalisés - frontend/src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
        const response = await fetch('http://localhost:5000/api/admin/verify', {
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

  const logout = () => {
    localStorage.removeItem('adminToken')
    setUser(null)
    router.push('/admin/login')
  }

  return { user, loading, logout }
}