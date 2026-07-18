import { useLocation, useNavigate } from 'react-router-dom';
import { AuthSplitLayout } from '../../components/auth/AuthSplitLayout.jsx';
import { LoginForm } from '../../components/auth/LoginForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { getErrorMessage } from '../../lib/api.js';

const REMEMBERED_EMAIL_KEY = 'avaana.rememberedEmail';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';
  const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';

  const handleLogin = async (credentials, remember) => {
    try {
      await login(credentials);
      if (remember) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, credentials.email.trim().toLowerCase());
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthSplitLayout>
      <LoginForm onSubmit={handleLogin} initialEmail={rememberedEmail} />
    </AuthSplitLayout>
  );
}
