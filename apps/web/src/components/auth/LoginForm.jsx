import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, LoaderCircle, Mail } from 'lucide-react';
import { PasswordInput } from './PasswordInput.jsx';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginForm({ onSubmit, initialEmail = '' }) {
  const [remember, setRemember] = useState(Boolean(initialEmail));
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: initialEmail, password: '' },
  });

  const submit = (values) => onSubmit(values, remember);
  const emailErrorId = 'login-email-error';

  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>

      <header className="mt-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Account access</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.035em] text-[#082F3C] dark:text-white sm:text-[2.15rem]">
          Welcome back
        </h1>
        <p className="mt-2.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Enter your details to continue to your account.
        </p>
      </header>

      <form onSubmit={handleSubmit(submit)} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-[#173E49] dark:text-slate-200">
            Email address
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? emailErrorId : undefined}
              {...register('email')}
              className={`h-[52px] w-full rounded-xl border bg-white pl-11 pr-4 text-[15px] text-[#082F3C] outline-none transition-all placeholder:text-slate-400 focus:ring-4 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 ${
                errors.email
                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-500/15'
                  : 'border-slate-200 focus:border-accent focus:ring-accent/10 dark:border-white/10 dark:focus:border-accent'
              }`}
            />
          </div>
          {errors.email && (
            <p id={emailErrorId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <PasswordInput
          id="login-password"
          registration={register('password')}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-accent/40 dark:border-white/20 dark:bg-white/10"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="rounded-md text-sm font-semibold text-brand-600 transition-colors hover:text-accent dark:text-brand-300"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(11,92,115,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
        New to AvaanaSpace?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-accent dark:text-brand-300">
          Create an account
        </Link>
      </p>
    </>
  );
}
