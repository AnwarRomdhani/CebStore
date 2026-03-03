'use client';

import { useState } from 'react';

export function WorkflowActions() {
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function run(path: string, label: string) {
    setLoading(label);
    setResult(null);
    try {
      const res = await fetch(path, { method: 'POST' });
      const data = await res.json().catch(() => null);
      setResult({ status: res.status, data });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="card grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          className="btn-brand"
          disabled={!!loading}
          onClick={() => run('/api/admin/workflows/check-stock', 'Stock')}
        >
          {loading === 'Stock' ? '...' : 'Vérifier stock'}
        </button>
        <button
          className="btn-outline"
          disabled={!!loading}
          onClick={() => run('/api/admin/workflows/check-abandoned', 'Abandoned')}
        >
          {loading === 'Abandoned' ? '...' : 'Paniers abandonnés'}
        </button>
      </div>

      {result ? (
        <pre className="overflow-auto rounded-lg border border-border bg-muted p-3 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : (
        <div className="text-sm text-foreground/70">
          Lance un workflow n8n via l’API backend.
        </div>
      )}
    </div>
  );
}

