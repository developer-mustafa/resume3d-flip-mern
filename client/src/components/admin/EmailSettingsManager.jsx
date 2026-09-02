import { useState, useEffect } from 'react';
import { Mail, Save, Server, Shield, Send } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import api from '../../api/client';
import useToastStore from '../../stores/toastStore';

export default function EmailSettingsManager() {
  const toast = useToastStore();
  const { admin } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    provider: 'none',
    fromEmail: 'noreply@resumebook.dev',
    toEmail: 'admin@resumebook.dev',
    enableContactAlerts: false,
    enablePasswordReset: false,
    resendApiKey: '',
    sendgridApiKey: '',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
    emailjsPrivateKey: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/email-settings');
        setSettings({ ...settings, ...data, resendApiKey: '', sendgridApiKey: '', emailjsPrivateKey: '' }); // Don't populate hidden keys if not needed, but we keep them empty in state so we don't overwrite with empty unless intended. Actually, we should just let them be empty string in state, and the backend ignores empty strings for API keys.
      } catch (error) {
        console.error('Failed to fetch email settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...settings };
      // Remove empty keys to avoid overwriting existing ones in DB with empty strings
      if (!payload.resendApiKey) delete payload.resendApiKey;
      if (!payload.sendgridApiKey) delete payload.sendgridApiKey;
      if (!payload.emailjsPrivateKey) delete payload.emailjsPrivateKey;

      await api.put('/email-settings', payload);
      toast.success('Email settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading settings...</div>;
  }

  if (admin?.role !== 'superadmin') {
    return <div className="p-8 text-red-500">Access Denied: Superadmin only.</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Email & SMTP Settings</h1>
          <p className="text-gray-400">Configure email providers for contact alerts and password resets.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Global Settings */}
        <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-400" />
            General Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Active Provider</label>
              <select
                name="provider"
                value={settings.provider}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              >
                <option value="none">None (Disabled)</option>
                <option value="resend">Resend</option>
                <option value="sendgrid">SendGrid</option>
                <option value="emailjs">EmailJS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">From Email Address</label>
              <input
                type="email"
                name="fromEmail"
                value={settings.fromEmail}
                onChange={handleChange}
                placeholder="noreply@yourdomain.com"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notification Email (To)</label>
              <input
                type="email"
                name="toEmail"
                value={settings.toEmail}
                onChange={handleChange}
                placeholder="admin@yourdomain.com"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="enableContactAlerts"
                checked={settings.enableContactAlerts}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/10 bg-[#1a1a1a] text-accent focus:ring-accent focus:ring-offset-gray-900"
              />
              Enable email alerts for new Contact Form submissions
            </label>
            <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="enablePasswordReset"
                checked={settings.enablePasswordReset}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/10 bg-[#1a1a1a] text-accent focus:ring-accent focus:ring-offset-gray-900"
              />
              Enable Forgot Password (Reset via Email)
            </label>
          </div>
        </div>

        {/* Provider Credentials */}
        {settings.provider !== 'none' && (
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-400" />
              Provider Credentials
            </h2>

            {settings.provider === 'resend' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Resend API Key</label>
                <input
                  type="password"
                  name="resendApiKey"
                  value={settings.resendApiKey}
                  onChange={handleChange}
                  placeholder="re_..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-gray-500 mt-2">Leave blank to keep existing key. Get your key from <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-400">resend.com</a></p>
              </div>
            )}

            {settings.provider === 'sendgrid' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SendGrid API Key</label>
                <input
                  type="password"
                  name="sendgridApiKey"
                  value={settings.sendgridApiKey}
                  onChange={handleChange}
                  placeholder="SG...."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-gray-500 mt-2">Leave blank to keep existing key.</p>
              </div>
            )}

            {settings.provider === 'emailjs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Service ID</label>
                  <input
                    type="text"
                    name="emailjsServiceId"
                    value={settings.emailjsServiceId}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Template ID</label>
                  <input
                    type="text"
                    name="emailjsTemplateId"
                    value={settings.emailjsTemplateId}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Public Key</label>
                  <input
                    type="text"
                    name="emailjsPublicKey"
                    value={settings.emailjsPublicKey}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Private Key (Optional)</label>
                  <input
                    type="password"
                    name="emailjsPrivateKey"
                    value={settings.emailjsPrivateKey}
                    onChange={handleChange}
                    placeholder="Leave blank to keep existing"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                  <p className="text-xs text-gray-500 mt-2">Required for backend REST API calls</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
