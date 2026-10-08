import { useMemo, useState } from 'react';
import { BookMarked, Bot, Check, Copy, Eye, FolderKanban, ListChecks, Lock, Plus, Rocket, Search, Wand2, X } from 'lucide-react';
import type { PipelineStep } from '../data/pipeline';
import { statusMeta, useStore, type Line } from '../store';
import { roleMeta, useAuth } from '../auth';
import { stepTheme } from '../theme';
import LineCard from '../production/LineCard';
import { agents, buildFullProject, genPromptFor, type AgentOpt } from '../production/genPrompt';

export default function DevelopApp({
  goProduction,
  goBlueprintAt,
}: {
  goProduction: () => void;
  goBlueprintAt?: (stepCode?: string) => void;
}) {
  const store = useStore();
  const { user, perms } = useAuth();
  const readOnly = store.isLocked || !perms.editDevelop || !user;
  const canLog = perms.editDevelop || perms.reviewApprove;
  const [tab, setTab] = useState('ST');
  const [gen, setGen] = useState<{ title: string; text: string } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentId, setAgentId] = useState(agents[0].id);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [q, setQ] = useState('');

  const step: PipelineStep = useMemo(
    () => store.data.find((s) => s.code === tab) ?? store.data[0],
    [store.data, tab],
  );
  const lines = store.lines[tab] ?? [];
  const smeta = statusMeta[store.activeProject.status];

  // search theo id / mô tả / #tag — áp dụng mọi user
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return lines;
    return lines.filter((l) => {
      if (query.startsWith('#')) {
        const tags = l.desc.match(/#[^\s#]+/g) ?? [];
        return tags.some((t) => t.toLowerCase().includes(query));
      }
      return `${l.idText} ${l.desc}`.toLowerCase().includes(query);
    });
  }, [lines, q]);

  const genFor = (l: Line) => setGen({ title: `${l.idText} · ${step.title}`, text: genPromptFor(step, l, store.lines) });

  const genLines = (picked: Line[]) => {
    if (!picked.length) return;
    setGen({
      title: `${tab} · ${picked.length}/${lines.length} lines được chọn`,
      text: picked.map((l) => genPromptFor(step, l, store.lines)).join('\n\n' + '─'.repeat(46) + '\n\n'),
    });
    if (canLog) store.logActive(`GEN ${tab} · ${picked.length} line(s)`);
  };

  const openPicker = () => {
    setChecked(new Set(lines.map((l) => l.uid)));
    setPickerOpen(true);
  };

  const runFull = () => {
    const agent = agents.find((a) => a.id === agentId) ?? agents[0];
    const text = buildFullProject({
      projectName: store.activeProject.name,
      data: store.data,
      lines: store.lines,
      agent,
    });
    setGen({ title: `GEN FULL · ${store.activeProject.name} · ${agent.label}`, text });
    if (canLog) store.logActive(`GEN FULL master prompt · agent: ${agent.label}`);
    setAgentOpen(false);
  };

  const copy = async () => {
    if (!gen) return;
    try {
      await navigator.clipboard.writeText(gen.text);
    } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-14">
      {/* ---------- tab bar ---------- */}
      <div className="sticky top-14 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 sm:px-6">
          <div className="scroll-x flex flex-1 items-center gap-1 overflow-x-auto py-2">
            {store.data.map((s) => {
              const t = stepTheme[s.code];
              const active = s.code === tab;
              const n = store.lines[s.code]?.length ?? 0;
              return (
                <button
                  key={s.code}
                  onClick={() => setTab(s.code)}
                  className={`spy-pill flex h-9 shrink-0 items-center gap-2 rounded-xl border px-3 ${
                    active ? `${t.border} ${t.bgSoft} shadow-sm` : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-mono text-[9px] font-bold ${active ? t.textSoft : 'text-slate-300'}`}>
                    {String(s.no).padStart(2, '0')}
                  </span>
                  <span className={`font-display text-[12px] font-bold tracking-tight ${active ? t.text : 'text-slate-400'}`}>{s.code}</span>
                  <span className={`grid h-4 min-w-4 place-items-center rounded-full px-1 font-mono text-[9px] font-bold ${active ? `${t.badge} text-white` : 'bg-slate-100 text-slate-400'}`}>
                    {n}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ---------- cụm project · float right ---------- */}
          <div className="flex shrink-0 items-center gap-2">
            {goBlueprintAt && perms.blueprint && (
              <button
                onClick={() => goBlueprintAt(tab)}
                title="Xem/quản lý category & items của tab này trong Bước 1"
                className="hidden h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11.5px] font-semibold text-slate-500 transition-all hover:border-indigo-300 hover:text-indigo-600 xl:flex"
              >
                <BookMarked size={13} />
                Data {tab} ↩
              </button>
            )}
            <button
              onClick={goProduction}
              title="Mở project tại Production hub"
              className="flex h-9 max-w-56 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
            >
              <FolderKanban size={13} className="shrink-0 text-indigo-500" />
              <span className="truncate text-[12px] font-bold text-slate-800">{store.activeProject.name}</span>
              <span className={`h-2 w-2 shrink-0 rounded-full ${smeta.dot}`} title={smeta.label} />
            </button>
            <button
              onClick={() => setAgentOpen(true)}
              title="GEN FULL — master prompt 8 sections cho AI Agent"
              className="sheen relative flex h-9 items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-3.5 text-[12px] font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
            >
              <Bot size={14} />
              <span className="hidden sm:inline">GEN FULL</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- header ---------- */}
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-6 sm:px-6">
        {store.isLocked && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] font-semibold text-emerald-700">
            <Lock size={13} />
            Project đã FINALIZE — chế độ chỉ đọc. Muốn chỉnh sửa hãy nhân bản project tại Production hub.
          </div>
        )}
        {!store.isLocked && !perms.editDevelop && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-[12px] font-semibold text-slate-500">
            <Eye size={13} />
            Chế độ chỉ xem (<b className="text-slate-700">{user ? roleMeta[user.role].label : ''}</b>) — bạn có thể GEN/copy output, nhưng không chỉnh lines. {perms.reviewApprove ? 'Bạn được phép review & approve ở Production hub.' : ''}
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
              <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-sm ${stepTheme[step.code].dot}`} />
              {tab}. {step.title}
              <span className="ml-2 text-base font-semibold text-slate-400">{step.titleVi}</span>
            </h2>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate-400">
              {lines.length} lines · Develop mode · tick category → chọn gợi ý → Random / GEN
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* search áp dụng mọi user — lọc theo id / mô tả / #tag */}
            <label className="relative flex items-center">
              <Search size={13} className="pointer-events-none absolute left-3 text-slate-300" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Tìm trong ${tab}… (vd: #tag, LC-001)`}
                className="h-9 w-48 rounded-full border border-slate-200 bg-white pl-8 pr-8 text-[12px] text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:w-56 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {q && (
                <span className="pointer-events-none absolute right-2.5 font-mono text-[9px] font-bold text-indigo-500">
                  {filtered.length}/{lines.length}
                </span>
              )}
            </label>
            <button
              onClick={() => store.addLine(tab)}
              disabled={readOnly}
              className="flex h-9 items-center gap-1.5 rounded-full bg-slate-900 px-4 text-[12px] font-bold text-white shadow-md transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={14} strokeWidth={2.5} />
              Thêm line
            </button>
            <button
              onClick={openPicker}
              disabled={!lines.length}
              className="flex h-9 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 text-[12px] font-bold text-slate-700 shadow-sm transition-all enabled:hover:-translate-y-0.5 enabled:hover:border-indigo-400 enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ListChecks size={14} />
              GEN {tab}
            </button>
            <button
              onClick={goProduction}
              className="flex h-9 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 text-[12px] font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400"
            >
              <Rocket size={14} />
              Go to Production
            </button>
          </div>
        </div>

        {/* ---------- lines ---------- */}
        <div className="mt-5 flex flex-col gap-4">
          {lines.length > 0 && filtered.length === 0 && (
            <div className="grid place-items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center">
              <Search size={20} className="text-slate-300" />
              <span className="text-[13px] font-semibold text-slate-400">
                Không tìm thấy line nào khớp “{q}” ở tab {tab}
              </span>
            </div>
          )}
          {lines.length === 0 && (
            <button
              onClick={() => store.addLine(tab)}
              disabled={readOnly}
              className="group grid place-items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center transition-all enabled:hover:border-indigo-300 enabled:hover:bg-indigo-50/40 disabled:cursor-not-allowed"
            >
              <Plus size={22} className="text-slate-300 transition-colors group-hover:text-indigo-400" />
              <span className="text-[13px] font-semibold text-slate-400 group-hover:text-indigo-500">
                Chưa có line nào ở tab {tab}
                {readOnly ? ' — chế độ chỉ xem' : ' — nhấn để tạo line đầu tiên'}
              </span>
            </button>
          )}
          {filtered.map((l) => (
            <LineCard key={l.uid} step={step} line={l} readOnly={readOnly} onGen={() => genFor(l)} />
          ))}
          {lines.length > 0 && !readOnly && !q && (
            <button
              onClick={() => store.addLine(tab)}
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 text-[12px] font-bold text-slate-400 transition-all hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-500"
            >
              <Plus size={14} strokeWidth={2.5} />
              Thêm line mới
            </button>
          )}
        </div>
      </div>

      {/* ---------- LINE PICKER (GEN {tab}) ---------- */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/45 p-4 backdrop-blur-sm" onClick={() => setPickerOpen(false)}>
          <div className="modal-in flex max-h-[86vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
              <ListChecks size={15} className="text-indigo-500" />
              <span className="font-display text-[14px] font-bold text-slate-800">
                GEN {tab} · chọn lines ({checked.size}/{lines.length})
              </span>
              <button onClick={() => setPickerOpen(false)} className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-2">
              <button onClick={() => setChecked(new Set(lines.map((l) => l.uid)))} className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200">
                Check all
              </button>
              <button onClick={() => setChecked(new Set())} className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-100">
                Bỏ chọn hết
              </button>
            </div>
            <div className="scroll-x flex-1 overflow-y-auto p-2">
              {lines.map((l) => {
                const on = checked.has(l.uid);
                return (
                  <button
                    key={l.uid}
                    onClick={() =>
                      setChecked((cur) => {
                        const n = new Set(cur);
                        if (n.has(l.uid)) n.delete(l.uid);
                        else n.add(l.uid);
                        return n;
                      })
                    }
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${on ? 'bg-indigo-50/70' : 'hover:bg-slate-50'}`}
                  >
                    <span className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded ${on ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-transparent'}`} style={{ width: 18, height: 18 }}>
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    <span className={`font-mono text-[11px] font-bold ${on ? 'text-indigo-700' : 'text-slate-500'}`}>{l.idText}</span>
                    <span className="min-w-0 flex-1 truncate text-[11.5px] text-slate-500">{l.desc || '(chưa mô tả)'}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
              <button onClick={() => setPickerOpen(false)} className="h-9 rounded-full px-4 text-[12px] font-semibold text-slate-500 hover:bg-slate-100">
                Hủy
              </button>
              <button
                onClick={() => {
                  genLines(lines.filter((l) => checked.has(l.uid)));
                  setPickerOpen(false);
                }}
                disabled={checked.size === 0}
                className="flex h-9 items-center gap-1.5 rounded-full bg-slate-900 px-4 text-[12px] font-bold text-white transition-all enabled:hover:bg-indigo-600 disabled:opacity-40"
              >
                <Wand2 size={13} />
                GEN {checked.size} lines
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- AGENT CHOOSER (GEN FULL) ---------- */}
      {agentOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/45 p-4 backdrop-blur-sm" onClick={() => setAgentOpen(false)}>
          <div className="modal-in w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
              <Bot size={15} className="text-violet-500" />
              <span className="font-display text-[14px] font-bold text-slate-800">GEN FULL · chọn AI Agent đích</span>
              <button onClick={() => setAgentOpen(false)} className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2 p-4">
              {agents.map((a: AgentOpt) => (
                <button
                  key={a.id}
                  onClick={() => setAgentId(a.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    agentId === a.id ? 'border-violet-400 bg-violet-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${agentId === a.id ? 'border-violet-600 bg-violet-600' : 'border-slate-300'}`}>
                    {agentId === a.id && <Check size={10} strokeWidth={3.5} className="text-white" />}
                  </span>
                  <span>
                    <span className={`block text-[13px] font-bold ${agentId === a.id ? 'text-violet-800' : 'text-slate-700'}`}>{a.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-400">{a.note}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
              <button
                onClick={runFull}
                className="sheen relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-[13px] font-bold text-white shadow-lg"
              >
                <Bot size={15} />
                Tổng hợp master prompt (8 sections)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- GEN modal ---------- */}
      {gen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/45 p-4 backdrop-blur-sm" onClick={() => setGen(null)}>
          <div className="modal-in flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              <Wand2 size={14} className="text-violet-300" />
              <span className="min-w-0 truncate font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">{gen.title}</span>
              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                <button
                  onClick={copy}
                  className="flex h-7 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 font-mono text-[10px] font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? 'Đã copy' : 'Copy prompt'}
                </button>
                <button onClick={() => setGen(null)} className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            </div>
            <pre className="scroll-x flex-1 overflow-auto p-5 font-mono text-[11.5px] leading-[1.8] text-slate-200">
              <code>{gen.text}</code>
            </pre>
            <div className="border-t border-white/10 bg-white/[0.03] px-5 py-2.5">
              <span className="text-[10.5px] text-slate-500">
                Category bị bỏ tick không xuất hiện · GEN FULL gồm 8 sections + consistency lock cho AI Agent.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
