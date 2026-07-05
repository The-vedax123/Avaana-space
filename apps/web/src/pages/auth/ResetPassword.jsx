import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../components/layout/AuthLayout.jsx';
import { Button, Field, Input } from '../../components/ui/index.jsx';
import { api, getErrorMessage } from '../../lib/api.js';
import { useToast } from '../../components/ui/Toast.jsx';

const schema = z.object({
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[a-z]/, 'Add a lowercase letter')
    .regex(/[A-Z]/, 'Add an uppercase letter')
    .regex(/[0-9]/, 'Add a number'),
});

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { password: '' } });

  const onSubmit = async (values) => {
    try {
      await api.post('/auth/reset-password', { token, password: values.password });
      toast.success('Password updated — please sign in');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Set a strong password to secure your account."
      footer={<Link to="/login" className="font-semibold text-accent">Back to sign in</Link>}
    >
      {!token ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-600">
          This reset link is invalid or missing a token. Please request a new one.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="New password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="new-password" placeholder="New password" {...register('password')} />
          </Field>
          <Button type="submit" className="w-full" loading={isSubmitting}>Update password</Button>
        </form>
      )}
    </AuthLayout>
  );
}
