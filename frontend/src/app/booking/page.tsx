'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Euro, ArrowLeft, ArrowRight, Check, User, Mail, Phone, MessageSquare } from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  price: number
  category: string
  duration?: number
}

interface TimeSlot {
  id: number
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export default function BookingPage() {
  const [step, setStep] = useState(1) // 1: Service, 2: Date/Heure, 3: Informations, 4: Confirmation
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [services, setServices] = useState<Service[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  })

  // Simuler le chargement des services
  useEffect(() => {
    // TODO: Remplacer par un appel API réel
    setServices([
      {
        id: 1,
        name: 'Microblading Sourcils',
        description: 'Technique de maquillage permanent pour des sourcils naturels et définis',
        price: 350,
        category: 'maquillage_permanent',
        duration: 90
      },
      {
        id: 2,
        name: 'Extensions Cils Volume Russe',
        description: 'Extensions de cils technique volume russe pour un regard intense',
        price: 120,
        category: 'extensions_cils',
        duration: 60
      },
      {
        id: 3,
        name: 'Rehaussement de Cils',
        description: 'Lift des cils naturels avec teinture pour un regard ouvert',
        price: 45,
        category: 'soins_regard',
        duration: 30
      }
    ])
  }, [])

  // Charger les créneaux disponibles quand une date est sélectionnée
  useEffect(() => {
    if (selectedDate) {
      // TODO: Appel API pour récupérer les créneaux
      setTimeSlots([
        { id: 1, date: selectedDate, startTime: '09:00', endTime: '10:30', isAvailable: true },
        { id: 2, date: selectedDate, startTime: '10:30', endTime: '12:00', isAvailable: true },
        { id: 3, date: selectedDate, startTime: '14:00', endTime: '15:30', isAvailable: true },
        { id: 4, date: selectedDate, startTime: '15:30', endTime: '17:00', isAvailable: false },
      ])
    }
  }, [selectedDate])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setStep(3)
  }

  const handleBookingSubmit = async () => {
    setLoading(true)
    // TODO: Appel API pour créer la réservation
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulation
    setLoading(false)
    setStep(4)
  }

  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Réserver votre rendez-vous
          </h1>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className={`flex items-center ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              Service
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                {step > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              Date & Heure
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${step >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                {step > 3 ? <Check className="h-4 w-4" /> : '3'}
              </div>
              Informations
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${step >= 4 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 4 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                <Check className="h-4 w-4" />
              </div>
              Confirmation
            </div>
          </div>
        </div>

        {/* Step 1: Sélection du service */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-light text-center mb-8">Choisissez votre prestation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-gray-900">{service.price}€</div>
                      {service.duration && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration}min
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{service.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  <div className="mt-4 text-pink-600 text-sm font-medium group-hover:text-pink-700">
                    Sélectionner →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Sélection de la date et heure */}
        {step === 2 && selectedService && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-light">Choisissez votre créneau</h2>
                <p className="text-gray-600">{selectedService.name} - {selectedService.price}€</p>
              </div>
              <div></div>
            </div>

            {/* Sélection de la date */}
            <div>
              <h3 className="text-lg font-medium mb-4">Sélectionnez une date</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {generateDateOptions().map((date) => {
                  const dateObj = new Date(date)
                  const isSelected = selectedDate === date
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-white border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {dateObj.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </div>
                      <div className="text-lg font-light">
                        {dateObj.getDate()}
                      </div>
                      <div className="text-xs">
                        {dateObj.toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sélection de l'heure */}
            {selectedDate && (
              <div>
                <h3 className="text-lg font-medium mb-4">Créneaux disponibles</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.isAvailable && handleTimeSlotSelect(slot)}
                      disabled={!slot.isAvailable}
                      className={`p-4 rounded-xl border transition-all ${
                        slot.isAvailable
                          ? 'bg-white border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {slot.startTime}
                      </div>
                      {!slot.isAvailable && (
                        <div className="text-xs mt-1">Indisponible</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Informations client */}
        {step === 3 && selectedService && selectedTimeSlot && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-light">Vos informations</h2>
                <p className="text-gray-600">
                  {selectedService.name} le {new Date(selectedTimeSlot.date).toLocaleDateString('fr-FR')} à {selectedTimeSlot.startTime}
                </p>
              </div>
              <div></div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={clientInfo.firstName}
                      onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={clientInfo.lastName}
                      onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={clientInfo.notes}
                    onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Ajoutez des informations complémentaires..."
                  ></textarea>
                </div>
              </div>

              <button
                onClick={handleBookingSubmit}
                disabled={!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email || loading}
                className="w-full mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Confirmation en cours...' : 'Confirmer la réservation'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Réservation confirmée !
              </h2>
              <p className="text-gray-600 text-lg">
                Votre rendez-vous a été enregistré avec succès.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-medium mb-6">Récapitulatif de votre rendez-vous</h3>
              <div className="space-y-4 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service :</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-medium">
                    {selectedTimeSlot && new Date(selectedTimeSlot.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure :</span>
                  <span className="font-medium">{selectedTimeSlot?.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée :</span>
                  <span className="font-medium">{selectedService?.duration} minutes</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-600">Prix :</span>
                  <span className="font-bold text-lg">{selectedService?.price}€</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-800 text-sm">
                  Un email de confirmation vous a été envoyé à {clientInfo.email}. 
                  Pour toute modification, contactez-nous au 01 23 45 67 89.
                </p>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}