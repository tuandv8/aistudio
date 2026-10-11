import { useMemo, useState } from 'react';
import {
  AudioLines, Baby, Briefcase, Check, ChevronDown, Compass, Copy, Flame, GraduationCap,
  History, Rocket, Route, ShieldAlert, Sparkles, Star, Users, Wand2,
} from 'lucide-react';
import type { PipelineStep } from '../data/pipeline';
import { musicPipeline } from '../data/musicPipeline';
import { audiences, audienceById, resolveRecs, type AudiencePath } from '../data/audiences';
import { themeOf } from '../theme';
import { useStore } from '../store';
import { useAuth } from '../auth';

const audIcon: Record<string, typeof Baby> = {
  'kids-0-6': Baby,
  'kids-7-12': GraduationCap,
  family: Users,
  edu: Compass,
  teens: Flame,
  'young-adults': Rocket,
  adults: Briefcase,
  nostalgia: History,
};

/* ---------------- category row (read-only browse + gợi ý theo đối tượng) ---------------- */
function MusicCatRow({
  step,
  catId,
  open,
  onToggle,
  recs,
}: {
  step: PipelineStep;
  catId: string;
  open: boolean;
  onToggle: () => void;
  recs: Record<string, number[]>;
}) {
  const cat = step.categories.find((c) => c.id === catId)!;
  const t = themeOf(step.code);
  const rec = recs[cat.id] ?? [];

  return (
    <div className={`border-t border-white/10 transition-colors ${open ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-2.5 text-left">
        <span className={`hidden font-mono text-[10px] font-bold tracking-wider ${open ? t.textSoft : 'text-slate-600'} sm:block`}>
          {cat.id}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-[13px] font-bold tracking-tight text-white">{cat.en}</span>
            <span className="truncate text-[11px] text-slate-500">{cat.vi}</span>
            {cat.required && <span className="rounded bg-white/10 px-1.5 py-px font-mono text-[8px] font-bold uppercase tracking-widest text-slate-300">key</span>}
            {rec.length > 0 && (
              <span className="flex items-center gap-1 rounded bg-amber-400/15 px-1.5 py-px font-mono text-[8px] font-bold uppercase tracking-widest text-amber-300">
                <Star size={8} className="fill-amber-300" /> gợi ý
              </span>
            )}
          </span>
          {!open && (
            <span className="mt-0.5 block truncate text-[10.5px] text-slate-500">
              {(rec.length ? rec.map((i) => cat.items[i]?.en).filter(Boolean) : cat.items.slice(0, 5).map((i) => i.en)).join('  ·  ')}
              {cat.items.length > 5 && <span className={`ml-1 ${t.text}`}>+{cat.items.length - 5}</span>}
            </span>
          )}
        </span>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
          {cat.control === 'checkbox' ? 'checkbox' : cat.control === 'multi' ? `multi · ${cat.items.length}` : `${cat.items.length}`}
        </span>
        <ChevronDown size={15} className={`shrink-0 text-slate-600 transition-transform duration-300 ${open ? `rotate-180 ${t.text}` : ''}`} />
      </button>
      <div className={`acc ${open ? 'open' : ''}`}>
        <div>
          <div className="px-4 pb-3.5 sm:pl-12">
            {cat.note && <p className="mb-2 text-[11px] italic text-slate-500">{cat.note}</p>}
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item, i) => {
                const isRec = rec.includes(i);
                return (
                  <span
                    key={`${item.en}-${i}`}
                    className={`chip inline-flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1.5 ${
                      isRec ? 'border-amber-400/60 bg-amber-400/15' : 'border-white/10 bg-white/[0.04]'
                    }`}
                    style={{ '--i': Math.min(i, 30) } as React.CSSProperties}
                  >
                    {isRec && <Star size={9} className="self-center fill-amber-300 text-amber-300" />}
                    <span className={`text-[11.5px] font-semibold leading-none ${isRec ? 'text-amber-100' : 'text-slate-200'}`}>{item.en}</span>
                    {item.vi && <span className="text-[10px] leading-none text-slate-500">{item.vi}</span>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MusicBlueprint({ onGoDevelop }: { onGoDevelop: () => void }) {
  const store = useStore();
  const { perms } = useAuth();
  const [audId, setAudId] = useState<string>('kids-0-6'); // trẻ em mặc định — ưu tiên số 1
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const aud: AudiencePath = audienceById(audId) ?? audiences[0];
  const recs = useMemo(() => resolveRecs(aud, musicPipeline), [aud]);
  const recCount = Object.keys(recs).length;

  const musicProjects = store.projects.filter((p) => p.domain === 'music');
  const activeMusic = musicProjects.find((p) => p.pid === store.activePid) ?? musicProjects[0];

  const applyPath = () => {
    if (!perms.manageProjects) return;
    if (activeMusic) {
      store.openProject(activeMusic.pid);
      store.setAudience(activeMusic.pid, aud.id);
    } else {
      const pid = store.createProject(`${aud.vi} · MV Project`, 'music');
      store.setAudience(pid, aud.id);
    }
    onGoDevelop();
  };

  const copyPath = async () => {
    const text = [
      `# AUDIENCE PATHWAY — ${aud.en} (${aud.vi}, ${aud.age}) · priority #${aud.priority}`,
      `Positioning: ${aud.headline}`,
      `Tone: ${aud.tone}`,
      '',
      '## PATHWAY',
      ...aud.pathway.map((p, i) => `${i + 1}. ${p}`),
      '',
      '## GUARDRAILS',
      ...aud.guardrails.map((g) => `- ${g}`),
      '',
      '## RECOMMENDED SELECTIONS',
      ...musicPipeline.flatMap((s) =>
        s.categories
          .filter((c) => recs[c.id]?.length)
          .map((c) => `- [${s.code}] ${c.en}: ${recs[c.id].map((i) => c.items[i].en).join(' + ')}`),
      ),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-screen pt-14">
      {/* ============ STAGE HEADER ============ */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-24 top-[-30%] h-[380px] w-[380px] rounded-full bg-amber-500/20 blur-[110px]" />
          <div className="absolute right-[-10%] top-[10%] h-[320px] w-[320px] rounded-full bg-teal-500/20 blur-[110px]" />
          <div className="absolute bottom-[-40%] left-1/3 h-[300px] w-[500px] rounded-full bg-rose-500/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.26em] text-amber-300">
              <AudioLines size={12} /> pipeline 02 · audience-first
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.2em] text-slate-400">
              8 steps · SG → MS
            </span>
          </div>
          <h1 className="mt-5 font-display text-[11vw] font-black leading-[0.92] tracking-tighter text-white sm:text-6xl lg:text-[4.6rem]">
            AI MUSIC VIDEO
            <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">PIPELINE</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-400">
            Cùng concept với AI Video Pipeline nhưng dành riêng cho video âm nhạc: từ ý tưởng ca khúc, thế giới âm thanh,
            nghệ sĩ, sân khấu, ca từ, giọng hát, sequence theo đoạn nhạc đến từng shot đồng bộ phách.
            <span className="ml-1 font-semibold text-amber-300">
              Chọn ĐỐI TƯỢNG XEM – NGHE trước, hệ thống sẽ dựng lối đi và gợi ý cho toàn bộ 8 step.
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              [musicPipeline.length, 'steps'],
              [musicPipeline.reduce((a, s) => a + s.categories.length, 0), 'categories'],
              [musicPipeline.reduce((a, s) => a + s.categories.reduce((b, c) => b + c.items.length, 0), 0), 'gợi ý'],
              [audiences.length, 'đối tượng'],
            ].map(([v, l]) => (
              <div key={String(l)}>
                <span className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-white">{v}</span>
                <span className="block pt-0.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-slate-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* ============ AUDIENCE SELECTOR ============ */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-amber-600">Bước 0 · bắt buộc</span>
              <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Chọn đối tượng xem – nghe
              </h2>
              <p className="mt-1 text-[12.5px] text-slate-500">
                Trẻ em được đặt <b className="text-amber-600">ưu tiên hàng đầu</b> — mỗi đối tượng mở ra một lối đi, ranh giới an toàn và bộ gợi ý riêng.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-mono text-[10px] text-slate-500 shadow-sm">
              đang chọn: <b className="text-slate-800">{aud.vi}</b>
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a, i) => {
              const Icon = audIcon[a.id] ?? Sparkles;
              const active = a.id === audId;
              const isKid = a.priority <= 2;
              return (
                <button
                  key={a.id}
                  onClick={() => setAudId(a.id)}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                    active
                      ? `${a.color.chip} border-transparent shadow-lg ring-2 ${a.color.ring}`
                      : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
                  } ${isKid && !active ? 'border-amber-200' : ''}`}
                >
                  {a.badge && (
                    <span className={`absolute right-0 top-0 rounded-bl-xl px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-widest ${active ? 'bg-slate-900 text-amber-300' : 'bg-amber-500 text-white'}`}>
                      {a.badge}
                    </span>
                  )}
                  <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${a.color.grad} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span className="mt-3 block font-display text-[14px] font-extrabold tracking-tight text-slate-900">{a.vi}</span>
                  <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-widest text-slate-400">
                    #{a.priority} · {a.en} · {a.age}
                  </span>
                  <span className="mt-2 block text-[11.5px] leading-snug text-slate-500">{a.headline}</span>
                  {active && (
                    <span className="mt-2.5 flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-700">
                      <Check size={11} strokeWidth={3.5} /> đang áp dụng lối đi
                    </span>
                  )}
                  {i === 0 && !active && (
                    <span className="mt-2.5 flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-widest text-amber-500">
                      <Star size={10} className="fill-amber-400 text-amber-400" /> mặc định hệ thống
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ============ PATHWAY ============ */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className={`flex flex-wrap items-center gap-3 border-b border-slate-100 bg-gradient-to-r ${aud.color.grad} px-5 py-4`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur">
              <Route size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9.5px] font-bold uppercase tracking-[0.26em] text-white/70">
                Lối đi · pathway cho {aud.vi}
              </p>
              <h3 className="truncate font-display text-[17px] font-extrabold tracking-tight text-white">{aud.headline}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyPath}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 text-[11.5px] font-bold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Đã copy' : 'Copy lối đi'}
              </button>
              <button
                onClick={applyPath}
                disabled={!perms.manageProjects}
                title={perms.manageProjects ? 'Lưu đối tượng vào project music và mở Develop' : 'Cần L2 trở lên'}
                className="flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-[11.5px] font-bold text-slate-900 shadow-md transition-all enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Wand2 size={13} />
                Áp dụng & mở Develop
              </button>
            </div>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-slate-600">
                <Sparkles size={14} className={`mt-0.5 shrink-0 ${aud.color.text}`} />
                <span><b className="text-slate-800">Tinh thần:</b> {aud.tone}</span>
              </p>
              <h4 className="mt-4 flex items-center gap-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.24em] text-slate-400">
                <Route size={12} /> các bước dẫn dắt ({aud.pathway.length})
              </h4>
              <ol className="mt-2.5 flex flex-col gap-2">
                {aud.pathway.map((p, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all hover:border-slate-300 hover:shadow-sm">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${aud.color.grad} font-mono text-[10px] font-bold text-white`}>
                      {i + 1}
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-slate-600">{p}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                <h4 className="flex items-center gap-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.24em] text-rose-600">
                  <ShieldAlert size={12} /> ranh giới an toàn ({aud.guardrails.length})
                </h4>
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {aud.guardrails.map((g, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-rose-900/80">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <h4 className="flex items-center gap-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.24em] text-amber-700">
                  <Star size={12} className="fill-amber-500 text-amber-500" /> gợi ý đã khớp: {recCount} category
                </h4>
                <p className="mt-2 text-[11.5px] leading-relaxed text-amber-900/75">
                  Các item được đánh ★ trong 8 step bên dưới là lựa chọn khuyến nghị cho đối tượng này.
                  Trong Develop, nút <b>“Áp dụng lối đi”</b> sẽ tự điền toàn bộ gợi ý vào line, và nút Random ưu tiên giữ chúng.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {musicPipeline.map((s) => {
                    const n = s.categories.filter((c) => recs[c.id]?.length).length;
                    const t = themeOf(s.code);
                    return (
                      <span key={s.code} className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-bold ${n ? `${t.border} ${t.bgSoft} ${t.text}` : 'border-slate-200 bg-white text-slate-300'}`}>
                        {s.code} {n ? `★${n}` : '—'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 8 STEPS ============ */}
        <section className="mt-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">8 step · category & gợi ý</span>
            <div className="flow-line flex-1" />
            <span className="font-mono text-[9.5px] text-slate-400">★ = khuyến nghị cho {aud.vi}</span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {musicPipeline.map((step) => {
              const t = themeOf(step.code);
              return (
                <article key={step.code} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
                  <header className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-5">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.grad} font-mono text-[11px] font-bold text-white shadow-lg`}>
                      0{step.no}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[15px] font-extrabold tracking-tight text-white">
                        {step.title}
                        <span className="ml-2 text-[12px] font-semibold text-slate-500">{step.titleVi}</span>
                      </h3>
                      <p className="mt-0.5 truncate text-[11.5px] text-slate-500">{step.purpose}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-right">
                        <span className={`font-display text-xl font-extrabold tabular-nums ${t.text}`}>{step.categories.length}</span>
                        <span className="block font-mono text-[8.5px] uppercase tracking-widest text-slate-600">cats</span>
                      </span>
                      <span className="text-right">
                        <span className="font-display text-xl font-extrabold tabular-nums text-slate-600">
                          {step.categories.reduce((a, c) => a + c.items.length, 0)}
                        </span>
                        <span className="block font-mono text-[8.5px] uppercase tracking-widest text-slate-600">items</span>
                      </span>
                    </div>
                  </header>
                  <div>
                    {step.categories.map((c) => (
                      <MusicCatRow
                        key={c.id}
                        step={step}
                        catId={c.id}
                        open={openCat === c.id}
                        onToggle={() => setOpenCat((cur) => (cur === c.id ? null : c.id))}
                        recs={recs}
                      />
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <button
            onClick={applyPath}
            disabled={!perms.manageProjects}
            className="sheen relative flex h-12 items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-7 text-[13.5px] font-bold text-white shadow-xl shadow-orange-500/25 transition-all enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <AudioLines size={16} />
            Bắt đầu sản xuất với lối đi “{aud.vi}”
          </button>
        </div>
      </div>
    </div>
  );
}
