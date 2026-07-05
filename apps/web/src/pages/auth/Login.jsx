import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../components/layout/AuthLayout.jsx';
import { Button, Field, Input } from '../../components/ui/index.jsx';
import { GoogleButton } from '../../components/ui/GoogleButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { getErrorMessage } from '../../lib/api.js';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login, googleLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [googleLoading, setGoogleLoading] = useState(false);
  const from = location.state?.from?.pathname || '/app';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onGoogle = async (payload) => {
    setGoogleLoading(true);
    try {
      await googleLogin(payload);
      toast.success('Signed in with Google');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemo = (email) => {
    setValue('email', email);
    setValue('password', 'Password123!');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to AvaanaSpace."
      footer={<>New here? <Link to="/register" className="font-semibold text-accent">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')} />
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-accent">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" loading={isSubmitting}>Sign in</Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleButton onAuth={onGoogle} loading={googleLoading} />

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white/60 p-4 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.02]">
        <p className="mb-2 font-medium text-slate-600 dark:text-slate-300">Demo accounts (password: Password123!)</p>
        <div className="flex flex-wrap gap-2">
          {[
            ['Super Admin', 'super@avaanaspace.com'],
            ['Admin', 'admin@avaanaspace.com'],
            ['Owner', 'priya@brightbrew.com'],
            ['User', 'lena@example.com'],
          ].map(([label, email]) => (
            <button key={email} type="button" onClick={() => fillDemo(email)} className="chip bg-brand-100 text-brand-600 hover:bg-brand-200">
              {label}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
