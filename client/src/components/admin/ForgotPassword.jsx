import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import useToastStore from '../../stores/toastStore';

export default function ForgotPassword() {
  const toast = useToastStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-4 font-inter">
      <div className="w-full max-w-md bg-charcoal-light p-8 rounded-2xl border border-border-dark shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-accent/20 blur-[80px] pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-ivory">Reset Password</h1>
          <p className="text-muted-light mt-2 text-sm">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="text-center relative z-10 space-y-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </div>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ivory mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-charcoal/50 border border-border-dark rounded-xl px-4 py-3 text-ivory placeholder-muted-light focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-accent hover:bg-accent-light text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-muted-light hover:text-ivory transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
