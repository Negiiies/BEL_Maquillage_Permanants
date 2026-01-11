import Link from 'next/link'

export default function MentionsLegales() {
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
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Mentions légales</h1>

        <div className="space-y-8">
          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Éditeur du site</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-900">
              <p><strong className="text-gray-900">Raison sociale :</strong> Bel maquillage permanent</p>
              <p><strong className="text-gray-900">Forme juridique :</strong> Entreprise individuelle</p>
              <p><strong className="text-gray-900">SIRET :</strong> 842 921 470 00014</p>
              <p><strong className="text-gray-900">Adresse :</strong> 59 route de la ferme du pavillon, 77600 Chanteloup-en-Brie</p>
              <p><strong className="text-gray-900">Téléphone :</strong> 06 37 46 60 04</p>
              <p><strong className="text-gray-900">Email :</strong> bel.pmakeup@gmail.com</p>
              <p><strong className="text-gray-900">Responsable de la publication :</strong> Mong Dung Le</p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Hébergement</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-900">
              <p><strong className="text-gray-900">Hébergeur :</strong> OVH</p>
              <p><strong className="text-gray-900">Raison sociale :</strong> OVH SAS</p>
              <p><strong className="text-gray-900">Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
              <p><strong className="text-gray-900">Téléphone :</strong> 1007</p>
              <p><strong className="text-gray-900">Site web :</strong>{' '}
                <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.ovh.com
                </a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Propriété intellectuelle</h2>
            <p className="text-gray-800 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive 
              de Bel maquillage permanent ou de ses partenaires. Toute reproduction, même partielle, est strictement 
              interdite sans autorisation préalable écrite.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Données personnelles</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Les informations recueillies sur ce site font l'objet d'un traitement informatique destiné à la 
              gestion des rendez-vous et à la relation client.
            </p>
            <p className="text-gray-800 leading-relaxed mb-4">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et 
              Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos 
              données personnelles.
            </p>
            <p className="text-gray-800 leading-relaxed">
              Pour exercer ces droits, contactez-nous à : <strong className="text-gray-900">bel.pmakeup@gmail.com</strong>
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Pour plus d'informations, consultez notre{' '}
              <Link href="/politique-confidentialite" className="text-blue-600 hover:underline font-medium">
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Cookies</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Ce site utilise des cookies techniques nécessaires au bon fonctionnement du service de réservation 
              en ligne (authentification, session).
            </p>
            <p className="text-gray-800 leading-relaxed">
              Aucun cookie publicitaire ou de tracking n'est utilisé.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Limitation de responsabilité</h2>
            <p className="text-gray-800 leading-relaxed">
              Bel maquillage permanent s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
              sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des 
              informations mises à disposition.
            </p>
          </section>

          {/* Loi applicable */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Droit applicable</h2>
            <p className="text-gray-800 leading-relaxed">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de 
              règlement amiable, le tribunal compétent sera celui du ressort du siège social de l'entreprise.
            </p>
          </section>

          {/* Date de mise à jour */}
          <section className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600">
              Dernière mise à jour : Décembre 2024
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