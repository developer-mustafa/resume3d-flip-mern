import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/client';
import useAuthStore from '../../stores/authStore';
import useToastStore from '../../stores/toastStore';
import { LoadingState, EmptyState } from '../ui/States';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Plus, Pencil, Trash2, X, Save, Loader2, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

const roleIcons = { superadmin: ShieldAlert, admin: ShieldCheck, editor: Shield };
const roleBadges = {
  superadmin: 'bg-red-500/10 text-red-400 border-red-500/20',
  admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  editor: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { admin: currentAdmin } = useAuthStore();
  const toast = useToastStore();

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getAdminUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const updateData = { name: form.name, email: form.email, role: form.role };
        await adminAPI.updateAdminUser(editingId, updateData);
        toast.success('User updated');
      } else {
        await adminAPI.createAdminUser(form);
        toast.success('User created');
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminAPI.deleteAdminUser(deleteTarget);
      toast.success('User deleted');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (currentAdmin?.role !== 'superadmin') {
    return (
      <EmptyState
        icon={<ShieldAlert className="w-12 h-12 text-muted" />}
        title="Access Restricted"
        message="Only superadmins can manage admin users."
      />
    );
  }

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ivory">Admin Users</h1>
          <p className="text-sm text-muted-light mt-1">Manage admin accounts and roles</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: '', role: 'editor' }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {users.map((user) => {
          const RoleIcon = roleIcons[user.role] || Shield;
          return (
            <div key={user._id} className="bg-charcoal-light border border-border-dark rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                    {user.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ivory">{user.name}</p>
                    <p className="text-xs text-muted-light">{user.email}</p>
                  </div>
                </div>
                {user._id !== currentAdmin?.id && (
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingId(user._id); setForm({ name: user.name, email: user.email, password: '', role: user.role }); setShowForm(true); }}
                      className="w-7 h-7 rounded flex items-center justify-center text-muted-light hover:text-ivory hover:bg-white/5">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => setDeleteTarget(user._id)}
                      className="w-7 h-7 rounded flex items-center justify-center text-muted-light hover:text-red-400 hover:bg-red-500/5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${roleBadges[user.role] || roleBadges.editor}`}>
                  <RoleIcon className="w-3 h-3" />
                  {user.role}
                </span>
                {user._id === currentAdmin?.id && <span className="text-[10px] text-muted">(you)</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-charcoal-light border border-border-dark rounded-xl w-full max-w-md mx-4 shadow-2xl">
            <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ivory">{editingId ? 'Edit Admin' : 'New Admin'}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-light hover:text-ivory"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-light mb-1.5">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-light mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" required />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-xs font-medium text-muted-light mb-1.5">Password *</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" required />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-muted-light mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50">
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-dark flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border-dark rounded-lg text-muted-light hover:text-ivory">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete admin?" message="This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
