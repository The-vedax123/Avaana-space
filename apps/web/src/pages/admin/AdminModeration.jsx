import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Flag, Check, X } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { PageHeader } from '../../components/app/shared.jsx';
import { Avatar, Badge, Button, Spinner, EmptyState } from '../../components/ui/index.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { cn } from '../../lib/cn.js';
import { formatCurrency, timeAgo } from '../../lib/format.js';

export default function AdminModeration() {
  const [tab, setTab] = useState('businesses');
  const toast = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['moderation', tab],
    queryFn: async () => (await api.get(`/admin/queues/${tab}`)).data.data,
  });

  const moderate = async (type, id, status) => {
    try {
      const path = type === 'businesses' ? `/businesses/${id}/moderate` : `/products/${id}/moderate`;
      await api.post(path, { status });
      toast.success(`Item ${status}`);
      qc.invalidateQueries({ queryKey: ['moderation'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader icon={Flag} title="Moderation" subtitle="Review and approve businesses and products." />

      <div className="mb-5 flex gap-2">
        {['businesses', 'products'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('chip capitalize', tab === t ? 'bg-brand-gradient text-white' : 'bg-slate-100 text-slate-600')}
          >
            Pending {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : data?.length ? (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={item.name} src={item.logoUrl || item.imageUrl} size={44} />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    {tab === 'businesses' ? item.category : `${item.business?.name || ''} · ${formatCurrency(item.price, item.currency)}`}
                    {' · '}{timeAgo(item.createdAt)}
                  </p>
                  <p className="mt-1 line-clamp-1 max-w-xl text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge tone="warning">Pending</Badge>
                <Button size="sm" onClick={() => moderate(tab, item.id, 'approved')}><Check className="h-4 w-4" /> Approve</Button>
                <Button size="sm" variant="danger" onClick={() => moderate(tab, item.id, 'rejected')}><X className="h-4 w-4" /> Reject</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Check} title="Queue is clear" description={`No pending ${tab} to review.`} />
      )}
    </div>
  );
}
