'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!res.ok) {
        setError("Impossible de créer le compte. Vérifiez vos informations.");
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
        <h1 className="text-xl font-semibold">Créer un compte</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Inscription sécurisée avec JWT + RBAC.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span>Prénom</span>
              <input
                className="h-10 rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Nom</span>
              <input
                className="h-10 rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>

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
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>

          <a className="text-sm underline underline-offset-4" href="/login">
            J&apos;ai déjà un compte
          </a>
        </form>
      </div>
    </div>
  );
}

