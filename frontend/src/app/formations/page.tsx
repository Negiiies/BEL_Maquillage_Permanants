'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Heart, Eye } from 'lucide-react';
import LogoTransition from '@/components/LogoTransition';

export default function FormationsHomePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [formationCounts, setFormationCounts] = useState<{ [key: string]: number }>({
    cils: 0,
    levres: 0,
    sourcils: 0
  });

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  };

  // Charger les formations depuis l'API
  useEffect(() => {
    const fetchFormationCounts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(`${API_URL}/formations`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Formations récupérées:', data); // Pour debug
          const formations = data.data || [];
          
          // Compter les formations par catégorie (subcategory)
          const counts = {
            cils: formations.filter((f: any) => f.subcategory === 'cils' && f.isActive).length,
            levres: formations.filter((f: any) => f.subcategory === 'levres' && f.isActive).length,
            sourcils: formations.filter((f: any) => f.subcategory === 'sourcils' && f.isActive).length
          };
          
          console.log('Counts calculés:', counts); // Pour debug
          setFormationCounts(counts);
        } else {
          console.error('Erreur API:', response.status);
        }
      } catch (error) {
        console.error('Erreur chargement formations:', error);
      }
    };

    fetchFormationCounts();
  }, []);

  const categories = [
    {
      id: 1,
      name: 'Cils',
      slug: 'cils',
      icon: Eye,
      subtitle: 'L\'art du regard',
      description: 'Maîtrisez l\'art du regard avec nos techniques avancées de rehaussement et extension de cils. Une formation complète pour sublimer chaque regard.',
      imageUrl: '/images/cilss.jpg'
    },
    {
      id: 2,
      name: 'Lèvres',
      slug: 'levres',
      icon: Heart,
      subtitle: 'La perfection du sourire',
      description: 'L\'excellence de la pigmentation des lèvres pour un résultat naturel et durable. Apprenez les techniques du maquillage semi-permanent des lèvres.',
      imageUrl: '/images/levres.jpg'
    },
    {
      id: 3,
      name: 'Sourcils',
      slug: 'sourcils',
      icon: Sparkles,
      subtitle: 'L\'élégance du visage',
      description: 'De la restructuration au maquillage permanent, devenez experte en sublimation du regard. Techniques Microblading, Ombré Brow et plus encore.',
      imageUrl: '/images/sourcilss.jpg'
    }
  ];

  const faqs = [
    {
      q: "Quel est le prix de la formation et les options de paiement ?",
      a: "Le prix varie selon la formation choisie. Nous proposons plusieurs options de paiement : comptant avec réduction, en plusieurs fois sans frais, et prise en charge par des organismes (CPF, Pôle Emploi)."
    },
    {
      q: "Qu'est-ce qui est inclus dans le kit de formation ?",
      a: "Chaque formation inclut un kit professionnel complet : manuel détaillé, pigments premium, outils et matériel pro, certificat de formation, et accès au groupe privé de suivi."
    },
    {
      q: "Où se déroule la formation ?",
      a: "Les formations se déroulent dans notre institut, dans une salle équipée et moderne, dans un cadre professionnel et convivial."
    },
    {
      q: "Y a-t-il un nombre de places limité ?",
      a: "Oui, nous limitons à 4-6 participants maximum par session pour garantir un apprentissage optimal et un suivi personnalisé."
    },
    {
      q: "Quels sont les prérequis pour participer ?",
      a: "Aucun prérequis spécifique. La formation est ouverte à tous, débutants comme professionnels. Une passion pour l'esthétique et la volonté d'apprendre sont les seuls critères."
    },
    {
      q: "Y a-t-il un accompagnement après la formation ?",
      a: "Absolument ! Groupe privé d'anciens élèves, conseils continus, partage de réalisations. Nous restons disponibles pour vous accompagner."
    }
  ];

  return (
    <>
      {showTransition && (
        <LogoTransition 
          pageName="FORMATIONS" 
          onComplete={handleTransitionComplete}
        />
      )}

      <div className={`min-h-screen bg-[#FAF7F2] text-neutral-900 font-serif transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* HERO ÉDITORIAL AVEC VIDÉO */}
      <section className="relative pt-32 pb-20 px-8 overflow-hidden">
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

        <div className="max-w-5xl mx-auto relative z-20">
          {/* Tag */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-black"></div>
            <span className="text-xs uppercase tracking-[0.3em] text-black font-medium">BEL Academy</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-6 leading-[0.9]">
            <span className="italic font-extralight text-neutral-800">Nos</span><br />
            <span className="text-black">Formations</span>
          </h1>

          {/* Intro */}
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div>
              <p className="text-2xl font-light leading-relaxed text-black">
                Transformez votre passion en expertise reconnue
              </p>
            </div>
            <div>
              <p className="text-lg font-light leading-relaxed text-neutral-900">
                Découvrez nos formations professionnelles qualifiantes en pigmentation et beauté du regard.
                Des programmes conçus pour transmettre une maîtrise technique rigoureuse, des méthodes reconnues et le savoir-faire d'une experte du domaine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIGNE SÉPARATRICE */}
      <div className="border-t-2 border-neutral-900 my-16"></div>

      {/* FORMATIONS - TIMELINE ÉDITORIALE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          
          {categories.map((category, index) => {
            const Icon = category.icon;
            
            return (
              <div 
                key={category.id}
                className="mb-32 last:mb-0 group cursor-pointer"
                onClick={() => router.push(`/formations/${category.slug}`)}
              >
                {/* Numéro + Ligne */}
                <div className="flex items-center gap-8 mb-12">
                  <span className="text-8xl font-light text-neutral-300 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 h-[2px] bg-neutral-300"></div>
                  <Icon className="w-8 h-8 text-neutral-400" />
                </div>

                {/* Contenu */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Image - 7 colonnes */}
                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200 group-hover:shadow-2xl transition-shadow duration-500">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ 
                          objectPosition: category.slug === 'levres' ? 'center 60%' : 'center center' 
                        }}
                      />
                    </div>
                  </div>

                  {/* Texte - 5 colonnes */}
                  <div className="lg:col-span-5 space-y-6 lg:pt-4">
                    
                    {/* Catégorie */}
                    <div>
                      <h2 className="text-5xl md:text-6xl font-light mb-2 group-hover:text-neutral-600 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-xl italic text-neutral-500 font-light">
                        {category.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-700 leading-relaxed font-light">
                      {category.description}
                    </p>

                    {/* Stats - Nombre de formations dynamique */}
                    <div className="flex items-center gap-2 text-sm text-neutral-600 pt-6 border-t border-neutral-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{formationCounts[category.slug] || 0} formation{(formationCounts[category.slug] || 0) > 1 ? 's disponibles' : ' disponible'}</span>
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-3 border-b-2 border-neutral-900 pb-2 group-hover:border-neutral-500 transition-colors">
                        <span className="text-sm uppercase tracking-[0.2em]">Découvrir les formations</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* POURQUOI BEL ACADEMY - FORMAT ÉDITORIAL */}
      <section className="py-32 border-t-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Header 2 colonnes */}
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">Pourquoi nous ?</p>
              <h2 className="text-5xl md:text-6xl font-light leading-tight">
                L'Excellence<br />BEL Academy
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-lg text-neutral-700 font-light leading-relaxed">
                Des formations d'exception dispensées par une experte reconnue. 
                Un cadre intimiste, des techniques avant-gardistes et un accompagnement personnalisé.
              </p>
            </div>
          </div>

          {/* Liste horizontale */}
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: '01', title: 'Expertise Reconnue', desc: 'Formatrice certifiée avec plus de 9 ans d expérience' },
              { num: '02', title: 'Petit Effectif', desc: 'Maximum 2 élèves par session pour un suivi optimal' },
              { num: '03', title: 'Certification', desc: 'Diplôme qualifiant et accompagnement post-formation' }
            ].map((item) => (
              <div key={item.num} className="space-y-4">
                <div className="text-5xl font-light text-neutral-400">{item.num}</div>
                <h3 className="text-2xl font-light border-b border-neutral-300 pb-3">{item.title}</h3>
                <p className="text-neutral-700 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CHIFFRES - FORMAT MAGAZINE */}
      <section className="py-24 border-t border-neutral-300">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '9+', label: 'Années' },
              { value: '200+', label: 'Élèves formées' },
              { value: '6', label: 'Formations' },
              { value: '98%', label: 'Satisfaction' }
            ].map((stat, index) => (
              <div key={index} className="text-center border-l border-neutral-300 first:border-l-0">
                <div className="text-6xl font-light mb-2 text-neutral-900">{stat.value}</div>
                <p className="text-neutral-600 text-xs uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 border-t-2 border-neutral-900">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-20">
            <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-8"></div>
            <h2 className="text-5xl font-light mb-6">Questions Fréquentes</h2>
            <p className="text-neutral-600 font-light">Tout ce que vous devez savoir</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-neutral-200 pb-6">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-start text-left gap-8 group"
                >
                  <span className="text-xl font-light flex-1 group-hover:text-neutral-600 transition-colors">
                    {faq.q}
                  </span>
                  <span className={`text-2xl text-neutral-400 transition-transform duration-300 ${
                    openFaq === index ? 'rotate-45' : ''
                  }`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${
                  openFaq === index ? 'max-h-96 mt-6' : 'max-h-0'
                }`}>
                  <p className="text-neutral-700 leading-relaxed font-light">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 border-t border-neutral-300">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center space-y-12">
            <h2 className="text-6xl md:text-7xl font-light leading-tight">
              Prête à rejoindre<br />BEL Academy ?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="inline-block px-12 py-5 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm uppercase tracking-[0.2em]"
              >
                Me contacter
              </Link>
              <a
                href="https://wa.me/33612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-12 py-5 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-sm uppercase tracking-[0.2em]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}