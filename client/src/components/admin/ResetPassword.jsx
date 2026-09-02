import { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import useToastStore from '../../stores/toastStore';

export default function ResetPassword() {
  const toast = useToastStore();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful! Please login.');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid or expired token');
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
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-ivory">Set New Password</h1>
          <p className="text-muted-light mt-2 text-sm">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-ivory mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-charcoal/50 border border-border-dark rounded-xl pl-4 pr-12 py-3 text-ivory placeholder-muted-light focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-light hover:text-ivory transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type password again"
                className="w-full bg-charcoal/50 border border-border-dark rounded-xl pl-4 pr-12 py-3 text-ivory placeholder-muted-light focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
