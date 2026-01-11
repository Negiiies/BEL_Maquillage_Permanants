import Link from 'next/link'

export default function ConditionsGenerales() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header simple */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/" className="text-2xl font-bold text-gray-900">BEL</Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Conditions Générales d'Utilisation
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-900 text-sm leading-relaxed">
            En créant un compte ou en utilisant notre service de réservation en ligne, vous acceptez les présentes 
            Conditions Générales d'Utilisation. Nous vous invitons à les lire attentivement.
          </p>
        </div>

        <div className="space-y-8">
          {/* Objet */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Objet</h2>
            <p className="text-gray-800 leading-relaxed">
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les 
              modalités et conditions d'utilisation du service de réservation en ligne proposé par Bel maquillage 
              permanent (ci-après « le Service »), ainsi que les droits et obligations des utilisateurs 
              (ci-après « l'Utilisateur » ou « le Client »).
            </p>
          </section>

          {/* Mentions légales */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Mentions légales</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-900">
              <p><strong className="text-gray-900">Éditeur du service :</strong></p>
              <p>Bel maquillage permanent</p>
              <p>Entreprise individuelle</p>
              <p>SIRET : 842 921 470 00014</p>
              <p>59 route de la ferme du pavillon, 77600 Chanteloup-en-Brie</p>
              <p>Email : bel.pmakeup@gmail.com</p>
              <p>Téléphone : 06 37 46 60 04</p>
              <p>Responsable : Mong Dung Le</p>
            </div>
          </section>

          {/* Acceptation des CGU */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Acceptation des CGU</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              L'utilisation du Service implique l'acceptation pleine et entière des présentes CGU.
            </p>
            <p className="text-gray-800 leading-relaxed">
              En cochant la case « J'accepte les Conditions Générales d'Utilisation » lors de votre inscription, 
              vous reconnaissez avoir pris connaissance de l'intégralité des présentes CGU et les accepter sans 
              réserve.
            </p>
          </section>

          {/* Accès au service */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Accès au service</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.1. Conditions d'accès</h3>
                <p className="text-gray-800 leading-relaxed">
                  Le Service est accessible gratuitement à toute personne disposant d'un accès à Internet. 
                  L'ensemble des frais supportés par l'Utilisateur pour accéder au Service (matériel informatique, 
                  connexion Internet, etc.) sont à sa charge.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.2. Création de compte</h3>
                <p className="text-gray-800 leading-relaxed mb-3">
                  Pour utiliser le Service de réservation, l'Utilisateur doit créer un compte en fournissant :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-4 rounded-lg">
                  <li>Prénom et nom</li>
                  <li>Adresse email valide</li>
                  <li>Mot de passe sécurisé (minimum 8 caractères)</li>
                  <li>Numéro de téléphone (facultatif)</li>
                  <li>Date de naissance (facultatif)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.3. Responsabilité de l'utilisateur</h3>
                <p className="text-gray-800 leading-relaxed">
                  L'Utilisateur s'engage à fournir des informations exactes et à les maintenir à jour. Il est 
                  responsable de la confidentialité de ses identifiants de connexion et de toute utilisation 
                  de son compte.
                </p>
              </div>
            </div>
          </section>

          {/* Utilisation du service */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Utilisation du service</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">5.1. Réservations</h3>
                <p className="text-gray-800 leading-relaxed mb-3">
                  Le Service permet aux Utilisateurs de :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-4 rounded-lg">
                  <li>Consulter les prestations disponibles</li>
                  <li>Réserver des créneaux horaires</li>
                  <li>Gérer leurs rendez-vous</li>
                  <li>Annuler ou modifier leurs réservations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">5.2. Confirmation de réservation</h3>
                <p className="text-gray-800 leading-relaxed">
                  Toute réservation effectuée via le Service fait l'objet d'une demande soumise à validation. 
                  Un email de confirmation vous sera envoyé une fois la réservation validée par l'institut.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">5.3. Annulation et modification</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-900 font-semibold mb-2">Politique d'annulation :</p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-900 text-sm">
                    <li>Annulation gratuite jusqu'à 24h avant le rendez-vous</li>
                    <li>Toute annulation tardive (moins de 24h) ou absence non justifiée pourra entraîner 
                    une facturation ou un refus de réservation ultérieure</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Obligations de l'utilisateur */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Obligations de l'utilisateur</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              L'Utilisateur s'engage à :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-6 rounded-lg">
              <li>Utiliser le Service conformément à sa destination et de manière loyale</li>
              <li>Ne pas tenter d'accéder de manière frauduleuse au Service</li>
              <li>Ne pas créer de faux comptes ou usurper l'identité d'un tiers</li>
              <li>Respecter les horaires de rendez-vous réservés</li>
              <li>Prévenir en cas d'empêchement dans les délais requis</li>
              <li>Ne pas utiliser le Service à des fins commerciales sans autorisation</li>
              <li>Ne pas perturber le bon fonctionnement du Service</li>
            </ul>
          </section>

          {/* Responsabilités */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Responsabilité et garanties</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">7.1. Disponibilité du service</h3>
                <p className="text-gray-800 leading-relaxed">
                  Bel maquillage permanent s'efforce d'assurer la disponibilité du Service 24h/24 et 7j/7. 
                  Toutefois, nous ne pouvons garantir une disponibilité absolue en raison de la nature d'Internet 
                  et des interventions de maintenance nécessaires.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">7.2. Limitation de responsabilité</h3>
                <p className="text-gray-800 leading-relaxed">
                  Bel maquillage permanent ne saurait être tenu responsable :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-4 rounded-lg mt-3">
                  <li>Des interruptions temporaires du Service pour maintenance</li>
                  <li>Des dysfonctionnements liés à l'équipement de l'Utilisateur</li>
                  <li>De l'utilisation frauduleuse du compte par un tiers</li>
                  <li>Des dommages indirects résultant de l'utilisation du Service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Protection des données personnelles</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Le traitement de vos données personnelles est effectué conformément au Règlement Général sur la 
              Protection des Données (RGPD) et à notre Politique de confidentialité.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-blue-900 text-sm">
                Pour plus d'informations sur le traitement de vos données, consultez notre{' '}
                <Link href="/politique-confidentialite" className="underline font-semibold">
                  Politique de confidentialité
                </Link>.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Propriété intellectuelle</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              L'ensemble des éléments composant le Service (textes, images, vidéos, logos, structure, etc.) est 
              la propriété exclusive de Bel maquillage permanent ou de ses partenaires.
            </p>
            <p className="text-gray-800 leading-relaxed">
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans 
              autorisation préalable et écrite est strictement interdite et constitue une contrefaçon sanctionnée 
              par le Code de la propriété intellectuelle.
            </p>
          </section>

          {/* Suspension et résiliation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Suspension et résiliation</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">10.1. Suppression par l'utilisateur</h3>
                <p className="text-gray-800 leading-relaxed">
                  L'Utilisateur peut supprimer son compte à tout moment depuis son espace personnel. 
                  Ses données personnelles seront alors anonymisées conformément à notre politique de confidentialité.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">10.2. Suspension par Bel maquillage permanent</h3>
                <p className="text-gray-800 leading-relaxed">
                  Nous nous réservons le droit de suspendre ou fermer le compte d'un Utilisateur en cas de :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-4 rounded-lg mt-3">
                  <li>Non-respect des présentes CGU</li>
                  <li>Comportement abusif ou frauduleux</li>
                  <li>Absences répétées sans prévenir</li>
                  <li>Utilisation détournée du Service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Modifications des CGU */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Modification des CGU</h2>
            <p className="text-gray-800 leading-relaxed">
              Bel maquillage permanent se réserve le droit de modifier les présentes CGU à tout moment. 
              Les modifications entrent en vigueur dès leur publication sur le site. En cas de modification 
              substantielle, les Utilisateurs seront informés par email. L'utilisation continue du Service après 
              la publication des modifications vaut acceptation des nouvelles CGU.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Droit applicable et litiges</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">12.1. Droit applicable</h3>
                <p className="text-gray-800 leading-relaxed">
                  Les présentes CGU sont soumises au droit français.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">12.2. Règlement des litiges</h3>
                <p className="text-gray-800 leading-relaxed mb-3">
                  En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute 
                  action judiciaire.
                </p>
                <p className="text-gray-800 leading-relaxed">
                  À défaut d'accord amiable, le litige sera porté devant les tribunaux compétents du ressort 
                  du siège social de l'entreprise.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">12.3. Médiation de la consommation</h3>
                <p className="text-gray-800 leading-relaxed">
                  Conformément à l'article L.612-1 du Code de la consommation, l'Utilisateur a le droit de 
                  recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du 
                  litige qui l'oppose au professionnel.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Contact</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Pour toute question relative aux présentes CGU ou à l'utilisation du Service, vous pouvez 
              nous contacter :
            </p>
            <div className="bg-gray-900 text-white p-6 rounded-lg space-y-2">
              <p><strong>Email :</strong> bel.pmakeup@gmail.com</p>
              <p><strong>Téléphone :</strong> 06 37 46 60 04</p>
              <p><strong>Courrier :</strong> 59 route de la ferme du pavillon, 77600 Chanteloup-en-Brie</p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <section className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Dernière mise à jour :</strong> Décembre 2024
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Entrée en vigueur :</strong> Décembre 2024
            </p>
          </section>
        </div>

        {/* Bouton retour */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          <p>© 2024 Bel maquillage permanent - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}