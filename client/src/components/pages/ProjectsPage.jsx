import useBookStore from '../../stores/bookStore';
import { ExternalLink, GitBranch, Folder } from 'lucide-react';

export default function ProjectsPage() {
  const { projects } = useBookStore();

  return (
    <div className="h-full flex flex-col">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold px-2.5 py-1 rounded-md" style={{ background: 'rgba(139,92,246,0.08)', color: '#8b5cf6' }}>
            03 // Portfolio
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800 mb-1">
          Selected Projects
        </h2>
        <div className="w-16 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {(projects || []).length > 0 ? (
          <div className="space-y-4 mb-6">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="group/proj relative rounded-xl p-5 border border-slate-200 bg-white/80 shadow-sm hover:shadow-lg hover:border-violet-300/50 transition-all duration-500 hover:-translate-y-0.5"
              >
                {/* Project number badge */}
                <div className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold" style={{ background: 'rgba(139,92,246,0.08)', color: '#8b5cf6' }}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover/proj:shadow-md transition-all" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))' }}>
                    <Folder className="w-5 h-5 text-violet-500/70 group-hover/proj:text-violet-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover/proj:text-violet-600 transition-colors">
                      {project.title}
                    </h3>
                    {project.shortDescription && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3 mt-1 ml-12">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-md border border-slate-200 text-slate-500 bg-white shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Features */}
                {project.features?.length > 0 && (
                  <ul className="space-y-1 mt-2 ml-12">
                    {project.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="text-[11px] text-slate-500 flex items-start">
                        <span className="w-1 h-1 rounded-full mt-1.5 mr-2 shrink-0" style={{ backgroundColor: '#8b5cf6' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Links */}
                <div className="flex gap-2 mt-3 ml-12">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg border border-slate-200 text-slate-500 hover:text-white hover:bg-slate-800 hover:border-slate-800 transition-all">
                      <GitBranch className="w-3 h-3" /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg border border-violet-200 text-violet-500 hover:text-white hover:bg-violet-500 hover:border-violet-500 transition-all">
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <p className="text-xs text-slate-400 italic">
              Projects will appear here once added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
