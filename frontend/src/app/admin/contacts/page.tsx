// 1. frontend/src/app/admin/contacts/page.tsx - Gestion des contacts
'use client'

import { useState, useEffect } from 'react'
import { 
  Mail,
  Phone,
  User,
  Search,
  Eye,
  Trash2,
  MessageCircle,
  Clock,
  CheckCircle2
} from 'lucide-react'

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRead, setFilterRead] = useState<string>('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Charger les contacts
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams()
      if (filterRead) params.append('isRead', filterRead)
      
      const response = await fetch(`/api/admin/contacts?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setContacts(data.data)
    } catch (error) {
      console.error('Erreur chargement contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [filterRead])

  // Marquer comme lu/non lu
  const toggleRead = async (contactId: number, isRead: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/contacts/${contactId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRead: !isRead })
      })

      if (response.ok) {
        await fetchContacts()
      }
    } catch (error) {
      console.error('Erreur toggle read:', error)
    }
  }

  // Supprimer un contact
  const deleteContact = async (contactId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        await fetchContacts()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Erreur suppression contact:', error)
    }
  }

  // Filtrer les contacts
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase()
    return (
      contact.firstName.toLowerCase().includes(searchLower) ||
      contact.lastName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.message.toLowerCase().includes(searchLower)
    )
  })

  // Ouvrir le modal
  const openModal = async (contact: Contact) => {
    setSelectedContact(contact)
    setShowModal(true)
    
    // Marquer comme lu automatiquement
    if (!contact.isRead) {
      await toggleRead(contact.id, contact.isRead)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <h1 className="text-2xl font-bold text-gray-900">Messages de Contact</h1>
          <p className="text-gray-600">
            {contacts.filter(c => !c.isRead).length} message(s) non lu(s) sur {contacts.length}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher dans les messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les messages</option>
            <option value="false">Non lus</option>
            <option value="true">Lus</option>
          </select>
        </div>
      </div>

      {/* Liste des contacts */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer ${
                !contact.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => openModal(contact)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </span>
                    </div>
                    {!contact.isRead && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Nouveau
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{contact.email}</span>
                    {contact.phone && (
                      <>
                        <Phone className="h-4 w-4 ml-4 mr-2" />
                        <span>{contact.phone}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {contact.message}
                  </p>
                </div>
                
                <div className="ml-4 flex flex-col items-end">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(contact.createdAt)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRead(contact.id, contact.isRead)
                      }}
                      className={`text-sm px-2 py-1 rounded ${
                        contact.isRead ? 'text-gray-600 hover:text-gray-800' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {contact.isRead ? <Eye className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteContact(contact.id)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de détail */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Message de {selectedContact.firstName} {selectedContact.lastName}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'envoi</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center">
                  {selectedContact.isRead ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Lu
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Non lu
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleRead(selectedContact.id, selectedContact.isRead)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    {selectedContact.isRead ? 'Marquer non lu' : 'Marquer comme lu'}
                  </button>
                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Supprimer
                  </button>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: Votre message&body=Bonjour ${selectedContact.firstName},`}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Répondre
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

