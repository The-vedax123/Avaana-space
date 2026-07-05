import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ticket, Send, ArrowRight } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { PageHeader } from '../../components/app/shared.jsx';
import { Badge, Button, EmptyState, Spinner, Textarea, statusTone } from '../../components/ui/index.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { useAuth, isStaff } from '../../context/AuthContext.jsx';
import { cn } from '../../lib/cn.js';
import { timeAgo } from '../../lib/format.js';

const audienceLabel = { admin: 'To support', business: 'To business', customer: 'To customer' };

export default function Tickets() {
  const { user } = useAuth();
  const staff = isStaff(user?.role);
  const toast = useToast();
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => (await api.get('/tickets', { params: { limit: 50 } })).data.data,
  });

  const { data: active } = useQuery({
    queryKey: ['ticket', activeId],
    queryFn: async () => (await api.get(`/tickets/${activeId}`)).data.data,
    enabled: !!activeId,
  });

  const act = async (action, body) => {
    setSending(true);
    try {
      await api.post(`/tickets/${activeId}/${action}`, body);
      toast.success('Sent');
      setReply('');
      qc.invalidateQueries({ queryKey: ['ticket', activeId] });
      qc.invalidateQueries({ queryKey: ['tickets'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const ownsBusiness = active && user && active.business?.ownerId === user.id;

  return (
    <div>
      <PageHeader
        icon={Ticket}
        title="Marketplace Enquiries"
        subtitle="Customer → Admin → Business → Admin → Customer. Every enquiry is mediated by support."
      />

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : tickets?.length ? (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left transition',
                  activeId === t.id ? 'border-accent bg-accent/5' : 'border-slate-100 bg-white hover:border-accent/40 dark:border-white/10 dark:bg-white/[0.02]',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">{t.reference}</span>
                  <Badge tone={statusTone(t.status)}>{t.status.replace(/_/g, ' ')}</Badge>
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-semibold">{t.subject}</p>
                <p className="text-xs text-slate-400">{t.business?.name} · {timeAgo(t.createdAt)}</p>
              </button>
            ))}
          </div>

          <div className="card p-0">
            {!active ? (
              <div className="flex h-full min-h-[300px] items-center justify-center p-10 text-center text-sm text-slate-400">
                Select an enquiry to view the conversation.
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-white/10">
                  <div>
                    <p className="font-semibold">{active.subject}</p>
                    <p className="text-xs text-slate-400">{active.reference} · {active.business?.name}</p>
                  </div>
                  <Badge tone={statusTone(active.status)}>{active.status.replace(/_/g, ' ')}</Badge>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                  {active.messages
                    ?.filter((m) => staff || ownsBusiness ? true : m.audience === 'customer' || m.senderId === user.id)
                    .map((m) => (
                      <div key={m.id} className="rounded-2xl border border-slate-100 p-4 dark:border-white/10">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                          <span className="capitalize">{m.senderRole?.replace('_', ' ')}</span>
                          <span className="chip bg-slate-100 text-slate-500">{audienceLabel[m.audience] || m.audience}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200">{m.body}</p>
                        <p className="mt-1 text-xs text-slate-400">{timeAgo(m.createdAt)}</p>
                      </div>
                    ))}
                </div>

                <div className="space-y-3 border-t border-slate-100 p-5 dark:border-white/10">
                  <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a message…" className="min-h-[80px]" />
                  <div className="flex flex-wrap gap-2">
                    {staff && (
                      <>
                        <Button size="sm" variant="secondary" loading={sending} disabled={!reply} onClick={() => act('forward', { body: reply })}>
                          <ArrowRight className="h-4 w-4" /> Forward to business
                        </Button>
                        <Button size="sm" loading={sending} disabled={!reply} onClick={() => act('reply', { body: reply, resolve: true })}>
                          <Send className="h-4 w-4" /> Reply to customer
                        </Button>
                      </>
                    )}
                    {ownsBusiness && (
                      <Button size="sm" loading={sending} disabled={!reply} onClick={() => act('business-reply', { body: reply })}>
                        <Send className="h-4 w-4" /> Respond to support
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => act('close', {})}>Close</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState icon={Ticket} title="No enquiries yet" description="Marketplace enquiries you send or receive will appear here." />
      )}
    </div>
  );
}
