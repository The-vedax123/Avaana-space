import { useQuery } from '@tanstack/react-query';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, Users, Store, Building2, TrendingUp } from 'lucide-react';
import { api } from '../../lib/api.js';
import { PageHeader, StatCard } from '../../components/app/shared.jsx';
import { Card, Spinner, EmptyState } from '../../components/ui/index.jsx';
import { useAuth, isStaff } from '../../context/AuthContext.jsx';
import { formatCurrency, formatNumber } from '../../lib/format.js';

const COLORS = ['#0B5C73', '#1FA6B8', '#72c5d5', '#063F52', '#a9dde6'];

function ChartCard({ title, children }) {
  return (
    <Card>
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </Card>
  );
}

function PlatformAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-platform'],
    queryFn: async () => (await api.get('/analytics/platform')).data.data,
  });
  const { data: search } = useQuery({
    queryKey: ['analytics-search'],
    queryFn: async () => (await api.get('/analytics/search')).data.data,
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;
  if (!data) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={formatNumber(data.totals.users)} icon={Users} tone="brand" index={0} />
        <StatCard label="Businesses" value={formatNumber(data.totals.businesses)} icon={Building2} tone="emerald" index={1} />
        <StatCard label="Products" value={formatNumber(data.totals.products)} icon={Store} tone="accent" index={2} />
        <StatCard label="Open enquiries" value={formatNumber(data.totals.openTickets)} icon={TrendingUp} tone="amber" index={3} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="User growth (14 days)">
          <AreaChart data={data.growth.users}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1FA6B8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1FA6B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis allowDecimals={false} width={28} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#0B5C73" strokeWidth={2} fill="url(#g1)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Businesses by category">
          <PieChart>
            <Pie data={data.categories} dataKey="value" nameKey="label" innerRadius={50} outerRadius={90} paddingAngle={3}>
              {data.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Revenue by product">
          <BarChart data={data.revenueByProduct}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" hide />
            <YAxis width={40} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#1FA6B8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Search volume (14 days)">
          <AreaChart data={search?.volume || []}>
            <defs>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B5C73" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0B5C73" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis allowDecimals={false} width={28} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#0B5C73" strokeWidth={2} fill="url(#g2)" />
          </AreaChart>
        </ChartCard>
      </div>
    </>
  );
}

function BusinessAnalytics() {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['my-businesses'],
    queryFn: async () => (await api.get('/businesses/mine')).data.data,
  });
  const first = businesses?.[0];
  const { data } = useQuery({
    queryKey: ['analytics-business', first?.id],
    queryFn: async () => (await api.get(`/analytics/business/${first.id}`)).data.data,
    enabled: !!first?.id,
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;
  if (!first) {
    return <EmptyState icon={Building2} title="No business yet" description="Register a business to unlock analytics." />;
  }
  if (!data) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Followers" value={formatNumber(data.followers)} icon={Users} tone="brand" index={0} />
        <StatCard label="Total sales" value={formatNumber(data.totalSales)} icon={Store} tone="accent" index={1} />
        <StatCard label="Revenue" value={formatCurrency(data.revenue)} icon={TrendingUp} tone="emerald" index={2} />
        <StatCard label="Enquiries" value={formatNumber(data.enquiries)} icon={BarChart3} tone="amber" index={3} />
      </div>
      <div className="mt-6">
        <ChartCard title={`Sales by product · ${data.business.name}`}>
          <BarChart data={data.salesByProduct}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis allowDecimals={false} width={32} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#0B5C73" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </>
  );
}

export default function Analytics() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader icon={BarChart3} title="Analytics" subtitle={isStaff(user?.role) ? 'Platform-wide insight.' : 'Insight for your business.'} />
      {isStaff(user?.role) ? <PlatformAnalytics /> : <BusinessAnalytics />}
    </div>
  );
}
