import useBookStore from '../../stores/bookStore';
import { Heart } from 'lucide-react';

export default function BackCoverPage() {
  const { profile } = useBookStore();
  const p = profile || {};

  return (
    <div className="h-full flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-r-[12px] border-r-[#0a0f1d] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.6)]">
      {/* Book Binding/Spine Effect */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/10 via-transparent to-transparent pointer-events-none z-30" />
      <div className="absolute right-2 top-0 bottom-0 w-[1px] bg-white/10 pointer-events-none z-30" />
      <div className="absolute right-4 top-0 bottom-0 w-[1px] bg-black/40 pointer-events-none z-30" />

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 text-center">
        {/* Initials */}
        <div className="w-20 h-20 rounded-2xl mb-8 mx-auto flex items-center justify-center ring-2 ring-blue-400/20 shadow-lg shadow-blue-500/10"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))' }}>
          <span className="text-2xl font-bold text-blue-300/70">
            {(p.name || 'MR').split(' ').map(w => w[0]).join('')}
          </span>
        </div>
        
        <h2 className="text-xl font-black tracking-widest uppercase mb-2 text-white">
          {p.name || 'Mustafa Rahman'}
        </h2>
        <p className="text-xs text-transparent bg-clip-text font-bold tracking-[0.2em] uppercase mb-8" style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #34d399)' }}>
          {p.title || 'Full Stack Software Engineer'}
        </p>

        <div className="w-10 h-px mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)' }} />
        
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
