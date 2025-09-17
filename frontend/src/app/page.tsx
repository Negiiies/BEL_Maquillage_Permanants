'use client'

import Link from 'next/link'
import { ChevronRight, Play, Pause, ArrowDown } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import LogoTransition from '@/components/LogoTransition'

export default function Home() {
  const leftVideoRef = useRef<HTMLVideoElement | null>(null)
  const rightVideoRef = useRef<HTMLVideoElement | null>(null)
  const [leftVideoPlaying, setLeftVideoPlaying] = useState(false)
  const [rightVideoPlaying, setRightVideoPlaying] = useState(false)
  const [showTransition, setShowTransition] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const handleTransitionComplete = () => {
    setShowTransition(false)
    setTimeout(() => {
      setShowContent(true)
    }, 300)
  }

  const handleMouseEnter = async (videoRef: React.RefObject<HTMLVideoElement | null>, setPlaying: (playing: boolean) => void) => {
    if (videoRef.current) {
      try {
        await videoRef.current.play()
        setPlaying(true)
      } catch (error) {
        console.log('Erreur lecture vidéo:', error)
      }
    }
  }

  const handleMouseLeave = (videoRef: React.RefObject<HTMLVideoElement | null>, setPlaying: (playing: boolean) => void) => {
    if (videoRef.current) {
      videoRef.current.pause()
      // On ne remet PAS currentTime à 0 pour garder la position
      setPlaying(false)
    }
  }

  return (
    <>
      {/* Transition d'entrée */}
      {showTransition && (
        <LogoTransition 
          pageName="ACCUEIL" 
          onComplete={handleTransitionComplete}
        />
      )}

      {/* Contenu principal avec animation dddd'apparition */}
      <div className={`relative transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section Fullscreen avec Vidéos côte à côte */}
      <section className="h-screen relative overflow-hidden">
        {/* Carousel Container */}
        <div className="flex h-full">
          {/* Slide 1 - Prestations avec Vidéo */}
          <div 
            className="relative flex-1 group cursor-pointer"
            onMouseEnter={() => handleMouseEnter(leftVideoRef, setLeftVideoPlaying)}
            onMouseLeave={() => handleMouseLeave(leftVideoRef, setLeftVideoPlaying)}
          >
            {/* Vidéo Background avec positionnement correct */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                ref={leftVideoRef}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 filter blur-sm group-hover:blur-none group-hover:scale-105"
                style={{ objectPosition: 'center 10%' }}
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/videos/Video1.mp4" type="video/mp4" />
              </video>
            </div>
            
            {/* Overlay qui s'éclaircit au hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/20 group-hover:via-black/10 group-hover:to-black/40 transition-all duration-500"></div>
            
            {/* Content Overlay - Style Dior plus élégant */}
            <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-8 lg:p-16">
              <div className="text-white max-w-sm transform transition-all duration-500 group-hover:translate-y-[-10px]">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-light mb-3 leading-relaxed drop-shadow-lg font-serif tracking-wide">
                  Nos Prestations
                </h1>
                <div className="w-8 h-px bg-white opacity-60 mb-4"></div>
                <button className="text-xs md:text-sm font-medium tracking-wider uppercase opacity-90 hover:opacity-100 transition-opacity underline underline-offset-4 font-sans">
                  Découvrir
                </button>
              </div>
            </div>
          </div>

          {/* Slide 2 - Formations avec Vidéo */}
          <div 
            className="relative flex-1 group cursor-pointer"
            onMouseEnter={() => handleMouseEnter(rightVideoRef, setRightVideoPlaying)}
            onMouseLeave={() => handleMouseLeave(rightVideoRef, setRightVideoPlaying)}
          >
            {/* Vidéo Background avec positionnement correct */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                ref={rightVideoRef}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 filter blur-sm group-hover:blur-none group-hover:scale-105"
                style={{ objectPosition: 'center 10%' }}
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/videos/Video.mp4" type="video/mp4" />
              </video>
            </div>
            
             {/* Overlay qui s'éclaircit au hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/20 group-hover:via-black/10 group-hover:to-black/40 transition-all duration-500"></div>
            
            {/* Content Overlay - Style Dior plus élégant */}
            <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-8 lg:p-16">
              <div className="text-white max-w-sm transform transition-all duration-500 group-hover:translate-y-[-10px]">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-light mb-3 leading-relaxed drop-shadow-lg font-serif tracking-wide">
                  Nos Formation
                </h1>
                <div className="w-8 h-px bg-white opacity-60 mb-4"></div>
                <button className="text-xs md:text-sm font-medium tracking-wider uppercase opacity-90 hover:opacity-100 transition-opacity underline underline-offset-4 font-sans">
                  Découvrir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20">
          <ArrowDown className="h-4 w-4 md:h-6 md:w-6" />
        </div>
        
        {/* Logo BEL imposant au centre comme Dior */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20">
          {/* Votre logo SVG */}
          <img 
            src="/images/Logo .svg" 
            alt="BEL Institut de Beauté" 
            className="w-48 md:w-64 lg:w-80 xl:w-96 h-auto drop-shadow-2xl hover:scale-105 transition-all duration-300 mx-auto filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          />
        </div>
      </section>

      {/* Section Galerie Vidéo/Images Full Screen */}
      <section className="relative">
        {/* Vidéo de présentation en plein écran */}
        <div className="h-screen relative overflow-hidden">
          <video 
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 10%' }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/presentation-bel.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay avec contenu */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6">
                L'Art de la Beauté
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 font-light opacity-90">
                Découvrez notre savoir-faire unique en maquillage permanent
              </p>
              <button className="bg-white bg-opacity-20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-opacity-30 transition-all duration-300 backdrop-blur-md text-sm md:text-base">
                Regarder la vidéo complète
              </button>
            </div>
          </div>
        </div>

        {/* Galerie d'images en mosaïque avec effet hover vidéo */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Image 1 avec possibilité vidéo */}
          <div className="relative group overflow-hidden h-64 md:h-80 lg:h-screen">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter blur-sm group-hover:blur-none group-hover:scale-110"
              style={{
                backgroundImage: "url('/images/Bel.JPG')",
                backgroundColor: '#f97316'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/40 group-hover:to-transparent transition-all duration-500"></div>
            <div className="relative z-10 h-full flex items-end p-4 md:p-8">
              <div className="text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">Maquillage Permanent</h3>
                <p className="text-sm opacity-90 drop-shadow-md">Sourcils • Lèvres • Eye-liner</p>
              </div>
            </div>
          </div>

          {/* Image 2 avec possibilité vidéo */}
          <div className="relative group overflow-hidden h-64 md:h-80 lg:h-screen">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter blur-sm group-hover:blur-none group-hover:scale-110"
              style={{
                backgroundImage: "url('/images/Carole.JPG')",
                backgroundColor: '#3b82f6'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/40 group-hover:to-transparent transition-all duration-500"></div>
            <div className="relative z-10 h-full flex items-end p-4 md:p-8">
              <div className="text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">Extensions de Cils</h3>
                <p className="text-sm opacity-90 drop-shadow-md">Volume • Longueur • Effet naturel</p>
              </div>
            </div>
          </div>

          {/* Image 3 - Statistiques */}
          <div className="relative group overflow-hidden h-64 md:h-80 lg:h-screen">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">500+</h3>
                <p className="text-base md:text-lg">Clientes satisfaites</p>
                <div className="mt-6 md:mt-8">
                  <div className="text-xl md:text-2xl font-bold mb-2">5 ans</div>
                  <p className="text-sm">D'expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section avant/après en parallax */}
        <div className="h-screen relative overflow-hidden bg-black">
          <div className="absolute inset-0 flex">
            {/* Avant */}
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">AVANT</h3>
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-500 rounded-lg mx-auto"></div>
                </div>
              </div>
            </div>
            
            {/* Séparateur central */}
            <div className="w-0.5 md:w-1 bg-white relative z-10"></div>
            
            {/* Après */}
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-black">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">APRÈS</h3>
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-300 rounded-lg mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Titre central */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-white px-4 md:px-8 py-2 md:py-4 rounded-full shadow-2xl">
              <h2 className="text-lg md:text-2xl font-bold text-black">Transformation</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Section À Propos - Noir et blanc */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6">
              L'excellence au service de votre beauté
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-black to-gray-600 mx-auto mb-4 md:mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Chez BEL, nous croyons que chaque femme mérite de se sentir belle et confiante. 
              Notre expertise vous permet de révéler votre beauté naturelle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-black to-gray-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                500+
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Clientes satisfaites</h3>
              <p className="text-sm md:text-base text-gray-600">Des résultats qui parlent d'eux-mêmes</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                5
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Années d'expérience</h3>
              <p className="text-sm md:text-base text-gray-600">Une expertise reconnue dans le domaine</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                100%
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Satisfaction garantie</h3>
              <p className="text-sm md:text-base text-gray-600">Votre satisfaction est notre priorité</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/a-propos"
              className="inline-flex items-center bg-gradient-to-r from-black to-gray-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
            >
              En savoir plus sur notre histoire
              <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section finale */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-black via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Prête à révéler votre beauté ?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto">
            Prenez rendez-vous pour une consultation personnalisée et découvrez 
            tout ce que nous pouvons faire pour vous
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Réserver une consultation
            </Link>
            <Link
              href="/prestations"
              className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-white hover:text-black transition-all duration-300"
            >
              Voir nos prestations
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}