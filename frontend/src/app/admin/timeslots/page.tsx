'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function AdminTimeSlotsGenerator() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Horaires par défaut
  const [schedule, setSchedule] = useState({
    weekdays: {
      start: '09:00',
      end: '18:00',
      slotDuration: 30
    },
    saturday: {
      start: '09:00',
      end: '16:00',
      slotDuration: 30
    }
  });

  // ⭐ FIX TIMEZONE : Fonction pour formater la date en YYYY-MM-DD sans décalage
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Générer les jours du mois
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() || 7; // Lundi = 1
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Jours du mois précédent
    for (let i = startDay - 1; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate,
        dateString: formatDateString(prevDate), // ⭐ FIX
        isCurrentMonth: false,
        isPast: prevDate < today
      });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDay = new Date(year, month, day);
      days.push({
        date: currentDay,
        dateString: formatDateString(currentDay), // ⭐ FIX
        isCurrentMonth: true,
        isPast: currentDay < today
      });
    }
    
    // Compléter la semaine
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({
          date: nextDate,
          dateString: formatDateString(nextDate), // ⭐ FIX
          isCurrentMonth: false,
          isPast: false
        });
      }
    }
    
    return days;
  };

  const calendar = generateCalendar(currentDate);
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Toggle un jour
  const toggleDay = (dateString: string, isPast: boolean) => {
    if (isPast) return;
    
    setSelectedDays(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(d => d !== dateString);
      } else {
        return [...prev, dateString];
      }
    });
  };

  // Calculer le nombre de créneaux
  const calculateSlots = () => {
    let totalSlots = 0;
    
    selectedDays.forEach(dateString => {
      const date = new Date(dateString + 'T12:00:00'); // ⭐ Force midi pour éviter décalage
      const dayOfWeek = date.getDay();
      const isSaturday = dayOfWeek === 6;
      
      const config = isSaturday ? schedule.saturday : schedule.weekdays;
      
      const startMinutes = parseInt(config.start.split(':')[0]) * 60 + parseInt(config.start.split(':')[1]);
      const endMinutes = parseInt(config.end.split(':')[0]) * 60 + parseInt(config.end.split(':')[1]);
      
      const dailySlots = Math.floor((endMinutes - startMinutes) / config.slotDuration);
      
      totalSlots += dailySlots;
    });
    
    return totalSlots;
  };

  // Générer les créneaux
  const generateTimeSlots = async () => {
    if (selectedDays.length === 0) {
      alert('Veuillez sélectionner au moins un jour');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      const allSlots = [];
      
      for (const dateString of selectedDays) {
        const date = new Date(dateString + 'T12:00:00'); // ⭐ Force midi
        const dayOfWeek = date.getDay();
        const isSaturday = dayOfWeek === 6;
        
        const config = isSaturday ? schedule.saturday : schedule.weekdays;
        
        const slots = [];
        let currentTime = config.start;
        
        const addMinutes = (time: string, minutes: number) => {
          const [hours, mins] = time.split(':').map(Number);
          const totalMins = hours * 60 + mins + minutes;
          const newHours = Math.floor(totalMins / 60);
          const newMins = totalMins % 60;
          return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
        };
        
        while (currentTime < config.end) {
          const endTime = addMinutes(currentTime, config.slotDuration);
          
          if (endTime <= config.end) {
            slots.push({
              startTime: currentTime,
              endTime: endTime,
              maxBookings: 1
            });
          }
          
          currentTime = endTime;
        }
        
        allSlots.push({
          date: dateString,
          slots
        });
      }

      // Envoyer au backend
      const promises = allSlots.map(day => 
        fetch(`${API_URL}/api/timeslots`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(day)
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.ok).length;

      alert(`✅ ${successCount}/${selectedDays.length} jours créés avec succès !`);
      setSelectedDays([]);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la génération des créneaux');
    } finally {
      setLoading(false);
    }
  };

  // Sélectionner tous les jours du mois (hors passé)
  const selectAllDays = () => {
    const allDays = calendar
      .filter(day => day.isCurrentMonth && !day.isPast)
      .map(day => day.dateString);
    setSelectedDays(allDays);
  };

  // Désélectionner tous
  const deselectAllDays = () => {
    setSelectedDays([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Générateur de Créneaux</h1>
          <p className="text-gray-600">Cliquez sur les jours où vous êtes présente pour générer vos créneaux automatiquement</p>
        </div>

        {/* Configuration horaires */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">⏰ Vos horaires de travail</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lundi-Vendredi */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Lundi - Vendredi</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Début</label>
                  <input
                    type="time"
                    value={schedule.weekdays.start}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      weekdays: { ...schedule.weekdays, start: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Fin</label>
                  <input
                    type="time"
                    value={schedule.weekdays.end}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      weekdays: { ...schedule.weekdays, end: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Samedi */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Samedi</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Début</label>
                  <input
                    type="time"
                    value={schedule.saturday.start}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      saturday: { ...schedule.saturday, start: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Fin</label>
                  <input
                    type="time"
                    value={schedule.saturday.end}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      saturday: { ...schedule.saturday, end: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="text-2xl font-bold capitalize text-gray-900">{monthName}</h2>
            
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* En-têtes jours */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grille calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {calendar.map((day, index) => {
              const isSelected = selectedDays.includes(day.dateString);
              const isPast = day.isPast;
              
              return (
                <button
                  key={index}
                  onClick={() => toggleDay(day.dateString, isPast)}
                  disabled={!day.isCurrentMonth || isPast}
                  className={`
                    aspect-square p-2 rounded-lg text-center transition-all duration-200
                    ${!day.isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : ''}
                    ${isPast && day.isCurrentMonth ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                    ${!isPast && day.isCurrentMonth && !isSelected ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-gray-200' : ''}
                    ${isSelected ? 'bg-green-500 text-white font-bold border-2 border-green-600 hover:bg-green-600' : ''}
                  `}
                >
                  <div className="text-sm md:text-base">{day.date.getDate()}</div>
                </button>
              );
            })}
          </div>

          {/* Légende */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700">Vous travaillez</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded border-2 border-gray-200"></div>
              <span className="text-gray-700">Jour de repos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-gray-700">Jour passé</span>
            </div>
          </div>
        </div>

        {/* Résumé et actions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">📊 Résumé</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{selectedDays.length}</div>
                <div className="text-sm text-gray-600">Jours sélectionnés</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {selectedDays.length > 0 ? Math.floor(calculateSlots() / selectedDays.length) : 0}
                </div>
                <div className="text-sm text-gray-600">Créneaux par jour</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{calculateSlots()}</div>
                <div className="text-sm text-gray-600">Total créneaux</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={selectAllDays}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Tout sélectionner
            </button>
            <button
              onClick={deselectAllDays}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Tout désélectionner
            </button>
            <button
              onClick={generateTimeSlots}
              disabled={loading || selectedDays.length === 0}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Génération...' : `Générer ${calculateSlots()} créneaux`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}