import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Store, Search } from 'lucide-react';
import { api } from '../../lib/api.js';
import { PageHeader, ProductCard, SkeletonGrid } from '../../components/app/shared.jsx';
import { EmptyState, Input, Select } from '../../components/ui/index.jsx';

const categories = ['All', 'Coffee', 'Services', 'Wellness', 'Design & Creative'];

export default function Marketplace() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('createdAt');

  const { data, isLoading } = useQuery({
    queryKey: ['products', q, category, sort],
    queryFn: async () => {
      const params = { q, sort, limit: 24 };
      if (category !== 'All') params.category = category;
      return (await api.get('/products', { params })).data.data;
    },
  });

  return (
    <div>
      <PageHeader
        icon={Store}
        title="Marketplace"
        subtitle="Discover products and services from approved businesses."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9" />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-52">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-44">
          <option value="createdAt">Newest</option>
          <option value="sales">Best selling</option>
          <option value="rating">Top rated</option>
          <option value="price">Price</option>
        </Select>
      </div>

      {isLoading ? (
        <SkeletonGrid count={8} className="lg:grid-cols-4" />
      ) : data?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      ) : (
        <EmptyState icon={Store} title="No products found" description="Try adjusting your filters or search." />
      )}
    </div>
  );
}
