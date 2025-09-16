import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-rose-400">BEL</div>
              <div className="ml-2 text-sm text-gray-300">Institut de Beauté</div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Spécialiste du maquillage permanent et de la beauté du regard. 
              Un savoir-faire d'exception pour sublimer votre beauté naturelle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/prestations" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Prestations
                </Link>
              </li>
              <li>
                <Link href="/formations" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Formations
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/prestations/maquillage-permanent" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Maquillage permanent
                </Link>
              </li>
              <li>
                <Link href="/prestations/extensions-cils" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Extensions de cils
                </Link>
              </li>
              <li>
                <Link href="/prestations/soins-regard" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Soins du regard
                </Link>
              </li>
              <li>
                <Link href="/formations" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Formations pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-rose-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  123 Rue de la Beauté<br />
                  75001 Paris, France
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <div className="text-gray-300 text-sm">01 23 45 67 89</div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <div className="text-gray-300 text-sm">contact@bel-institut.fr</div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-rose-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  Lun - Ven: 9h - 18h<br />
                  Sam: 9h - 16h
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 BEL Institut de Beauté. Tous droits réservés.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Mentions légales
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer