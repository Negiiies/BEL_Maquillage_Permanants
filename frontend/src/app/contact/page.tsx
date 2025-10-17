'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import LogoTransition from '@/components/LogoTransition'

export default function ContactPage() {
  const [showContent, setShowContent] = useState(false)

  return (
    <>
      {!showContent && (
        <LogoTransition 
          pageName="Contact" 
          onComplete={() => setShowContent(true)}
        />
      )}

      {showContent && (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-100 to-stone-50 animate-[slideUp_0.8s_ease-out]">
          {/* Hero */}
          <section className="relative h-[60vh] overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="/images/Piece.png" 
                alt="Contactez BEL Institut"
                className="w-full h-full object-cover object-top"
                style={{ objectPosition: 'center top' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
              <span className="text-sm tracking-[0.3em] uppercase opacity-90 mb-4">BEL Institut</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">Contactez-Nous</h1>
              <p className="text-lg md:text-xl max-w-2xl opacity-90 font-light">
                Nous sommes là pour répondre à toutes vos questions
              </p>
            </div>
          </section>

          {/* Section principale */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Colonne gauche : Photo + Réseaux + FAQ */}
                <div className="space-y-6">
                  {/* Photo verticale */}
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[700px]">
                    <img 
                      src="/images/soeur1.jpg" 
                      alt="Contactez BEL Institut"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 20%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h2 className="text-3xl md:text-4xl font-light mb-2">Prenons Contact</h2>
                      <p className="text-lg opacity-90">Nous sommes à votre écoute</p>
                    </div>
                  </div>

                  {/* Réseaux sociaux avec fond beige */}
                  <div className="bg-stone-100/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-stone-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Suivez-nous</h3>
                    <div className="flex space-x-4">
                      {/* Instagram */}
                      <a 
                        href="https://www.instagram.com/bel_institut?igsh=djA1NTZzcWlrZ2V2" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                      >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      
                      {/* TikTok */}
                      <a 
                        href="https://www.tiktok.com/@bel_institut?_t=ZN-90NqZO3TOB4&_r=1" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-14 h-14 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                      >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* FAQ avec fond beige */}
                  <div className="bg-stone-100/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-stone-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions Fréquentes</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Dois-je prendre rendez-vous ?</h4>
                        <p className="text-sm text-gray-600">Oui, nous travaillons uniquement sur rendez-vous pour vous garantir un service personnalisé.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Quel est le délai pour une consultation ?</h4>
                        <p className="text-sm text-gray-600">Nous vous répondons sous 24h et proposons généralement un rendez-vous sous 3 à 7 jours.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Proposez-vous des consultations gratuites ?</h4>
                        <p className="text-sm text-gray-600">Oui, la première consultation est gratuite pour discuter de vos besoins et vous conseiller.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne droite : Coordonnées */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-light text-gray-900 mb-2">Nos Coordonnées</h2>
                    <p className="text-gray-600 mb-8">Contactez-nous directement</p>
                  </div>

                  {/* Carte coordonnées avec fond beige */}
                  <div className="bg-stone-100/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-8 border border-stone-200">
                    {/* Téléphone */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-stone-200/70 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Téléphone</h3>
                        <p className="text-gray-700">01 23 45 67 89</p>
                        <p className="text-sm text-gray-500 mt-1">Lun - Ven : 9h - 18h</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-stone-200/70 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-700">contact@bel-institut.fr</p>
                        <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                      </div>
                    </div>

                    {/* Adresse */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-stone-200/70 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Adresse</h3>
                        <p className="text-gray-700">59 Route de la Ferme du Pavillon<br />77600 Chanteloup-en-Brie</p>
                      </div>
                    </div>

                    {/* Horaires */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-stone-200/70 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Horaires</h3>
                        <div className="text-gray-700 space-y-1">
                          <p>Lundi - Vendredi : 9h - 18h</p>
                          <p>Samedi : 9h - 16h</p>
                          <p className="text-sm text-gray-500">Dimanche : Fermé</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Citation avec logo - fond très foncé pour contraste */}
                  <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #8c6a4a, #cbb188)' }}>
                    <div className="aspect-[4/3] relative">
                      <img 
                        src="/images/Logo .svg"
                        alt="BEL Institut"
                        className="w-full h-full object-contain p-12 opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center text-white">
                          <p className="text-lg md:text-xl font-light italic mb-4">
                            "Nous sommes impatients de vous accueillir"
                          </p>
                          <p className="text-sm tracking-wider uppercase opacity-90">— L'équipe BEL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Map - fond beige harmonieux */}
          <section className="py-16 bg-gradient-to-b from-stone-100 to-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-4">Où nous trouver ?</h2>
                <p className="text-gray-600">Venez nous rendre visite</p>
              </div>
              
              <div className="bg-stone-300 rounded-2xl overflow-hidden shadow-lg h-96 border-4 border-stone-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5250.239581321497!2d2.7422827764956055!3d48.85592607133179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e61cb0c921fafb%3A0x34a62203bbb14f8c!2s59%20Rte%20de%20la%20Frm%20du%20Pavillon%2C%2077600%20Chanteloup-en-Brie!5e0!3m2!1sfr!2sfr!4v1759954380407!5m2!1sfr!2sfr"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BEL Institut - 59 Route de la Ferme du Pavillon, 77600 Chanteloup-en-Brie"
                ></iframe>
              </div>
            </div>
          </section>
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