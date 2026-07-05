import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Store, Building2, ShieldAlert, Info } from 'lucide-react';
import { api } from '../../lib/api.js';
import { PageHeader } from '../../components/app/shared.jsx';
import { Button, EmptyState, Spinner } from '../../components/ui/index.jsx';
import { cn } from '../../lib/cn.js';
import { timeAgo } from '../../lib/format.js';

const categoryMeta = {
  marketplace: { icon: Store, tone: 'text-accent bg-accent/10' },
  business: { icon: Building2, tone: 'text-emerald-500 bg-emerald-100' },
  moderation: { icon: ShieldAlert, tone: 'text-amber-500 bg-amber-100' },
  system: { icon: Info, tone: 'text-brand-500 bg-brand-100' },
};

const filters = ['all', 'marketplace', 'business', 'moderation', 'system'];

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data.data,
  });

  const items = (data?.items || []).filter((n) => filter === 'all' || n.category === filter);

  const markAll = async () => {
    await api.post('/notifications/read-all');
    qc.invalidateQueries({ queryKey: ['notifications'] });
    qc.invalidateQueries({ queryKey: ['notif-unread'] });
  };
  const markOne = async (id) => {
    await api.post(`/notifications/${id}/read`);
    qc.invalidateQueries({ queryKey: ['notifications'] });
    qc.invalidateQueries({ queryKey: ['notif-unread'] });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        icon={Bell}
        title="Activity Center"
        subtitle={data?.unread ? `${data.unread} unread notifications` : 'You are all caught up.'}
        actions={<Button variant="secondary" onClick={markAll}><CheckCheck className="h-4 w-4" /> Mark all read</Button>}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn('chip capitalize transition', filter === f ? 'bg-brand-gradient text-white' : 'bg-slate-100 text-slate-600 hover:bg-brand-100')}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : items.length ? (
        <div className="space-y-3">
          {items.map((n) => {
            const meta = categoryMeta[n.category] || categoryMeta.system;
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => !n.read && markOne(n.id)}
                className={cn(
                  'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition',
                  n.read ? 'border-slate-100 bg-white dark:border-white/10 dark:bg-white/[0.02]' : 'border-accent/30 bg-accent/5',
                )}
              >
                <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', meta.tone)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-slate-500">{n.body}</p>
                  <p className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Bell} title="No notifications" description="Your activity will appear here." />
      )}
    </div>
  );
}
