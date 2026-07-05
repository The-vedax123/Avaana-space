import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Store,
  Building2,
  Users,
  Bell,
  Ticket,
  BarChart3,
  Settings,
  Search,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCog,
  Flag,
  ScrollText,
  ChevronDown,
} from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import { Avatar } from '../ui/index.jsx';
import { useAuth, isStaff } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { api } from '../../lib/api.js';
import { cn } from '../../lib/cn.js';

const mainNav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/discovery', label: 'Discovery', icon: Compass },
  { to: '/app/marketplace', label: 'Marketplace', icon: Store },
  { to: '/app/businesses', label: 'Businesses', icon: Building2 },
  { to: '/app/spaces', label: 'Spaces', icon: Users },
  { to: '/app/tickets', label: 'Enquiries', icon: Ticket },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
];

const adminNav = [
  { to: '/app/admin', label: 'Admin', icon: ShieldCheck, end: true },
  { to: '/app/admin/users', label: 'Users', icon: UserCog },
  { to: '/app/admin/moderation', label: 'Moderation', icon: Flag },
  { to: '/app/admin/reports', label: 'Reports', icon: Flag },
  { to: '/app/admin/audit', label: 'Audit logs', icon: ScrollText },
];

function NavItem({ item, onClick }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          isActive
            ? 'bg-brand-gradient text-white shadow-soft'
            : 'text-slate-600 hover:bg-brand-100/60 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-white/5',
        )
      }
    >
      <item.icon className="h-[18px] w-[18px]" />
      {item.label}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }) {
  const { user } = useAuth();
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/app" onClick={onNavigate} className="px-2 pt-2">
        <Logo />
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <NavItem key={item.to} item={item} onClick={onNavigate} />
        ))}
        {isStaff(user?.role) && (
          <>
            <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Administration
            </p>
            {adminNav.map((item) => (
              <NavItem key={item.to} item={item} onClick={onNavigate} />
            ))}
          </>
        )}
      </nav>
      <NavItem item={{ to: '/app/settings', label: 'Settings', icon: Settings }} onClick={onNavigate} />
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const roleLabel = user?.role?.replace('_', ' ');
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100 dark:hover:bg-white/5"
      >
        <Avatar name={user?.name} src={user?.avatarUrl} size={34} />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight">{user?.name}</span>
          <span className="block text-xs capitalize text-slate-400">{roleLabel}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-card dark:border-white/10 dark:bg-brand-800"
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={() => { setOpen(false); navigate('/app/settings'); }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Settings className="h-4 w-4" /> Settings
              </button>
              <button
                onClick={async () => { await logout(); navigate('/login'); }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Topbar({ onMenu }) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const { data: unread } = useQuery({
    queryKey: ['notif-unread'],
    queryFn: async () => (await api.get('/notifications/unread-count')).data.data.unread,
    refetchInterval: 30000,
  });

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/app/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-100 bg-surface/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-brand-900/80">
      <button onClick={onMenu} className="btn-ghost p-2 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <form onSubmit={submit} className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search businesses, products, spaces, people…"
          className="input pl-9"
          aria-label="Global search"
        />
      </form>
      <div className="flex flex-1 items-center justify-end gap-1.5">
        <button onClick={toggle} className="btn-ghost p-2.5" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          onClick={() => navigate('/app/notifications')}
          className="btn-ghost relative p-2.5"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
        <UserMenu />
      </div>
    </header>
  );
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-surface dark:bg-brand-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-100 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-brand-900/70 lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-100 bg-white dark:border-white/10 dark:bg-brand-900 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 btn-ghost p-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
