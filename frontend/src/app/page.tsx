export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Plateforme E-commerce intelligente
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              Catalogue, commandes, paiements, IA (chatbot + recommandations) et
              workflows.
            </p>
          </div>
          <div className="flex gap-2">
            <a className="btn-brand" href="/register">
              Démarrer
            </a>
            <a className="btn-outline" href="/admin">
              Dashboard admin
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="font-medium">Catalogue</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Recherche & filtres multicritères, gestion catégories, stock en
            temps réel.
          </p>
        </div>
        <div className="card">
          <h2 className="font-medium">Paiement</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Intégration passerelles, webhooks, statuts, traçabilité complète.
          </p>
        </div>
        <div className="card">
          <h2 className="font-medium">IA & Workflows</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Chatbot intelligent, recommandations, analyses et automatisation.
          </p>
        </div>
      </section>
    </div>
  );
}
