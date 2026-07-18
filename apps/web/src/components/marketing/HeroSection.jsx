import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Compass,
  MapPin,
  Search,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';
import zambiaHeroBackground from '../../assets/images/zambia-hero-background.webp';
import { useAuth } from '../../context/AuthContext.jsx';

const heroStats = [
  { icon: Building2, label: 'Local businesses' },
  { icon: Store, label: 'Products & services' },
  { icon: Users, label: 'Community spaces' },
  { icon: BriefcaseBusiness, label: 'Opportunities' },
];

function HeroSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Zambia');

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location !== 'Zambia') params.set('location', location);
    navigate(`/app/search${params.size ? `?${params.toString()}` : ''}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search AvaanaSpace"
      className="mt-8 rounded-2xl border border-white/35 bg-white/95 p-2 shadow-2xl shadow-brand-900/25 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search businesses, products, services, communities or opportunities</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-500"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search businesses, products, services, communities or opportunities…"
            className="h-12 w-full rounded-xl border-0 bg-transparent pl-11 pr-3 text-sm text-ink placeholder:text-slate-500 focus:ring-2 focus:ring-accent/40"
          />
        </label>

        <div className="hidden h-8 w-px bg-slate-200 md:block" aria-hidden="true" />

        <label className="relative md:w-40">
          <span className="sr-only">Location</span>
          <MapPin
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500"
          />
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-brand-50/70 pl-9 pr-8 text-sm font-medium text-brand-700 focus:border-accent focus:ring-2 focus:ring-accent/30 md:border-0 md:bg-transparent"
          >
            <option>Zambia</option>
            <option>Lusaka</option>
            <option>Copperbelt</option>
            <option>Livingstone</option>
            <option>Ndola</option>
            <option>Kitwe</option>
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
      </div>
    </form>
  );
}

function HeroStats() {
  return (
    <ul
      aria-label="What you can discover on AvaanaSpace"
      className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/20 pt-6 sm:grid-cols-4"
    >
      {heroStats.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2 text-xs font-medium text-white/[0.78]">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-200 ring-1 ring-white/15 backdrop-blur-sm">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

export function HeroSection() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative min-h-[780px] overflow-hidden bg-secondary lg:min-h-[82vh]"
    >
      <img
        src={zambiaHeroBackground}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-[1.01] object-cover object-[88%_center] opacity-[0.56] blur-[0.5px] sm:object-[68%_center] sm:opacity-[0.62] md:scale-100 md:object-[center_45%] md:opacity-[0.66] md:blur-0 lg:opacity-[0.68]"
      />

      <div className="hero-image-overlay absolute inset-0" aria-hidden="true" />
      <div className="hero-pattern absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="hero-bottom-fade absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[780px] max-w-7xl items-center px-6 pb-32 pt-32 lg:min-h-[82vh] lg:grid-cols-12 lg:px-10 lg:pb-36 lg:pt-36 xl:px-12">
        <div className="lg:col-span-7 xl:col-span-6">
          <motion.div
            {...entrance}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-brand-100 shadow-soft backdrop-blur-md sm:text-sm"
          >
            <Sparkles className="h-4 w-4 text-brand-300" aria-hidden="true" />
            Zambia&apos;s Digital Discovery Platform
          </motion.div>

          <motion.h1
            id="hero-heading"
            {...entrance}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.06, ease: 'easeOut' }}
            className="mt-6 font-display text-[2.55rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]"
          >
            Discover <span className="text-brand-300">Zambia.</span>
            <br />
            Grow Your <span className="text-brand-300">Business.</span>
            <br />
            Build the <span className="text-brand-300">Future.</span>
          </motion.h1>

          <motion.p
            {...entrance}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}
            className="mt-6 max-w-2xl text-base leading-7 text-white/[0.82] sm:text-lg sm:leading-8"
          >
            AvaanaSpace connects people, businesses, products, communities and opportunities across
            Zambia in one trusted digital ecosystem.
          </motion.p>

          <motion.div
            {...entrance}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
          >
            <HeroSearch />
          </motion.div>

          <motion.div
            {...entrance}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
            className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Link
              to={user ? '/app/businesses' : '/register'}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            >
              Explore Businesses <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/app/search?type=opportunities"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/[0.12] px-6 py-3 text-sm font-semibold text-white shadow-soft backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Discover Opportunities <Compass className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#discover"
              className="inline-flex min-h-12 items-center justify-center px-3 py-3 text-sm font-semibold text-white/[0.85] underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              How AvaanaSpace Works
            </a>
          </motion.div>

          <motion.div
            {...entrance}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
          >
            <HeroStats />
          </motion.div>
        </div>

        <div className="hidden lg:col-span-5 lg:block xl:col-span-6" aria-hidden="true" />
      </div>

      <svg
        className="pointer-events-none absolute -bottom-px left-0 z-20 h-12 w-full text-surface dark:text-brand-900 sm:h-16 lg:h-20"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,70 C260,105 500,35 760,62 C1030,90 1215,98 1440,38 L1440,96 L0,96 Z"
        />
      </svg>
    </section>
  );
}
