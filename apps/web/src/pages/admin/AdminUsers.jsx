import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserCog, Search } from 'lucide-react';
import { api, getErrorMessage } from '../../lib/api.js';
import { PageHeader } from '../../components/app/shared.jsx';
import { Avatar, Badge, Button, Input, Select, Spinner, statusTone } from '../../components/ui/index.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { timeAgo } from '../../lib/format.js';

const roles = ['user', 'business_owner', 'admin', 'super_admin'];

export default function AdminUsers() {
  const [q, setQ] = useState('');
  const toast = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', q],
    queryFn: async () => (await api.get('/admin/users', { params: { q, limit: 50 } })).data.data,
  });

  const setRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}`, { role });
      toast.success('Role updated');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggleSuspend = async (u) => {
    try {
      await api.patch(`/admin/users/${u.id}`, { status: u.status === 'suspended' ? 'approved' : 'suspended' });
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} src={u.avatarUrl} size={36} />
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <Select value={u.role} onChange={(e) => setRole(u.id, e.target.value)} className="w-40 py-1.5 text-xs">
          {roles.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
        </Select>
      ),
    },
    { key: 'status', header: 'Status', render: (u) => <Badge tone={statusTone(u.status)}>{u.status}</Badge> },
    { key: 'createdAt', header: 'Joined', render: (u) => <span className="text-xs text-slate-400">{timeAgo(u.createdAt)}</span> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (u) => (
        <Button size="sm" variant={u.status === 'suspended' ? 'secondary' : 'danger'} onClick={() => toggleSuspend(u)}>
          {u.status === 'suspended' ? 'Reinstate' : 'Suspend'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader icon={UserCog} title="Users" subtitle="Manage roles and access across the platform." />
      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="pl-9" />
      </div>
      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : <Table columns={columns} data={data || []} />}
    </div>
  );
}
