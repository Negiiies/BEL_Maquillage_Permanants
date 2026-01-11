// Version magazine + animations gauche/droite + vidéo floutée
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Heart, Eye, Clock, ArrowRight } from 'lucide-react'
import LogoTransition from '@/components/LogoTransition'
import { API_URL } from '@/lib/config'

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  category: string
  imageUrl?: string
  isActive: boolean
}

const CATEGORY_CONFIG = {
  sourcils: {
    label: 'Sourcils',
    icon: Sparkles
  },
  levres: {
    label: 'Lèvres',
    icon: Heart
  },
  cils: {
    label: 'Cils',
    icon: Eye
  }
}

export default function PrestationsPage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sourcils' | 'levres' | 'cils'>('sourcils')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`)
        const data = await response.json()
        if (data.success) {
          setServices(data.data)
        }
      } catch (error) {
        console.error('Erreur chargement services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filteredServices = services.filter(s => s.category === activeTab)

  const handleReserve = (serviceId: number) => {
    router.push(`/reserver?service=${serviceId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    )
  }

  return (
    <>
      {!showContent && (
        <LogoTransition 
          pageName="Prestations" 
          onComplete={() => setShowContent(true)}
        />
      )}

      {showContent && (
        <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 font-serif animate-fadeIn">

          {/* HERO ÉDITORIAL AVEC VIDÉO - COMME FORMATIONS */}
          <section className="relative pt-32 pb-20 px-8 overflow-hidden">
            {/* Vidéo background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-40"
              >
                <source src="/videos/pres.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="max-w-5xl mx-auto relative z-20">
              {/* Tag */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-black"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-black font-medium">BEL Institut</span>
              </div>

              {/* Titre principal */}
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-6 leading-[0.9]">
                <span className="italic font-extralight text-neutral-800">Nos</span><br />
                <span className="text-black">Prestations</span>
              </h1>

              {/* Intro */}
              <div className="grid md:grid-cols-2 gap-12 mt-16">
                <div>
                  <p className="text-2xl font-light leading-relaxed text-black">
                    L'excellence au service de votre beauté
                  </p>
                </div>
                <div>
                  <p className="text-lg font-light leading-relaxed text-neutral-900">
                    Découvrez nos prestations de maquillage permanent et beauté du regard. 
                    Un savoir-faire unique pour sublimer votre beauté naturelle avec élégance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* LIGNE SÉPARATRICE */}
          <div className="border-t-2 border-neutral-900 my-16"></div>

          {/* Onglets */}
          <div className="px-8 py-12 border-b border-neutral-300">
            <div className="flex justify-center gap-10 flex-wrap">
              {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((category) => {
                const config = CATEGORY_CONFIG[category]
                const Icon = config.icon
                const isActive = activeTab === category
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`flex items-center gap-3 px-6 py-3 uppercase tracking-widest text-sm border-b-2 transition-all duration-300 ${
                      isActive
                        ? 'border-neutral-900 text-neutral-900'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Articles avec marges comme magazine - max-w-7xl */}
          <div className="max-w-7xl mx-auto px-8 py-24 space-y-32">
              {filteredServices.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-neutral-500 italic">
                    Aucun article dans cette rubrique.
                  </p>
                </div>
              ) : (
                filteredServices.map((service, index) => {
                  const isEven = index % 2 === 0

                  return (
                    <div
                      key={service.id}
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start opacity-0 ${
                        isEven ? 'animate-slideInLeft' : 'animate-slideInRight'
                      }`}
                      style={{ 
                        animationDelay: `${index * 0.15}s`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      {/* Image */}
                      <div className={`w-full ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="relative overflow-hidden rounded-xl shadow-lg border border-neutral-300">
                          {service.imageUrl ? (
                            <img
                              src={`${API_URL}${service.imageUrl}`}
                              alt={service.name}
                              className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-[500px] bg-neutral-200 flex items-center justify-center">
                              <p className="text-neutral-500 uppercase tracking-widest text-sm">{service.name}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Texte en format article */}
                      <div className={`w-full space-y-8 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                        {/* Titre article */}
                        <h2 className="text-5xl md:text-6xl font-light leading-tight tracking-tight border-b border-neutral-300 pb-6">
                          {service.name}
                        </h2>

                        {/* Description en colonnes style magazine */}
                        <div className="text-lg text-neutral-700 leading-relaxed font-light columns-1 md:columns-2 gap-8">
                          {service.description || 'Un soin présenté dans un style éditorial raffiné, pensé pour sublimer votre beauté naturelle avec élégance et professionnalisme. Notre expertise au service de votre bien-être.'}
                        </div>

                        {/* Infos et CTA */}
                        <div className="pt-8 border-t border-neutral-300 space-y-6">
                          <div className="flex items-center gap-12">
                            <div className="flex items-center gap-3 text-neutral-600">
                              <Clock className="w-5 h-5" />
                              <span className="text-neutral-800 font-light">{service.duration} minutes</span>
                            </div>
                            <div className="text-4xl font-light">{service.price}€</div>
                          </div>

                          <button
                            onClick={() => handleReserve(service.id)}
                            className="border border-neutral-800 text-neutral-900 px-10 py-4 uppercase tracking-widest text-sm hover:bg-neutral-900 hover:text-neutral-50 transition-all duration-300 flex items-center gap-3"
                          >
                            Réserver cette prestation
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* FAQ PRESTATIONS - Style Accordéon */}
            <div className="max-w-7xl mx-auto px-8 py-32 border-t-2 border-neutral-900">
              {/* Header FAQ */}
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-light tracking-tight uppercase mb-6">
                  Questions Fréquentes
                </h2>
                <p className="text-lg text-neutral-600 italic">
                  Tout ce que vous devez savoir sur nos prestations
                </p>
              </div>

              {/* Questions en accordéons */}
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
                {[
                  {
                    q: "Qu'est-ce que la pigmentation des sourcils ou des lèvres ?",
                    a: "Il s'agit d'un maquillage semi-permanent permettant de redessiner, structurer et intensifier les sourcils ou les lèvres, avec un rendu naturel et personnalisé."
                  },
                  {
                    q: "Est-ce douloureux ?",
                    a: "La sensation varie selon la sensibilité de chacun(e), mais les techniques utilisées sont douces et largement supportables."
                  },
                  {
                    q: "Combien de temps dure le résultat ?",
                    a: "Le résultat dure en moyenne 12 à 24 mois, selon le type de peau, le mode de vie et l'entretien."
                  },
                  {
                    q: "Une retouche est-elle nécessaire ?",
                    a: "Oui, une retouche est indispensable, généralement réalisée 4 à 8 semaines après la première séance, pour fixer le pigment et optimiser le résultat."
                  },
                  {
                    q: "Le résultat est-il naturel ?",
                    a: "Oui. Chaque prestation est entièrement personnalisée afin de respecter la morphologie du visage et sublimer sans transformer."
                  },
                  {
                    q: "Existe-t-il des contre-indications ?",
                    a: "Oui, certaines situations peuvent constituer des contre-indications (grossesse, pathologies, traitements médicaux…). Un questionnaire santé est systématiquement réalisé."
                  },
                  {
                    q: "Combien de temps dure une séance ?",
                    a: "Une séance dure en moyenne 1h30 à 2h30, selon la prestation choisie."
                  },
                  {
                    q: "Y a-t-il des précautions à suivre après la prestation ?",
                    a: "Oui. Des consignes post-soin précises sont fournies pour garantir une bonne cicatrisation et une tenue optimale."
                  },
                  {
                    q: "Les accompagnateurs sont-ils autorisés ?",
                    a: "Pour des raisons d'hygiène, de confort et de concentration, les accompagnateurs ne sont pas autorisés en cabine (sauf cas exceptionnel)."
                  },
                  {
                    q: "Puis-je me maquiller ou m'exposer au soleil après la séance ?",
                    a: "Il est recommandé d'éviter le maquillage, l'eau, le soleil, les UV, le sauna et le hammam pendant la phase de cicatrisation (environ 7 à 10 jours pour la pigmentation)."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-neutral-300 pb-6">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex justify-between items-start text-left gap-4 group"
                    >
                      <span className="text-lg font-light text-neutral-900 flex-1 group-hover:text-neutral-600 transition-colors">
                        {faq.q}
                      </span>
                      <span className={`text-2xl text-neutral-400 transition-transform duration-300 ${
                        openFaq === index ? 'rotate-45' : ''
                      }`}>
                        +
                      </span>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${
                      openFaq === index ? 'max-h-96 mt-4' : 'max-h-0'
                    }`}>
                      <p className="text-neutral-700 leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

      
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-60px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(60px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </>
  )
}