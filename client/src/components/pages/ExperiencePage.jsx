import useBookStore from '../../stores/bookStore';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

const capabilities = [
  { num: '01', label: 'Architecture', color: '#3b82f6' },
  { num: '02', label: 'Frontend', color: '#06b6d4' },
  { num: '03', label: 'Backend', color: '#10b981' },
  { num: '04', label: 'Database', color: '#f59e0b' },
  { num: '05', label: 'Cloud & DevOps', color: '#8b5cf6' },
  { num: '06', label: 'AI Engineering', color: '#ec4899' },
];

export default function ExperiencePage() {
  const { experience } = useBookStore();

  return (
    <div className="h-full flex flex-col">
      {/* Section Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary">
            02 // Career
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-1">
          Experience
        </h2>
        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary to-primary-600" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {/* Experience entries */}
        {(experience || []).length > 0 ? (
          <div className="space-y-4 mb-5">
            {experience.map((exp, idx) => (
              <div 
                key={exp._id} 
                className="relative pl-7 group/exp"
              >
                {/* Timeline line */}
                <div className="absolute left-[9px] top-6 bottom-[-16px] w-px bg-slate-200 dark:bg-slate-700 group-last/exp:hidden" />
                
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-400/40 flex items-center justify-center shrink-0 group-hover/exp:border-primary group-hover/exp:shadow-md group-hover/exp:shadow-primary/20 transition-all shadow-sm z-10">
                  <Briefcase className="w-2 h-2 text-primary/60 group-hover/exp:text-primary" />
                </div>
                
                <div className="rounded-xl px-3 pt-1 pb-2 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-sm transition-all duration-300">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight group-hover/exp:text-primary transition-colors">{exp.position}</h3>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 mb-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{exp.company}</p>
                    {exp.location && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Responsibilities */}
                  {exp.responsibilities?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {exp.responsibilities.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-[9px] font-medium tracking-wide text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm cursor-default hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary dark:hover:text-primary transition-colors"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {exp.description && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-50 mb-10">
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
              Experience entries will appear here once added.
            </p>
          </div>
        )}

        {/* Engineering Capabilities */}
        <div className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-[10px] tracking-[0.4em] uppercase text-slate-400 dark:text-slate-500 font-bold mb-3 flex items-center">
            <span className="w-4 h-px bg-slate-300 dark:bg-slate-700 mr-3"></span>
            ENGINEERING CAPABILITIES
            <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700 ml-3"></span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {capabilities.map((cap) => (
              <div
                key={cap.num}
                className="group/cap px-2 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <span className="text-[9px] font-mono font-bold block mb-0.5 transition-colors" style={{ color: cap.color + '80' }}>
                  {cap.num}
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover/cap:text-slate-800 dark:group-hover/cap:text-slate-100 transition-colors">
                  {cap.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
