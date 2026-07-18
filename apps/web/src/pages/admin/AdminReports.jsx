import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Flag, Check, X } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { PageHeader } from '../../components/app/shared.jsx';
import { Badge, Button, Spinner, statusTone } from '../../components/ui/index.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { timeAgo } from '../../lib/format.js';

export default function AdminReports() {
  const toast = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => (await api.get('/admin/reports')).data.data,
  });

  const resolve = async (id, status) => {
    try {
      await api.patch(`/admin/reports/${id}`, { status });
      toast.success(`Report ${status}`);
      qc.invalidateQueries({ queryKey: ['admin-reports'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns = [
    { key: 'targetType', header: 'Type', render: (r) => <Badge tone="neutral">{r.targetType}</Badge> },
    { key: 'reason', header: 'Reason', render: (r) => <span className="line-clamp-2 max-w-md">{r.reason}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
    { key: 'createdAt', header: 'Reported', render: (r) => <span className="text-xs text-slate-400">{timeAgo(r.createdAt)}</span> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) =>
        r.status === 'open' ? (
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => resolve(r.id, 'resolved')}><Check className="h-4 w-4" /> Resolve</Button>
            <Button size="sm" variant="ghost" onClick={() => resolve(r.id, 'dismissed')}><X className="h-4 w-4" /> Dismiss</Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader icon={Flag} title="Reports" subtitle="User-submitted reports awaiting review." />
      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : <Table columns={columns} data={data || []} empty="No reports submitted." />}
    </div>
  );
}
