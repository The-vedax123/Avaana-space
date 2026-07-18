import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import { HexField } from '../marketing/HexField.jsx';

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-secondary lg:block">
        <HexField />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/"><Logo className="[&_span]:text-white" /></Link>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md font-display text-4xl font-extrabold leading-tight"
            >
              Where discovery meets opportunity.
            </motion.h2>
            <p className="mt-4 max-w-md text-brand-100">
              Join thousands of businesses and millions of people on one intelligent, accessible platform.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Sparkles, text: 'Discover businesses, products & communities' },
                { icon: ShieldCheck, text: 'Enterprise-grade security & privacy' },
                { icon: Users, text: 'Build and grow your audience' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm text-brand-50">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-brand-200">© {new Date().getFullYear()} AvaanaSpace · Accessible Discovery</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden"><Link to="/"><Logo /></Link></div>
          <h1 className="mt-8 font-display text-2xl font-bold tracking-tight lg:mt-0">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
