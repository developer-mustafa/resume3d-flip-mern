import { useState, useEffect, useCallback } from 'react';
import useToastStore from '../../stores/toastStore';
import { LoadingState, EmptyState, StatusBadge } from '../ui/States';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

/**
 * Generic CRUD manager component.
 * Provides table view + create/edit modal + delete confirmation.
 */
export default function CrudManager({
  title,
  description,
  apiGetAll,
  apiCreate,
  apiUpdate,
  apiDelete,
  columns,
  FormFields,
  defaultFormData,
  entityName = 'item',
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToastStore();

  const fetchItems = useCallback(async () => {
    try {
      const { data } = await apiGetAll();
      setItems(data.items || data || []);
    } catch (err) {
      toast.error(`Failed to load ${entityName}s`);
    } finally {
      setLoading(false);
    }
  }, [apiGetAll, entityName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultFormData);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    const formData = {};
    Object.keys(defaultFormData).forEach((key) => {
      formData[key] = item[key] !== undefined ? item[key] : defaultFormData[key];
    });
    setForm(formData);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await apiUpdate(editingId, form);
        toast.success(`${entityName} updated`);
      } else {
        await apiCreate(form);
        toast.success(`${entityName} created`);
      }
      setShowForm(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || `Failed to save ${entityName}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(deleteTarget);
      toast.success(`${entityName} deleted`);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      toast.error(err.message || `Failed to delete ${entityName}`);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ivory">{title}</h1>
          {description && <p className="text-sm text-muted-light mt-1">{description}</p>}
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {entityName}
        </button>
      </div>

      {/* Table */}
      {items.length > 0 ? (
        <div className="bg-charcoal-light border border-border-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-dark">
                  {columns.map((col) => (
                    <th key={col.key} className="text-left px-4 py-3 text-xs font-medium text-muted-light uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-light uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-ivory">
                        {col.render ? col.render(item) : (
                          col.key === 'status' ? <StatusBadge status={item[col.key]} /> : String(item[col.key] || '—')
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-ivory hover:bg-white/5 transition-colors"
                          aria-label={`Edit ${entityName}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-red-400 hover:bg-red-500/5 transition-colors"
                          aria-label={`Delete ${entityName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title={`No ${entityName}s yet`}
          message={`Create your first ${entityName} to get started.`}
          action={
            <button
              onClick={openCreate}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add {entityName}
            </button>
          }
        />
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-charcoal-light border border-border-dark rounded-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-charcoal-light border-b border-border-dark px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-ivory">
                {editingId ? `Edit ${entityName}` : `New ${entityName}`}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-light hover:text-ivory transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <FormFields form={form} setForm={setForm} />
            </div>
            <div className="sticky bottom-0 bg-charcoal-light border-t border-border-dark px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm border border-border-dark rounded-lg text-muted-light hover:text-ivory transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={`Delete ${entityName}?`}
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
