import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Compass, Store, Users, Building2, ArrowRight, Sparkles, Ticket } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageHeader, StatCard, BusinessCard, ProductCard, SkeletonGrid } from '../../components/app/shared.jsx';
import { Button, Card } from '../../components/ui/index.jsx';
import { formatNumber } from '../../lib/format.js';

const quickActions = [
  { to: '/app/discovery', label: 'Explore Discovery', icon: Compass, desc: 'Trending & recommended' },
  { to: '/app/marketplace', label: 'Browse Marketplace', icon: Store, desc: 'Products & services' },
  { to: '/app/spaces', label: 'Join Spaces', icon: Users, desc: 'Communities for you' },
  { to: '/app/businesses', label: 'Register Business', icon: Building2, desc: 'Get discovered' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['discovery'],
    queryFn: async () => (await api.get('/discovery')).data.data,
  });

  const stats = [
    { label: 'Trending now', value: formatNumber(data?.trending?.length ? data.trending[0]?.followers : 0), icon: Sparkles, tone: 'accent', trend: 'live' },
    { label: 'Marketplace', value: formatNumber(data?.products?.length || 0), icon: Store, tone: 'brand' },
    { label: 'Communities', value: formatNumber(data?.communities?.length || 0), icon: Users, tone: 'violet' },
    { label: 'Businesses', value: formatNumber(data?.featured?.length || 0), icon: Building2, tone: 'emerald' },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle="Here's what's happening across your AvaanaSpace ecosystem."
        actions={
          <Link to="/app/discovery"><Button>Explore <ArrowRight className="h-4 w-4" /></Button></Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-glow">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-gradient group-hover:text-white">
                <a.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{a.label}</h3>
              <p className="text-sm text-slate-500">{a.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Trending businesses</h2>
          <Link to="/app/businesses" className="text-sm font-medium text-accent">See all</Link>
        </div>
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.trending || []).slice(0, 3).map((b, i) => (
              <BusinessCard key={b.id} business={b} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Popular products</h2>
          <Link to="/app/marketplace" className="text-sm font-medium text-accent">See all</Link>
        </div>
        {isLoading ? (
          <SkeletonGrid count={4} className="lg:grid-cols-4" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(data?.products || []).slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
