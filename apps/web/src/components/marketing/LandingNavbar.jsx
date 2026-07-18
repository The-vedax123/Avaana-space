import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import { Button } from '../ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Discover', href: '#discover' },
  { label: 'Businesses', href: '#businesses' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Spaces', href: '#spaces' },
  { label: 'Opportunities', href: '#opportunities' },
  { label: 'About', href: '#about' },
];

export function LandingNavbar() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);
  const lightSurface = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/90 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-brand-900/90'
          : 'bg-gradient-to-b from-brand-900/75 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10 xl:px-12">
        <Link
          to="/"
          aria-label="AvaanaSpace home"
          className={`rounded-lg ${lightSurface ? '' : '[&>span>span]:!text-white'}`}
        >
          <Logo />
        </Link>

        <nav
          aria-label="Main navigation"
          className={`hidden items-center gap-5 text-[13px] font-medium lg:flex xl:gap-7 ${
            lightSurface ? 'text-slate-600 dark:text-slate-200' : 'text-white/85'
          }`}
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-md py-2 transition-colors hover:text-accent focus-visible:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              lightSurface
                ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/app">
                <Button size="sm">
                  Open app <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    lightSurface
                      ? 'text-brand-700 hover:bg-brand-50 dark:text-white dark:hover:bg-white/10'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Log in
                </Link>
                <Link to="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl lg:hidden ${
              lightSurface ? 'text-slate-700 dark:text-white' : 'text-white'
            }`}
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-brand-900/95 lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-6 py-5">
              <div className="grid grid-cols-2 gap-1">
                {navigation.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="secondary" className="w-full">Log in</Button>
                </Link>
                <Link to={user ? '/app' : '/register'} onClick={closeMenu}>
                  <Button className="w-full">{user ? 'Open app' : 'Get started'}</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
