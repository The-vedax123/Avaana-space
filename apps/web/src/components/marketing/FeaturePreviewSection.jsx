import { Link } from 'react-router-dom';
import { ArrowUpRight, BriefcaseBusiness, Building2, Compass, Store, Users } from 'lucide-react';
import { Reveal } from './Reveal.jsx';

const featurePreviews = [
  {
    id: 'businesses',
    icon: Building2,
    title: 'Businesses',
    description: 'Find trusted Zambian businesses, professionals and services in every sector.',
    href: '/app/businesses',
  },
  {
    id: 'marketplace',
    icon: Store,
    title: 'Marketplace',
    description: 'Explore locally offered products and services through a safer, curated marketplace.',
    href: '/app/marketplace',
  },
  {
    id: 'spaces',
    icon: Users,
    title: 'Spaces',
    description: 'Join communities built around industries, places, interests and shared ambitions.',
    href: '/app/spaces',
  },
  {
    id: 'opportunities',
    icon: BriefcaseBusiness,
    title: 'Opportunities',
    description: 'Discover partnerships, jobs, programmes and pathways to grow across Zambia.',
    href: '/app/search?type=opportunities',
  },
  {
    id: 'discover',
    icon: Compass,
    title: 'Discover',
    description: 'See what is new, relevant and worth knowing in Zambia’s digital ecosystem.',
    href: '/app/discovery',
  },
];

export function FeaturePreviewSection() {
  return (
    <section
      aria-labelledby="feature-preview-heading"
      className="relative z-20 bg-surface px-6 py-20 dark:bg-brand-900 sm:py-24 lg:px-10 xl:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <span className="chip bg-brand-100 text-brand-600">Made for Zambia</span>
          <h2
            id="feature-preview-heading"
            className="mt-4 font-display text-3xl font-bold tracking-tight text-ink dark:text-white sm:text-4xl"
          >
            Everything Zambia Needs to Discover, Connect and Grow
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            One connected platform for finding trusted businesses, local value and communities that
            move ideas forward.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featurePreviews.map(({ id, icon: Icon, title, description, href }, index) => (
            <Reveal key={id} delay={index * 0.04}>
              <article id={id} className="group card h-full scroll-mt-24 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
                <Link
                  to={href}
                  aria-label={`Explore ${title}`}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-600 transition-colors hover:text-accent dark:text-brand-300"
                >
                  Explore
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
