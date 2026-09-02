import { useState } from 'react';
import CrudManager from './CrudManager';
import { adminAPI } from '../../api/client';

const columns = [
  { key: 'position', label: 'Position' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
];

const defaultFormData = {
  company: '', position: '', location: '', employmentType: '',
  startDate: '', endDate: '', current: false, description: '',
  responsibilities: [], technologies: [], order: 0, status: 'published',
};

function FormFields({ form, setForm }) {
  const [respInput, setRespInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const set = (key, val) => setForm({ ...form, [key]: val });

  const addToList = (key, input, setInput) => {
    if (input.trim() && !form[key].includes(input.trim())) {
      set(key, [...form[key], input.trim()]);
      setInput('');
    }
  };
  const removeFromList = (key, item) => set(key, form[key].filter(i => i !== item));

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Position *</label>
          <input value={form.position} onChange={(e) => set('position', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Company *</label>
          <input value={form.company} onChange={(e) => set('company', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Location</label>
          <input value={form.location} onChange={(e) => set('location', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Employment Type</label>
          <select value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50">
            <option value="">Select...</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50 resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.current} onChange={(e) => set('current', e.target.checked)}
          className="w-4 h-4 rounded border-border-dark bg-charcoal" id="exp-current" />
        <label htmlFor="exp-current" className="text-sm text-ivory cursor-pointer">Current position</label>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Responsibilities</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.responsibilities.map((r) => (
            <span key={r} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 text-accent rounded-md">
              {r}
              <button onClick={() => removeFromList('responsibilities', r)} className="hover:text-red-400">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={respInput} onChange={(e) => setRespInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('responsibilities', respInput, setRespInput))}
            placeholder="Add responsibility..." className="flex-1 px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50" />
          <button onClick={() => addToList('responsibilities', respInput, setRespInput)}
            className="px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-muted-light hover:text-ivory">Add</button>
        </div>
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Technologies</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.technologies.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/10 text-purple-400 rounded-md">
              {t}
              <button onClick={() => removeFromList('technologies', t)} className="hover:text-red-400">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('technologies', techInput, setTechInput))}
            placeholder="Add technology..." className="flex-1 px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50" />
          <button onClick={() => addToList('technologies', techInput, setTechInput)}
            className="px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-muted-light hover:text-ivory">Add</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default function ExperienceManager() {
  return (
    <CrudManager
      title="Experience"
      description="Manage work experience"
      apiGetAll={adminAPI.getExperience}
      apiCreate={adminAPI.createExperience}
      apiUpdate={adminAPI.updateExperience}
      apiDelete={adminAPI.deleteExperience}
      columns={columns}
      FormFields={FormFields}
      defaultFormData={defaultFormData}
      entityName="Experience"
    />
  );
}
