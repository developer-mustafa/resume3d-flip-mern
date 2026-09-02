import useToastStore from '../../stores/toastStore';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'bg-emerald-900/90 border-emerald-500/40 text-emerald-100',
  error: 'bg-red-900/90 border-red-500/40 text-red-100',
  warning: 'bg-amber-900/90 border-amber-500/40 text-amber-100',
  info: 'bg-blue-900/90 border-blue-500/40 text-blue-100',
};

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-slide-in ${colors[toast.type] || colors.info}`}
            role="alert"
          >
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
