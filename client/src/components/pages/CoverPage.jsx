import useBookStore from '../../stores/bookStore';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';

export default function CoverPage() {
  const { profile } = useBookStore();
  const p = profile || {};

  return (
    <div className="h-full flex flex-col relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] text-slate-800 dark:text-white p-10 md:p-14 overflow-hidden border-l-[12px] border-l-slate-300 dark:border-l-[#0a0f1d] shadow-[inset_10px_0_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_10px_0_20px_rgba(0,0,0,0.6)]">
      {/* Book Binding/Spine Effect */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 dark:from-white/10 via-transparent to-transparent pointer-events-none z-30" />
      <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-black/5 dark:bg-white/10 pointer-events-none z-30" />
      <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-black/10 dark:bg-black/40 pointer-events-none z-30" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary-400 rounded-full animate-pulse" />
      <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Geometric grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Top section */}
      <div className="pt-6 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-gradient-to-r from-primary-400 to-transparent" />
          <Sparkles className="w-3 h-3 text-primary-400/60" />
        </div>
        <p className="text-[10px] tracking-[0.35em] uppercase text-primary-300/60 font-semibold">
          Interactive Resume
        </p>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col justify-center -mt-4 relative z-10">
        {/* Profile image */}
        {p.profileImage ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden mb-8 ring-2 ring-primary-400/30 shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform duration-500">
            <img
              src={p.profileImage}
              alt={p.name || 'Profile'}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl mb-8 flex items-center justify-center ring-2 ring-primary-400/30 shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-primary/20 to-primary-600/20">
            <span className="text-2xl font-bold text-primary-300/80">
              {(p.name || 'MR').split(' ').map(w => w[0]).join('')}
            </span>
          </div>
        )}

        {/* Name */}
        <h1 className="text-4xl md:text-[42px] font-black tracking-tight leading-none mb-3 text-slate-800 dark:text-white">
          {p.name || 'Mustafa Rahman'}
        </h1>

        {/* Title with accent line */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" />
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
            {p.title || 'Full Stack Software Engineer'}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
          {p.subtitle || 'Software Engineer • Web Developer • Educator'}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <MapPin className="w-3.5 h-3.5 text-primary-400/50" />
          <span className="font-medium">{p.location || 'Austin, Texas, USA'}</span>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-600/90 dark:text-slate-400/90 leading-relaxed max-w-sm mb-8">
          {p.bio || 'Full Stack Software Engineer focused on building scalable, secure, high-performance web applications and SaaS products.'}
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 max-w-md">
          {(p.techBadges || [
            'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL',
            'Prisma', 'MongoDB', 'Firebase', 'Supabase', 'AI Integration'
          ]).map((tech, i) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded-md border border-slate-300 dark:border-slate-700/60 text-slate-600 dark:text-slate-300/80 hover:border-primary-400/50 hover:text-primary-600 dark:hover:text-primary-300 hover:shadow-sm hover:shadow-primary/10 transition-all duration-300 cursor-default bg-slate-200/60 dark:bg-slate-800/60"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="pb-4 flex items-center justify-between relative z-10">
        <div>
          <div className="w-10 h-px bg-gradient-to-r from-primary-400/40 to-transparent mb-3" />
          <p className="text-[9px] tracking-[0.4em] uppercase text-slate-500 font-bold">
            {p.headline || 'BUILD • SCALE • AUTOMATE'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-500 animate-pulse hover:border-primary-400/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
