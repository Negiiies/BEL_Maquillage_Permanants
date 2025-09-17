'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, User, MessageSquare } from 'lucide-react'
import LogoTransition from '../../components/LogoTransition'

export default function ContactPage() {
  const [showContent, setShowContent] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      // Reset le status après 5 secondes
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <>
      {!showContent && (
        <LogoTransition 
          pageName="Contact" 
          onComplete={() => setShowContent(true)} 
        />
      )}
      
      {showContent && (
        <div className="min-h-screen animate-[slideUp_0.8s_ease-out]">
          {/* Hero Section Contact */}
          <section className="relative h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div className="max-w-4xl">
                <div className="mb-8">
                  <span className="inline-block bg-white bg-opacity-10 text-white text-sm font-medium px-6 py-2 rounded-full backdrop-blur-md">
                    PARLONS BEAUTÉ
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight font-serif">
                  Contactez-Nous
                </h1>
                
                <p className="text-xl md:text-2xl font-light mb-8 opacity-90 max-w-2xl mx-auto">
                  Nous sommes là pour répondre à toutes vos questions et vous accompagner
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Nous écrire
                  </button>
                  <button 
                    onClick={() => document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Nos coordonnées
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </section>

          {/* Section Formulaire et Informations */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Formulaire de contact */}
                <div id="contact-form" className="bg-gray-50 rounded-3xl p-8 shadow-lg">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Envoyez-nous un message
                    </h2>
                    <div className="w-16 h-1 bg-black mb-4"></div>
                    <p className="text-gray-600">
                      Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>

                  {/* Messages de statut */}
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      ✅ Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                      ❌ Une erreur s'est produite. Veuillez réessayer.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Prénom et Nom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="votre.email@exemple.com"
                      />
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="01 23 45 67 89"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Décrivez votre demande, questions sur nos prestations, prise de rendez-vous..."
                      ></textarea>
                    </div>

                    {/* Bouton d'envoi */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Envoyer le message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Informations de contact */}
                <div id="contact-info" className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Informations de contact
                    </h2>
                    <div className="w-16 h-1 bg-black mb-6"></div>
                    <p className="text-gray-600 text-lg">
                      Notre équipe est à votre disposition pour vous accueillir dans les meilleures conditions.
                    </p>
                  </div>

                  {/* Coordonnées */}
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                        <p className="text-gray-600">
                          123 Rue de la Beauté<br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                        <p className="text-gray-600">01 23 45 67 89</p>
                        <p className="text-sm text-gray-500">Lun-Ven: 9h-18h, Sam: 9h-16h</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600">contact@bel-institut.fr</p>
                        <p className="text-sm text-gray-500">Réponse sous 24h</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
                        <div className="text-gray-600 space-y-1">
                          <p>Lundi - Vendredi: 9h - 18h</p>
                          <p>Samedi: 9h - 16h</p>
                          <p className="text-sm text-gray-500">Dimanche: Fermé</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Réseaux sociaux */}
                  <div className="bg-black rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-semibold mb-4">Suivez-nous</h3>
                    <p className="text-gray-300 mb-4">
                      Découvrez nos dernières réalisations et conseils beauté
                    </p>
                    <div className="flex space-x-4">
                      <a 
                        href="#" 
                        className="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-300"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                      <a 
                        href="#" 
                        className="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-300"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Carte/FAQ */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Plan d'accès */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Comment nous trouver</h2>
                  <div className="bg-gray-300 rounded-2xl h-80 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <MapPin className="h-12 w-12 mx-auto mb-4" />
                      <p>Plan d'accès interactif</p>
                      <p className="text-sm">(Intégration Google Maps)</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span>Métro : Châtelet-Les Halles (Lignes 1, 4, 7, 11, 14)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span>Bus : Lignes 21, 38, 47, 58, 67, 69, 70, 72, 74, 75, 76, 81, 85</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span>Parking : Parking Forum des Halles (5 min à pied)</span>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Comment prendre rendez-vous ?</h3>
                      <p className="text-gray-600 text-sm">
                        Vous pouvez nous contacter par téléphone, email ou via ce formulaire. Nous vous proposerons des créneaux selon vos disponibilités.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Proposez-vous des consultations gratuites ?</h3>
                      <p className="text-gray-600 text-sm">
                        Oui, nous offrons une consultation gratuite de 15 minutes pour discuter de vos besoins et vous conseiller.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Quels sont vos délais pour un rendez-vous ?</h3>
                      <p className="text-gray-600 text-sm">
                        Nous nous efforçons de vous proposer un rendez-vous dans les 48h. Pour les urgences, contactez-nous directement.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Acceptez-vous les cartes bancaires ?</h3>
                      <p className="text-gray-600 text-sm">
                        Oui, nous acceptons tous les modes de paiement : CB, espèces, chèques et virements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Animation d'entrée pour le contenu */}
          <style jsx>{`
            @keyframes slideUp {
              0% { opacity: 0; transform: translateY(50px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  )
}