import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Heart, MessageCircle, Send, Users, Plus } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { Avatar, Badge, Button, Field, Input, Textarea, Spinner } from '../../components/ui/index.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { timeAgo, formatNumber } from '../../lib/format.js';

function PostCard({ post, onLike }) {
  return (
    <article className="card p-5">
      <div className="flex items-center gap-3">
        <Avatar name={post.author?.name} src={post.author?.avatarUrl} size={40} />
        <div>
          <p className="text-sm font-semibold">{post.author?.name || 'Member'}</p>
          <p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.body}</p>
      <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
        <button onClick={() => onLike(post.id)} className="inline-flex items-center gap-1.5 hover:text-rose-500">
          <Heart className="h-4 w-4" /> {formatNumber(post.likes)}
        </button>
        <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> {formatNumber(post.commentsCount)}</span>
      </div>
    </article>
  );
}

export default function SpaceDetail() {
  const { slug } = useParams();
  const toast = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({ title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data: space, isLoading } = useQuery({
    queryKey: ['space', slug],
    queryFn: async () => (await api.get(`/spaces/${slug}`)).data.data,
  });

  const join = async () => {
    try {
      const { data } = await api.post(`/spaces/${space.id}/join`);
      toast.success(data.data.joined ? 'Joined space' : 'Left space');
      qc.invalidateQueries({ queryKey: ['space', slug] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const like = async (postId) => {
    try {
      await api.post(`/spaces/posts/${postId}/like`);
      qc.invalidateQueries({ queryKey: ['space', slug] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/spaces/${space.id}/posts`, post);
      toast.success('Post published');
      setOpen(false);
      setPost({ title: '', body: '' });
      qc.invalidateQueries({ queryKey: ['space', slug] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!space) return <p className="py-20 text-center text-slate-500">Space not found.</p>;

  return (
    <div>
      <Link to="/app/spaces" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to spaces
      </Link>

      <div className="card mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
              {space.name}
              {space.official && <Badge tone="accent">Official</Badge>}
            </h1>
            <p className="text-sm capitalize text-slate-400">{space.visibility} · {formatNumber(space.members)} members</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={join}>Join</Button>
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New post</Button>
        </div>
      </div>

      <p className="mb-8 max-w-3xl text-slate-600 dark:text-slate-300">{space.description}</p>

      <div className="space-y-5">
        {space.posts?.length ? (
          space.posts.map((p) => <PostCard key={p.id} post={p} onLike={like} />)
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400 dark:border-white/10">
            No posts yet — start the conversation.
          </p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a post">
        <form onSubmit={submitPost} className="space-y-4">
          <Field label="Title"><Input value={post.title} onChange={(e) => setPost((p) => ({ ...p, title: e.target.value }))} required minLength={3} /></Field>
          <Field label="Body"><Textarea value={post.body} onChange={(e) => setPost((p) => ({ ...p, body: e.target.value }))} required /></Field>
          <Button type="submit" className="w-full" loading={submitting}><Send className="h-4 w-4" /> Publish</Button>
        </form>
      </Modal>
    </div>
  );
}
