import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout.jsx';
import { Button, Field, Input } from '../../components/ui/index.jsx';
import { api, getErrorMessage } from '../../lib/api.js';
import { useToast } from '../../components/ui/Toast.jsx';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPassword() {
  const toast = useToast();
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/forgot-password', values);
      setDevToken(data.data?.devToken || '');
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a secure link to reset your password."
      footer={<>Remembered it? <Link to="/login" className="font-semibold text-accent">Back to sign in</Link></>}
    >
      {sent ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <MailCheck className="mx-auto h-10 w-10 text-emerald-500" />
          <h3 className="mt-3 font-semibold">Check your inbox</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            If an account exists, a reset link is on its way.
          </p>
          {devToken && (
            <Link
              to={`/reset-password?token=${devToken}`}
              className="mt-4 inline-block text-sm font-semibold text-accent"
            >
              Continue with reset (demo link)
            </Link>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
          </Field>
          <Button type="submit" className="w-full" loading={isSubmitting}>Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
