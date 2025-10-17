'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  price: number
  category: string
}

interface TimeSlot {
  id: number
  date: string
  startTime: string
  endTime: string
}

export default function ReservationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [services, setServices] = useState<Service[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [clientNotes, setClientNotes] = useState('')

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('clientToken')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

  // Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services')
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

  // Charger les créneaux quand un service est sélectionné
  useEffect(() => {
    if (selectedService) {
      const fetchTimeSlots = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/timeslots/available?serviceId=${selectedService.id}`
          )
          const data = await response.json()
          if (data.success) {
            setTimeSlots(data.data.slots || [])
          }
        } catch (error) {
          console.error('Erreur chargement créneaux:', error)
        }
      }
      fetchTimeSlots()
    }
  }, [selectedService])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setStep(3)
  }

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedTimeSlot) return

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('clientToken')
      const response = await fetch('http://localhost:5000/api/bookings', {
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
        // Succès - rediriger vers une page de confirmation
        router.push('/mes-reservations?success=true')
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Réserver un rendez-vous</h1>
          <p className="text-gray-600">BEL Institut de Beauté</p>
          
          {/* Steps indicator */}
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                {step > 1 ? <Check className="h-5 w-5" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Service</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                {step > 2 ? <Check className="h-5 w-5" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium">Créneau</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Confirmer</span>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Service */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Choisissez votre prestation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <p className="text-lg font-bold text-black">{service.price}€</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Time Slot */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center text-gray-600 hover:text-black mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </button>
            
            <h2 className="text-xl font-semibold mb-4">Choisissez un créneau</h2>
            
            {timeSlots.length === 0 ? (
              <p className="text-gray-600">Aucun créneau disponible pour le moment.</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupSlotsByDate(timeSlots)).map(([date, slots]) => (
                  <div key={date}>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSlotSelect(slot)}
                          className="p-3 border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-colors text-center"
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                          <span className="text-sm font-medium">{slot.startTime}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedService && selectedTimeSlot && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={() => setStep(2)}
              className="flex items-center text-gray-600 hover:text-black mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </button>
            
            <h2 className="text-xl font-semibold mb-6">Confirmer votre réservation</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Prestation</p>
                <p className="font-semibold text-gray-900">{selectedService.name}</p>
                <p className="text-lg font-bold text-black mt-1">{selectedService.price}€</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Date et heure</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedTimeSlot.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
                <p className="font-semibold text-gray-900">{selectedTimeSlot.startTime}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Remarques (optionnel)
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  placeholder="Des informations à nous communiquer ?"
                />
              </div>
            </div>
            
            <button
              onClick={handleSubmitBooking}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center"
            >
              {loading ? 'Confirmation...' : (
                <>
                  Confirmer la réservation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}