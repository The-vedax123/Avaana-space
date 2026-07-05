import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BadgeCheck, MapPin, Globe, Users, Star, UserPlus } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { Avatar, Badge, Button, Spinner } from '../../components/ui/index.jsx';
import { ProductCard } from '../../components/app/shared.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { formatNumber } from '../../lib/format.js';

export default function BusinessDetail() {
  const { slug } = useParams();
  const toast = useToast();
  const qc = useQueryClient();

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', slug],
    queryFn: async () => (await api.get(`/businesses/${slug}`)).data.data,
  });

  const follow = async () => {
    try {
      const { data } = await api.post(`/businesses/${business.id}/follow`);
      toast.success(data.data.following ? 'Following' : 'Unfollowed');
      qc.invalidateQueries({ queryKey: ['business', slug] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!business) return <p className="py-20 text-center text-slate-500">Business not found.</p>;

  return (
    <div>
      <Link to="/app/businesses" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to businesses
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-white/10 dark:bg-white/[0.03]">
        <div className="relative h-44 bg-brand-gradient">
          {business.coverUrl && <img src={business.coverUrl} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-white shadow-soft dark:border-brand-800">
                <Avatar name={business.name} src={business.logoUrl} size={88} />
              </div>
              <div className="pb-1">
                <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
                  {business.name}
                  {business.verified && <BadgeCheck className="h-6 w-6 text-accent" />}
                </h1>
                <p className="text-sm text-slate-500">{business.tagline}</p>
              </div>
            </div>
            <Button onClick={follow}><UserPlus className="h-4 w-4" /> Follow</Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <Badge tone="brand">{business.category}</Badge>
            {business.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {business.location}</span>}
            {business.website && (
              <a href={business.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {formatNumber(business.followers)} followers</span>
            {business.rating > 0 && <span className="inline-flex items-center gap-1.5 text-amber-500"><Star className="h-4 w-4 fill-current" /> {business.rating}</span>}
          </div>

          <p className="mt-6 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">{business.description}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="section-title mb-4">Products & services</h2>
        {business.products?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {business.products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400 dark:border-white/10">
            No products listed yet.
          </p>
        )}
      </section>
    </div>
  );
}
