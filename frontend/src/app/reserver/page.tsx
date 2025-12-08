'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Clock, Check, ArrowRight, ArrowLeft, Sparkles, Heart, Eye, ChevronDown } from 'lucide-react'
import { API_URL } from '@/lib/config'

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface TimeSlot {
  id: number
  date: string
  startTime: string
  endTime: string
}

const CATEGORY_ICONS: { [key: string]: any } = {
  'sourcils': Sparkles,
  'levres': Heart,
  'cils': Eye
}

const CATEGORY_LABELS: { [key: string]: string } = {
  'sourcils': 'Sourcils',
  'levres': 'Lèvres',
  'cils': 'Cils'
}

export default function ReservationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedServiceId = searchParams.get('service')
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const [daysToShow, setDaysToShow] = useState(7)
  
  const [services, setServices] = useState<Service[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [clientNotes, setClientNotes] = useState('')

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('clientToken')
    if (!token) {
      router.push('/auth/login?redirect=/reserver')
    }
  }, [router])

  // Charger les services
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
      }
    }
    fetchServices()
  }, [])

  // Gérer la pré-sélection depuis /prestations
  useEffect(() => {
    if (preSelectedServiceId && services.length > 0) {
      const service = services.find(s => s.id === parseInt(preSelectedServiceId))
      if (service) {
        handleServiceSelect(service)
      }
    }
  }, [preSelectedServiceId, services])

  // Charger les créneaux quand un service est sélectionné
  useEffect(() => {
    if (selectedService && step === 2) {
      const fetchTimeSlots = async () => {
        setLoadingSlots(true)
        try {
          console.log('🔍 Fetching slots for service:', selectedService.id)
          
          const response = await fetch(
            `${API_URL}/api/timeslots/available?serviceId=${selectedService.id}`
          )
          const data = await response.json()
          
          console.log('🔍 API Response:', data)
          console.log('🔍 Slots array:', data.data?.slots)
          console.log('🔍 Nombre de slots:', data.data?.slots?.length)
          
          if (data.success) {
            setTimeSlots(data.data.slots || [])
            console.log('✅ TimeSlots mis à jour:', data.data.slots?.length || 0, 'créneaux')
          }
        } catch (error) {
          console.error('❌ Erreur chargement créneaux:', error)
        } finally {
          setLoadingSlots(false)
        }
      }
      fetchTimeSlots()
    }
  }, [selectedService, step])

  // Sélection service
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setDaysToShow(7)
    setStep(2)
  }

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setStep(3)
  }

  const loadMoreDays = () => {
    setDaysToShow(prev => prev + 7)
  }

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedTimeSlot) return

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('clientToken')
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          timeSlotId: selectedTimeSlot.id,
          clientNotes: clientNotes || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/mon-compte?tab=reservations&success=true')
      } else {
        setError(data.message || 'Erreur lors de la réservation')
      }
    } catch (error) {
      console.error('Erreur réservation:', error)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    return slots.reduce((acc, slot) => {
      const date = slot.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(slot)
      return acc
    }, {} as Record<string, TimeSlot[]>)
  }

  const groupServicesByCategory = (services: Service[]) => {
    return services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = []
      }
      acc[service.category].push(service)
      return acc
    }, {} as Record<string, Service[]>)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">
            Réserver un rendez-vous
          </h1>
          <p className="text-lg text-gray-600">
            BEL Institut de Beauté - Prenez soin de vous
          </p>
        </div>

        {/* Steps indicator */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200'
              }`}>
                {step > 1 ? <Check className="h-5 w-5" /> : '1'}
              </div>
              <span className="ml-3 text-sm font-light tracking-wide hidden md:block">Service</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200'
              }`}>
                {step > 2 ? <Check className="h-5 w-5" /> : '2'}
              </div>
              <span className="ml-3 text-sm font-light tracking-wide hidden md:block">Créneau</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-3 text-sm font-light tracking-wide hidden md:block">Confirmer</span>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Service */}
        {step === 1 && (
          <div className="space-y-8">
            {Object.entries(groupServicesByCategory(services)).map(([category, categoryServices]) => {
              const Icon = CATEGORY_ICONS[category] || Sparkles
              return (
                <div key={category}>
                  <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center">
                    <Icon className="w-6 h-6 mr-3" />
                    {CATEGORY_LABELS[category] || category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group text-left"
                      >
                        <div className="p-6">
                          <h3 className="text-xl font-light text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{service.duration} min</span>
                            </div>
                            <div className="text-2xl font-light text-gray-900">
                              {service.price}€
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Step 2: Choose Time Slot */}
        {step === 2 && selectedService && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <button
              onClick={() => {
                setStep(1)
                setSelectedService(null)
                setDaysToShow(7)
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="font-light">Changer de prestation</span>
            </button>
            
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Prestation sélectionnée</p>
              <h3 className="text-2xl font-light text-gray-900">{selectedService.name}</h3>
              <p className="text-lg font-light text-gray-900 mt-2">{selectedService.price}€</p>
            </div>

            <h2 className="text-2xl font-light text-gray-900 mb-6">Choisissez un créneau</h2>
            
            {loadingSlots ? (
              <div className="space-y-8 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
                      {[...Array(10)].map((_, idx) => (
                        <div key={idx} className="h-16 bg-gray-100 rounded-xl"></div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="text-gray-600 mt-4">Chargement des créneaux disponibles...</p>
                </div>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">Aucun créneau disponible pour le moment.</p>
                <p className="text-sm text-gray-600 mt-2">Veuillez réessayer ultérieurement.</p>
              </div>
            ) : (
              <>
                <div className="space-y-8">
                  {Object.entries(groupSlotsByDate(timeSlots))
                    .slice(0, daysToShow)
                    .map(([date, slots]) => (
                    <div key={date}>
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-3 text-gray-700" />
                        {new Date(date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h3>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleTimeSlotSelect(slot)}
                            className="p-3 border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 text-center group"
                          >
                            <span className="text-xs font-medium text-gray-900 block">
                              {slot.startTime.slice(0, 5)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {daysToShow < Object.keys(groupSlotsByDate(timeSlots)).length && (
                  <div className="mt-8">
                    <button
                      onClick={loadMoreDays}
                      className="w-full p-6 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center gap-3 text-gray-900">
                        <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                        <span className="font-medium">Afficher plus de disponibilités</span>
                        <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {Object.keys(groupSlotsByDate(timeSlots)).length - daysToShow} jours restants
                      </p>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedService && selectedTimeSlot && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <button
              onClick={() => {
                setStep(2)
                setSelectedTimeSlot(null)
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="font-light">Changer de créneau</span>
            </button>
            
            <h2 className="text-2xl font-light text-gray-900 mb-8">Confirmer votre réservation</h2>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6 flex items-start">
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-4 mb-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2 font-light">Prestation</p>
                <p className="text-xl font-light text-gray-900 mb-1">{selectedService.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{selectedService.duration} minutes</span>
                  </div>
                  <p className="text-2xl font-light text-gray-900">{selectedService.price}€</p>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2 font-light">Date et heure</p>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <p className="text-lg font-light text-gray-900">
                    {new Date(selectedTimeSlot.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <p className="text-lg font-light text-gray-900">{selectedTimeSlot.startTime.slice(0, 5)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">
                  Remarques ou demandes particulières (optionnel)
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors font-light"
                  rows={4}
                  placeholder="Des informations à nous communiquer ? (allergies, préférences...)"
                />
              </div>
            </div>
            
            <button
              onClick={handleSubmitBooking}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-light text-lg hover:bg-gray-800 disabled:bg-gray-400 transition-all duration-300 flex items-center justify-center group"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Confirmation en cours...
                </div>
              ) : (
                <>
                  <span className="tracking-wide">Confirmer la réservation</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4 font-light">
              Vous recevrez un email de confirmation après validation de votre réservation
            </p>
          </div>
        )}
      </div>
    </div>
  )
}