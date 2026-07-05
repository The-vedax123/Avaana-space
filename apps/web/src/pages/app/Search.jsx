import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Clock, X } from 'lucide-react';
import { api } from '../../lib/api.js';
import { PageHeader, BusinessCard, ProductCard, SpaceCard } from '../../components/app/shared.jsx';
import { Avatar, EmptyState, Input, Spinner } from '../../components/ui/index.jsx';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') || '';
  const [term, setTerm] = useState(initial);
  const [debounced, setDebounced] = useState(initial);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term), 300);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    setParams(debounced ? { q: debounced } : {}, { replace: true });
  }, [debounced, setParams]);

  const { data: recent } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => (await api.get('/discovery/search/recent')).data.data,
  });

  const { data: suggestions } = useQuery({
    queryKey: ['autocomplete', term],
    queryFn: async () => (await api.get('/discovery/search/autocomplete', { params: { q: term } })).data.data,
    enabled: term.length > 1,
  });

  const { data, isFetching } = useQuery({
    queryKey: ['search', debounced],
    queryFn: async () => (await api.get('/discovery/search', { params: { q: debounced } })).data.data,
    enabled: debounced.length > 0,
  });

  const hasResults =
    data && (data.businesses?.length || data.products?.length || data.spaces?.length || data.people?.length || data.posts?.length);

  return (
    <div>
      <PageHeader icon={SearchIcon} title="Search" subtitle="Find businesses, products, spaces, people and posts." />

      <div className="relative mb-6 max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search everything…"
          className="py-3 pl-12 text-base"
          autoFocus
        />
        {term && (
          <button onClick={() => setTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        )}
        {suggestions?.length > 0 && term.length > 1 && term !== debounced && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-card dark:border-white/10 dark:bg-brand-800">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setTerm(s)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white/5">
                <SearchIcon className="h-4 w-4 text-slate-400" /> {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {!debounced && recent?.length > 0 && (
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-medium text-slate-500">Recent searches</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button key={r} onClick={() => setTerm(r)} className="chip bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-600">
                <Clock className="h-3.5 w-3.5" /> {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {debounced && isFetching && <div className="flex justify-center py-16"><Spinner /></div>}

      {debounced && !isFetching && !hasResults && (
        <EmptyState icon={SearchIcon} title={`No results for “${debounced}”`} description="Try a different keyword." />
      )}

      {debounced && !isFetching && hasResults && (
        <div className="space-y-10">
          {data.businesses?.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Businesses</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.businesses.map((b, i) => <BusinessCard key={b.id} business={b} index={i} />)}</div>
            </section>
          )}
          {data.products?.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Products</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{data.products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
            </section>
          )}
          {data.spaces?.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Spaces</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.spaces.map((s, i) => <SpaceCard key={s.id} space={s} index={i} />)}</div>
            </section>
          )}
          {data.people?.length > 0 && (
            <section>
              <h2 className="section-title mb-4">People</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.people.map((u) => (
                  <div key={u.id} className="card flex items-center gap-3 p-4">
                    <Avatar name={u.name} src={u.avatarUrl} size={44} />
                    <div>
                      <p className="text-sm font-semibold">{u.name}</p>
                      <p className="text-xs capitalize text-slate-400">{u.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.posts?.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Posts</h2>
              <div className="space-y-3">
                {data.posts.map((p) => (
                  <div key={p.id} className="card p-4">
                    <p className="font-semibold">{p.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
