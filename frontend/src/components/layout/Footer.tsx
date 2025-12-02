import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function FooterMinimal() {
  return (
    <footer className="bg-[#FAF7F2] text-neutral-900 font-serif">
      
      {/* Section Newsletter - Style Magazine */}
      <div className="border-t-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-8"></div>
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
              Restez Informée
            </h2>
            <p className="text-neutral-600 mb-12 font-light">
              Recevez nos actualités, conseils beauté et offres exclusives
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 bg-white border border-neutral-300 px-6 py-4 text-sm focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-500 font-light"
                required
              />
              <button
                type="submit"
                className="bg-neutral-900 text-white px-8 py-4 text-sm font-medium tracking-wider uppercase hover:bg-neutral-800 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="border-t border-neutral-300">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12">
            
            {/* Logo & Tagline */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <img 
                  src="/images/Logo .svg" 
                  alt="BEL Institut de Beauté" 
                  className="h-20 w-auto opacity-90"
                />
              </div>
              <p className="text-neutral-700 leading-relaxed font-light max-w-sm">
                L'excellence au service de votre beauté. 
                Expertise, raffinement et savoir-faire depuis 2019.
              </p>
              
              {/* Réseaux sociaux */}
              <div className="pt-6 border-t border-neutral-300">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
                  Suivez-nous
                </p>
                <div className="flex items-center space-x-6">
                  <a 
                    href="https://www.instagram.com/bel_institut_de_beaute?igsh=MW41dHN0dnZjMzNpcg==" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@bel_institut?_t=ZN-90NqZO3TOB4&_r=1" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-neutral-500">
                Navigation
              </h3>
              <ul className="space-y-4">
                {[
                  { name: 'Accueil', href: '/' },
                  { name: 'Prestations', href: '/prestations' },
                  { name: 'Formations', href: '/formations' },
                  { name: 'Contact', href: '/contact' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-neutral-700 hover:text-neutral-900 transition-colors font-light border-b border-transparent hover:border-neutral-900 pb-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-neutral-500">
                Services
              </h3>
              <ul className="space-y-4">
                <li className="text-neutral-700 font-light">Maquillage Permanent</li>
                <li className="text-neutral-700 font-light">Extensions de Cils</li>
                <li className="text-neutral-700 font-light">Soins du Regard</li>
                <li className="pt-4">
                  <Link 
                    href="/reserver"
                    className="text-neutral-900 hover:text-neutral-700 transition-colors font-light inline-flex items-center group border-b-2 border-neutral-900 pb-1"
                  >
                    Réserver
                    <svg 
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-neutral-500">
                Contact
              </h3>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="tel:+33123456789"
                    className="text-neutral-700 hover:text-neutral-900 transition-colors font-light"
                  >
                    01 23 45 67 89
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:contact@bel-institut.fr"
                    className="text-neutral-700 hover:text-neutral-900 transition-colors font-light"
                  >
                    contact@bel-institut.fr
                  </a>
                </li>
                <li className="text-neutral-700 font-light pt-2">
                  Paris, France
                </li>
              </ul>
              
              {/* Horaires */}
              <div className="mt-8 pt-8 border-t border-neutral-300">
                <p className="text-xs text-neutral-500 font-medium tracking-[0.2em] mb-4 uppercase">
                  Horaires
                </p>
                <p className="text-sm text-neutral-700 font-light leading-relaxed">
                  Lundi - Vendredi : 9h - 18h<br />
                  Samedi : 10h - 17h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-neutral-600">
            <p className="font-light tracking-wide">
              © {new Date().getFullYear()} BEL Institut de Beauté — Tous droits réservés
            </p>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/mentions-legales"
                className="hover:text-neutral-900 transition-colors font-light tracking-wide"
              >
                Mentions Légales
              </Link>
              <Link 
                href="/politique-confidentialite"
                className="hover:text-neutral-900 transition-colors font-light tracking-wide"
              >
                Confidentialité
              </Link>
              <Link 
                href="/cgv"
                className="hover:text-neutral-900 transition-colors font-light tracking-wide"
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