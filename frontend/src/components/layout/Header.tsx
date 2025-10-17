'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
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
                  className="w-full h-full object-contain filter drop-shadow-lg"
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
                className="text-white/80 hover:text-white text-sm font-light tracking-[0.1em] uppercase transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-white/60 hover:text-white text-sm font-light tracking-[0.05em] transition-colors duration-300"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="text-white/60 hover:text-white text-sm font-light tracking-[0.05em] transition-colors duration-300"
                >
                  Inscription
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2.5 text-sm font-light tracking-[0.05em] transition-all duration-300 hover:bg-white/20 hover:border-white/40"
                >
                  Prendre RDV
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/mon-compte"
                  className="text-white/60 hover:text-white text-sm font-light tracking-[0.05em] transition-colors duration-300 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Mon compte</span>
                </Link>
                <Link
                  href="/reserver"
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2.5 text-sm font-light tracking-[0.05em] transition-all duration-300 hover:bg-white/20"
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
              className="text-white/80 hover:text-white p-2 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-white/80 hover:text-white text-base font-light tracking-[0.05em] transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-white/10 pt-4 mt-6 space-y-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/login"
                    className="block text-white/60 hover:text-white text-base font-light tracking-[0.05em] transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block text-white/60 hover:text-white text-base font-light tracking-[0.05em] transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                  <Link
                    href="/auth/login"
                    className="block bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 text-center text-base font-light tracking-[0.05em] transition-all duration-300 mt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Prendre Rendez-vous
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/mon-compte"
                    className="flex items-center text-white/60 hover:text-white text-base font-light tracking-[0.05em] transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Mon Compte
                  </Link>
                  <Link
                    href="/reserver"
                    className="block bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 text-center text-base font-light tracking-[0.05em] transition-all duration-300"
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