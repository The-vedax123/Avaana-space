import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Building2, Store, Flag, Clock, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { PageHeader, StatCard } from '../../components/app/shared.jsx';
import { Card, Spinner, Badge } from '../../components/ui/index.jsx';
import { formatNumber, timeAgo } from '../../lib/format.js';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data.data,
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  const queues = [
    { label: 'Pending businesses', value: data.queues.pendingBusinesses, to: '/app/admin/moderation' },
    { label: 'Pending products', value: data.queues.pendingProducts, to: '/app/admin/moderation' },
    { label: 'Open reports', value: data.queues.openReports, to: '/app/admin/reports' },
  ];

  return (
    <div>
      <PageHeader icon={ShieldCheck} title="Admin Dashboard" subtitle="Platform health, moderation queues and activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={formatNumber(data.stats.users)} icon={Users} tone="brand" index={0} />
        <StatCard label="Businesses" value={formatNumber(data.stats.businesses)} icon={Building2} tone="emerald" index={1} />
        <StatCard label="Products" value={formatNumber(data.stats.products)} icon={Store} tone="accent" index={2} />
        <StatCard label="Open enquiries" value={formatNumber(data.stats.openTickets)} icon={Flag} tone="amber" index={3} />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {queues.map((q) => (
          <Link key={q.label} to={q.to}>
            <Card className="group flex items-center justify-between transition hover:-translate-y-1 hover:shadow-glow">
              <div>
                <p className="text-sm text-slate-500">{q.label}</p>
                <p className="mt-1 font-display text-2xl font-bold">{q.value}</p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-gradient group-hover:text-white">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="section-title mb-4">Recent activity</h2>
        <Card className="p-0">
          <ul className="divide-y divide-slate-50 dark:divide-white/5">
            {data.recentAudit?.length ? (
              data.recentAudit.map((log) => (
                <li key={log.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <Clock className="h-4 w-4" />
                    </span>
                    <span className="text-sm"><Badge tone="neutral">{log.action}</Badge></span>
                  </div>
                  <span className="text-xs text-slate-400">{timeAgo(log.createdAt)}</span>
                </li>
              ))
            ) : (
              <li className="px-5 py-8 text-center text-sm text-slate-400">No recent activity.</li>
            )}
          </ul>
        </Card>
      </section>
    </div>
  );
}
