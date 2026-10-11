import { useEffect, useState } from 'react';
import { AudioLines, BookMarked, Clapperboard, Film, FlaskConical, Lock, LogOut, Music4, PanelLeft, Rocket } from 'lucide-react';
import { useStore, type Domain } from '../store';
import { roleMeta, useAuth } from '../auth';
import { stepTheme } from '../theme';

export default function Navbar({
  view,
  setView,
  domain,
  onToggleSidebar,
}: {
  view: 'blueprint' | 'develop' | 'production';
  setView: (v: 'blueprint' | 'develop' | 'production') => void;
  domain: Domain;
  onToggleSidebar: () => void;
}) {
  const { data } = useStore();
  const { user, perms, logout } = useAuth();
  const [active, setActive] = useState('overview');
  const [progress, setProgress] = useState(0);
  const music = domain === 'music';

  useEffect(() => {
    if (view !== 'blueprint' || music) return;
    const ids = ['overview', ...data.map((s) => `step-${s.code}`), 'decisions'];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-38% 0px -56% 0px' },
    );
    ids.forEach((id) => document.getElementById(id) && io.observe(document.getElementById(id)!));
    const onScroll = () => {
      const h = document.documentElement;
      setProgress(h.scrollHeight - h.clientHeight > 0 ? (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [view, data, music]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-2.5 px-4 sm:px-6">
        {/* sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          title="Ẩn / hiện sidebar (phím [)"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:text-slate-800"
        >
          <PanelLeft size={15} />
        </button>

        {/* logo + domain */}
        <a href="#overview" onClick={(e) => { e.preventDefault(); setView('blueprint'); }} className="flex shrink-0 items-center gap-2.5">
          <span
            className={`grid h-8 w-8 place-items-center rounded-lg text-white shadow-md ${
              music ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/25' : 'bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-600/25'
            }`}
          >
            {music ? <Music4 size={16} strokeWidth={2.2} /> : <Clapperboard size={16} strokeWidth={2.2} />}
          </span>
          <span className="hidden font-display sm:block">
            <span className="block text-[12.5px] font-bold leading-none tracking-tight text-slate-900">
              {music ? 'AI MUSIC VIDEO PIPELINE' : 'AI VIDEO PIPELINE'}
            </span>
            <span className={`block pt-1 font-mono text-[9px] uppercase tracking-[0.22em] ${music ? 'text-amber-600' : 'text-indigo-500'}`}>
              {music ? 'SG → MS · audience-first' : 'ST → SH · v1.1 open system'}
            </span>
          </span>
        </a>

        {/* ---------- MAIN MENU ---------- */}
        <nav className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1">
          <button
            onClick={() => perms.blueprint && setView('blueprint')}
            disabled={!perms.blueprint}
            title={perms.blueprint ? 'Bước 1 · Phân tích hệ thống' : 'Cần Level 3 hoặc Admin để vào Bước 1'}
            className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-bold transition-all ${
              !perms.blueprint
                ? 'cursor-not-allowed text-slate-300'
                : view === 'blueprint'
                  ? music
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {perms.blueprint ? <BookMarked size={13} /> : <Lock size={12} />}
            <span className="hidden sm:inline">Bước 1 · Phân tích</span>
            <span className="sm:hidden">B1</span>
          </button>
          <button
            onClick={() => setView('develop')}
            className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-bold transition-all ${
              view === 'develop' ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FlaskConical size={13} />
            <span className="hidden sm:inline">Bước 2 · Develop</span>
            <span className="sm:hidden">B2</span>
          </button>
          <button
            onClick={() => setView('production')}
            className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-bold transition-all ${
              view === 'production' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Rocket size={13} />
            <span className="hidden sm:inline">Bước 3 · Production</span>
            <span className="sm:hidden">B3</span>
          </button>
        </nav>

        {/* step pills — chỉ ở blueprint video */}
        {view === 'blueprint' && !music && (
          <nav className="scroll-x -mb-px ml-auto hidden items-center gap-1 overflow-x-auto py-2 md:flex">
            {data.map((s) => {
              const t = stepTheme[s.code];
              const isActive = active === `step-${s.code}`;
              const customN = s.categories.filter((c) => c.custom).length;
              return (
                <a
                  key={s.code}
                  href={`#step-${s.code}`}
                  onClick={go(`step-${s.code}`)}
                  className={`spy-pill relative flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10.5px] font-semibold tracking-wide ${
                    isActive ? `${t.border} ${t.bgSoft} ${t.text} shadow-sm` : `border-transparent text-slate-400 ${t.pill} hover:text-slate-600`
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? t.dot : 'bg-slate-300'}`} />
                  {s.no}.{s.code}
                  {customN > 0 && (
                    <span className="grid h-3.5 min-w-3.5 place-items-center rounded-full bg-emerald-500 px-0.5 text-[8px] font-bold text-white">
                      +{customN}
                    </span>
                  )}
                </a>
              );
            })}
            <a
              href="#decisions"
              onClick={go('decisions')}
              className={`spy-pill ml-1 flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-3 font-mono text-[10.5px] font-semibold tracking-wide ${
                active === 'decisions'
                  ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm'
                  : 'border-dashed border-amber-300/80 text-amber-500 hover:border-amber-400 hover:text-amber-600'
              }`}
            >
              REVIEW
            </a>
          </nav>
        )}
        {view === 'blueprint' && music && (
          <span className="ml-auto hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-700 md:flex">
            <AudioLines size={12} />
            audience-first · trẻ em ưu tiên #1
          </span>
        )}
        {view !== 'blueprint' && (
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 md:flex">
            {music ? <Music4 size={12} className="text-amber-500" /> : <Film size={12} className="text-indigo-500" />}
            {music ? 'music pipeline' : 'video pipeline'}
          </span>
        )}

        {/* ---------- user chip ---------- */}
        {user && (
          <div className={`flex shrink-0 items-center gap-2 ${view === 'blueprint' && !music ? 'ml-2' : 'ml-2 md:ml-0'}`}>
            <span
              className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${roleMeta[user.role].avatar} font-mono text-[10px] font-bold text-white shadow`}
              title={`${user.displayName} · ${roleMeta[user.role].label}`}
            >
              {user.initials}
            </span>
            <span className="hidden leading-none xl:block">
              <span className="block text-[11px] font-bold text-slate-800">{user.displayName}</span>
              <span className="mt-1 block font-mono text-[8.5px] font-bold uppercase tracking-widest text-slate-400">
                {roleMeta[user.role].short}
              </span>
            </span>
            <button
              onClick={logout}
              title="Đăng xuất"
              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
        <div
          className={`h-full transition-[width] duration-150 ease-out ${music ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500' : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500'}`}
          style={{ width: view === 'blueprint' && !music ? `${progress}%` : '0%' }}
        />
      </div>
    </header>
  );
}
