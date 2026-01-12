'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormationSections from '@/components/FormationSections';
import { API_URL } from '@/lib/config';

interface Formation {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  subcategory: string;
  level: string;
  imageUrl?: string;
}

export default function FormationsCilsPage() {
  const router = useRouter();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch(`${API_URL}/formations/subcategory/cils`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setFormations(data.data);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const getLevelLabel = (level: string) => {
    const labels: any = {
      debutant: 'Débutant',
      intermediaire: 'Intermédiaire',
      avance: 'Avancé'
    };
    return labels[level] || level;
  };

  const scrollToInscription = () => {
    const element = document.getElementById('inscription-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 font-serif">
      
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-8 overflow-hidden border-b border-neutral-300">
        {/* Vidéo background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/formation.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-5xl mx-auto relative z-20 text-center">
          <div className="w-12 h-[1px] bg-black mx-auto mb-8"></div>
          <p className="text-xs uppercase tracking-[0.3em] text-black font-medium mb-6">
            BEL Academy
          </p>
          <h1 className="text-7xl md:text-8xl font-light mb-6 leading-tight">
            <span className="italic font-extralight text-neutral-800">Formations</span><br />
            <span className="text-black">Cils</span>
          </h1>
          <p className="text-lg text-neutral-900 max-w-2xl mx-auto font-light">
            Maîtrisez l'art du regard avec nos formations professionnelles dédiées aux cils
          </p>
        </div>
      </section>

      {/* FORMATIONS */}
      <section className="py-32">
        {formations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 font-light">
              Aucune formation disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-8 space-y-32">
            {formations.map((formation, index) => (
              <div 
                key={formation.id}
                className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
              >
                {/* IMAGE */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                    {formation.imageUrl ? (
                      <img
                        src={`${API_URL}${formation.imageUrl}`}
                        alt={formation.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENU */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  {/* Numéro */}
                  <div className="flex items-center gap-6">
                    <span className="text-6xl font-light text-neutral-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 h-[1px] bg-neutral-300"></div>
                  </div>

                  {/* Badge */}
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                      Cils
                    </span>
                  </div>

                  {/* Titre */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight">
                    {formation.title}
                  </h2>

                  {/* Description */}
                  <p className="text-neutral-700 text-lg leading-relaxed font-light">
                    {formation.description}
                  </p>

                  {/* Infos */}
                  <div className="flex items-center gap-8 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Prix</p>
                      <p className="text-3xl font-light">{formation.price}€</p>
                    </div>
                    <div className="w-[1px] h-12 bg-neutral-300"></div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Durée</p>
                      <p className="text-lg font-light">{formation.duration}</p>
                    </div>
                    <div className="w-[1px] h-12 bg-neutral-300"></div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Niveau</p>
                      <p className="text-lg font-light">{getLevelLabel(formation.level)}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-8">
                    <button
                      onClick={scrollToInscription}
                      className="group inline-flex items-center gap-4 text-sm uppercase tracking-[0.2em] border-b-2 border-neutral-900 pb-2 hover:border-neutral-500 transition-colors"
                    >
                      <span>Je m'inscris</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTIONS INSCRIPTION + FAQ */}
      <FormationSections 
        formationTitle="Formations Cils"
        formationId={0}
      />

      {/* CTA FINAL */}
      <section className="py-32 border-t border-neutral-300">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-12 leading-[1.1] tracking-tight">
            Prête à devenir<br />experte en cils ?
          </h2>
          
          <p className="text-lg text-neutral-600 mb-12 font-light">
            Rejoignez BEL Academy et maîtrisez les techniques professionnelles
          </p>
          
          <button
            onClick={() => router.push('/contact')}
            className="inline-flex items-center gap-4 px-12 py-5 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm uppercase tracking-[0.2em]"
          >
            <span>Me contacter</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
}