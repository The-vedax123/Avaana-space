import { useQuery } from '@tanstack/react-query';
import { ScrollText } from 'lucide-react';
import { api } from '../../lib/api.js';
import { PageHeader } from '../../components/app/shared.jsx';
import { Badge, Spinner } from '../../components/ui/index.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { timeAgo } from '../../lib/format.js';

export default function AdminAudit() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit'],
    queryFn: async () => (await api.get('/admin/audit-logs', { params: { limit: 100 } })).data.data,
  });

  const columns = [
    { key: 'action', header: 'Action', render: (l) => <Badge tone="brand">{l.action}</Badge> },
    { key: 'actorId', header: 'Actor', render: (l) => <span className="font-mono text-xs text-slate-500">{l.actorId || 'system'}</span> },
    { key: 'target', header: 'Target', render: (l) => <span className="font-mono text-xs text-slate-500">{l.target || '—'}</span> },
    { key: 'createdAt', header: 'When', render: (l) => <span className="text-xs text-slate-400">{timeAgo(l.createdAt)}</span> },
  ];

  return (
    <div>
      <PageHeader icon={ScrollText} title="Audit Logs" subtitle="A tamper-evident record of platform actions." />
      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : <Table columns={columns} data={data || []} empty="No audit entries yet." />}
    </div>
  );
}
