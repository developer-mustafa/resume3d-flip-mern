import useBookStore from '../../stores/bookStore';

const categoryOrder = ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'AI', 'Tools'];

const categoryColors = {
  Frontend: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', dot: '#3b82f6' },
  Backend: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', dot: '#10b981' },
  Database: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', dot: '#f59e0b' },
  Cloud: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', dot: '#8b5cf6' },
  DevOps: { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', dot: '#ec4899' },
  AI: { bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', dot: '#06b6d4' },
  Tools: { bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', dot: '#6b7280' },
};

export default function ProfilePage() {
  const { profile, skills } = useBookStore();
  const p = profile || {};

  // Group skills by category
  const grouped = {};
  (skills || []).forEach((skill) => {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  });

  const sortedCategories = categoryOrder.filter((c) => grouped[c]?.length > 0);

  return (
    <div className="h-full flex flex-col">
      {/* Section Header */}
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold px-2.5 py-1 rounded-md" style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>
            01 // Profile
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 mb-1">
          Engineering Profile
        </h2>
        <div className="w-16 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
      </div>

      {/* Summary */}
      <p className="text-xs md:text-[13px] text-slate-600 leading-relaxed mb-4 font-medium border-l-2 border-blue-400/30 pl-4">
        {p.summary || 'Full Stack Software Engineer specializing in modern web applications, SaaS architecture, backend systems, databases, cloud platforms, and AI-powered products.'}
      </p>

      {/* Skills Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <h3 className="text-[10px] tracking-[0.4em] uppercase text-slate-400 font-bold mb-3 flex items-center">
          <span className="w-4 h-px bg-slate-300 mr-3"></span>
          CORE COMPETENCIES
          <span className="flex-1 h-px bg-slate-200 ml-3"></span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {sortedCategories.map((category) => {
            const colors = categoryColors[category] || categoryColors.Tools;
            return (
              <div 
                key={category} 
                className="rounded-xl p-3 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                style={{ background: colors.bg, borderColor: colors.border }}
              >
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center text-slate-700">
                  <div className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: colors.dot }}></div>
                  {category === 'AI' ? 'AI Engineering' :
                   category === 'Cloud' ? 'Cloud Architecture' :
                   `${category}`}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {grouped[category].map((skill) => (
                    <span
                      key={skill._id || skill.name}
                      className="px-2.5 py-1 text-[10px] font-semibold tracking-wide text-slate-600 bg-white/80 rounded-md shadow-sm hover:shadow-md hover:text-blue-600 transition-all duration-200 cursor-default border border-white/60"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fallback if no skills */}
        {sortedCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <p className="text-xs text-slate-400 italic">
              Skills will appear here once added via the admin dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
