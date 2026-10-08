import { useMemo } from 'react';
import { ArrowDown, BookOpen, Boxes, ChevronRight, FileText, Film, Infinity as InfinityIcon, Layers, MapPin, Mic2, PenSquare, UserRound, Video } from 'lucide-react';
import { useStore } from '../store';
import { stepTheme } from '../theme';
import { Reveal, useCountUp } from '../hooks/useReveal';

const stepIcon: Record<string, typeof Film> = {
  ST: Film, WB: BookOpen, CH: UserRound, LC: MapPin,
  TR: FileText, VO: Mic2, SC: Layers, SH: Video,
};

function Stat({ value, label }: { value: number; label: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="text-center sm:text-left">
      <span ref={ref} className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-slate-900 sm:text-4xl">
        {val}
      </span>
      <span className="block pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</span>
    </div>
  );
}

export default function Hero() {
  const { data } = useStore();
  const s = useMemo(() => {
    const flat = data.flatMap((d) => d.categories);
    return {
      steps: data.length,
      categories: flat.length,
      items: flat.reduce((a, c) => a + c.items.length, 0),
      combobox: flat.filter((c) => c.control === 'combobox').length,
      checkbox: flat.filter((c) => c.control === 'checkbox').length,
      customCats: flat.filter((c) => c.custom).length,
      customItems: flat.reduce((a, c) => a + c.items.filter((i) => i.custom).length, 0),
    };
  }, [data]);

  return (
    <section id="overview" className="relative scroll-mt-24 pt-32 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 shadow-sm shadow-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-indigo-600">
              Bước 1 · Phân tích hệ thống — v1.1 hệ thống mở
            </span>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <Reveal delay={80}>
              <h1 className="font-display text-[13.5vw] font-black leading-[0.94] tracking-tighter text-slate-900 sm:text-7xl lg:text-[5.4rem]">
                AI VIDEO
                <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  PIPELINE
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-base">
                Kiến trúc dữ liệu cho trạm sản xuất video AI:{' '}
                <span className="font-semibold text-slate-700">8 bước</span> ·{' '}
                <span className="font-semibold text-emerald-600">hệ thống mở</span> — built-in khóa, custom tự thêm/sửa/xóa ·
                combobox <span className="font-semibold text-slate-700">không giới hạn gợi ý</span>. Xong xuôi nhấn{' '}
                <span className="font-semibold text-slate-700">Bước 2 · Production</span> trên menu để dựng prompt ngay.
              </p>
            </Reveal>
            <Reveal delay={230} className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#step-ST"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('step-ST')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-500/30"
              >
                Bắt đầu review
                <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#decisions"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('decisions')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-[13px] font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900"
              >
                Trạng thái 6 quyết định
                <ChevronRight size={15} />
              </a>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:pb-1">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Quy mô dữ liệu</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-emerald-600">
                  {s.customCats + s.customItems > 0 ? `+${s.customCats + s.customItems} custom của bạn` : 'built-in · v1.1'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Stat value={s.steps} label="steps / tabs" />
                <Stat value={s.categories} label="categories" />
                <Stat value={s.items} label="gợi ý items" />
                <Stat value={s.combobox} label="combobox" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------- pipeline map ---------- */}
        <Reveal delay={120} className="mt-14">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Pipeline map</span>
            <div className="flow-line flex-1" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-300">scroll ↓</span>
          </div>
        </Reveal>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {data.map((step, i) => {
            const t = stepTheme[step.code];
            const Icon = stepIcon[step.code];
            const customN = step.categories.filter((c) => c.custom).length;
            return (
              <Reveal key={step.code} delay={i * 60}>
                <a
                  href={`#step-${step.code}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`step-${step.code}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`floaty group relative block rounded-xl border ${t.border} bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}
                  style={{ '--d': `${i * 0.55}s` } as React.CSSProperties}
                >
                  {customN > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 font-mono text-[9px] font-bold text-white shadow">
                      +{customN}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${t.grad} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={15} strokeWidth={2.2} />
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-300 group-hover:text-slate-400">
                      0{step.no}
                    </span>
                  </div>
                  <div className="mt-3 font-mono text-[10px] font-bold tracking-widest text-slate-400">{step.code}-###</div>
                  <div className="mt-0.5 truncate font-display text-[13px] font-bold tracking-tight text-slate-800">
                    {step.title}
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <Boxes size={11} className={t.textSoft} />
                    <span className={`font-mono text-[10px] font-semibold ${t.text}`}>
                      {step.categories.length} categories
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={100} className="mt-6 pb-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-dashed border-slate-300 bg-white/50 px-4 py-3">
            <span className="flex items-center gap-2 font-mono text-[10.5px] text-slate-500">
              <InfinityIcon size={12} className="text-indigo-500" />
              Combobox: <b className="text-slate-700">3 gợi ý trở lên · không giới hạn</b> ({s.combobox})
            </span>
            <span className="flex items-center gap-2 font-mono text-[10.5px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Checkbox: đúng <b className="text-slate-700">2</b> lựa chọn ({s.checkbox} category)
            </span>
            <span className="flex items-center gap-2 font-mono text-[10.5px] text-slate-500">
              <PenSquare size={12} className="text-emerald-500" />
              Custom: thêm/sửa/xóa tự do · Built-in: <b className="text-slate-700">khóa chống xóa</b>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
