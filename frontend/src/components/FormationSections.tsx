'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/config';

interface FormationSectionsProps {
  formationTitle: string;
  formationId: number;
}

export default function FormationSections({ formationTitle, formationId }: FormationSectionsProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // État pour les accordéons FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/inscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          formationTitle,
          formationId
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Questions fréquentes
  const faqs = [
    {
      question: "Quel est le prix de la formation et les options de paiement ?",
      answer: "Le prix varie selon la formation choisie. Nous proposons plusieurs options de paiement : paiement comptant avec réduction, paiement en plusieurs fois sans frais, et prise en charge par des organismes de financement (CPF, Pôle Emploi, etc.). Contactez-nous pour un devis personnalisé."
    },
    {
      question: "Qu'est-ce qui est inclus dans le kit de formation ?",
      answer: "Chaque formation inclut un kit professionnel complet : manuel de formation détaillé, pigments de qualité premium, outils et matériel professionnel, certificat de formation, et accès à notre groupe privé de suivi post-formation."
    },
    {
      question: "Quel est le contenu de la formation ?",
      answer: "La formation couvre tous les aspects essentiels : théorie (anatomie, colorimétrie, hygiène), pratique sur peaux synthétiques, puis pratique sur modèles réels. Vous apprendrez les différentes techniques, la gestion de la clientèle, et recevrez des conseils pour lancer votre activité."
    },
    {
      question: "Où se déroule la formation ?",
      answer: "Les formations se déroulent dans notre institut situé à [Votre ville]. Nous disposons d'une salle de formation équipée et moderne, dans un cadre professionnel et convivial."
    },
    {
      question: "Comment se déroulent les deux jours de formation ?",
      answer: "Jour 1 : Théorie approfondie le matin (anatomie, colorimétrie, hygiène), puis pratique sur peaux synthétiques l'après-midi. Jour 2 : Révision et perfectionnement, puis pratique sur modèles réels avec notre accompagnement personnalisé."
    },
    {
      question: "Y a-t-il un nombre de places limité ?",
      answer: "Oui, nous limitons chaque session à 4-6 participants maximum pour garantir un apprentissage optimal et un suivi personnalisé de chaque élève."
    },
    {
      question: "Qui est la formatrice ?",
      answer: "Votre formatrice est [Nom], experte certifiée en maquillage permanent avec [X] années d'expérience. Passionnée par la transmission de son savoir-faire, elle vous accompagnera personnellement tout au long de votre apprentissage."
    },
    {
      question: "Quels sont les horaires de la formation ?",
      answer: "Les formations se déroulent généralement de 9h00 à 17h00 avec une pause déjeuner. Un planning détaillé vous sera communiqué lors de votre inscription."
    },
    {
      question: "Quels sont les prérequis pour participer à cette formation ?",
      answer: "Aucun prérequis spécifique n'est nécessaire. La formation est ouverte à tous, débutants comme professionnels souhaitant se perfectionner. Une passion pour l'esthétique et la volonté d'apprendre sont les seuls critères requis."
    },
    {
      question: "Y a-t-il des modèles fournis pour la pratique ?",
      answer: "Oui, nous fournissons des modèles pour la pratique. Vous pourrez également inviter vos propres modèles si vous le souhaitez. Cela vous permet de commencer à constituer votre portfolio dès la formation."
    },
    {
      question: "Y a-t-il un accompagnement après la formation ?",
      answer: "Absolument ! Vous intégrerez notre groupe privé d'anciens élèves où vous pourrez poser vos questions, partager vos réalisations, et bénéficier de conseils. Nous restons disponibles pour vous accompagner dans vos premiers pas professionnels."
    }
  ];

  return (
    <div className="bg-[#FAF7F2] text-neutral-900">
      {/* SECTION INSCRIPTION */}
      <div id="inscription-form" className="relative py-32 overflow-hidden border-t-2 border-neutral-900">
        
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Texte gauche */}
            <div>
              <div className="inline-block mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 border border-neutral-300 px-4 py-2">
                  Inscription
                </span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-light mb-8 leading-tight tracking-tight">
                Demande<br />d'Inscription
              </h2>
              
              <div className="space-y-6 text-neutral-700 leading-relaxed font-light">
                <p>
                  En complétant ce formulaire, vous soumettez une demande d'inscription à notre formation. 
                  Veuillez noter que cette demande ne constitue pas une confirmation de participation immédiate. 
                  Elle sera examinée par notre équipe, et nous vous contacterons pour valider votre inscription.
                </p>
                
                <p>
                  Lors de cet échange, nous vous fournirons tous les détails nécessaires pour finaliser votre dossier, 
                  notamment les documents à préparer et les modalités de paiement. Votre participation sera 
                  définitivement confirmée après la validation de votre demande.
                </p>
                
                <p>
                  N'hésitez pas à nous poser toutes vos questions via ce formulaire ou à nous contacter directement 
                  pour toute précision. Nous sommes à votre écoute pour vous accompagner dans cette démarche.
                </p>
              </div>
            </div>

            {/* Formulaire droite */}
            <div className="bg-white border border-neutral-300 p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <input
                  type="text"
                  required
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-4 bg-[#FAF7F2] border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors"
                />

                {/* Prénom */}
                <input
                  type="text"
                  required
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-4 bg-[#FAF7F2] border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors"
                />

                {/* Téléphone et Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    required
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-4 bg-[#FAF7F2] border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 bg-[#FAF7F2] border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <textarea
                  placeholder="Votre message (optionnel)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-4 bg-[#FAF7F2] border border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none transition-colors resize-none"
                />

                {/* Message succès */}
                {success && (
                  <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3">
                    ✅ Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.
                  </div>
                )}

                {/* Message erreur */}
                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3">
                    ❌ {error}
                  </div>
                )}

                {/* Bouton */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm font-medium"
                >
                  {loading ? 'ENVOI EN COURS...' : 'ENVOYER MA DEMANDE'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION FAQ */}
      <div className="relative py-32 border-t border-neutral-300">
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-8"></div>
            
            <h2 className="text-5xl md:text-6xl font-light mb-6 leading-tight tracking-tight">
              Informations<br />Pratiques
            </h2>
            
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto font-light">
              Tout ce que vous devez savoir avant de rejoindre notre formation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-neutral-200 pb-6">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-start text-left gap-6 group"
                >
                  <span className="text-neutral-900 font-light text-lg flex-1 transition-colors group-hover:text-neutral-600">
                    {faq.question}
                  </span>
                  <span className={`text-2xl flex-shrink-0 transition-all duration-300 ${
                    openFaq === index ? 'text-neutral-900 rotate-45' : 'text-neutral-400'
                  }`}>
                    +
                  </span>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ${
                  openFaq === index ? 'max-h-96 mt-6' : 'max-h-0'
                }`}>
                  <p className="text-neutral-700 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}