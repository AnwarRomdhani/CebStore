'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Email ou mot de passe incorrect.');
        return;
      }

      router.push('/');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-xl font-semibold">Connexion</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Connectez-vous pour accéder à vos commandes et au dashboard admin.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span>Email</span>
            <input
              className="h-10 rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Mot de passe</span>
            <input
              className="h-10 rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}

          <button className="btn-brand" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <a className="text-sm underline underline-offset-4" href="/register">
            Créer un compte
          </a>
        </form>
      </div>
    </div>
  );
}

