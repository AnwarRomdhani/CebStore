export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-xl font-semibold">Accès refusé</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Vous n’avez pas les droits nécessaires pour accéder à cette page.
        </p>
        <div className="mt-4 flex gap-2">
          <a className="btn-brand" href="/">
            Retour à l’accueil
          </a>
          <a className="btn-outline" href="/login">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}

