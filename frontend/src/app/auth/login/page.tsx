'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function ConnexionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('clientToken', data.data.token)
        router.push('/')
      } else {
        setError(data.message || 'Email ou mot de passe incorrect')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Partie gauche - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <div className="text-2xl font-bold tracking-tight">BEL</div>
          </Link>

          {/* Titre */}
          <h1 className="text-xl font-semibold mb-6 text-gray-900">
            Vous avez déjà utilisé BEL ?
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-2.5 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                placeholder="Email"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Mot de passe oublié */}
            <div className="text-right">
              <Link href="/mot-de-passe-oublie" className="text-sm text-gray-700 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Lien inscription */}
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Nouveau sur BEL ?
              </p>
              <Link 
                href="/auth/register" 
                className="text-sm font-medium text-gray-900 hover:underline inline-block mt-1"
              >
                Créer mon compte
              </Link>
            </div>
          </form>

          {/* Compte de test */}
          <div className="mt-8 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 text-xs">
              <strong>Compte de test :</strong><br />
              Email: marie.martin@email.com<br />
              Mot de passe: client123
            </p>
          </div>
        </div>
      </div>

      {/* Partie droite - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src="/images/Bel.JPG" 
          alt="BEL Institut" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-light mb-4 drop-shadow-lg">
              Bon retour chez BEL
            </h2>
            <p className="text-xl font-light drop-shadow-md">
              Accédez à votre espace personnel
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}