import CrudManager from './CrudManager';
import { adminAPI } from '../../api/client';

const columns = [
  { key: 'institution', label: 'Institution' },
  { key: 'degree', label: 'Degree' },
  { key: 'field', label: 'Field' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
];

const defaultFormData = {
  institution: '', degree: '', field: '', startDate: '', endDate: '',
  description: '', location: '', status: 'published',
};

function FormFields({ form, setForm }) {
  const set = (key, val) => setForm({ ...form, [key]: val });
  const inputCls = "w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50";
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Institution *</label>
        <input value={form.institution} onChange={(e) => set('institution', e.target.value)} className={inputCls} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Degree</label>
          <input value={form.degree} onChange={(e) => set('degree', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Field of Study</label>
          <input value={form.field} onChange={(e) => set('field', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Location</label>
        <input value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls + " resize-none"} />
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

export default function EducationManager() {
  return (
    <CrudManager
      title="Education"
      description="Manage education records"
      apiGetAll={adminAPI.getEducation}
      apiCreate={adminAPI.createEducation}
      apiUpdate={adminAPI.updateEducation}
      apiDelete={adminAPI.deleteEducation}
      columns={columns}
      FormFields={FormFields}
      defaultFormData={defaultFormData}
      entityName="Education"
    />
  );
}
