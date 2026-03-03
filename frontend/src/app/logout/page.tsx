'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
      router.push('/');
      router.refresh();
    })();
  }, [router]);

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-xl font-semibold">Déconnexion</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Déconnexion en cours...
        </p>
      </div>
    </div>
  );
}

