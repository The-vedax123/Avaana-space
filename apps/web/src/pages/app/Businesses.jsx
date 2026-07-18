import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Search, Plus } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { PageHeader, BusinessCard, SkeletonGrid } from '../../components/app/shared.jsx';
import { Button, EmptyState, Field, Input, Textarea, Select } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const categories = ['Food & Beverage', 'Design & Creative', 'Health & Wellness', 'Technology', 'Retail', 'Professional Services'];

export default function Businesses() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: categories[0], tagline: '', description: '', location: '', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', q],
    queryFn: async () => (await api.get('/businesses', { params: { q, limit: 24 } })).data.data,
  });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.website) delete payload.website;
      await api.post('/businesses', payload);
      toast.success('Business submitted for approval');
      setOpen(false);
      setForm({ name: '', category: categories[0], tagline: '', description: '', location: '', website: '' });
      qc.invalidateQueries({ queryKey: ['businesses'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Building2}
        title="Businesses"
        subtitle="Explore verified businesses or register your own."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Register business</Button>}
      />

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search businesses…" className="pl-9" />
      </div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : data?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((b, i) => <BusinessCard key={b.id} business={b} index={i} />)}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No businesses yet"
          description="Be the first to register a business and get discovered."
          action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Register business</Button>}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Register a business" description="Submitted businesses are reviewed by an admin before going live.">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Business name"><Input value={form.name} onChange={update('name')} required minLength={2} placeholder="e.g. BrightBrew Coffee" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onChange={update('category')}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Location"><Input value={form.location} onChange={update('location')} placeholder="City, Country" /></Field>
          </div>
          <Field label="Tagline"><Input value={form.tagline} onChange={update('tagline')} placeholder="A short catchy line" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={update('description')} required minLength={10} placeholder="Tell people what you do…" /></Field>
          <Field label="Website (optional)"><Input value={form.website} onChange={update('website')} type="url" placeholder="https://" /></Field>
          <Button type="submit" className="w-full" loading={submitting}>Submit for approval</Button>
        </form>
      </Modal>
    </div>
  );
}
