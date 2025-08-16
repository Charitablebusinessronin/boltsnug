import React, { useMemo, useState } from 'react';
import { Users, UserPlus, Shield, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Client' | 'Contractor' | 'Employee' | 'Admin';
  status: 'Active' | 'Pending' | 'Suspended';
  created_at: string;
  last_active?: string;
}

export const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const users: AdminUser[] = useMemo(() => ([
    { id: 'u-1001', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Client', status: 'Active', created_at: '2025-07-02T10:00:00Z', last_active: '2025-08-15T12:30:00Z' },
    { id: 'u-1002', name: 'John Contractor', email: 'john.contractor@example.com', role: 'Contractor', status: 'Pending', created_at: '2025-08-12T09:15:00Z' },
    { id: 'u-1003', name: 'Maria Rodriguez', email: 'maria.rodriguez@example.com', role: 'Employee', status: 'Active', created_at: '2025-06-11T08:30:00Z', last_active: '2025-08-15T08:10:00Z' },
    { id: 'u-1004', name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active', created_at: '2025-01-01T00:00:00Z', last_active: '2025-08-15T11:45:00Z' },
    { id: 'u-1005', name: 'Kevin Lee', email: 'kevin.lee@example.com', role: 'Contractor', status: 'Suspended', created_at: '2025-03-05T14:20:00Z', last_active: '2025-07-31T14:00:00Z' },
  ]), []);

  const filtered = users.filter(u =>
    (search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === '' || u.role === roleFilter) &&
    (statusFilter === '' || u.status === statusFilter)
  );

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background p-4 rounded-lg text-center">
          <div className="font-heading text-2xl font-bold text-primary">{users.length}</div>
          <div className="font-ui text-xs text-primary/60">Total Users</div>
        </div>
        <div className="bg-background p-4 rounded-lg text-center">
          <div className="font-heading text-2xl font-bold text-blue-600">{users.filter(u => u.status === 'Pending').length}</div>
          <div className="font-ui text-xs text-primary/60">Pending Approvals</div>
        </div>
        <div className="bg-background p-4 rounded-lg text-center">
          <div className="font-heading text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Active').length}</div>
          <div className="font-ui text-xs text-primary/60">Active</div>
        </div>
      </div>

      <div className="bg-background p-4 rounded-lg space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm">
            <option value="">All Roles</option>
            <option value="Client">Client</option>
            <option value="Contractor">Contractor</option>
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <button className="healthcare-button-secondary flex items-center justify-center"><Filter className="h-4 w-4 mr-2" />Advanced Filters</button>
        </div>
      </div>

      <div className="healthcare-card p-0 overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left bg-background">
                <th className="px-4 py-3 font-ui text-xs text-primary/60">Name</th>
                <th className="px-4 py-3 font-ui text-xs text-primary/60">Email</th>
                <th className="px-4 py-3 font-ui text-xs text-primary/60">Role</th>
                <th className="px-4 py-3 font-ui text-xs text-primary/60">Status</th>
                <th className="px-4 py-3 font-ui text-xs text-primary/60">Created</th>
                <th className="px-4 py-3 font-ui text-xs text-primary/60">Last Active</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-accent/20">
                  <td className="px-4 py-3 font-ui text-primary">{u.name}</td>
                  <td className="px-4 py-3 font-body text-primary/80">{u.email}</td>
                  <td className="px-4 py-3 font-body text-primary/70">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-ui ${
                      u.status === 'Active' ? 'bg-green-100 text-green-700' : u.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.status === 'Active' ? <CheckCircle className="h-3 w-3 mr-1" /> : u.status === 'Pending' ? <Clock className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-primary/70">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3 font-body text-primary/70">{formatDate(u.last_active)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button className="healthcare-button-secondary text-xs">View</button>
                      <button className="healthcare-button-secondary text-xs">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-6 text-center">
            <Users className="h-12 w-12 text-primary/30 mx-auto mb-2" />
            <p className="font-body text-primary/60">No users match your filters</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="healthcare-button-secondary"><Shield className="h-4 w-4 mr-2" /> Access Controls</button>
        <button className="healthcare-button-primary"><UserPlus className="h-4 w-4 mr-2" /> Add User</button>
      </div>
    </div>
  );
}
