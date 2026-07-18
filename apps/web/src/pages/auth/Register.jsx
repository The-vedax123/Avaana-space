import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[a-z]/, 'Add a lowercase letter')
    .regex(/[A-Z]/, 'Add an uppercase letter')
    .regex(/[0-9]/, 'Add a number'),
});

export default function Register() {
  const { register: signup, googleLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '' } });

  const onSubmit = async (values) => {
    try {
      await signup(values);
      toast.success('Account created — welcome to AvaanaSpace!');
      navigate('/app', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onGoogle = async (payload) => {
    setGoogleLoading(true);
    try {
      await googleLogin(payload);
      toast.success('Signed up with Google');
      navigate('/app', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start discovering in minutes. It's free."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-accent">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Jane Doe" {...register('name')} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message} hint="Use 8+ chars with upper, lower and a number.">
          <Input id="password" type="password" autoComplete="new-password" placeholder="Create a password" {...register('password')} />
        </Field>
        <Button type="submit" className="w-full" loading={isSubmitting}>Create account</Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleButton onAuth={onGoogle} loading={googleLoading} />
    </AuthLayout>
  );
}
