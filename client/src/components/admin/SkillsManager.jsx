import CrudManager from './CrudManager';
import { adminAPI } from '../../api/client';

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'AI', 'Tools'];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'order', label: 'Order' },
  { key: 'status', label: 'Status' },
];

const defaultFormData = {
  name: '', category: 'Frontend', level: '', icon: '',
  description: '', featured: false, order: 0, status: 'published',
};

function FormFields({ form, setForm }) {
  const set = (key, val) => setForm({ ...form, [key]: val });
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Skill Name *</label>
        <input value={form.name} onChange={(e) => set('name', e.target.value)}
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Category *</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Icon Name</label>
        <input value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="e.g. code, server, database"
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50" />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2}
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-ivory cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 rounded border-border-dark bg-charcoal text-accent focus:ring-accent" />
            Featured
          </label>
        </div>
      </div>
    </>
  );
}

export default function SkillsManager() {
  return (
    <CrudManager
      title="Skills"
      description="Manage your technical skills"
      apiGetAll={adminAPI.getSkills}
      apiCreate={adminAPI.createSkill}
      apiUpdate={adminAPI.updateSkill}
      apiDelete={adminAPI.deleteSkill}
      columns={columns}
      FormFields={FormFields}
      defaultFormData={defaultFormData}
      entityName="Skill"
    />
  );
}
