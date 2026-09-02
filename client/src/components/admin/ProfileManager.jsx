import { useState, useEffect } from 'react';
import { publicAPI, adminAPI } from '../../api/client';
import useToastStore from '../../stores/toastStore';
import { LoadingState } from '../ui/States';
import { Save, Loader2 } from 'lucide-react';

const Field = ({ label, name, type = 'text', rows, required, form, setForm }) => (
  <div>
    <label className="block text-xs font-medium text-muted-light mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {rows ? (
      <textarea
        value={form[name] || ''}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        rows={rows}
        className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
      />
    ) : (
      <input
        type={type}
        value={form[name] || ''}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
      />
    )}
  </div>
);

export default function ProfileManager() {
  const [form, setForm] = useState({
    name: '', title: '', subtitle: '', location: '', bio: '',
    headline: '', profileImage: '', availability: '', summary: '',
    email: '', phone: '', website: '', resumeTagline: '', techBadges: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [badgeInput, setBadgeInput] = useState('');
  const toast = useToastStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await publicAPI.getProfile();
        setForm({
          name: data.name || '',
          title: data.title || '',
          subtitle: data.subtitle || '',
          location: data.location || '',
          bio: data.bio || '',
          headline: data.headline || '',
          profileImage: data.profileImage || '',
          availability: data.availability || '',
          summary: data.summary || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          resumeTagline: data.resumeTagline || '',
          techBadges: data.techBadges || [],
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateProfile(form);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addBadge = () => {
    if (badgeInput.trim() && !form.techBadges.includes(badgeInput.trim())) {
      setForm({ ...form, techBadges: [...form.techBadges, badgeInput.trim()] });
      setBadgeInput('');
    }
  };

  const removeBadge = (badge) => {
    setForm({ ...form, techBadges: form.techBadges.filter(b => b !== badge) });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ivory">Profile</h1>
          <p className="text-sm text-muted-light mt-1">Manage your resume profile information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <div className="bg-charcoal-light border border-border-dark rounded-xl p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Full Name" name="name" required form={form} setForm={setForm} />
          <Field label="Professional Title" name="title" form={form} setForm={setForm} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Short Title / Subtitle" name="subtitle" form={form} setForm={setForm} />
          <Field label="Location" name="location" form={form} setForm={setForm} />
        </div>
        <Field label="Bio" name="bio" rows={3} form={form} setForm={setForm} />
        <Field label="Professional Summary" name="summary" rows={4} form={form} setForm={setForm} />
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Headline / Tagline" name="headline" form={form} setForm={setForm} />
          <Field label="Availability" name="availability" form={form} setForm={setForm} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Email" name="email" type="email" form={form} setForm={setForm} />
          <Field label="Phone" name="phone" form={form} setForm={setForm} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Website" name="website" type="url" form={form} setForm={setForm} />
          <Field label="Profile Image URL" name="profileImage" form={form} setForm={setForm} />
        </div>
        <Field label="Resume Tagline" name="resumeTagline" form={form} setForm={setForm} />

        {/* Tech Badges */}
        <div>
          <label className="block text-xs font-medium text-muted-light mb-1.5">Technology Badges</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.techBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
              >
                {badge}
                <button onClick={() => removeBadge(badge)} className="hover:text-red-400 transition-colors">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={badgeInput}
              onChange={(e) => setBadgeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
              placeholder="Add technology..."
              className="flex-1 px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
            <button onClick={addBadge} className="px-3 py-2 bg-charcoal border border-border-dark rounded-lg text-sm text-muted-light hover:text-ivory transition-colors">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
