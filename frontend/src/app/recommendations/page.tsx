'use client';

import { useEffect, useState } from 'react';
import type { components } from '../../types/openapi';

type ProductRecommendationResponseDto =
  components['schemas']['ProductRecommendationResponseDto'];

export default function RecommendationsPage() {
  const [data, setData] = useState<ProductRecommendationResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ai/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 10 }),
        });

        if (res.status === 401) {
          setError('Connectez-vous pour obtenir des recommandations.');
          return;
        }
        if (!res.ok) {
          setError('Impossible de charger les recommandations.');
          return;
        }
        setData((await res.json()) as ProductRecommendationResponseDto);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-xl font-semibold">Recommandations</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Basées sur achats, recherches, avis et préférences.
        </p>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-sm text-foreground/70">Chargement...</div>
        ) : error ? (
          <div className="grid gap-3">
            <div className="text-sm">{error}</div>
            <div className="flex gap-2">
              <a className="btn-brand" href="/login">
                Connexion
              </a>
              <a className="btn-outline" href="/register">
                Créer un compte
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-sm text-foreground/70">
              {data?.totalRecommendations ?? 0} produits recommandés
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {(data?.products ?? []).map((p) => (
                <div key={p.productId} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      {p.description ? (
                        <div className="mt-1 text-sm text-foreground/70">
                          {p.description}
                        </div>
                      ) : null}
                    </div>
                    <div className="text-sm font-medium text-brand">
                      {Number(p.price || 0).toFixed(2)} TND
                    </div>
                  </div>
                  {p.reason ? (
                    <div className="mt-2 text-xs text-foreground/60">
                      {p.reason}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

