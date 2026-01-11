'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Logo */}
        <div className="mb-12">
          <img 
            src="/images/Logo .svg" 
            alt="BEL Institut de Beauté" 
            className="w-32 md:w-40 h-auto mx-auto opacity-50"
          />
        </div>

        {/* 404 */}
        <h1 className="text-9xl md:text-[12rem] font-light text-gray-200 mb-4 leading-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
          Page introuvable
        </h2>
        
        <p className="text-lg text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 group">
              <Home className="w-5 h-5" />
              <span className="font-light tracking-wide">Retour à l&apos;accueil</span>
            </button>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-light tracking-wide">Page précédente</span>
          </button>
        </div>

        {/* Liens utiles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Liens utiles :</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/prestations" className="text-gray-600 hover:text-gray-900 transition-colors">
              Nos Prestations
            </Link>
            <Link href="/formations" className="text-gray-600 hover:text-gray-900 transition-colors">
              Nos Formations
            </Link>
            <Link href="/reserver" className="text-gray-600 hover:text-gray-900 transition-colors">
              Réserver
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}