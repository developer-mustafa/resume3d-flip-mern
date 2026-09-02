import CrudManager from './CrudManager';
import { adminAPI } from '../../api/client';

const columns = [
  { key: 'title', label: 'Service' },
  { key: 'icon', label: 'Icon' },
  { key: 'order', label: 'Order' },
  { key: 'status', label: 'Status' },
];

const defaultFormData = {
  title: '', description: '', icon: '', featured: false, order: 0, status: 'published',
};

function FormFields({ form, setForm }) {
  const set = (key, val) => setForm({ ...form, [key]: val });
  const inputCls = "w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50";
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Service Title *</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} required />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls + " resize-none"} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Icon Name</label>
          <input value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="e.g. code, globe, cpu" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-ivory cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 rounded border-border-dark bg-charcoal" />
            Featured
          </label>
        </div>
      </div>
    </>
  );
}

export default function ServicesManager() {
  return (
    <CrudManager
      title="Services"
      description="Manage offered services"
      apiGetAll={adminAPI.getServices}
      apiCreate={adminAPI.createService}
      apiUpdate={adminAPI.updateService}
      apiDelete={adminAPI.deleteService}
      columns={columns}
      FormFields={FormFields}
      defaultFormData={defaultFormData}
      entityName="Service"
    />
  );
}
