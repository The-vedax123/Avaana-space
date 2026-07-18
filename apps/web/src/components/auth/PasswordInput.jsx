import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

export function PasswordInput({ id = 'password', registration, error }) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#173E49] dark:text-slate-200">
        Password
      </label>
      <div className="relative">
        <LockKeyhole
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          {...registration}
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-[52px] w-full rounded-xl border bg-white pl-11 pr-12 text-[15px] text-[#082F3C] outline-none transition-all placeholder:text-slate-400 focus:ring-4 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 ${
            error
              ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-500/15'
              : 'border-slate-200 focus:border-accent focus:ring-accent/10 dark:border-white/10 dark:focus:border-accent'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {visible ? (
            <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
