import CrudManager from './CrudManager';
import { adminAPI } from '../../api/client';

const columns = [
  { key: 'name', label: 'Certificate' },
  { key: 'issuer', label: 'Issuer' },
  { key: 'credentialId', label: 'Credential ID' },
  { key: 'status', label: 'Status' },
];

const defaultFormData = {
  name: '', issuer: '', issueDate: '', expiryDate: '',
  credentialId: '', credentialUrl: '', description: '', status: 'published',
};

function FormFields({ form, setForm }) {
  const set = (key, val) => setForm({ ...form, [key]: val });
  const inputCls = "w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50";
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Certificate Name *</label>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} required />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Issuer</label>
        <input value={form.issuer} onChange={(e) => set('issuer', e.target.value)} className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Credential ID</label>
          <input value={form.credentialId} onChange={(e) => set('credentialId', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Credential URL</label>
          <input value={form.credentialUrl} onChange={(e) => set('credentialUrl', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={inputCls + " resize-none"} />
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

export default function CertificationsManager() {
  return (
    <CrudManager
      title="Certifications"
      description="Manage certifications and credentials"
      apiGetAll={adminAPI.getCertifications}
      apiCreate={adminAPI.createCertification}
      apiUpdate={adminAPI.updateCertification}
      apiDelete={adminAPI.deleteCertification}
      columns={columns}
      FormFields={FormFields}
      defaultFormData={defaultFormData}
      entityName="Certification"
    />
  );
}
