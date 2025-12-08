'use client'
import { API_URL } from '@/lib/config'
import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff,
  Save,
  X,
  Sparkles
} from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  category: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  totalBookings?: string
  createdAt: string
  updatedAt: string
}

interface ServiceFormData {
  name: string
  description: string
  price: string
  duration: string
  category: string
  sortOrder: string
  imageUrl: string
}

const categories = [
  { value: 'sourcils', label: '✨ Sourcils' },
  { value: 'levres', label: '💋 Lèvres' },
  { value: 'cils', label: '👁️ Cils' }
]

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'sourcils',
    sortOrder: '0',
    imageUrl: ''
  })
  const [customDuration, setCustomDuration] = useState('')
  const [showCustomDuration, setShowCustomDuration] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Charger les services
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setServices(data.data)
    } catch (error) {
      console.error('Erreur chargement services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Filtrer les services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Ouvrir le modal pour ajouter/éditer
  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      
      // Vérifier si la durée fait partie des options prédéfinies
      const predefinedDurations = ['15', '30', '45', '60', '90', '120', '150', '180']
      const durationStr = service.duration.toString()
      
      if (predefinedDurations.includes(durationStr)) {
        // Durée standard
        setFormData({
          name: service.name,
          description: service.description,
          price: service.price.toString(),
          duration: durationStr,
          category: service.category,
          sortOrder: service.sortOrder.toString(),
          imageUrl: service.imageUrl || ''
        })
        setShowCustomDuration(false)
        setCustomDuration('')
      } else {
        // Durée personnalisée
        setFormData({
          name: service.name,
          description: service.description,
          price: service.price.toString(),
          duration: 'custom',
          category: service.category,
          sortOrder: service.sortOrder.toString(),
          imageUrl: service.imageUrl || ''
        })
        setShowCustomDuration(true)
        setCustomDuration(durationStr)
      }
    } else {
      setEditingService(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: 'sourcils',
        sortOrder: '0',
        imageUrl: ''
      })
      setShowCustomDuration(false)
      setCustomDuration('')
    }
    setShowModal(true)
  }

  // Fermer le modal
  const closeModal = () => {
    setShowModal(false)
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'sourcils',
      sortOrder: '0',
      imageUrl: ''
    })
    setShowCustomDuration(false)
    setCustomDuration('')
    setUploading(false)
    setUploadError('')
  }

  // Fonction pour uploader une image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('L\'image est trop grande (max 5MB)')
      return
    }

    // Vérifier le type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format non accepté. Utilisez JPG, PNG, GIF ou WEBP')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const token = localStorage.getItem('adminToken')
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await fetch('http://localhost:5000/api/admin/upload/service-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })

      const data = await response.json()

      if (response.ok) {
        setFormData({ ...formData, imageUrl: data.data.imageUrl })
        setUploadError('')
      } else {
        setUploadError(data.message || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      setUploadError('Erreur de connexion au serveur')
    } finally {
      setUploading(false)
    }
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const token = localStorage.getItem('adminToken')
      const url = editingService 
        ? `http://localhost:5000/api/admin/services/${editingService.id}`
        : 'http://localhost:5000/api/admin/services'
      
      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          duration: showCustomDuration ? customDuration : formData.duration
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        closeModal()
        fetchServices()
      } else {
        alert(data.message || 'Erreur')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion')
    } finally {
      setFormLoading(false)
    }
  }

  // Supprimer un service
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(data.message)
        fetchServices()
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion')
    }
  }

  // Toggle active/inactive
  const toggleActive = async (service: Service) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...service,
          isActive: !service.isActive
        })
      })

      if (response.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Helper pour formater le nom de catégorie
  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Services</h1>
          <p className="text-gray-600">{services.length} service(s) au total</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image */}
            {service.imageUrl && (
              <div className="h-48 bg-gray-200">
                <img 
                  src={`http://localhost:5000${service.imageUrl}`}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Contenu */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <span className="text-sm text-gray-500">{getCategoryLabel(service.category)}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-blue-600">{service.price}€</span>
                <span className="text-sm text-gray-500">
                  {service.duration >= 60 
                    ? `${Math.floor(service.duration / 60)}h${service.duration % 60 > 0 ? (service.duration % 60).toString().padStart(2, '0') : ''}`
                    : `${service.duration} min`
                  }
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  service.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.isActive ? 'Actif' : 'Inactif'}
                </span>
                {service.totalBookings && (
                  <span className="text-xs text-gray-500">
                    {service.totalBookings} réservation(s)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(service)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center"
                >
                  {service.isActive ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {service.isActive ? 'Masquer' : 'Afficher'}
                </button>
                <button
                  onClick={() => openModal(service)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun service */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun service trouvé</p>
        </div>
      )}

      {/* Modal Ajouter/Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingService ? 'Modifier le service' : 'Nouveau service'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du service *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée *
                  </label>
                  
                  {showCustomDuration ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        placeholder="Durée en minutes (ex: 40, 75, 105...)"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomDuration(false)
                          setCustomDuration('')
                          setFormData({ ...formData, duration: '60' })
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                      >
                        ← Retour aux durées prédéfinies
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.duration}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowCustomDuration(true)
                          setFormData({ ...formData, duration: 'custom' })
                        } else {
                          setFormData({ ...formData, duration: e.target.value })
                        }
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="">-- Choisir une durée --</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1h</option>
                      <option value="90">1h30</option>
                      <option value="120">2h</option>
                      <option value="150">2h30</option>
                      <option value="180">3h</option>
                      <option value="custom">✏️ Autre durée personnalisée...</option>
                    </select>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Choisissez une durée standard ou créez une durée personnalisée
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image du service
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Upload en cours...</p>}
                {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={`http://localhost:5000${formData.imageUrl}`}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {formLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}