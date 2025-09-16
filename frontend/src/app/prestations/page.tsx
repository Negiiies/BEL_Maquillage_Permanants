'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock, Star, Sparkles, Eye, Paintbrush2 } from 'lucide-react'
import LogoTransition from '../../components/LogoTransition'
export default function PrestationsPage() {
  const [showTransition, setShowTransition] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setShowTransition(false)
      setShowContent(true)
    }, 2500)

    return () => clearTimeout(transitionTimer)
  }, [])

  useEffect(() => {
    if (!showContent) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const progress = Math.min(scrollY / (windowHeight * 0.6), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showContent])

  if (showTransition) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <img 
              src="/images/Logo .svg" 
              alt="BEL Institut" 
              className="w-32 md:w-48 lg:w-64 h-auto mx-auto drop-shadow-2xl animate-[fadeInScale_2s_ease-in-out] filter brightness-0 invert"
            />
          </div>
          
          <div className="mt-6 opacity-0 animate-[fadeIn_1s_ease-in_1s_forwards]">
            <p className="text-white text-lg font-light tracking-[0.3em] uppercase">
              Prestations
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${showContent ? 'animate-[slideUp_0.8s_ease-out]' : 'opacity-0'}`}>
      {/* Hero Section avec effet Dior */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {/* Vidéo principale */}
          <div 
            className="absolute inset-0 transition-all duration-1000 ease-out"
            style={{ 
              opacity: 1 - scrollProgress,
              transform: `scale(${1 - scrollProgress * 0.1})`
            }}
          >
            <video 
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/testh.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>

          {/* Les 3 vidéos qui apparaissent au scroll */}
          <div 
            className="absolute inset-0 flex"
            style={{ 
              opacity: scrollProgress,
              transform: `scale(${0.9 + scrollProgress * 0.1})`
            }}
          >
            {/* Vidéo 1 - Maquillage permanent */}
            <div className="flex-1 relative overflow-hidden">
              <video 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/videos/testv.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-light mb-2 font-serif">
                    Maquillage Permanent
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    Sourcils • Lèvres • Eye-liner
                  </p>
                  <button className="text-xs tracking-wider uppercase underline underline-offset-4 hover:no-underline transition-all">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>

            {/* Vidéo 2 - Extensions */}
            <div className="flex-1 relative overflow-hidden">
              <video 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/videos/testv1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-light mb-2 font-serif">
                    Extensions de Cils
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    Volume • Longueur • Intensité
                  </p>
                  <button className="text-xs tracking-wider uppercase underline underline-offset-4 hover:no-underline transition-all">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>

            {/* Vidéo 3 - Soins */}
            <div className="flex-1 relative overflow-hidden">
              <video 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/videos/testv2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-light mb-2 font-serif">
                    Soins du Regard
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    Teinture • Rehaussement • Épilation
                  </p>
                  <button className="text-xs tracking-wider uppercase underline underline-offset-4 hover:no-underline transition-all">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu central */}
        <div 
          className="relative z-10 h-full flex items-center justify-center text-center text-white px-4"
          style={{ 
            opacity: scrollProgress < 0.5 ? 1 - (scrollProgress * 2) : 0,
            transform: `translateY(${scrollProgress * 50}px)`
          }}
        >
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight font-serif tracking-wide">
              L'Art de la Beauté
            </h1>
            
            <p className="text-lg md:text-xl font-light mb-8 opacity-90 max-w-2xl mx-auto tracking-wide">
              Révélez votre beauté naturelle
            </p>

            <button className="text-sm tracking-[0.3em] uppercase text-white underline underline-offset-8 hover:no-underline transition-all duration-300">
              Découvrir la collection
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
          style={{ opacity: 1 - scrollProgress }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Section Nos Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Expertises
            </h2>
            <div className="w-24 h-1 bg-rose-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des techniques avancées pour sublimer votre beauté naturelle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Maquillage Permanent */}
            <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/5 to-pink-600/5 group-hover:from-rose-600/10 group-hover:to-pink-600/10 transition-all duration-500"></div>
              
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Paintbrush2 className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Maquillage Permanent
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sourcils, lèvres et eye-liner parfaitement dessinés pour un réveil en beauté chaque matin.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mr-3"></div>
                    <span>Microblading sourcils</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mr-3"></div>
                    <span>Powder brows</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mr-3"></div>
                    <span>Lèvres naturelles</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mr-3"></div>
                    <span>Eye-liner fin</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">À partir de 300€</span>
                  <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 group-hover:scale-105">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>

            {/* Extensions de Cils */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 group-hover:from-purple-600/10 group-hover:to-indigo-600/10 transition-all duration-500"></div>
              
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Extensions de Cils
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Un regard intensifié et magnifié grâce à nos techniques d'extensions personnalisées.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>Extensions classiques</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>Volume russe</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>Méga volume</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>Effet wet look</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">À partir de 80€</span>
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 group-hover:scale-105">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>

            {/* Soins du Regard */}
            <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 group-hover:from-emerald-600/10 group-hover:to-teal-600/10 transition-all duration-500"></div>
              
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Soins du Regard
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Prenez soin de vos yeux avec nos soins spécialisés pour un regard reposé et éclatant.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Teinture cils et sourcils</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Rehaussement de cils</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Épilation sourcils</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Soin contour des yeux</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">À partir de 35€</span>
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 group-hover:scale-105">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prête à Vous Sublimer ?
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Réservez votre consultation gratuite et découvrez quelle prestation vous convient le mieux
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-rose-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Réserver ma consultation
            </Link>
            <Link
              href="/tarifs"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-rose-600 transition-all duration-300"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}