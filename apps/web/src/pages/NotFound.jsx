import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { LogoMark } from '../components/ui/Logo.jsx';
import { Button } from '../components/ui/index.jsx';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center dark:bg-brand-900">
      <LogoMark size={56} />
      <h1 className="mt-8 font-display text-6xl font-extrabold text-brand-600">404</h1>
      <p className="mt-3 text-lg font-semibold">This page drifted off the map</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-8"><Button><Home className="h-4 w-4" /> Back home</Button></Link>
    </div>
  );
}
