import { useState } from 'react';
import CrudManager from './CrudManager';
import { adminAPI } from '../../api/client';
import { StatusBadge } from '../ui/States';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  {
    key: 'technologies',
    label: 'Stack',
    render: (item) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {(item.technologies || []).slice(0, 4).map(t => (
          <span key={t} className="px-1.5 py-0.5 text-[10px] bg-accent/10 text-accent rounded">{t}</span>
        ))}
        {(item.technologies || []).length > 4 && (
          <span className="text-[10px] text-muted-light">+{item.technologies.length - 4}</span>
        )}
      </div>
    ),
  },
  {
    key: 'featured',
    label: 'Featured',
    render: (item) => item.featured ? <span className="text-accent text-xs">★</span> : <span className="text-muted text-xs">—</span>,
  },
  { key: 'status', label: 'Status' },
];

const defaultFormData = {
  title: '', slug: '', shortDescription: '', description: '', category: '',
  technologies: [], features: [], image: '', githubUrl: '', liveUrl: '',
  featured: false, status: 'draft', order: 0,
};

function FormFields({ form, setForm }) {
  const [techInput, setTechInput] = useState('');
  const [featInput, setFeatInput] = useState('');
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
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Title *</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)}
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Slug</label>
          <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated"
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Category</label>
          <input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. SaaS, EdTech"
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Short Description</label>
        <input value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)}
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50 resize-none" />
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Technologies</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.technologies.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 text-accent rounded-md">
              {t}<button onClick={() => removeFromList('technologies', t)} className="hover:text-red-400">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('technologies', techInput, setTechInput))}
            placeholder="Add tech..." className="flex-1 px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50" />
          <button onClick={() => addToList('technologies', techInput, setTechInput)}
            className="px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-muted-light hover:text-ivory">Add</button>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Features</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.features.map((f) => (
            <span key={f} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-md">
              {f}<button onClick={() => removeFromList('features', f)} className="hover:text-red-400">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={featInput} onChange={(e) => setFeatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('features', featInput, setFeatInput))}
            placeholder="Add feature..." className="flex-1 px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50" />
          <button onClick={() => addToList('features', featInput, setFeatInput)}
            className="px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-muted-light hover:text-ivory">Add</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">GitHub URL</label>
          <input value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Live URL</label>
          <input value={form.liveUrl} onChange={(e) => set('liveUrl', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-light mb-1.5">Image URL</label>
        <input value={form.image} onChange={(e) => set('image', e.target.value)}
          className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-ivory cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 rounded border-border-dark bg-charcoal" />
            Featured
          </label>
        </div>
      </div>
    </>
  );
}

export default function ProjectsManager() {
  return (
    <CrudManager
      title="Projects"
      description="Manage your portfolio projects"
      apiGetAll={adminAPI.getProjects}
      apiCreate={adminAPI.createProject}
      apiUpdate={adminAPI.updateProject}
      apiDelete={adminAPI.deleteProject}
      columns={columns}
      FormFields={FormFields}
      defaultFormData={defaultFormData}
      entityName="Project"
    />
  );
}
