import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../api/client';
import useToastStore from '../../stores/toastStore';
import { LoadingState } from '../ui/States';
import { Save, Loader2 } from 'lucide-react';

export default function SEOManager() {
  const [form, setForm] = useState({
    metaTitle: '', metaDescription: '', keywords: [],
    canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', twitterImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kwInput, setKwInput] = useState('');
  const toast = useToastStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await publicAPI.getSEO();
        setForm({
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          keywords: data.keywords || [],
          canonicalUrl: data.canonicalUrl || '',
          ogTitle: data.ogTitle || '',
          ogDescription: data.ogDescription || '',
          ogImage: data.ogImage || '',
          twitterImage: data.twitterImage || '',
        });
      } catch (err) {
        toast.error('Failed to load SEO settings');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSEO(form);
      toast.success('SEO settings updated');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (kwInput.trim() && !form.keywords.includes(kwInput.trim())) {
      setForm({ ...form, keywords: [...form.keywords, kwInput.trim()] });
      setKwInput('');
    }
  };

  if (loading) return <LoadingState />;

  const set = (key, val) => setForm({ ...form, [key]: val });
  const inputCls = "w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ivory">SEO Settings</h1>
          <p className="text-sm text-muted-light mt-1">Search engine optimization</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <div className="bg-charcoal-light border border-border-dark rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">
            Meta Title <span className="text-muted">({form.metaTitle.length}/70)</span>
          </label>
          <input value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} maxLength={70} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">
            Meta Description <span className="text-muted">({form.metaDescription.length}/160)</span>
          </label>
          <textarea value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} maxLength={160} rows={2} className={inputCls + " resize-none"} />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Keywords</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.keywords.map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 text-accent rounded-md">
                {kw}
                <button onClick={() => setForm({ ...form, keywords: form.keywords.filter(k => k !== kw) })} className="hover:text-red-400">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={kwInput} onChange={(e) => setKwInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Add keyword..." className={"flex-1 " + inputCls} />
            <button onClick={addKeyword} className="px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-muted-light hover:text-ivory">Add</button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Canonical URL</label>
          <input value={form.canonicalUrl} onChange={(e) => set('canonicalUrl', e.target.value)} className={inputCls} />
        </div>

        <hr className="border-border-dark" />
        <h3 className="text-sm font-semibold text-ivory">Open Graph</h3>

        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">OG Title</label>
          <input value={form.ogTitle} onChange={(e) => set('ogTitle', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">OG Description</label>
          <textarea value={form.ogDescription} onChange={(e) => set('ogDescription', e.target.value)} rows={2} className={inputCls + " resize-none"} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">OG Image URL</label>
            <input value={form.ogImage} onChange={(e) => set('ogImage', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Twitter Card Image URL</label>
            <input value={form.twitterImage} onChange={(e) => set('twitterImage', e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>
    </div>
  );
}
