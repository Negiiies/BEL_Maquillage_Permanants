import Link from 'next/link'

export default function PolitiqueConfidentialite() {
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
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Politique de confidentialité</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-900 text-sm leading-relaxed">
            Chez Bel maquillage permanent, nous prenons la protection de vos données personnelles très au sérieux. 
            Cette politique de confidentialité vous explique comment nous collectons, utilisons et protégeons vos 
            informations conformément au Règlement Général sur la Protection des Données (RGPD).
          </p>
        </div>

        <div className="space-y-8">
          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Responsable du traitement des données</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-900">
              <p><strong className="text-gray-900">Responsable :</strong> Mong Dung Le</p>
              <p><strong className="text-gray-900">Entreprise :</strong> Bel maquillage permanent</p>
              <p><strong className="text-gray-900">Adresse :</strong> 59 route de la ferme du pavillon, 77600 Chanteloup-en-Brie</p>
              <p><strong className="text-gray-900">Email :</strong> bel.pmakeup@gmail.com</p>
              <p><strong className="text-gray-900">Téléphone :</strong> 06 37 46 60 04</p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Données personnelles collectées</h2>
            <p className="text-gray-800 mb-4">Nous collectons les données suivantes lors de votre inscription :</p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Données obligatoires :</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-800 mb-6">
                <li>Prénom et nom</li>
                <li>Adresse email (identifiant de connexion)</li>
                <li>Mot de passe (hashé et sécurisé)</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mb-3">Données facultatives :</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                <li>Numéro de téléphone</li>
                <li>Date de naissance</li>
              </ul>
            </div>

            <p className="text-gray-800 mt-4">
              Lors de vos réservations, nous collectons également les informations relatives aux prestations 
              demandées et aux dates de rendez-vous.
            </p>
          </section>

          {/* Finalités */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Finalités du traitement</h2>
            <p className="text-gray-800 mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-6 rounded-lg">
              <li>Créer et gérer votre compte client</li>
              <li>Traiter vos demandes de réservation</li>
              <li>Vous envoyer des confirmations de rendez-vous par email</li>
              <li>Assurer le service après-vente et répondre à vos questions</li>
              <li>Améliorer nos services</li>
              <li>Respecter nos obligations légales (comptabilité, etc.)</li>
            </ul>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Base légale du traitement</h2>
            <p className="text-gray-800 leading-relaxed">
              Le traitement de vos données repose sur les bases légales suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-6 rounded-lg mt-4">
              <li><strong className="text-gray-900">Exécution d'un contrat :</strong> Gestion de votre compte et de vos réservations</li>
              <li><strong className="text-gray-900">Intérêt légitime :</strong> Amélioration de nos services</li>
              <li><strong className="text-gray-900">Obligation légale :</strong> Conservation des données comptables</li>
            </ul>
          </section>

          {/* Destinataires */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Destinataires des données</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Vos données personnelles sont strictement confidentielles et ne sont accessibles qu'à :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-6 rounded-lg">
              <li>Le personnel autorisé de Bel maquillage permanent</li>
              <li>Notre hébergeur technique (OVH) dans le cadre de la maintenance du site</li>
            </ul>
            <p className="text-gray-800 leading-relaxed mt-4">
              <strong className="text-gray-900">Nous ne vendons, ne louons et ne transmettons jamais vos données à des tiers à des fins 
              commerciales.</strong>
            </p>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Durée de conservation</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <p className="font-semibold text-gray-900">Compte actif :</p>
                <p className="text-gray-800">
                  Vos données sont conservées tant que votre compte est actif.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Après suppression du compte :</p>
                <p className="text-gray-800">
                  Vos données personnelles sont immédiatement anonymisées. Seul l'historique des rendez-vous 
                  (anonymisé) est conservé pour nos archives.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Obligations légales :</p>
                <p className="text-gray-800">
                  Certaines données (factures, comptabilité) peuvent être conservées jusqu'à 10 ans conformément 
                  aux obligations légales.
                </p>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Sécurité des données</h2>
            <p className="text-gray-800 mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos 
              données contre tout accès non autorisé, perte ou altération :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-6 rounded-lg">
              <li>Chiffrement des mots de passe (algorithme Argon2)</li>
              <li>Connexion sécurisée HTTPS (SSL/TLS)</li>
              <li>Accès restreint aux données (authentification requise)</li>
              <li>Sauvegardes régulières</li>
              <li>Hébergement sécurisé chez OVH (France)</li>
              <li>Surveillance et logs de sécurité</li>
            </ul>
          </section>

          {/* Droits RGPD */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Vos droits (RGPD)</h2>
            <p className="text-gray-800 mb-4">
              Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900">✓ Droit d'accès</p>
                <p className="text-blue-800 text-sm">
                  Vous pouvez consulter les données que nous détenons sur vous.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900">✓ Droit de rectification</p>
                <p className="text-blue-800 text-sm">
                  Vous pouvez modifier vos informations personnelles depuis votre espace client.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900">✓ Droit à l'effacement ("droit à l'oubli")</p>
                <p className="text-blue-800 text-sm">
                  Vous pouvez supprimer votre compte à tout moment depuis votre espace client.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900">✓ Droit à la portabilité</p>
                <p className="text-blue-800 text-sm">
                  Vous pouvez télécharger vos données dans un format structuré.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900">✓ Droit d'opposition</p>
                <p className="text-blue-800 text-sm">
                  Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900">✓ Droit de limitation</p>
                <p className="text-blue-800 text-sm">
                  Vous pouvez demander la limitation du traitement de vos données.
                </p>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-lg mt-6">
              <p className="font-semibold mb-2">Comment exercer vos droits ?</p>
              <p className="text-gray-300 text-sm mb-4">
                Pour exercer l'un de ces droits, vous pouvez :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Gérer directement vos informations depuis votre espace client</li>
                <li>Nous contacter par email à : <strong className="text-white">bel.pmakeup@gmail.com</strong></li>
                <li>Nous écrire à : 59 route de la ferme du pavillon, 77600 Chanteloup-en-Brie</li>
              </ul>
              <p className="text-gray-300 text-sm mt-4">
                Nous nous engageons à répondre à votre demande dans un délai maximum d'un mois.
              </p>
            </div>
          </section>

          {/* Réclamation CNIL */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Réclamation auprès de la CNIL</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire une 
              réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
            </p>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-900">
              <p><strong className="text-gray-900">CNIL</strong></p>
              <p>3 Place de Fontenoy</p>
              <p>TSA 80715</p>
              <p>75334 Paris Cedex 07</p>
              <p>Site web :{' '}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Cookies</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Notre site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement 
              du service :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-800 bg-gray-50 p-6 rounded-lg">
              <li>Cookie de session (authentification)</li>
              <li>Token d'authentification (stocké localement dans votre navigateur)</li>
            </ul>
            <p className="text-gray-800 leading-relaxed mt-4">
              <strong className="text-gray-900">Nous n'utilisons aucun cookie publicitaire, de tracking ou d'analyse de comportement.</strong>
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Modifications de la politique</h2>
            <p className="text-gray-800 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              La version en vigueur est celle publiée sur cette page. En cas de modification importante, 
              nous vous en informerons par email.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Contact</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Pour toute question concernant cette politique de confidentialité ou le traitement de vos 
              données personnelles, contactez-nous :
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