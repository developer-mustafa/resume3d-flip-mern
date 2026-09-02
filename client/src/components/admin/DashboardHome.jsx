import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/client';
import { LoadingState, ErrorState } from '../ui/States';
import { FolderKanban, Wrench, Briefcase, Award, MessageSquare, Clock } from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getDashboardStats();
        setStats(data.stats);
        setActivity(data.recentActivity || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Published Projects', value: stats?.publishedProjects || 0, icon: FolderKanban, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Draft Projects', value: stats?.draftProjects || 0, icon: FolderKanban, color: 'text-accent bg-accent/10' },
    { label: 'Total Skills', value: stats?.totalSkills || 0, icon: Wrench, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Experience Entries', value: stats?.totalExperience || 0, icon: Briefcase, color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Certifications', value: stats?.totalCertifications || 0, icon: Award, color: 'text-orange-400 bg-orange-500/10' },
    { label: 'Unread Messages', value: stats?.unreadMessages || 0, icon: MessageSquare, color: 'text-rose-400 bg-rose-500/10' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ivory">Dashboard</h1>
        <p className="text-sm text-muted-light mt-1">Overview of your resume content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-charcoal-light border border-border-dark rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-ivory">{card.value}</p>
            <p className="text-xs text-muted-light mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-charcoal-light border border-border-dark rounded-xl">
        <div className="px-5 py-4 border-b border-border-dark">
          <h2 className="text-sm font-semibold text-ivory">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border-dark">
          {activity.length > 0 ? (
            activity.map((log) => (
              <div key={log._id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-charcoal-lighter flex items-center justify-center shrink-0">
                  <Clock className="w-3 h-3 text-muted-light" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ivory">
                    <span className="font-medium">{log.userId?.name || 'Admin'}</span>
                    {' '}
                    <span className="text-muted-light">{log.action}</span>
                    {' '}
                    <span className="text-accent">{log.resource}</span>
                  </p>
                  <p className="text-[10px] text-muted font-mono mt-0.5">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-sm text-muted-light">
              No activity yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
