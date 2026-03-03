import { redirect } from 'next/navigation';
import { requireRole } from '../../lib/auth';
import { ApiError } from '../../services/api/errors';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole('ADMIN');
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      redirect('/forbidden');
    }
    redirect('/login');
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Admin</h1>
            <p className="text-sm text-foreground/70">
              Gestion catalogue, commandes, paiements, workflows et analytics.
            </p>
          </div>
          <a className="btn-outline" href="/logout">
            Déconnexion
          </a>
        </div>
      </div>
      {children}
    </div>
  );
}

