'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock, Users, Award, Star } from 'lucide-react'
import LogoTransition from '../../components/LogoTransition'

export default function FormationsPage() {
  const [showContent, setShowContent] = useState(false)

  return (
    <>
      {!showContent && (
        <LogoTransition 
          pageName="Formations" 
          onComplete={() => setShowContent(true)} 
        />
      )}
      
      {showContent && (
        <div className="min-h-screen animate-[slideUp_0.8s_ease-out]">
      {/* Hero Section Formations */}
      <section className="relative h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <div className="mb-8">
              <span className="inline-block bg-white bg-opacity-10 text-white text-sm font-medium px-6 py-2 rounded-full backdrop-blur-md">
                BEL ACADEMY
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight font-serif">
              Nos Formations
            </h1>
            
            <p className="text-xl md:text-2xl font-light mb-8 opacity-90 max-w-2xl mx-auto">
              Développez votre expertise en maquillage permanent et beauté du regard
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                Voir nos formations
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-black transition-all duration-300">
                Télécharger la brochure
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Section Formations disponibles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Programmes de Formation
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des formations complètes pour maîtriser l'art du maquillage permanent
            </p>
          </div>

          {/* Grid des formations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Formation 1 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="flex items-center justify-center text-gray-500">
                  <Award className="h-12 w-12" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Débutant
                  </span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Maquillage Permanent Sourcils
                </h3>
                <p className="text-gray-600 mb-4">
                  Maîtrisez les techniques de microblading et de powder brows
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>3 jours intensifs</span>
                  <Users className="h-4 w-4 ml-4 mr-2" />
                  <span>Max 6 élèves</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">1 200€</span>
                  <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>

            {/* Formation 2 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="flex items-center justify-center text-gray-500">
                  <Award className="h-12 w-12" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Intermédiaire
                  </span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Extensions de Cils
                </h3>
                <p className="text-gray-600 mb-4">
                  Techniques volume et méga volume pour un regard sublimé
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>2 jours</span>
                  <Users className="h-4 w-4 ml-4 mr-2" />
                  <span>Max 4 élèves</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">800€</span>
                  <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>

            {/* Formation 3 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="flex items-center justify-center text-gray-500">
                  <Award className="h-12 w-12" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Avancé
                  </span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Formation Complète
                </h3>
                <p className="text-gray-600 mb-4">
                  Maîtrisez toutes les techniques : sourcils, lèvres, eye-liner
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>5 jours</span>
                  <Users className="h-4 w-4 ml-4 mr-2" />
                  <span>Max 4 élèves</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">2 500€</span>
                  <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pourquoi choisir BEL Academy */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi Choisir BEL Academy ?
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Certification</h3>
              <p className="text-gray-300">Diplôme reconnu dans le secteur</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Petit Groupe</h3>
              <p className="text-gray-300">Maximum 6 élèves par formation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">5 ans d'expérience</h3>
              <p className="text-gray-300">Expertise reconnue</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Suivi Personnalisé</h3>
              <p className="text-gray-300">Accompagnement après formation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prête à Devenir Experte ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez BEL Academy et transformez votre passion en expertise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Nous contacter
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-black transition-all duration-300">
              Télécharger la brochure
            </button>
          </div>
        </div>
      </section>

      {/* Animation d'entrée pour le contenu */}
      <style jsx>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
      )}
    </>
  )
}