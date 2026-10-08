import { useState } from 'react';
import { ArrowUpRight, Box, Check, Plus, ScanFace, Shapes, UserRound } from 'lucide-react';
import type { PipelineStep } from '../data/pipeline';
import { stepTheme } from '../theme';
import { Reveal } from '../hooks/useReveal';
import { useStore } from '../store';
import { useAuth } from '../auth';
import CategoryRow from './CategoryRow';

function AddCatForm({ stepCode }: { stepCode: string }) {
  const store = useStore();
  const { perms } = useAuth();
  const [open, setOpen] = useState(false);
  const [en, setEn] = useState('');
  const [vi, setVi] = useState('');
  const [control, setControl] = useState<'combobox' | 'checkbox'>('combobox');

  const create = () => {
    if (!en.trim()) return;
    store.addCategory(stepCode, { en: en.trim(), vi: vi.trim(), control });
    setEn('');
    setVi('');
    setControl('combobox');
  };

  if (!perms.editData)
    return (
      <div className="border-t border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-center font-mono text-[9.5px] uppercase tracking-widest text-slate-300">
        custom categories chỉ mở cho Level 3 / Admin
      </div>
    );

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 border-t border-dashed border-emerald-300/80 bg-emerald-50/30 px-4 py-3 text-[11.5px] font-bold text-emerald-600 transition-all hover:bg-emerald-50/70"
      >
        <Plus size={13} strokeWidth={2.5} />
        Thêm category của riêng bạn (custom — sửa/xóa được)
      </button>
    );

  return (
    <div className="border-t border-emerald-200 bg-emerald-50/40 px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          autoFocus
          value={en}
          onChange={(e) => setEn(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
          placeholder="Tên category (EN) — ví dụ: Signature Move"
          className="h-9 min-w-52 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-[12.5px] outline-none focus:border-emerald-400"
        />
        <input
          value={vi}
          onChange={(e) => setVi(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
          placeholder="Chú thích VI (tùy chọn)"
          className="h-9 min-w-40 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-[12.5px] outline-none focus:border-emerald-400"
        />
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
          {(['combobox', 'checkbox'] as const).map((ctl) => (
            <button
              key={ctl}
              onClick={() => setControl(ctl)}
              className={`h-9 px-3 font-mono text-[10.5px] font-bold transition-all ${
                control === ctl
                  ? ctl === 'combobox'
                    ? 'bg-violet-600 text-white'
                    : 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {ctl}
            </button>
          ))}
        </div>
        <button
          onClick={create}
          disabled={!en.trim()}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-[12px] font-bold text-white shadow transition-all enabled:hover:bg-emerald-600 disabled:opacity-40"
        >
          <Check size={13} strokeWidth={3} />
          Tạo
        </button>
        <button onClick={() => setOpen(false)} className="h-9 rounded-lg px-2.5 text-[12px] font-semibold text-slate-400 hover:text-slate-600">
          Hủy
        </button>
      </div>
      <p className="mt-2 font-mono text-[9.5px] text-emerald-500/80">
        combobox: thêm item ngay sau khi tạo · checkbox: tự động có Yes / No
      </p>
    </div>
  );
}

export default function StepSection({ step }: { step: PipelineStep }) {
  const t = stepTheme[step.code];
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const form = step.categories.filter((c) => c.group === 'form');
  const portrait = step.categories.filter((c) => c.group === 'portrait');
  const body = step.categories.filter((c) => c.group === 'body');
  const ungrouped = step.categories.filter((c) => !c.group);

  const Row = ({ id }: { id: string }) => {
    const cat = step.categories.find((c) => c.id === id)!;
    return <CategoryRow stepCode={step.code} cat={cat} theme={t} open={openId === cat.id} onToggle={() => toggle(cat.id)} />;
  };

  const GroupLabel = ({ icon: Icon, vi }: { icon: typeof ScanFace; vi: string }) => (
    <div className="flex items-center gap-2 border-t border-slate-200/90 bg-slate-50/70 px-4 py-1.5 sm:px-5">
      <Icon size={11} className={t.textSoft} />
      <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.28em] ${t.textSoft}`}>{vi}</span>
    </div>
  );

  return (
    <section id={`step-${step.code}`} className="relative scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* ---------- step header ---------- */}
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${t.grad}`} />
            <span className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[8.5rem] font-black leading-none tracking-tighter text-slate-900/[0.045] sm:text-[11rem]">
              {String(step.no).padStart(2, '0')}
            </span>
            <div className="relative grid gap-5 p-5 sm:p-7 lg:grid-cols-[auto_1fr_auto] lg:gap-8">
              <div className="flex items-start gap-4">
                <span className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gradient-to-br ${t.grad} text-white shadow-lg`}>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest opacity-80">step</span>
                  <span className="font-display text-xl font-extrabold leading-none">0{step.no}</span>
                </span>
                <div className="pt-0.5">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{step.title}</h2>
                  <p className="pt-0.5 text-[13px] font-semibold text-slate-400">{step.titleVi}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">id format: {step.code}-###</p>
                </div>
              </div>

              <div className="max-w-2xl lg:border-l lg:border-slate-100 lg:pl-8">
                <p className="text-[13.5px] leading-relaxed text-slate-500">{step.purpose}</p>
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-500">
                  <ArrowUpRight size={13} className={`mt-0.5 shrink-0 ${t.text}`} />
                  <span>
                    <b className="font-semibold text-slate-700">Đầu ra:</b> {step.output}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:justify-center">
                <div className="text-right">
                  <span className={`font-display text-4xl font-extrabold tabular-nums tracking-tight ${t.text}`}>
                    {step.categories.length}
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-slate-400">categories</span>
                </div>
                <div className="text-right">
                  <span className="font-display text-4xl font-extrabold tabular-nums tracking-tight text-slate-300">
                    {step.categories.reduce((a, c) => a + c.items.length, 0)}
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-slate-400">gợi ý</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------- gridlines ---------- */}
        <Reveal delay={90}>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200/90 bg-white px-4 py-2.5 sm:px-5">
              <Box size={12} className="text-slate-400" />
              <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Gridlines — mở để xem gợi ý · lock = built-in · ● = custom
              </span>
              <span className="ml-auto hidden font-mono text-[9.5px] text-slate-300 sm:block">{step.categories.length} rows</span>
            </div>

            <div>
              {step.code === 'CH' ? (
                <>
                  <GroupLabel icon={Shapes} vi="Reference form — form bắt buộc" />
                  {form.map((c) => (
                    <Row key={c.id} id={c.id} />
                  ))}
                  <GroupLabel icon={ScanFace} vi="Portrait — khuôn mặt" />
                  {portrait.map((c) => (
                    <Row key={c.id} id={c.id} />
                  ))}
                  <GroupLabel icon={UserRound} vi="Body — dáng & trang phục" />
                  {body.map((c) => (
                    <Row key={c.id} id={c.id} />
                  ))}
                  {ungrouped.length > 0 && <GroupLabel icon={Plus} vi="Custom — category bạn thêm" />}
                  {ungrouped.map((c) => (
                    <Row key={c.id} id={c.id} />
                  ))}
                </>
              ) : (
                step.categories.map((c) => <Row key={c.id} id={c.id} />)
              )}
            </div>

            <AddCatForm stepCode={step.code} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
