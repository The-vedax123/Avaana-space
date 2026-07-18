import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import { initials } from '../../lib/format.js';

export function Button({ variant = 'primary', size = 'md', className, loading, children, ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn bg-rose-500 text-white hover:bg-rose-600 shadow-soft',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2.5',
  };
  return (
    <button className={cn(variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ tone = 'brand', className, children }) {
  const tones = {
    brand: 'bg-brand-100 text-brand-600',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    neutral: 'bg-slate-100 text-slate-600',
  };
  return <span className={cn('chip', tones[tone], className)}>{children}</span>;
}

export const statusTone = (status) =>
  ({ approved: 'success', pending: 'warning', rejected: 'danger', suspended: 'danger', open: 'accent', resolved: 'success', closed: 'neutral' }[
    status
  ] || 'neutral');

export function Avatar({ name = '', src, size = 40, className }) {
  return src ? (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size }}
      className={cn('rounded-full object-cover', className)}
    />
  ) : (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-gradient font-semibold text-white',
        className,
      )}
    >
      {initials(name) || '?'}
    </span>
  );
}

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn('input', className)} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn('input min-h-[120px] resize-y', className)} {...props} />;
});

export const Select = forwardRef(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn('input appearance-none', className)} {...props}>
      {children}
    </select>
  );
});

export function Field({ label, error, hint, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}

export function Spinner({ className }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-accent', className)} />;
}

export function Skeleton({ className }) {
  return <div className={cn('shimmer rounded-xl bg-slate-100 dark:bg-white/5', className)} />;
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.02]">
      {Icon && (
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-500 dark:bg-white/5">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h3 className="font-display text-lg font-semibold text-ink dark:text-white">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
