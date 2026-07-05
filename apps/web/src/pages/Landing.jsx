import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Store,
  Compass,
  Users,
  Building2,
  Bell,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Star,
  Check,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../components/ui/Logo.jsx';
import { Button } from '../components/ui/index.jsx';
import { Reveal } from '../components/marketing/Reveal.jsx';
import { HexField } from '../components/marketing/HexField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const stats = [
  { value: '12K+', label: 'Businesses' },
  { value: '48K+', label: 'Products' },
  { value: '2.1M', label: 'Discoveries' },
  { value: '99.9%', label: 'Uptime' },
];

const features = [
  { icon: Building2, title: 'Business Directory', desc: 'Verified profiles with galleries, products, services, followers and analytics.' },
  { icon: Store, title: 'Marketplace', desc: 'A curated marketplace with admin-mediated enquiries — customers never message sellers directly.' },
  { icon: Compass, title: 'Discovery Engine', desc: 'Trending, featured, recommended and nearby — surfaced intelligently.' },
  { icon: Users, title: 'Community Spaces', desc: 'Public, private and official communities with posts, comments and moderation.' },
  { icon: Search, title: 'Global Search', desc: 'Search businesses, products, spaces, people and posts with autocomplete.' },
  { icon: Bell, title: 'Notifications', desc: 'A unified activity center with categories and unread counters.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Beautiful dashboards for business, marketplace, search and community insight.' },
  { icon: ShieldCheck, title: 'Enterprise Security', desc: 'JWT + refresh tokens, RBAC, rate limiting, audit logs and secure uploads.' },
];

const testimonials = [
  { name: 'Priya Nair', role: 'Founder, BrightBrew', quote: 'AvaanaSpace gave our roastery a home, a storefront and a community — all in one place.' },
  { name: 'Diego Santos', role: 'PixelForge Studio', quote: 'The discovery engine sends us qualified leads weekly. It feels like a premium product.' },
  { name: 'Lena Kim', role: 'Community member', quote: 'Finding local businesses and joining spaces has never felt this effortless.' },
];

function Nav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3 shadow-soft">
          <Link to="/" aria-label="AvaanaSpace home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-accent">Features</a>
            <a href="#marketplace" className="hover:text-accent">Marketplace</a>
            <a href="#spaces" className="hover:text-accent">Spaces</a>
            <a href="#testimonials" className="hover:text-accent">Stories</a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/app"><Button size="sm">Open app <ArrowRight className="h-4 w-4" /></Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
                <Link to="/register"><Button size="sm">Get started</Button></Link>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
        </div>
        {open && (
          <div className="glass mt-2 flex flex-col gap-2 rounded-2xl p-4 md:hidden">
            <a href="#features" className="py-2 text-sm">Features</a>
            <a href="#marketplace" className="py-2 text-sm">Marketplace</a>
            <a href="#spaces" className="py-2 text-sm">Spaces</a>
            <Link to="/login"><Button variant="secondary" className="w-full">Sign in</Button></Link>
            <Link to="/register"><Button className="w-full">Get started</Button></Link>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <HexField />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 text-center md:pt-28">
        <Reveal>
          <span className="chip mx-auto bg-white/70 text-brand-600 shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> One intelligent platform
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Discover businesses, products & communities in{' '}
            <span className="bg-brand-gradient bg-clip-text text-transparent">one place</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            AvaanaSpace unifies a business directory, marketplace, discovery engine, community spaces and
            search into a single, beautifully accessible ecosystem.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to={user ? '/app' : '/register'}>
              <Button size="lg">Start discovering <ArrowRight className="h-5 w-5" /></Button>
            </Link>
            <Link to="/app/discovery">
              <Button size="lg" variant="secondary">Explore the demo</Button>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl px-4 py-5 shadow-soft">
                <div className="font-display text-2xl font-extrabold text-brand-600 sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24">
      <Reveal className="text-center">
        <span className="chip mx-auto bg-brand-100 text-brand-600">Everything, connected</span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">One ecosystem, many superpowers</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Each module is designed to feel native to the next — from directory to marketplace to community.
        </p>
      </Reveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.04}>
            <div className="group card h-full p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Preview({ id, eyebrow, title, desc, bullets, reverse, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-20">
      <div className={`grid items-center gap-12 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <Reveal>
          <div>
            <span className="chip bg-accent/10 text-accent">{eyebrow}</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">{title}</h2>
            <p className="mt-3 text-slate-600">{desc}</p>
            <ul className="mt-6 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1}>{children}</Reveal>
      </div>
    </section>
  );
}

function MarketplaceMock() {
  const items = [
    { name: 'Ethiopia Yirgacheffe', price: '$19.50', tag: 'Coffee' },
    { name: 'Design Sprint', price: '$4,500', tag: 'Services' },
    { name: 'Colombia Huila', price: '$17.00', tag: 'Coffee' },
    { name: 'Wellness Kit', price: '$32.00', tag: 'Wellness' },
  ];
  return (
    <div className="card p-4">
      <div className="grid grid-cols-2 gap-3">
        {items.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-slate-100 p-3 dark:border-white/10"
          >
            <div className="mb-3 h-20 rounded-xl bg-brand-gradient opacity-90" />
            <div className="chip bg-brand-100 text-brand-600">{p.tag}</div>
            <div className="mt-2 text-sm font-semibold">{p.name}</div>
            <div className="text-sm text-accent">{p.price}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DiscoveryMock() {
  const rows = ['Trending', 'Featured', 'Recommended', 'Nearby'];
  return (
    <div className="card space-y-4 p-5">
      {rows.map((r, i) => (
        <div key={r}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">{r}</span>
            <span className="text-xs text-accent">See all</span>
          </div>
          <div className="flex gap-3">
            {[0, 1, 2].map((c) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i * 3 + c) * 0.03 }}
                className="h-16 flex-1 rounded-xl bg-gradient-to-br from-brand-100 to-accent/20"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacesMock() {
  const spaces = [
    { name: 'Founders Circle', members: '3.4K', official: true },
    { name: 'Makers & Roasters', members: '918' },
    { name: 'Product Design Guild', members: '640' },
  ];
  return (
    <div className="card space-y-3 p-5">
      {spaces.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 dark:border-white/10"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Users className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              {s.name}
              {s.official && <span className="chip bg-accent/10 text-accent">Official</span>}
            </div>
            <div className="text-xs text-slate-500">{s.members} members</div>
          </div>
          <Button size="sm" variant="secondary">Join</Button>
        </motion.div>
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-24">
      <Reveal className="text-center">
        <span className="chip mx-auto bg-brand-100 text-brand-600">Loved by makers</span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">Stories from the ecosystem</h2>
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <div className="card h-full p-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-slate-700 dark:text-slate-200">“{t.quote}”</p>
              <div className="mt-5 text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-slate-500">{t.role}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-16 text-center shadow-glow">
          <HexField />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
              Ready to be discovered?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Join AvaanaSpace and put your business, products and community in front of millions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register"><Button size="lg">Create free account <ArrowRight className="h-5 w-5" /></Button></Link>
              <Link to="/app/discovery"><Button size="lg" variant="secondary" className="bg-white/10 text-white border-white/20">Browse discovery</Button></Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const cols = {
    Platform: ['Discovery', 'Marketplace', 'Spaces', 'Search'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Resources: ['Docs', 'API', 'Status', 'Security'],
  };
  return (
    <footer className="border-t border-slate-100 bg-white/60 dark:border-white/10 dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              Accessible Discovery. One intelligent platform for businesses, products, communities and people.
            </p>
          </div>
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-ink dark:text-white">{title}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                {links.map((l) => (
                  <li key={l}><a href="#features" className="hover:text-accent">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-white/10 sm:flex-row">
          <span>© {new Date().getFullYear()} AvaanaSpace. All rights reserved.</span>
          <span>Built with care for accessibility (WCAG AA).</span>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <Nav />
      <Hero />
      <Features />
      <Preview
        id="marketplace"
        eyebrow="Marketplace"
        title="A marketplace with trust built in"
        desc="Businesses upload products that require admin approval. Customers never message sellers directly — every enquiry is mediated through AvaanaSpace support."
        bullets={[
          'Admin-approved product listings',
          'Customer → Admin → Business → Admin → Customer workflow',
          'Rich product pages with ratings and stock',
        ]}
      >
        <MarketplaceMock />
      </Preview>
      <Preview
        id="discovery"
        eyebrow="Discovery"
        title="Surfacing what matters"
        desc="A discovery engine that highlights trending, featured, new, recommended and nearby — so nothing great goes unnoticed."
        bullets={['Trending & featured rails', 'Personalised recommendations', 'Nearby & new business spotlights']}
        reverse
      >
        <DiscoveryMock />
      </Preview>
      <Preview
        id="spaces"
        eyebrow="Community Spaces"
        title="Communities that belong"
        desc="Public, private and official spaces with posts, comments, likes and moderation — the social fabric of your ecosystem."
        bullets={['Public, private & official spaces', 'Posts, comments & likes', 'Built-in moderation tools']}
      >
        <SpacesMock />
      </Preview>
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
