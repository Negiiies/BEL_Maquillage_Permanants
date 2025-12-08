'use client'

import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import LogoTransition from '@/components/LogoTransition'

export default function Home() {
  const leftVideoRef = useRef<HTMLVideoElement | null>(null)
  const rightVideoRef = useRef<HTMLVideoElement | null>(null)
  const ctaSectionRef = useRef<HTMLDivElement | null>(null)
  const [leftVideoPlaying, setLeftVideoPlaying] = useState(false)
  const [rightVideoPlaying, setRightVideoPlaying] = useState(false)
  const [showTransition, setShowTransition] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(0)

  const handleTransitionComplete = () => {
    setShowTransition(false)
    setTimeout(() => {
      setShowContent(true)
    }, 300)
  }

  // Effet scroll pour parallax - optimisé avec throttle
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ctaSectionRef.current) {
            const rect = ctaSectionRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const sectionCenter = rect.top + rect.height / 2
            const windowCenter = windowHeight / 2
            const distanceFromCenter = windowCenter - sectionCenter
            const offset = distanceFromCenter * 0.3
            setParallaxOffset(offset)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer pour les animations au scroll - optimisé
  useEffect(() => {
    if (!showContent) return

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          // Observer une seule fois puis arrêter d'observer
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Petit délai pour s'assurer que le DOM est prêt
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll')
      elements.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [showContent])

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
        
        {/* HERO SECTION AVEC 2 VIDÉOS */}
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
                  style={{ objectPosition: 'center 40%' }}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/videos/FOR.mp4" type="video/mp4" />
                </video>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/20 group-hover:via-black/10 group-hover:to-black/40 transition-all duration-500"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-8 lg:p-16">
                <div className="text-white max-w-sm transform transition-all duration-500 group-hover:translate-y-[-10px]">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-light mb-3 leading-relaxed drop-shadow-lg font-serif tracking-wide">
                    Nos Prestations
                  </h1>
                  <div className="w-8 h-px bg-white opacity-60 mb-4"></div>
                  <Link href="/prestations">
                    <button className="text-xs md:text-sm font-medium tracking-wider uppercase opacity-90 hover:opacity-100 transition-opacity underline underline-offset-4 font-sans">
                      Découvrir
                    </button>
                  </Link>
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
                  style={{ objectPosition: 'center 40%' }}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/videos/PR.mp4" type="video/mp4" />
                </video>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/20 group-hover:via-black/10 group-hover:to-black/40 transition-all duration-500"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-8 lg:p-16">
                <div className="text-white max-w-sm transform transition-all duration-500 group-hover:translate-y-[-10px]">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-light mb-3 leading-relaxed drop-shadow-lg font-serif tracking-wide">
                    Nos Formations
                  </h1>
                  <div className="w-8 h-px bg-white opacity-60 mb-4"></div>
                  <Link href="/formations">
                    <button className="text-xs md:text-sm font-medium tracking-wider uppercase opacity-90 hover:opacity-100 transition-opacity underline underline-offset-4 font-sans">
                      Découvrir
                    </button>
                  </Link>
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

        {/* SECTION ÉDITORIALE MAGAZINE AVEC ANIMATIONS */}
        <section className="min-h-screen bg-[#FAF7F2] py-32 px-8 font-serif">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-20 animate-on-scroll opacity-0 translate-y-8">
              <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-8"></div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-600 mb-6">
                BEL Institut de Beauté
              </p>
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-8">
                <span className="italic font-extralight text-neutral-800">L'Art</span><br/>
                <span className="text-neutral-900">de la Beauté</span>
              </h2>
              <p className="text-xl text-neutral-800 max-w-3xl mx-auto font-light leading-relaxed">
                Découvrez notre savoir-faire unique en maquillage permanent
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
              
              <div className="space-y-8 animate-on-scroll opacity-0 -translate-x-8">
                <div className="aspect-[3/4] bg-neutral-200 overflow-hidden group">
                  <img 
                    src="/images/deux.JPG" 
                    alt="L'Art de la Beauté"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="border-t-2 border-neutral-900 pt-6">
                  <p className="text-neutral-800 font-light leading-relaxed">
                    Notre approche unique combine expertise technique et sens artistique pour révéler 
                    votre beauté naturelle avec subtilité et élégance.
                  </p>
                </div>
              </div>

              <div className="space-y-12 animate-on-scroll opacity-0 translate-x-8">
                <div className="space-y-6">
                  <div className="text-7xl font-light text-neutral-400 leading-none">01</div>
                  <h3 className="text-3xl font-light border-b border-neutral-300 pb-4">
                    Notre Philosophie
                  </h3>
                  <p className="text-neutral-800 font-light leading-relaxed">
                    Chez BEL, chaque prestation est pensée comme une œuvre unique. Nous croyons que 
                    la beauté réside dans l'authenticité et la confiance en soi.
                  </p>
                  <p className="text-neutral-800 font-light leading-relaxed">
                    Notre mission est de sublimer ce qui vous rend unique, avec des techniques 
                    avant-gardistes et un accompagnement personnalisé.
                  </p>
                </div>

                <div className="aspect-video bg-neutral-200 overflow-hidden group">
                  <img 
                    src="/images/Carole.JPG" 
                    alt="Expertise BEL"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="border-l-2 border-neutral-900 pl-6 py-4">
                  <p className="text-2xl font-light italic text-neutral-900 leading-relaxed mb-4">
                    "La beauté commence là où l'authenticité rencontre l'expertise"
                  </p>
                  <p className="text-sm uppercase tracking-[0.2em] text-neutral-600">
                    — Carole, Fondatrice
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8 border-t border-neutral-300 pt-8">
                  <div className="text-center">
                    <div className="text-4xl font-light mb-2">5+</div>
                    <p className="text-xs uppercase tracking-wider text-neutral-700">Années</p>
                  </div>
                  <div className="text-center border-l border-neutral-300">
                    <div className="text-4xl font-light mb-2">500+</div>
                    <p className="text-xs uppercase tracking-wider text-neutral-700">Clientes</p>
                  </div>
                  <div className="text-center border-l border-neutral-300">
                    <div className="text-4xl font-light mb-2">98%</div>
                    <p className="text-xs uppercase tracking-wider text-neutral-700">Satisfaction</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* POURQUOI BEL - AVEC ANIMATIONS */}
        <section className="py-32 bg-white border-t border-neutral-300 font-serif">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="relative animate-on-scroll opacity-0 -translate-x-8">
                <div className="aspect-[4/5] overflow-hidden group">
                  <img 
                    src="/images/trois.JPG" 
                    alt="BEL Institut"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#FAF7F2] border border-neutral-300 p-8 shadow-lg">
                  <div className="text-center">
                    <div className="text-5xl font-light text-neutral-900">5+</div>
                    <div className="text-sm text-neutral-700 mt-2 tracking-wider">Années d'expertise</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 animate-on-scroll opacity-0 translate-x-8">
                <div className="w-12 h-[1px] bg-neutral-900 mb-8"></div>
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-600">
                  Pourquoi choisir BEL ?
                </p>

                <h2 className="text-5xl md:text-6xl font-light text-neutral-900 leading-tight">
                  L'Excellence au Service de Votre Beauté
                </h2>

                <p className="text-lg text-neutral-800 leading-relaxed font-light">
                  Chez BEL, nous nous engageons à offrir des soins de qualité qui révèlent 
                  votre beauté naturelle avec des techniques avancées et des produits haut de gamme.
                </p>

                <div className="space-y-4 pt-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="w-8 h-[1px] bg-neutral-400 mt-3 transition-all duration-300 group-hover:w-12"></div>
                    <span className="text-neutral-800 font-light">Soin minutieux et personnalisé</span>
                  </div>
                  <div className="flex items-start space-x-4 group">
                    <div className="w-8 h-[1px] bg-neutral-400 mt-3 transition-all duration-300 group-hover:w-12"></div>
                    <span className="text-neutral-800 font-light">Équipe experte et passionnée</span>
                  </div>
                  <div className="flex items-start space-x-4 group">
                    <div className="w-8 h-[1px] bg-neutral-400 mt-3 transition-all duration-300 group-hover:w-12"></div>
                    <span className="text-neutral-800 font-light">Produits respectueux de votre bien-être</span>
                  </div>
                </div>

                <div className="pt-8">
                  <Link href="/prestations">
                    <button className="group inline-flex items-center gap-3 border-b-2 border-neutral-900 pb-2 hover:border-neutral-500 transition-colors text-sm uppercase tracking-[0.2em]">
                      <span>Nos Prestations</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES - AVEC ANIMATIONS */}
        <section className="py-32 bg-[#FAF7F2] border-t border-neutral-300 font-serif">
          <div className="max-w-7xl mx-auto px-8">
            
            <div className="text-center mb-20 animate-on-scroll opacity-0 translate-y-8">
              <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-8"></div>
              <h2 className="text-5xl md:text-6xl font-light text-neutral-900 mb-8">
                Découvrez nos Services
              </h2>
              <p className="text-lg text-neutral-800 max-w-3xl mx-auto leading-relaxed font-light">
                Nos prestations sont réalisées avec minutie et expertise, dans une ambiance 
                apaisante et professionnelle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
              
              <div className="text-center group animate-on-scroll opacity-0 translate-y-8" style={{ transitionDelay: '100ms' }}>
                <div className="aspect-square overflow-hidden mb-8 bg-neutral-200">
                  <img 
                    src="/images/sourcilss.JPG" 
                    alt="Sourcils"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-3xl font-light text-neutral-900 mb-4 tracking-wide">
                  SOURCILS
                </h3>
                <p className="text-neutral-800 mb-6 leading-relaxed font-light">
                  Redéfinissez vos sourcils pour un regard structuré et harmonieux avec nos techniques précises.
                </p>
                <button className="text-sm tracking-wider uppercase border-b-2 border-neutral-900 pb-1 hover:border-neutral-500 transition-colors">
                  Découvrir
                </button>
              </div>

              <div className="text-center group animate-on-scroll opacity-0 translate-y-8" style={{ transitionDelay: '200ms' }}>
                <div className="aspect-square overflow-hidden mb-8 bg-neutral-200">
                  <img 
                    src="/images/cilss.JPG" 
                    alt="Cils"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-3xl font-light text-neutral-900 mb-4 tracking-wide">
                  CILS
                </h3>
                <p className="text-neutral-800 mb-6 leading-relaxed font-light">
                  Sublimez votre regard avec nos extensions et rehaussements de cils pour un effet spectaculaire.
                </p>
                <button className="text-sm tracking-wider uppercase border-b-2 border-neutral-900 pb-1 hover:border-neutral-500 transition-colors">
                  Découvrir
                </button>
              </div>

              <div className="text-center group animate-on-scroll opacity-0 translate-y-8" style={{ transitionDelay: '300ms' }}>
                <div className="aspect-square overflow-hidden mb-8 bg-neutral-200">
                  <img 
                    src="/images/levres.JPG" 
                    alt="Lèvres"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-3xl font-light text-neutral-900 mb-4 tracking-wide">
                  LÈVRES
                </h3>
                <p className="text-neutral-800 mb-6 leading-relaxed font-light">
                  Révélez la beauté de vos lèvres avec notre expertise en maquillage permanent pour un sourire éclatant.
                </p>
                <button className="text-sm tracking-wider uppercase border-b-2 border-neutral-900 pb-1 hover:border-neutral-500 transition-colors">
                  Découvrir
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA AVEC EFFET PARALLAX */}
        <section 
          ref={ctaSectionRef}
          className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <img 
              src="/images/Bel.JPG" 
              alt="Prenons soin de vous"
              className="w-full h-full object-cover will-change-transform"
              style={{
                transform: `translate3d(0px, ${parallaxOffset}px, 0px)`,
                objectPosition: 'center center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 font-serif animate-on-scroll opacity-0 scale-95">
            <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-90">
              Prenons soin de vous...
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 max-w-4xl mx-auto leading-tight">
              Redécouvrez votre beauté naturelle
            </h2>
            <Link href="/contact">
              <button className="mt-8 px-12 py-5 border-2 border-white text-white text-sm tracking-wider uppercase hover:bg-white hover:text-gray-900 transition-all duration-300">
                Réserver un Soin
              </button>
            </Link>
          </div>
        </section>

        {/* À PROPOS - AVEC ANIMATIONS */}
        <section className="py-32 bg-white border-t border-neutral-300 font-serif">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="space-y-8 lg:pr-12 animate-on-scroll opacity-0 -translate-x-8">
                <div className="w-12 h-[1px] bg-neutral-900 mb-8"></div>
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-600">
                  À propos de moi
                </p>

                <h2 className="text-5xl md:text-6xl font-light text-neutral-900">
                  Je suis Carole
                </h2>

                <div className="space-y-6 text-neutral-800 leading-relaxed border-l-2 border-neutral-900 pl-8 font-light">
                  <p>
                    Fondatrice de BEL maquillage permanent, spécialisée dans le bien-être et la beauté.
                  </p>
                  <p>
                    Mon objectif est de vous accompagner pour révéler le meilleur de vous-même. 
                    Chaque soin est une expérience unique, pensée pour sublimer votre beauté naturelle.
                  </p>
                  <p>
                    C'est un voyage sensoriel qui redéfinit votre perception de la beauté, vous permettant 
                    de vous reconnecter à vous-même et de rayonner pleinement.
                  </p>
                </div>

                <div className="pt-8">
                  <Link href="/contact">
                    <button className="inline-flex items-center gap-3 border-b-2 border-neutral-900 pb-2 hover:border-neutral-500 transition-colors text-sm uppercase tracking-[0.2em] group">
                      <span>Réservez votre soin</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="relative animate-on-scroll opacity-0 translate-x-8">
                <div className="aspect-[4/5] overflow-hidden group">
                  <img 
                    src="/images/quatre.JPG" 
                    alt="Carole - Fondatrice"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGES - AVEC ANIMATIONS */}
        <section className="py-32 bg-[#FAF7F2] border-t border-neutral-300 font-serif">
          <div className="max-w-7xl mx-auto px-8">
            
            <div className="text-center mb-20 animate-on-scroll opacity-0 translate-y-8">
              <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-8"></div>
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-600 mb-6">
                Témoignages
              </p>
              <h2 className="text-5xl md:text-6xl font-light text-neutral-900 mb-8">
                Les Retours Clients
              </h2>
              <p className="text-lg text-neutral-800 max-w-3xl mx-auto leading-relaxed font-light">
                Découvrez les témoignages de celles qui ont fait confiance à notre expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {[
                { name: 'Manon Hans', initial: 'M', color: 'bg-purple-200', text: 'Magnifique prestation de rehaussement de cils coréen + teinture. Le résultat est incroyable. Carole est super sympa!', delay: '100ms' },
                { name: 'Marion mrp', initial: 'M', color: 'bg-pink-200', text: 'Je suis RA-VIE ! J\'ai fais une prestation de rehaussement de cils coréen et le résultat est juste magnifique 😍', delay: '150ms' },
                { name: 'Charlotte', initial: 'C', color: 'bg-indigo-200', text: 'Un grand merci à Carole pour son travail exceptionnel sur mes sourcils ! Très professionnelle et à l\'écoute.', delay: '200ms' },
                { name: 'Mélia Belkacemi', initial: 'M', color: 'bg-rose-200', text: 'Un moment beauté & bonne humeur ✨ Le résultat est vraiment bluffant, naturel, soigné.', delay: '250ms' },
                { name: 'Manon Wrk', initial: 'M', color: 'bg-violet-200', text: 'Très satisfaite ! Son travail est minutieux et elle a réussi à réaliser un cover magnifique.', delay: '300ms' },
                { name: 'Laura', initial: 'L', color: 'bg-green-200', text: 'Vraiment un grand merci ! Carole est professionnel, rassurante et vraiment minutieuse.', delay: '350ms' }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-neutral-300 p-8 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8"
                  style={{ transitionDelay: testimonial.delay }}
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-neutral-900 font-medium text-xl`}>
                      {testimonial.initial}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-neutral-900">{testimonial.name}</div>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-800 leading-relaxed text-sm font-light">
                    {testimonial.text}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

      </div>

      <style jsx global>{`
        .animate-on-scroll {
          transition-property: opacity, transform;
          transition-duration: 0.8s;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }
      `}</style>
    </>
  )
}