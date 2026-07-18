import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, Package, ShieldCheck, MessageSquareText, Building2 } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { Button, Badge, Field, Input, Textarea, Spinner, Avatar } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { formatCurrency, formatNumber } from '../../lib/format.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => (await api.get(`/products/${slug}`)).data.data,
  });

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tickets', {
        businessId: product.businessId,
        productId: product.id,
        subject: subject || `Enquiry about ${product.name}`,
        message,
      });
      toast.success('Enquiry sent to AvaanaSpace support');
      setOpen(false);
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!product) return <p className="py-20 text-center text-slate-500">Product not found.</p>;

  return (
    <div>
      <Link to="/app/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex h-80 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 to-accent/20">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-8xl font-black text-brand-500/30">{product.name[0]}</span>
          )}
        </div>

        <div>
          <Badge tone="brand">{product.category}</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-3 flex items-center gap-4">
            <span className="font-display text-3xl font-extrabold text-brand-600">
              {formatCurrency(product.price, product.currency)}
            </span>
            {product.rating > 0 && (
              <span className="inline-flex items-center gap-1 text-sm text-amber-500">
                <Star className="h-4 w-4 fill-current" /> {product.rating}
              </span>
            )}
          </div>
          <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Package className="h-4 w-4" /> {formatNumber(product.stock)} in stock</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Admin-approved listing</span>
          </div>

          {product.business && (
            <Link to={`/app/businesses/${product.business.slug}`} className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-accent/40 dark:border-white/10">
              <Avatar name={product.business.name} src={product.business.logoUrl} size={44} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{product.business.name}</p>
                <p className="text-xs text-slate-400">{product.business.category}</p>
              </div>
              <Building2 className="h-4 w-4 text-slate-400" />
            </Link>
          )}

          <div className="mt-8 rounded-2xl bg-brand-100/60 p-4 dark:bg-white/5">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              To keep everyone safe, customers never message sellers directly. Your enquiry is handled by
              AvaanaSpace support and routed to the business.
            </p>
            <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
              <MessageSquareText className="h-4 w-4" /> Send an enquiry
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Send an enquiry"
        description="AvaanaSpace support will relay your message to the business."
      >
        <form onSubmit={submitEnquiry} className="space-y-4">
          <Field label="Subject">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={`Enquiry about ${product.name}`} />
          </Field>
          <Field label="Message">
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required minLength={5} placeholder="What would you like to ask?" />
          </Field>
          <Button type="submit" className="w-full" loading={submitting}>Submit enquiry</Button>
        </form>
      </Modal>
    </div>
  );
}
