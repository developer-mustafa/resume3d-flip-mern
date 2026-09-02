import useBookStore from '../../stores/bookStore';
import { Heart } from 'lucide-react';

export default function BackCoverPage() {
  const { profile } = useBookStore();
  const p = profile || {};

  return (
    <div className="h-full flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-[#1e293b] dark:to-[#0f172a] border-r-[12px] border-r-slate-300 dark:border-r-[#0a0f1d] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_-10px_0_20px_rgba(0,0,0,0.6)]">
      {/* Book Binding/Spine Effect */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/5 dark:from-white/10 via-transparent to-transparent pointer-events-none z-30" />
      <div className="absolute right-2 top-0 bottom-0 w-[1px] bg-black/5 dark:bg-white/10 pointer-events-none z-30" />
      <div className="absolute right-4 top-0 bottom-0 w-[1px] bg-black/10 dark:bg-black/40 pointer-events-none z-30" />

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 text-center">
        {/* Initials */}
        <div className="w-20 h-20 rounded-2xl mb-8 mx-auto flex items-center justify-center ring-2 ring-primary-400/20 shadow-lg shadow-primary/10 bg-gradient-to-br from-primary/15 to-primary-600/15">
          <span className="text-2xl font-bold text-primary-300/70">
            {(p.name || 'MR').split(' ').map(w => w[0]).join('')}
          </span>
        </div>
        
        <h2 className="text-xl font-black tracking-widest uppercase mb-2 text-slate-800 dark:text-white">
          {p.name || 'Mustafa Rahman'}
        </h2>
        <p className="text-xs text-transparent bg-clip-text font-bold tracking-[0.2em] uppercase mb-8 bg-gradient-to-r from-primary-400 to-primary-300">
          {p.title || 'Full Stack Software Engineer'}
        </p>

        <div className="w-10 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" />
        
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <p className="text-[9px] tracking-[0.4em] uppercase font-semibold">
            Thank you for reading
          </p>
          <Heart className="w-3 h-3 text-rose-400/60" />
        </div>
      </div>
    </div>
  );
}
