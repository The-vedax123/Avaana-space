import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Plus } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { PageHeader, SpaceCard, SkeletonGrid } from '../../components/app/shared.jsx';
import { Button, EmptyState, Field, Input, Textarea, Select } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export default function Spaces() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', visibility: 'public' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => (await api.get('/spaces', { params: { limit: 24 } })).data.data,
  });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/spaces', form);
      toast.success('Space created');
      setOpen(false);
      setForm({ name: '', description: '', visibility: 'public' });
      qc.invalidateQueries({ queryKey: ['spaces'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Spaces"
        subtitle="Public, private and official communities."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create space</Button>}
      />

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : data?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s, i) => <SpaceCard key={s.id} space={s} index={i} />)}
        </div>
      ) : (
        <EmptyState icon={Users} title="No spaces yet" description="Create the first community." action={<Button onClick={() => setOpen(true)}>Create space</Button>} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create a space" description="Bring people together around a shared interest.">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name"><Input value={form.name} onChange={update('name')} required minLength={2} placeholder="e.g. Founders Circle" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={update('description')} required minLength={10} placeholder="What is this space about?" /></Field>
          <Field label="Visibility">
            <Select value={form.visibility} onChange={update('visibility')}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Select>
          </Field>
          <Button type="submit" className="w-full" loading={submitting}>Create space</Button>
        </form>
      </Modal>
    </div>
  );
}
