import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../api/client';
import useToastStore from '../../stores/toastStore';
import { LoadingState } from '../ui/States';
import { Save, Loader2 } from 'lucide-react';

export default function BookSettingsManager() {
  const [form, setForm] = useState({
    bookTitle: '', bookSubtitle: '', accentColor: '#2563eb',
    paperColor: '#faf9f6', backgroundColor: '#1a1a1a',
    animationSpeed: 800, showPageNumbers: true, showSocialLinks: true,
    defaultPage: 0, bookMode: 'desktop-spread',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToastStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await publicAPI.getSettings();
        setForm({
          bookTitle: data.bookTitle || '',
          bookSubtitle: data.bookSubtitle || '',
          accentColor: data.accentColor || '#2563eb',
          paperColor: data.paperColor || '#faf9f6',
          backgroundColor: data.backgroundColor || '#1a1a1a',
          animationSpeed: data.animationSpeed || 800,
          showPageNumbers: data.showPageNumbers !== false,
          showSocialLinks: data.showSocialLinks !== false,
          defaultPage: data.defaultPage || 0,
          bookMode: data.bookMode || 'desktop-spread',
        });
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(form);
      toast.success('Book settings updated');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  const set = (key, val) => setForm({ ...form, [key]: val });
  const inputCls = "w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory focus:outline-none focus:border-accent/50";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ivory">Book Settings</h1>
          <p className="text-sm text-muted-light mt-1">Configure the 3D resume book appearance</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <div className="bg-charcoal-light border border-border-dark rounded-xl p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Book Title</label>
            <input value={form.bookTitle} onChange={(e) => set('bookTitle', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Book Subtitle</label>
            <input value={form.bookSubtitle} onChange={(e) => set('bookSubtitle', e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Accent Color</label>
            <div className="flex gap-2">
              <input type="color" value={form.accentColor} onChange={(e) => set('accentColor', e.target.value)}
                className="w-10 h-10 rounded border border-border-dark cursor-pointer" />
              <input value={form.accentColor} onChange={(e) => set('accentColor', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Paper Color</label>
            <div className="flex gap-2">
              <input type="color" value={form.paperColor} onChange={(e) => set('paperColor', e.target.value)}
                className="w-10 h-10 rounded border border-border-dark cursor-pointer" />
              <input value={form.paperColor} onChange={(e) => set('paperColor', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={form.backgroundColor} onChange={(e) => set('backgroundColor', e.target.value)}
                className="w-10 h-10 rounded border border-border-dark cursor-pointer" />
              <input value={form.backgroundColor} onChange={(e) => set('backgroundColor', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Animation Speed (ms)</label>
            <input type="number" min={200} max={2000} step={100} value={form.animationSpeed}
              onChange={(e) => set('animationSpeed', parseInt(e.target.value) || 800)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Default Page</label>
            <select value={form.defaultPage} onChange={(e) => set('defaultPage', parseInt(e.target.value))} className={inputCls}>
              {['Cover', 'Profile', 'Experience', 'Projects', 'Contact'].map((p, i) => (
                <option key={i} value={i}>{i} — {p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-light mb-1.5">Book Mode</label>
            <select value={form.bookMode} onChange={(e) => set('bookMode', e.target.value)} className={inputCls}>
              <option value="desktop-spread">Desktop Spread</option>
              <option value="mobile-single-page">Mobile Single Page</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ivory cursor-pointer">
            <input type="checkbox" checked={form.showPageNumbers} onChange={(e) => set('showPageNumbers', e.target.checked)}
              className="w-4 h-4 rounded border-border-dark bg-charcoal" />
            Show page numbers
          </label>
          <label className="flex items-center gap-2 text-sm text-ivory cursor-pointer">
            <input type="checkbox" checked={form.showSocialLinks} onChange={(e) => set('showSocialLinks', e.target.checked)}
              className="w-4 h-4 rounded border-border-dark bg-charcoal" />
            Show social links
          </label>
        </div>
      </div>
    </div>
  );
}
