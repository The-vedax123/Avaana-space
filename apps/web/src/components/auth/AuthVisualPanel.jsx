import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, ShieldCheck, Store } from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import zambiaBackground from '../../assets/images/zambia-hero-background.webp';

const trustItems = [
  { icon: Store, label: 'Verified business profiles' },
  { icon: ShieldCheck, label: 'Secure account access' },
  { icon: CheckCircle2, label: 'Local discovery' },
];

export function AuthVisualPanel() {
  return (
    <section
      aria-label="AvaanaSpace — accessible discovery"
      className="relative h-[220px] overflow-hidden bg-secondary md:h-auto md:min-h-[100svh]"
    >
      <img
        src={zambiaBackground}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[82%_center] md:object-[68%_center] lg:object-[center_45%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,38,50,0.95)_0%,rgba(6,63,82,0.80)_45%,rgba(11,92,115,0.48)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,25,34,0.78)_0%,transparent_58%)]"
      />
      <div aria-hidden="true" className="hero-pattern absolute inset-0 opacity-20" />
      <div
        aria-hidden="true"
        className="absolute left-[42%] top-[34%] h-48 w-48 rounded-full bg-accent/15 blur-3xl md:h-80 md:w-80"
      />

      <div className="relative z-10 flex h-full flex-col px-6 pb-8 pt-6 text-white sm:px-8 md:px-9 md:pb-10 md:pt-8 lg:px-12 lg:pb-12 lg:pt-10 xl:px-16 xl:pb-14">
        <div className="flex items-start justify-between gap-4">
          <Link
            to="/"
            aria-label="AvaanaSpace home"
            className="rounded-lg [&>span>span]:!text-white"
          >
            <Logo size={34} />
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md md:mt-1">
            <MapPin className="h-3.5 w-3.5 text-brand-200" aria-hidden="true" />
            Lusaka
          </span>
        </div>

        <div className="mt-auto md:max-w-md lg:max-w-xl">
          <div className="hidden md:block">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-100 backdrop-blur-sm">
              Accessible Discovery
            </span>
            <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.035em] text-white lg:text-5xl xl:text-[3.4rem]">
              Your next connection could change everything.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 lg:text-base lg:leading-7">
              Discover businesses, services, products, communities and opportunities through one
              connected platform.
            </p>

            <div
              aria-hidden="true"
              className="absolute bottom-14 left-8 hidden h-32 w-px bg-gradient-to-b from-transparent via-brand-300/70 to-transparent lg:block xl:left-10"
            >
              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200 shadow-[0_0_18px_rgba(114,197,213,0.9)]" />
            </div>

            <ul className="mt-8 hidden grid-cols-3 gap-3 border-t border-white/15 pt-6 lg:grid">
              {trustItems.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-xs leading-5 text-white/80">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                    <Icon className="h-4 w-4 text-brand-200" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <h1 className="max-w-xs font-display text-3xl font-bold leading-tight tracking-tight text-white md:hidden">
            Discover. Connect. Grow.
          </h1>
        </div>
      </div>
    </section>
  );
}
