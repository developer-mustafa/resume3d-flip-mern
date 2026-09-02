import CrudManager from './CrudManager';
import { adminAPI } from '../../api/client';

const columns = [
  { key: 'platform', label: 'Platform' },
  { key: 'label', label: 'Label' },
  {
    key: 'url',
    label: 'URL',
    render: (item) => (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs truncate block max-w-xs">
        {item.url}
      </a>
    ),
  },
  { key: 'order', label: 'Order' },
  { key: 'status', label: 'Status' },
];

const defaultFormData = {
  platform: '', label: '', url: '', icon: '', order: 0, status: 'published',
};

function FormFields({ form, setForm }) {
  const set = (key, val) => setForm({ ...form, [key]: val });
  const inputCls = "w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50";
  const platforms = ['GitHub', 'LinkedIn', 'Facebook', 'YouTube', 'Website', 'Email', 'Twitter', 'Instagram'];
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Platform *</label>
        <select value={form.platform} onChange={(e) => set('platform', e.target.value)} className={inputCls}>
          <option value="">Select platform...</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">URL *</label>
        <input value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://..." className={inputCls} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Label</label>
          <input value={form.label} onChange={(e) => set('label', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Status</label>
        <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </>
  );
}

export default function SocialLinksManager() {
  return (
    <CrudManager
      title="Social Links"
      description="Manage social media and profile links"
      apiGetAll={adminAPI.getSocialLinks}
      apiCreate={adminAPI.createSocialLink}
      apiUpdate={adminAPI.updateSocialLink}
      apiDelete={adminAPI.deleteSocialLink}
      columns={columns}
      FormFields={FormFields}
      defaultFormData={defaultFormData}
      entityName="Social Link"
    />
  );
}
