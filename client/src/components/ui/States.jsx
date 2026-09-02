import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-light">
      <Loader2 className="w-8 h-8 animate-spin mb-3 text-accent" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <p className="text-muted-light mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title = 'No data yet', message = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="mb-4 text-muted-light">{icon}</div>}
      <h3 className="text-lg font-medium text-ivory mb-1">{title}</h3>
      {message && <p className="text-sm text-muted-light mb-4">{message}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-charcoal-lighter/50 rounded ${className}`}
      {...props}
    />
  );
}

export function StatusBadge({ status }) {
  const styles = {
    published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    archived: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    unread: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    read: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}
