import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function FooterMinimal() {
  return (
    <footer className="bg-black text-white">
      {/* Section Newsletter - Style Dior */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide">
              Restez Informée
            </h2>
            <p className="text-sm text-gray-400 mb-8 font-light tracking-wide">
              Recevez nos actualités, conseils beauté et offres exclusives
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 bg-white/5 border border-white/20 px-6 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors placeholder:text-gray-500 font-light"
                required
              />
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Logo & Tagline */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <img 
                src="/images/Logo .svg" 
                alt="BEL Institut de Beauté" 
                className="h-20 w-auto brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-light max-w-sm">
              L'excellence au service de votre beauté. 
              Expertise, raffinement et savoir-faire depuis 2019.
            </p>
            
            {/* Réseaux sociaux minimalistes */}
            <div className="flex items-center space-x-4 pt-4">
              <a 
                href="https://www.instagram.com/bel_institut_de_beaute?igsh=MW41dHN0dnZjMzNpcg==" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a 
                href="https://www.tiktok.com/@bel_institut?_t=ZN-90NqZO3TOB4&_r=1" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-gray-500">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Prestations', href: '/prestations' },
                { name: 'Formations', href: '/formations' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-gray-500">
              Services
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-400 font-light">Maquillage Permanent</li>
              <li className="text-sm text-gray-400 font-light">Extensions de Cils</li>
              <li className="text-sm text-gray-400 font-light">Soins du Regard</li>
              <li className="pt-2">
                <Link 
                  href="/reserver"
                  className="text-sm text-white hover:text-gray-300 transition-colors font-light inline-flex items-center group"
                >
                  Réserver
                  <svg 
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-gray-500">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+33123456789"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  01 23 45 67 89
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@bel-institut.fr"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  contact@bel-institut.fr
                </a>
              </li>
              <li className="text-sm text-gray-400 font-light pt-2">
                Paris, France
              </li>
            </ul>
            
            {/* Horaires minimalistes */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 font-light tracking-wider mb-2">
                HORAIRES
              </p>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Lun - Ven : 9h - 18h<br />
                Samedi : 10h - 17h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-gray-500">
            <p className="font-light tracking-wide">
              © {new Date().getFullYear()} BEL Institut de Beauté
            </p>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/mentions-legales"
                className="hover:text-white transition-colors font-light tracking-wide"
              >
                Mentions Légales
              </Link>
              <Link 
                href="/politique-confidentialite"
                className="hover:text-white transition-colors font-light tracking-wide"
              >
                Confidentialité
              </Link>
              <Link 
                href="/cgv"
                className="hover:text-white transition-colors font-light tracking-wide"
              >
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}