import { backendFetch } from '../../../services/api/server';
import { WorkflowActions } from '../../../components/WorkflowActions';

export default async function AdminWorkflowsPage() {
  const health = await backendFetch('/workflows/health', {
    method: 'GET',
    auth: false,
  }).catch(() => null);

  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Workflows (n8n)</h2>
        <p className="mt-1 text-sm text-foreground/70">
          Santé du service et déclenchement d’automatisations.
        </p>
      </div>

      <div className="card">
        <div className="text-sm font-medium">Health</div>
        <pre className="mt-2 overflow-auto rounded-lg border border-border bg-muted p-3 text-xs">
          {JSON.stringify(health, null, 2)}
        </pre>
      </div>

      <WorkflowActions />
    </div>
  );
}

