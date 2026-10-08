import { ArrowRight, Clapperboard, Wand2 } from 'lucide-react';

export default function Footer({ onOpenDevelop }: { onOpenDevelop: () => void }) {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md">
              <Clapperboard size={18} strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-display text-[15px] font-extrabold tracking-tight text-slate-900">
                AI VIDEO PIPELINE — v1.1 open system
              </p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-slate-400">
                Bước 1 phân tích · Bước 2 production · autosaved
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDevelop}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <Wand2 size={18} className="shrink-0 text-indigo-500" />
            <span className="text-[12.5px] leading-snug text-slate-600">
              Sẵn sàng tạo prompt thật — <b className="text-slate-900">mở Develop</b>, tick category, random, GEN.
            </span>
            <ArrowRight size={16} className="shrink-0 text-indigo-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
