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
        <div className="min-h-screen bg-[#FAF7F2] font-serif animate-[slideUp_0.8s_ease-out]">
          
          {/* Hero avec Image */}
          <section className="relative h-[70vh] overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="/images/Piece.png" 
                alt="Contactez BEL Institut"
                className="w-full h-full object-cover object-top"
                style={{ objectPosition: 'center top' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-8 pt-20">
              <div className="w-12 h-[1px] bg-white/60 mx-auto mb-6"></div>
              <p className="text-xs uppercase tracking-[0.3em] mb-6 opacity-90">
                Entrons en contact
              </p>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight font-serif">
                <span className="italic font-extralight">Contactez</span><br/>
                <span>Nous</span>
              </h1>
              <p className="text-xl font-light opacity-90 max-w-2xl">
                Nous sommes là pour répondre à toutes vos questions
              </p>
            </div>
          </section>

          {/* Section principale */}
          <section className="py-32">
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Colonne gauche : Photo + Infos */}
                <div className="space-y-12">
                  
                  {/* Photo éditoriale */}
                  <div className="aspect-[3/4] bg-neutral-200 overflow-hidden">
                    <img 
                      src="/images/soeur1.jpg" 
                      alt="BEL Institut"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 20%' }}
                    />
                  </div>

                  {/* Réseaux sociaux */}
                  <div className="border-t-2 border-neutral-900 pt-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">
                      Suivez-nous
                    </p>
                    <div className="flex space-x-6">
                      <a 
                        href="https://www.instagram.com/bel_institut?igsh=djA1NTZzcWlrZ2V2" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 border border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      
                      <a 
                        href="https://www.tiktok.com/@bel_institut?_t=ZN-90NqZO3TOB4&_r=1" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 border border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="border-t border-neutral-300 pt-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-8">
                      Questions Fréquentes
                    </p>
                    <div className="space-y-8">
                      <div className="border-l-2 border-neutral-900 pl-6">
                        <h4 className="font-light text-lg text-neutral-900 mb-2">Dois-je prendre rendez-vous ?</h4>
                        <p className="text-sm text-neutral-700 font-light leading-relaxed">
                          Oui, nous travaillons uniquement sur rendez-vous pour garantir un service personnalisé.
                        </p>
                      </div>
                      <div className="border-l-2 border-neutral-900 pl-6">
                        <h4 className="font-light text-lg text-neutral-900 mb-2">Quel est le délai ?</h4>
                        <p className="text-sm text-neutral-700 font-light leading-relaxed">
                          Réponse sous 24h. Rendez-vous généralement sous 3 à 7 jours.
                        </p>
                      </div>
                      <div className="border-l-2 border-neutral-900 pl-6">
                        <h4 className="font-light text-lg text-neutral-900 mb-2">Consultation gratuite ?</h4>
                        <p className="text-sm text-neutral-700 font-light leading-relaxed">
                          Oui, la première consultation est offerte pour discuter de vos besoins.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne droite : Coordonnées */}
                <div className="space-y-12">
                  
                  <div className="border-b border-neutral-300 pb-8">
                    <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">
                      Nos Coordonnées
                    </h2>
                    <p className="text-neutral-700 font-light">
                      Contactez-nous directement
                    </p>
                  </div>

                  {/* Coordonnées */}
                  <div className="space-y-10">
                    
                    {/* Téléphone */}
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 border border-neutral-300 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-neutral-900" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-light text-neutral-900 mb-2">Téléphone</h3>
                        <p className="text-neutral-700 font-light">06 37 46 60 04</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 border border-neutral-300 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-neutral-900" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-light text-neutral-900 mb-2">Email</h3>
                        <p className="text-neutral-700 font-light">bel.pmakeup@gmail.com</p>
                      </div>
                    </div>

                    {/* Adresse */}
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 border border-neutral-300 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-neutral-900" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-light text-neutral-900 mb-2">Adresse</h3>
                        <p className="text-neutral-700 font-light leading-relaxed">
                          59 Route de la Ferme du Pavillon<br />
                          77600 Chanteloup-en-Brie
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Citation */}
                  <div className="border-t-2 border-neutral-900 pt-12 mt-12">
                    <div className="border-l-2 border-neutral-900 pl-8">
                      <p className="text-2xl font-light italic text-neutral-800 mb-4 leading-relaxed">
                        "Nous sommes impatients de vous accueillir"
                      </p>
                      <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                        — L'équipe BEL
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* Map */}
          <section className="py-32 bg-white border-t border-neutral-300">
            <div className="max-w-7xl mx-auto px-8">
              
              <div className="text-center mb-16">
                <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-8"></div>
                <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">
                  Où nous trouver ?
                </h2>
                <p className="text-neutral-700 font-light">
                  Venez nous rendre visite
                </p>
              </div>
              
              <div className="border-2 border-neutral-900 overflow-hidden h-96">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5250.239581321497!2d2.7422827764956055!3d48.85592607133179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e61cb0c921fafb%3A0x34a62203bbb14f8c!2s59%20Rte%20de%20la%20Frm%20du%20Pavillon%2C%2077600%20Chanteloup-en-Brie!5e0!3m2!1sfr!2sfr!4v1759954380407!5m2!1sfr!2sfr"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(20%)' }}
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