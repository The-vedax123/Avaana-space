import { useQuery } from '@tanstack/react-query';
import { Compass } from 'lucide-react';
import { api } from '../../lib/api.js';
import { PageHeader, BusinessCard, ProductCard, SpaceCard, SkeletonGrid } from '../../components/app/shared.jsx';
import { EmptyState } from '../../components/ui/index.jsx';

function Row({ title, subtitle, items, render }) {
  if (!items?.length) return null;
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-4">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(render)}</div>
    </section>
  );
}

export default function Discovery() {
  const { data, isLoading } = useQuery({
    queryKey: ['discovery'],
    queryFn: async () => (await api.get('/discovery')).data.data,
  });

  return (
    <div>
      <PageHeader
        icon={Compass}
        title="Discovery"
        subtitle="Trending, featured, recommended and nearby — surfaced for you."
      />
      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : !data ? (
        <EmptyState icon={Compass} title="Nothing to discover yet" description="Check back soon." />
      ) : (
        <>
          <Row title="Trending" subtitle="Rising fast this week" items={data.trending} render={(b, i) => <BusinessCard key={b.id} business={b} index={i} />} />
          <Row title="Featured" subtitle="Verified & handpicked" items={data.featured} render={(b, i) => <BusinessCard key={b.id} business={b} index={i} />} />
          <Row title="Recommended for you" items={data.recommended} render={(b, i) => <BusinessCard key={b.id} business={b} index={i} />} />
          <Row title="New businesses" subtitle="Fresh on AvaanaSpace" items={data.newBusinesses} render={(b, i) => <BusinessCard key={b.id} business={b} index={i} />} />
          <section className="mt-10">
            <h2 className="section-title mb-4">Popular products</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.popular?.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
          <Row title="Communities" subtitle="Find your people" items={data.communities} render={(s, i) => <SpaceCard key={s.id} space={s} index={i} />} />
          <Row title="Nearby" subtitle="Around you" items={data.nearby} render={(b, i) => <BusinessCard key={b.id} business={b} index={i} />} />
        </>
      )}
    </div>
  );
}
