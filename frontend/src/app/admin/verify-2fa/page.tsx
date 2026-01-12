'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Mail, ArrowLeft } from 'lucide-react'
import { API_URL } from '@/lib/config'

export default function AdminVerify2FAPage() {
     console.log('🚀 PAGE VERIFY-2FA CHARGÉE !')  // ← AJOUTE CETTE LIGNE
  
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    // DEBUG
    console.log('🔍 Vérification sessionStorage...')
    const storedEmail = sessionStorage.getItem('admin2faEmail')
    console.log('📧 Email trouvé:', storedEmail)
    
    if (!storedEmail) {
      console.log('❌ Pas d\'email → Redirection vers login')
      router.push('/admin/login')
      return
    }
    
    console.log('✅ Email OK, on reste sur verify-2fa')
    setEmail(storedEmail)

    // Countdown pour pouvoir renvoyer le code
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus suivant
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }

    // Auto-submit si tous remplis
    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value].join('')
      if (fullCode.length === 6) {
        handleVerify(fullCode)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || code.join('')
    
    if (finalCode.length !== 6) {
      setError('Veuillez entrer le code complet')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/admin/login/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: finalCode })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.data.token)
        sessionStorage.removeItem('admin2faEmail')
        router.push('/admin')
      } else {
        setError(data.message || 'Code invalide')
        setCode(['', '', '', '', '', ''])
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus()
        }
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/admin/login/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setCanResend(false)
        setCountdown(60)
        setCode(['', '', '', '', '', ''])
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus()
        }
        
        // Redémarrer le countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true)
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(data.message || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vérification de sécurité
          </h1>
          <p className="text-gray-600 text-sm">
            Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
          </p>
        </div>

        {/* Code inputs */}
        <div className="mb-6">
          <div className="flex gap-2 justify-center mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors text-gray-900"
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => handleVerify()}
            disabled={loading || code.join('').length !== 6}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Vérification...' : 'Vérifier'}
          </button>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                <Mail className="inline h-4 w-4 mr-1" />
                Renvoyer le code
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Renvoyer le code dans {countdown}s
              </p>
            )}
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem('admin2faEmail')
              router.push('/admin/login')
            }}
            className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>💡 Conseil :</strong> Le code expire dans 10 minutes. Vérifiez vos spams si vous ne le recevez pas.
          </p>
        </div>
      </div>
    </div>
  )
}