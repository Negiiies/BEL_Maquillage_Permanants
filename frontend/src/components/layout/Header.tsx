'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()

  // Déterminer si on est sur une page avec fond clair
  const isLightBackground = [
    '/mon-compte',
    '/reserver',
    '/booking',
    '/mes-reservations',
    
  ].some(path => pathname?.startsWith(path))

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('clientToken')
      setIsAuthenticated(!!token)
    }
    
    checkAuth()
    
    // Écouter les changements de localStorage
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Prestations', href: '/prestations' },
    { name: 'Formations', href: '/formations' },
    { name: 'Contact', href: '/contact' },
  ]

  // Styles adaptatifs selon le fond de la page
  const getHeaderStyle = () => {
    if (isLightBackground) {
      // Pour les pages avec fond clair
      return isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/80 backdrop-blur-sm'
    } else {
      // Pour les pages avec fond sombre (accueil, etc.)
      return isScrolled 
        ? 'bg-black/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }
  }

  const getTextColor = () => {
    return isLightBackground ? 'text-gray-900' : 'text-white'
  }

  const getTextColorHover = () => {
    return isLightBackground 
      ? 'text-gray-600 hover:text-gray-900' 
      : 'text-white/80 hover:text-white'
  }

  const getButtonStyle = () => {
    return isLightBackground
      ? 'bg-gray-900 text-white hover:bg-gray-800'
      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40'
  }

  const getMobileMenuBg = () => {
    return isLightBackground
      ? 'bg-white/95 backdrop-blur-md border-t border-gray-200'
      : 'bg-black/95 backdrop-blur-md border-t border-white/10'
  }

  const getUnderlineColor = () => {
    return isLightBackground ? 'bg-gray-900' : 'bg-white'
  }

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${getHeaderStyle()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="w-16 h-16 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/images/Logo .svg" 
                  alt="BEL Institut" 
                  className={`w-full h-full object-contain filter drop-shadow-lg ${
                    isLightBackground ? 'brightness-0' : ''
                  }`}
                />
              </div>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${getTextColorHover()} text-sm font-light tracking-[0.1em] uppercase transition-all duration-300 relative group`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-px ${getUnderlineColor()} transition-all duration-300 group-hover:w-full`}></span>
              </Link>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  className={`${getTextColorHover()} text-sm font-light tracking-[0.05em] transition-colors duration-300`}
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className={`${getTextColorHover()} text-sm font-light tracking-[0.05em] transition-colors duration-300`}
                >
                  Inscription
                </Link>
                <Link
                  href="/auth/login"
                  className={`${getButtonStyle()} px-6 py-2.5 text-sm font-light tracking-[0.05em] transition-all duration-300`}
                >
                  Prendre RDV
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/mon-compte"
                  className={`${getTextColorHover()} text-sm font-light tracking-[0.05em] transition-colors duration-300 flex items-center space-x-2`}
                >
                  <User className="h-4 w-4" />
                  <span>Mon compte</span>
                </Link>
                <Link
                  href="/reserver"
                  className={`${getButtonStyle()} px-6 py-2.5 text-sm font-light tracking-[0.05em] transition-all duration-300`}
                >
                  Prendre RDV
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${getTextColorHover()} p-2 transition-colors duration-300`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`lg:hidden ${getMobileMenuBg()}`}>
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block ${getTextColorHover()} text-base font-light tracking-[0.05em] transition-colors duration-300 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className={`border-t ${isLightBackground ? 'border-gray-200' : 'border-white/10'} pt-4 mt-6 space-y-4`}>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/login"
                    className={`block ${getTextColorHover()} text-base font-light tracking-[0.05em] transition-colors duration-300 py-2`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className={`block ${getTextColorHover()} text-base font-light tracking-[0.05em] transition-colors duration-300 py-2`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                  <Link
                    href="/auth/login"
                    className={`block ${getButtonStyle()} px-4 py-3 text-center text-base font-light tracking-[0.05em] transition-all duration-300 mt-4`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Prendre Rendez-vous
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/mon-compte"
                    className={`flex items-center ${getTextColorHover()} text-base font-light tracking-[0.05em] transition-colors duration-300 py-2`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Mon Compte
                  </Link>
                  <Link
                    href="/reserver"
                    className={`block ${getButtonStyle()} px-4 py-3 text-center text-base font-light tracking-[0.05em] transition-all duration-300`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Prendre RDV
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header