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
    icon: Sparkles,
    color: 'from-amber-50 to-orange-50'
  },
  levres: {
    label: 'Lèvres',
    icon: Heart,
    color: 'from-rose-50 to-pink-50'
  },
  cils: {
    label: 'Cils',
    icon: Eye,
    color: 'from-blue-50 to-indigo-50'
  }
}

export default function PrestationsPage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sourcils' | 'levres' | 'cils'>('sourcils')

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
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
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white animate-[slideUp_0.8s_ease-out]">
          {/* Header */}
          <div className="pt-32 pb-16 px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-wide">
              Nos Prestations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Découvrez nos soins d'exception, pensés pour sublimer votre beauté naturelle
            </p>
          </div>

          {/* Onglets */}
          <div className="max-w-7xl mx-auto px-4 mb-16">
            <div className="flex justify-center gap-4 flex-wrap">
              {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((category) => {
                const config = CATEGORY_CONFIG[category]
                const Icon = config.icon
                const isActive = activeTab === category
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-xl scale-105'
                        : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="font-light text-lg tracking-wide">{config.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Services - Layout Zigzag */}
          <div className="max-w-7xl mx-auto px-4 pb-24 space-y-24">
            {filteredServices.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 font-light">
                  Aucune prestation disponible pour le moment
                </p>
              </div>
            ) : (
              filteredServices.map((service, index) => {
                const isEven = index % 2 === 0
                const config = CATEGORY_CONFIG[activeTab]
                
                return (
                  <div
                    key={service.id}
                    className={`flex flex-col ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } gap-12 items-center`}
                  >
                    {/* Image */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
                        {service.imageUrl ? (
                          <img
                            src={`${API_URL}${service.imageUrl}`}
                            alt={service.name}
                            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%23f3f4f6" width="800" height="500"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-size="24"%3E' + service.name + '%3C/text%3E%3C/svg%3E'
                            }}
                          />
                        ) : (
                          <div className={`w-full h-[500px] bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                            <div className="text-center">
                              <config.icon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                              <p className="text-gray-500 font-light text-lg">{service.name}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="w-full lg:w-1/2 space-y-6">
                      {/* Titre */}
                      <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-wide">
                        {service.name}
                      </h2>

                      {/* Description */}
                      <p className="text-lg text-gray-600 leading-relaxed font-light">
                        {service.description || 'Une prestation d\'exception pour sublimer votre beauté naturelle.'}
                      </p>

                      {/* Infos */}
                      <div className="flex items-center gap-8 pt-4">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700 font-light">{service.duration} minutes</span>
                        </div>
                        <div className="text-3xl font-light text-gray-900">
                          {service.price}€
                        </div>
                      </div>

                      {/* Bouton Réserver */}
                      <button
                        onClick={() => handleReserve(service.id)}
                        className="group mt-8 bg-gray-900 text-white px-10 py-4 rounded-full font-light text-lg tracking-wide hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        <span>Réserver</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* Ligne décorative */}
                      <div className="pt-8">
                        <div className={`h-1 w-24 bg-gradient-to-r ${
                          activeTab === 'sourcils' ? 'from-amber-400 to-orange-400' :
                          activeTab === 'levres' ? 'from-rose-400 to-pink-400' :
                          'from-blue-400 to-indigo-400'
                        } rounded-full`}></div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* CTA final */}
          <div className="max-w-4xl mx-auto px-4 pb-24 text-center">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 shadow-2xl">
              <h3 className="text-3xl font-light text-white mb-6 tracking-wide">
                Prête à sublimer votre beauté ?
              </h3>
              <p className="text-gray-300 font-light text-lg mb-8 max-w-2xl mx-auto">
                Nos experts sont à votre disposition pour vous conseiller et vous accompagner dans votre transformation.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="bg-white text-gray-900 px-10 py-4 rounded-full font-light text-lg tracking-wide hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation slideUp */}
      <style jsx>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}