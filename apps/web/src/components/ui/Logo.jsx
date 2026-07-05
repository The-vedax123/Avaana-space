import { cn } from '../../lib/cn.js';

export function LogoMark({ className, size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="avaana-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1FA6B8" />
          <stop offset="1" stopColor="#0B5C73" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#avaana-mark)" />
      <path d="M32 14 L47 40 H37.5 L32 29 L26.5 40 H17 Z" fill="#fff" />
      <circle cx="32" cy="46" r="3.2" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, showText = true, size = 36 }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {showText && (
        <span className="font-display text-lg font-extrabold tracking-tight text-ink dark:text-white">
          Avaana<span className="text-accent">Space</span>
        </span>
      )}
    </span>
  );
}
