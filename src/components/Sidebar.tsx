import { AudioLines, ChevronLeft, Clapperboard, Film, Music4, Sparkles, X } from 'lucide-react';
import type { Domain } from '../store';

export default function Sidebar({
  open,
  setOpen,
  domain,
  setDomain,
  counts,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  domain: Domain;
  setDomain: (d: Domain) => void;
  counts: { video: number; music: number };
}) {
  const items: {
    id: Domain;
    title: string;
    sub: string;
    tag: string;
    Icon: typeof Film;
    accent: string;
    activeBg: string;
    iconBg: string;
  }[] = [
    {
      id: 'video',
      title: 'AI VIDEO PIPELINE',
      sub: 'Storyline → Shots · 8 steps',
      tag: 'ST → SH',
      Icon: Film,
      accent: 'text-indigo-300',
      activeBg: 'bg-indigo-500/15 border-indigo-400/40',
      iconBg: 'from-indigo-500 to-violet-600',
    },
    {
      id: 'music',
      title: 'AI MUSIC VIDEO PIPELINE',
      sub: 'Song Concept → Music Shots · audience-first',
      tag: 'SG → MS',
      Icon: Music4,
      accent: 'text-amber-300',
      activeBg: 'bg-amber-500/15 border-amber-400/40',
      iconBg: 'from-amber-400 to-orange-600',
    },
  ];

  return (
    <>
      {/* backdrop mobile */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[61] flex w-[264px] flex-col overflow-hidden bg-slate-900 text-slate-200 shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white shadow-lg">
            <Clapperboard size={17} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[13px] font-extrabold tracking-tight text-white">PIPELINE STUDIO</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-slate-500">2 sản phẩm · 1 workspace</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={14} />
          </button>
          <button
            onClick={() => setOpen(false)}
            title="Thu gọn sidebar"
            className="hidden h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:grid"
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* pipeline switch */}
        <div className="flex flex-col gap-2.5 p-3.5">
          <span className="px-1 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-slate-500">Pipeline</span>
          {items.map((itx) => {
            const active = domain === itx.id;
            return (
              <button
                key={itx.id}
                onClick={() => setDomain(itx.id)}
                className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 ${
                  active ? itx.activeBg : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                }`}
              >
                {active && <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${itx.iconBg}`} />}
                <div className="flex items-start gap-2.5">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${itx.iconBg} text-white shadow-md transition-transform duration-300 group-hover:scale-105`}
                  >
                    {itx.id === 'video' ? <Film size={16} strokeWidth={2.2} /> : <AudioLines size={16} strokeWidth={2.2} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display text-[12.5px] font-extrabold leading-tight tracking-tight ${active ? 'text-white' : 'text-slate-300'}`}>
                      {itx.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[10.5px] text-slate-400">{itx.sub}</span>
                    <span className="mt-1.5 flex items-center gap-2">
                      <span className={`rounded bg-black/30 px-1.5 py-0.5 font-mono text-[8.5px] font-bold tracking-widest ${itx.accent}`}>
                        {itx.tag}
                      </span>
                      <span className="font-mono text-[8.5px] text-slate-500">
                        {counts[itx.id]} project
                      </span>
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* note */}
        <div className="mt-auto border-t border-white/10 p-3.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
              <Sparkles size={11} className="text-amber-300" />
              Dùng chung
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-[10.5px] leading-snug text-slate-400">
              <li>• Tài khoản & phân quyền (Admin / L3 / L2 / L1)</li>
              <li>• Review queue hybrid + two-person rule</li>
              <li>• Project ID (PRJ-####) cùng workspace</li>
              <li>• Import / Export JSON · Excel</li>
            </ul>
          </div>
          <p className="mt-3 px-1 font-mono text-[8.5px] uppercase tracking-[0.2em] text-slate-600">
            phím tắt: [ để đóng / mở
          </p>
        </div>
      </aside>
    </>
  );
}
