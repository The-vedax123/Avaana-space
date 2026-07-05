import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { PageHeader } from '../../components/app/shared.jsx';
import { Avatar, Button, Card, Field, Input, Textarea, Badge } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export default function Settings() {
  const { user, setUser } = useAuth();
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatarUrl: user?.avatarUrl || '' });
  const [saving, setSaving] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.avatarUrl) delete payload.avatarUrl;
      const { data } = await api.patch('/users/me', payload);
      setUser(data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Manage your profile and preferences." />

      <Card className="mb-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={form.name} src={form.avatarUrl} size={64} />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <Badge tone="brand" className="mt-1 capitalize">{user?.role?.replace('_', ' ')}</Badge>
          </div>
        </div>
        <form onSubmit={save} className="space-y-4">
          <Field label="Full name"><Input value={form.name} onChange={update('name')} /></Field>
          <Field label="Bio"><Textarea value={form.bio} onChange={update('bio')} placeholder="Tell people about yourself" /></Field>
          <Field label="Avatar URL"><Input value={form.avatarUrl} onChange={update('avatarUrl')} type="url" placeholder="https://" /></Field>
          <Button type="submit" loading={saving}>Save changes</Button>
        </form>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Appearance</p>
          <p className="text-sm text-slate-400">Switch between light and dark theme.</p>
        </div>
        <Button variant="secondary" onClick={toggle}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'Light' : 'Dark'} mode
        </Button>
      </Card>
    </div>
  );
}
