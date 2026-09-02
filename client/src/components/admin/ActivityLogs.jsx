import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/client';
import useToastStore from '../../stores/toastStore';
import { LoadingState, EmptyState } from '../ui/States';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const actionColors = {
  login: 'text-blue-400',
  logout: 'text-gray-400',
  create: 'text-emerald-400',
  update: 'text-accent',
  delete: 'text-red-400',
  publish: 'text-emerald-400',
  unpublish: 'text-orange-400',
  settings_update: 'text-purple-400',
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const toast = useToastStore();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getActivityLogs({ page, limit: 30 });
      setLogs(data.items || []);
      setPagination(data.pagination || { total: 0, pages: 1 });
    } catch (err) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page]);

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ivory">Activity Logs</h1>
        <p className="text-sm text-muted-light mt-1">Admin action audit trail</p>
      </div>

      {logs.length > 0 ? (
        <>
          <div className="bg-charcoal-light border border-border-dark rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-dark">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-light uppercase">Time</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-light uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-light uppercase">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-light uppercase">Resource</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-light uppercase">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-xs text-muted font-mono whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-ivory text-xs">
                        {log.userId?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${actionColors[log.action] || 'text-muted-light'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ivory text-xs">{log.resource}</td>
                      <td className="px-4 py-3 text-xs text-muted font-mono">{log.ip || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-light">
                Page {page} of {pagination.pages} ({pagination.total} entries)
              </p>
              <div className="flex gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-ivory hover:bg-white/5 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page >= pagination.pages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-ivory hover:bg-white/5 disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Clock className="w-12 h-12 text-muted" />}
          title="No activity logs"
          message="Actions will be recorded here as admins use the dashboard."
        />
      )}
    </div>
  );
}
