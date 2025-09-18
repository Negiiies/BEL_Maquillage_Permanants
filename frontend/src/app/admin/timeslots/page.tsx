// frontend/src/app/admin/timeslots/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Settings,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

interface TimeSlot {
  id: number
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  serviceId?: number
  maxBookings: number
  currentBookings: number
  service?: {
    name: string
    category: string
  }
  bookingsDetails: Array<{
    id: number
    clientName: string
    duration: number
    status: string
  }>
}

interface CalendarDay {
  date: string
  isCurrentMonth: boolean
  slots: TimeSlot[]
  isToday: boolean
}

export default function AdminTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  
  // Générer le calendrier
  const generateCalendar = (date: Date): CalendarDay[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay() || 7 // Lundi = 1
    
    const calendar: CalendarDay[] = []
    
    // Jours du mois précédent
    for (let i = firstDayOfWeek - 1; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i)
      calendar.push({
        date: prevDate.toISOString().split('T')[0],
        isCurrentMonth: false,
        slots: [],
        isToday: false
      })
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDay = new Date(year, month, day)
      const dateString = currentDay.toISOString().split('T')[0]
      const today = new Date().toISOString().split('T')[0]
      
      calendar.push({
        date: dateString,
        isCurrentMonth: true,
        slots: timeSlots.filter(slot => slot.date === dateString),
        isToday: dateString === today
      })
    }
    
    // Compléter la semaine
    while (calendar.length % 7 !== 0) {
      const nextDate = new Date(year, month + 1, calendar.length - lastDay.getDate() - (firstDayOfWeek - 1))
      calendar.push({
        date: nextDate.toISOString().split('T')[0],
        isCurrentMonth: false,
        slots: [],
        isToday: false
      })
    }
    
    return calendar
  }

  // Charger les créneaux
  const fetchTimeSlots = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
      
      const response = await fetch(`http://localhost:5000/api/timeslots/available?startDate=${startDate}&endDate=${endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      // Enrichir avec les données admin
      const adminResponse = await fetch(`http://localhost:5000/api/admin/timeslots`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const adminData = await adminResponse.json()
      
      setTimeSlots(adminData.data || [])
    } catch (error) {
      console.error('Erreur chargement créneaux:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimeSlots()
  }, [currentDate])

  // Navigation du calendrier
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Générer des créneaux automatiquement
  const generateTimeSlots = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const startDate = selectedDate || new Date().toISOString().split('T')[0]
      const endDate = new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const response = await fetch('http://localhost:5000/api/admin/timeslots/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate,
          endDate,
          weekDays: [1, 2, 3, 4, 5, 6] // Lun-Sam
        })
      })

      if (response.ok) {
        await fetchTimeSlots()
        alert('Créneaux générés avec succès !')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Erreur lors de la génération')
      }
    } catch (error) {
      console.error('Erreur génération créneaux:', error)
      alert('Erreur de connexion')
    }
  }

  // Basculer la disponibilité d'un créneau
  const toggleSlotAvailability = async (slotId: number, isAvailable: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/admin/timeslots/${slotId}/availability`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !isAvailable })
      })

      if (response.ok) {
        await fetchTimeSlots()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur toggle disponibilité:', error)
      alert('Erreur de connexion')
    }
  }

  const calendar = generateCalendar(currentDate)
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Créneaux</h1>
          <p className="text-gray-600">Planifiez et gérez vos disponibilités</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateTimeSlots}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Générer Créneaux
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}
            >
              <Calendar className="h-4 w-4 inline mr-1" />
              Calendrier
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              <Clock className="h-4 w-4 inline mr-1" />
              Liste
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* Vue Calendrier */
        <div className="bg-white rounded-lg shadow p-6">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize">{monthName}</h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {calendar.map((day, index) => (
              <div
                key={index}
                className={`min-h-24 p-1 border border-gray-200 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}>
                  {new Date(day.date).getDate()}
                </div>
                
                {/* Créneaux du jour */}
                <div className="mt-1 space-y-1">
                  {day.slots.slice(0, 3).map(slot => (
                    <div
                      key={slot.id}
                      className={`text-xs p-1 rounded cursor-pointer ${
                        slot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      } ${slot.currentBookings > 0 ? 'border-l-2 border-blue-500' : ''}`}
                      onClick={() => {
                        setSelectedDate(day.date)
                        // Ici on pourrait ouvrir un modal de détails
                      }}
                    >
                      {slot.startTime.slice(0, 5)}
                      {slot.currentBookings > 0 && (
                        <span className="ml-1 bg-blue-500 text-white rounded-full px-1">
                          {slot.currentBookings}
                        </span>
                      )}
                    </div>
                  ))}
                  {day.slots.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{day.slots.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Légende */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
              <span>Indisponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border-l-2 border-blue-500 rounded mr-2"></div>
              <span>Avec réservations</span>
            </div>
          </div>
        </div>
      ) : (
        /* Vue Liste */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots
                  .filter(slot => !selectedDate || slot.date === selectedDate)
                  .slice(0, 20)
                  .map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(slot.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.service ? slot.service.name : 'Tous services'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {slot.currentBookings}/{slot.maxBookings}
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                slot.currentBookings === 0 ? 'bg-gray-300' :
                                slot.currentBookings < slot.maxBookings ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(slot.currentBookings / slot.maxBookings) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleSlotAvailability(slot.id, slot.isAvailable)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            slot.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {slot.isAvailable ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Disponible
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Indisponible
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Settings className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}