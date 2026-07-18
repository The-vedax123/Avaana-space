import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, Star, TrendingUp, Users } from 'lucide-react';
import { Badge, Avatar } from '../ui/index.jsx';
import { cn } from '../../lib/cn.js';
import { formatCurrency, formatNumber } from '../../lib/format.js';

export function PageHeader({ title, subtitle, actions, icon: Icon }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, tone = 'brand', index = 0 }) {
  const tones = {
    brand: 'from-brand-500 to-accent',
    accent: 'from-accent to-brand-400',
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-orange-400',
    violet: 'from-violet-500 to-fuchsia-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon && (
          <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white', tones[tone])}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">{value}</div>
      {trend && (
        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
          <TrendingUp className="h-3.5 w-3.5" /> {trend}
        </div>
      )}
    </motion.div>
  );
}

export function BusinessCard({ business, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/app/businesses/${business.slug}`} className="group block card overflow-hidden p-0">
        <div className="relative h-24 bg-brand-gradient">
          {business.coverUrl && <img src={business.coverUrl} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="px-5 pb-5">
          <div className="-mt-8 mb-3 flex items-end justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-soft dark:border-brand-800">
              <Avatar name={business.name} src={business.logoUrl} size={56} />
            </div>
            {business.verified && <Badge tone="accent"><BadgeCheck className="h-3.5 w-3.5" /> Verified</Badge>}
          </div>
          <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold group-hover:text-accent">
            {business.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{business.tagline || business.description}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
            <span className="chip bg-brand-100 text-brand-600">{business.category}</span>
            {business.location && (
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {business.location}</span>
            )}
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {formatNumber(business.followers)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/app/marketplace/${product.slug}`} className="group block card overflow-hidden p-0">
        <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-brand-100 to-accent/20">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-4xl font-black text-brand-500/30">{product.name[0]}</span>
          )}
          <span className="absolute right-3 top-3 chip bg-white/90 text-brand-600 shadow-soft">{product.category}</span>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 font-semibold group-hover:text-accent">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-brand-600">
              {formatCurrency(product.price, product.currency)}
            </span>
            {product.rating > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" /> {product.rating}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SpaceCard({ space, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/app/spaces/${space.slug}`} className="group block card p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
            <Users className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold group-hover:text-accent">{space.name}</h3>
              {space.official && <Badge tone="accent">Official</Badge>}
            </div>
            <p className="text-xs capitalize text-slate-400">{space.visibility} · {formatNumber(space.members)} members</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">{space.description}</p>
      </Link>
    </motion.div>
  );
}

export function SkeletonGrid({ count = 6, className }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card p-0">
          <div className="shimmer h-32 rounded-t-2xl bg-slate-100 dark:bg-white/5" />
          <div className="space-y-3 p-5">
            <div className="shimmer h-4 w-2/3 rounded bg-slate-100 dark:bg-white/5" />
            <div className="shimmer h-3 w-full rounded bg-slate-100 dark:bg-white/5" />
            <div className="shimmer h-3 w-1/2 rounded bg-slate-100 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
