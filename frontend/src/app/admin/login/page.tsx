'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.data.token)
        router.push('/admin')
      } else {
        setError(data.message || 'Identifiants incorrects')
      }
    } catch (error) {
      console.error('Erreur connexion:', error)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-8 font-serif">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-neutral-900 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-light text-neutral-900 mb-2">
            BEL Admin
          </h1>
          <p className="text-neutral-600 font-light">
            Espace administrateur sécurisé
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white border-2 border-neutral-900 p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm uppercase tracking-[0.2em] text-neutral-700 mb-3 font-medium">
                Email administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="admin@bel-institut.fr"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm uppercase tracking-[0.2em] text-neutral-700 mb-3 font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="border-l-2 border-red-600 pl-4 py-3 bg-red-50">
                <p className="text-sm text-red-600 font-light">{error}</p>
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors text-sm uppercase tracking-[0.2em] font-medium"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

          </form>

          {/* Note de sécurité */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-neutral-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Connexion sécurisée par chiffrement. Vos identifiants sont protégés et jamais stockés en clair.
              </p>
            </div>
          </div>

        </div>

        {/* Footer sécurité */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 font-light">
            Accès réservé aux administrateurs BEL Institut
          </p>
        </div>

      </div>
    </div>
  )
}