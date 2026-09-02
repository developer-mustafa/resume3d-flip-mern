import { useState } from 'react';
import useBookStore from '../../stores/bookStore';
import useToastStore from '../../stores/toastStore';
import { publicAPI } from '../../api/client';
import { Mail, MapPin, Send, Globe, Users, Video, GitBranch } from 'lucide-react';

const platformIcons = {
  github: GitBranch,
  linkedin: Users,
  website: Globe,
  facebook: Globe,
  youtube: Video,
  email: Mail,
  twitter: Globe,
  instagram: Globe,
};

export default function ContactPage() {
  const { profile, socialLinks } = useBookStore();
  const toast = useToastStore();
  const p = profile || {};

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning('Please fill in all required fields');
      return;
    }
    setSending(true);
    try {
      await publicAPI.submitContact(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold px-2.5 py-1 rounded-md" style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b' }}>
            04 // Let's Talk
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800 mb-1">
          Get In Touch
        </h2>
        <div className="w-16 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
      </div>

      <p className="text-xs text-slate-500 italic mb-6 font-medium border-l-2 border-amber-400/30 pl-3">
        "Engineering ideas into reliable digital products."
      </p>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="flex flex-col gap-3">
          {/* Top: Info */}
          <div className="flex-1">
            <h3 className="text-base font-bold mb-1 tracking-tight text-slate-800">{p.name || 'Mustafa Rahman'}</h3>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: '#f59e0b' }}>{p.title || 'Full Stack Software Engineer'}</p>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <MapPin className="w-3.5 h-3.5 text-amber-500/60" />
              <span className="font-medium">{p.location || 'Austin, Texas, USA'}</span>
            </div>

            {/* Contact details */}
            <div className="space-y-2 mb-4">
              {p.email && (
                <div className="flex items-center gap-3 text-xs text-slate-600 group/contact">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center group-hover/contact:shadow-md transition-all" style={{ background: 'rgba(245,158,11,0.08)' }}>
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <a href={`mailto:${p.email}`} className="font-semibold hover:text-amber-600 transition-colors">{p.email}</a>
                </div>
              )}
              {p.website && (
                <div className="flex items-center gap-3 text-xs text-slate-600 group/contact">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center group-hover/contact:shadow-md transition-all" style={{ background: 'rgba(245,158,11,0.08)' }}>
                    <Globe className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <a href={p.website} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-amber-600 transition-colors">{p.website}</a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {socialLinks.map((link, idx) => {
                  const Icon = platformIcons[link.platform?.toLowerCase()] || Globe;
                  return (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-amber-500 hover:border-amber-500 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                      aria-label={link.label || link.platform}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Contact Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Send a Message</h3>
              
              {['name', 'email', 'subject'].map((field) => (
                <div key={field} className={`relative border rounded-lg transition-all duration-300 overflow-hidden ${focusedInput === field ? 'border-amber-400 shadow-sm shadow-amber-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={field === 'name' ? 'Your Name *' : field === 'email' ? 'Your Email *' : 'Subject'}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    onFocus={() => setFocusedInput(field)}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full px-3 py-1.5 text-xs bg-transparent text-slate-700 placeholder:text-slate-300 focus:outline-none"
                    required={field !== 'subject'}
                  />
                </div>
              ))}
              
              <div className={`relative border rounded-lg transition-all duration-300 overflow-hidden ${focusedInput === 'message' ? 'border-amber-400 shadow-sm shadow-amber-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
                <textarea
                  placeholder="How can I help you? *"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocusedInput('message')}
                  onBlur={() => setFocusedInput(null)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs bg-transparent text-slate-700 placeholder:text-slate-300 focus:outline-none resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 text-white text-[10px] font-bold tracking-widest uppercase rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
              >
                <Send className={`w-3 h-3 ${sending ? 'animate-pulse' : ''}`} />
                {sending ? 'TRANSMITTING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>
        </div>

        {/* Closing statement */}
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-[9px] tracking-[0.4em] uppercase text-slate-400 font-bold text-center">
            {p.resumeTagline || 'DESIGN WITH PURPOSE • ENGINEER FOR SCALE • BUILD FOR IMPACT'}
          </p>
        </div>
      </div>
    </div>
  );
}
