'use client'

import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { useRef, useState } from 'react'
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
      setPlaying(false)
    }
  }

  return (
    <>
      {showTransition && (
        <LogoTransition 
          pageName="ACCUEIL" 
          onComplete={handleTransitionComplete}
        />
      )}

      <div className={`relative transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero Section avec 2 vidéos */}
        <section className="h-screen relative overflow-hidden">
          <div className="flex h-full">
            {/* Vidéo Prestations */}
            <div 
              className="relative flex-1 group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(leftVideoRef, setLeftVideoPlaying)}
              onMouseLeave={() => handleMouseLeave(leftVideoRef, setLeftVideoPlaying)}
            >
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
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/20 group-hover:via-black/10 group-hover:to-black/40 transition-all duration-500"></div>
              
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

            {/* Vidéo Formations */}
            <div 
              className="relative flex-1 group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(rightVideoRef, setRightVideoPlaying)}
              onMouseLeave={() => handleMouseLeave(rightVideoRef, setRightVideoPlaying)}
            >
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
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/20 group-hover:via-black/10 group-hover:to-black/40 transition-all duration-500"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-8 lg:p-16">
                <div className="text-white max-w-sm transform transition-all duration-500 group-hover:translate-y-[-10px]">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-light mb-3 leading-relaxed drop-shadow-lg font-serif tracking-wide">
                    Nos Formations
                  </h1>
                  <div className="w-8 h-px bg-white opacity-60 mb-4"></div>
                  <button className="text-xs md:text-sm font-medium tracking-wider uppercase opacity-90 hover:opacity-100 transition-opacity underline underline-offset-4 font-sans">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20">
            <ArrowDown className="h-4 w-4 md:h-6 md:w-6" />
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20">
            <img 
              src="/images/Logo .svg" 
              alt="BEL Institut de Beauté" 
              className="w-48 md:w-64 lg:w-80 xl:w-96 h-auto drop-shadow-2xl hover:scale-105 transition-all duration-300 mx-auto filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            />
          </div>
        </section>

        {/* Vidéo présentation plein écran */}
        <section className="h-screen relative overflow-hidden">
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
        </section>

        {/* Section Pourquoi choisir BEL avec effet volet */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/Bel.JPG" 
                    alt="BEL Institut de Beauté"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">5+</div>
                    <div className="text-sm text-gray-600 mt-1">Années d'expertise</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-block">
                  <span className="text-sm tracking-[0.3em] uppercase text-gray-500">
                    Pourquoi choisir BEL Studio ?
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                  L'Excellence au Service de Votre Beauté
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Chez BEL Studio, nous nous engageons à offrir des soins de qualité qui révèlent 
                  votre beauté naturelle.
                </p>

                <p className="text-base text-gray-600 leading-relaxed">
                  Notre expertise repose sur des techniques avancées et des produits haut de 
                  gamme, pour une expérience unique et personnalisée.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700">Soin minutieux et personnalisé</span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700">Équipe experte et passionnée</span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700">Des produits respectueux de votre bien-être</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href="/prestations">
                    <button className="group inline-flex items-center px-8 py-3 bg-gray-900 text-white text-sm tracking-wider uppercase hover:bg-gray-800 transition-all duration-300">
                      Nos Prestations
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Services */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Découvrez nos Différents Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez nos soins spécialisés, pensés pour révéler et sublimer votre beauté naturelle.
              </p>
              <p className="text-base text-gray-600 max-w-3xl mx-auto mt-4">
                Nos prestations sont réalisées avec minutie et expertise, afin de vous offrir une expérience 
                personnalisée dans une ambiance apaisante et professionnelle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="text-center group cursor-pointer">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img 
                    src="/images/Bel.JPG" 
                    alt="Sourcils"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-wide">
                  SOURCILS
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                  Redéfinissez vos sourcils pour un regard structuré et harmonieux. Nos 
                  techniques précises mettent en valeur votre expression naturelle.
                </p>
                <button className="text-sm tracking-wider uppercase border-b-2 border-gray-900 pb-1 hover:border-gray-600 transition-colors">
                  Découvrir
                </button>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img 
                    src="/images/Carole.JPG" 
                    alt="Tricopigmentation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-wide">
                  TRICOPIGMENTATION
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                  Retrouvez densité et confiance avec la tricopigmentation pour cheveux et 
                  barbe, une technique offrant un effet naturel et durable.
                </p>
                <button className="text-sm tracking-wider uppercase border-b-2 border-gray-900 pb-1 hover:border-gray-600 transition-colors">
                  Découvrir
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA avec image */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/images/Bel.JPG" 
              alt="Prenons soin de vous"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4">
            <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-90">
              Prenons soin de vous...
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 max-w-4xl mx-auto leading-tight">
              Redécouvrez votre beauté naturelle avec nos soins experts.
            </h2>
            <Link href="/contact">
              <button className="mt-8 px-8 py-4 border-2 border-white text-white text-sm tracking-wider uppercase hover:bg-white hover:text-gray-900 transition-all duration-300">
                Réserver un Soin
              </button>
            </Link>
          </div>
        </section>

        {/* Section À propos Pauline */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 lg:pr-12">
                <div className="inline-block">
                  <span className="text-sm tracking-[0.3em] uppercase text-gray-500">
                    À propos de moi
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-light text-gray-900">
                  Je suis Carole
                </h2>

                <div className="space-y-4 text-gray-600 leading-relaxed border-l-2 border-gray-300 pl-6">
                  <p>
                    Fondatrice de BEL maquillage permanet, spécialisée dans le bien-être et la beauté.
                  </p>

                  <p>
                    Avec une passion pour l'esthétique et le développement personnel, 
                    mon objectif est de vous accompagner pour révéler le meilleur de 
                    vous-même. Chaque soin est une expérience unique, pensée pour 
                    sublimer votre beauté naturelle et renforcer votre confiance.
                  </p>

                  <p>
                    Mon approche va bien au-delà d'un simple soin. C'est un voyage 
                    sensoriel qui redéfinit votre perception de la beauté, vous permettant 
                    de vous reconnecter à vous-même et de rayonner pleinement.
                  </p>
                </div>

                <div className="pt-6">
                  <Link href="/contact">
                    <button className="text-sm tracking-wider uppercase border-b-2 border-gray-900 pb-1 hover:border-gray-600 transition-colors">
                      Réservez votre soin
                    </button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/Carole.JPG" 
                    alt="Pauline - Fondatrice BEL Studio"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">
                BEL Studio
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Les Retours Clients
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez les témoignages de celles et ceux qui ont fait confiance à notre expertise 
                pour révéler leur beauté naturelle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Avis 1 - MANON HANS */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Manon Hans</div>
                    <div className="text-sm text-gray-500">Il y a 1 mois</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Magnifique prestation de rehaussement de cils coréen + teinture. Le résultat est incroyable. 
                  Carole est super sympa, à l'écoute et prend son temps pour voir le meilleur résultat possible ! 
                  Je recommande fortement ! Un grand merci à elle !
                </p>
              </div>

              {/* Avis 2 - Marion mrp */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Marion mrp</div>
                    <div className="text-sm text-gray-500">Il y a 2 mois</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Je suis RA-VIE ! J'ai fais une prestation de rehaussement de cils coréen et le résultat est juste magnifique 😍😍
                  Carole est professionnel, douce et gentille 🥰
                  J'ai passé un excellent moment, je n'ai pas vu le temps passé et le résultat est à la hauteur de mes attentes !
                </p>
              </div>

              {/* Avis 3 - Hello (Charlotte) */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                    H
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Charlotte</div>
                    <div className="text-sm text-gray-500">Il y a 5 mois</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Un grand merci à Carole pour son travail exceptionnel sur mes sourcils ! 
                  La précédente pigmentation avait très mal vieillit et grâce à son savoir-faire, mes sourcils sont à nouveau très jolis. 
                  Carole est très professionnelle, douce, rigoureuse et à l'écoute. Je suis ravie du résultat !
                </p>
              </div>

              {/* Avis 4 - Mélia BELKACEMI */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-400 flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Mélia Belkacemi</div>
                    <div className="text-sm text-gray-500">Il y a 2 mois</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  ✨ Un moment beauté & bonne humeur ✨
                  J'ai réalisé un Brow Lift et un Lash Lift coréen et... waouh ! 
                  Le résultat est vraiment bluffant, naturel, soigné, et surtout parfaitement exécuté. 
                  Le travail est précis, minutieux, avec un vrai sens du détail. 
                  Un vrai moment de partage entre rires et bien-être, dans une ambiance douce et positive.
                </p>
              </div>

              {/* Avis 5 - Manon Wrk */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Manon Wrk</div>
                    <div className="text-sm text-gray-500">Il y a 9 mois</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Très satisfaite de mon rdv avec Carole pour réaliser un combo brows, elle a parfaitement pris en compte 
                  mes demandes et mes exigences. Son travail est minutieux et elle a réussi à réaliser un cover magnifique 
                  sur mon ancien tatouage. 5 étoiles pour sa patience, son perfectionnisme et son professionnalisme !
                </p>
              </div>

              {/* Avis 6 - Loussouarn Laura */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                    L
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Loussouarn Laura</div>
                    <div className="text-sm text-gray-500">Il y a 11 mois</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Vraiment un grand merci je suis totalement fan ! 
                  Venue pour un rattrapage je ressors tellement heureuse et satisfaite. 
                  Carole est professionnel, rassurante et vraiment minutieuse elle a redessiner mes lèvres à la perfection. 
                  Vous pouvez aller dans son institut les yeux fermés je la recommande vivement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-gradient-to-r from-black via-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Prête à révéler votre beauté ?
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Prenez rendez-vous pour une consultation personnalisée et découvrez 
              tout ce que nous pouvons faire pour vous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Réserver une consultation
              </Link>
              <Link href="/prestations" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-black transition-all duration-300">
                Voir nos prestations
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}