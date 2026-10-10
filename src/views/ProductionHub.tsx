import { useMemo, useState } from 'react';
import {
  ArrowLeft, Check, ChevronRight, Copy, FolderKanban, FlaskConical, History, Inbox, KeyRound,
  Lock, PenLine, Plus, Rocket, Send, ShieldCheck, Trash2, Undo2, Users, Wand2, X,
} from 'lucide-react';
import { statusMeta, useStore, type Project } from '../store';
import { queueStatusMeta, useQueue, type QueueEntry } from '../reviewQueue';
import { roleMeta, useAuth } from '../auth';
import { stepTheme } from '../theme';
import { agents, buildFullProject } from '../production/genPrompt';

const fmt = (at: number) =>
  new Date(at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

/* ---------------- flow 3 chặng của project local ---------------- */
const FLOW = ['draft', 'review', 'final'] as const;
function StatusFlow({ status }: { status: string }) {
  const norm = status === 'approved' ? 'final' : status;
  const idx = Math.max(0, (FLOW as readonly string[]).indexOf(norm));
  return (
    <div className="flex items-center gap-1">
      {FLOW.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={`grid place-items-center rounded-full border text-[8px] font-bold ${
              i <= idx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-slate-300'
            }`}
            style={{ width: 18, height: 18 }}
            title={statusMeta[s].label}
          >
            {i < idx ? <Check size={9} strokeWidth={3.5} /> : i + 1}
          </span>
          {i < FLOW.length - 1 && <span className={`h-px w-4 ${i < idx ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
        </div>
      ))}
      <span className="ml-1 font-mono text-[9px] uppercase tracking-widest text-slate-400">{statusMeta[norm as keyof typeof statusMeta]?.label ?? norm}</span>
    </div>
  );
}

const totalLines = (p: { lines: Record<string, unknown[]> }) =>
  Object.values(p.lines).reduce((a, l) => a + (l?.length ?? 0), 0);

/* ================= PROJECT CARD (workspace cá nhân) ================= */
function ProjectCard({ p, onOpenDevelop }: { p: Project; onOpenDevelop: () => void }) {
  const store = useStore();
  const queue = useQueue();
  const { user, perms } = useAuth();
  const active = store.activePid === p.pid;
  const meta = statusMeta[p.status];
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(p.name);
  const [confirmDel, setConfirmDel] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const canDelete = perms.deleteFinal || (perms.manageProjects && p.status !== 'final');
  const qEntry = queue.latestForProject(p.pid);
  const inQueue = p.status === 'review' && qEntry && (qEntry.status === 'review' || qEntry.status === 'approved');

  const submit = () => {
    if (!user) return;
    queue.submit({
      pid: p.pid,
      projectCode: p.pcode,
      projectName: p.name,
      owner: { username: user.username, displayName: user.displayName, roleLabel: roleMeta[user.role].label },
      data: p.data,
      lines: p.lines,
    });
    store.setProjectStatus(p.pid, 'review', `Submit to review queue — snapshot ${totalLines(p)} lines (visible cho Admin/L3)`);
  };

  const withdraw = () => {
    if (!qEntry) return;
    queue.withdraw(qEntry.qid);
    store.setProjectStatus(p.pid, 'draft', 'Rút submission khỏi review queue');
  };

  const history = showAllHistory ? p.history : p.history.slice(-5);

  return (
    <article className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${active ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
      {active && <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-widest text-white">Active</span>}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow">
            <FolderKanban size={17} />
          </span>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (store.renameProject(p.pid, name.trim() || p.name), setEditing(false))}
                  className="h-8 w-full max-w-56 rounded-lg border border-indigo-300 px-2.5 text-[13px] font-bold outline-none"
                />
                <button onClick={() => { store.renameProject(p.pid, name.trim() || p.name); setEditing(false); }} className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
                  <Check size={13} />
                </button>
              </div>
            ) : (
              <h3 className="flex items-center gap-2 font-display text-[16px] font-extrabold tracking-tight text-slate-900">
                <span
                  className="shrink-0 rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-[9.5px] font-bold tracking-wider text-white"
                  title="Project ID — duy nhất trên toàn hệ thống, không thể đổi"
                >
                  {p.pcode}
                </span>
                <span className="truncate">{p.name}</span>
                {perms.manageProjects && p.status !== 'final' && (
                  <button onClick={() => { setName(p.name); setEditing(true); }} className="text-slate-300 transition-colors hover:text-indigo-500" title="Đổi tên">
                    <PenLine size={12} />
                  </button>
                )}
              </h3>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-widest ${meta.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              {inQueue && qEntry && (
                <span className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-widest text-amber-700">
                  <Send size={9} />
                  queue: {queueStatusMeta[qEntry.status].label}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4"><StatusFlow status={p.status} /></div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {Object.keys(stepTheme).map((code) => {
            const n = p.lines[code]?.length ?? 0;
            if (!n) return null;
            const t = stepTheme[code];
            return (
              <span key={code} className={`rounded-md border ${t.border} ${t.bgSoft} px-1.5 py-0.5 font-mono text-[9px] font-bold ${t.text}`}>
                {code}×{n}
              </span>
            );
          })}
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500">Σ {totalLines(p)} lines</span>
        </div>

        <div className="mt-4 grid gap-1 rounded-xl bg-slate-50 p-3 font-mono text-[10px] text-slate-500">
          <span>Tạo: <b className="text-slate-700">{fmt(p.createdAt)}</b></span>
          <span>Cập nhật: <b className="text-slate-700">{fmt(p.updatedAt)}</b></span>
        </div>

        <div className="mt-3">
          <button onClick={() => setShowAllHistory((v) => !v)} className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500">
            <History size={11} />
            Action log ({p.history.length}) — timestamps
            <ChevronRight size={11} className={`transition-transform ${showAllHistory ? 'rotate-90' : ''}`} />
          </button>
          <div className={`acc ${showAllHistory || p.history.length <= 5 ? 'open' : ''}`}>
            <div>
              <div className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto">
                {history.slice().reverse().map((h, k) => (
                  <div key={k} className="flex items-baseline gap-2 text-[10.5px]">
                    <span className="shrink-0 font-mono text-[9.5px] text-slate-300">{fmt(h.at)}</span>
                    <span className="h-1 w-1 shrink-0 self-center rounded-full bg-indigo-400" />
                    <span className="text-slate-600">{h.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* actions theo quyền v1.5 */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        {perms.submitReview && p.status === 'draft' && (
          <button
            onClick={submit}
            disabled={totalLines(p) === 0}
            title={totalLines(p) === 0 ? 'Project chưa có line nào để submit' : 'Đẩy bản sao read-only vào review queue chung'}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-[11px] font-bold text-white shadow-sm transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={13} />
            Submit to Review
          </button>
        )}
        {inQueue && qEntry && qEntry.ownerName === user?.username && qEntry.status === 'review' && (
          <button onClick={withdraw} className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11px] font-bold text-slate-600 transition-all hover:border-slate-400">
            <Undo2 size={13} />
            Rút khỏi queue
          </button>
        )}
        {perms.finalize && p.status !== 'final' && (
          <button
            onClick={() => store.setProjectStatus(p.pid, 'final', 'Finalize & KHÓA bản trực tiếp (admin) — deploy, không thể sửa')}
            className="sheen relative flex h-8 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 text-[11px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
            title="Admin: khóa & deploy trực tiếp, không cần qua queue"
          >
            <Lock size={13} />
            Finalize & Khóa (direct)
          </button>
        )}
        {p.status === 'final' && (
          <span className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-100 px-3 text-[11px] font-bold text-emerald-700">
            <Lock size={12} />
            Đã deploy — chỉ đọc
          </span>
        )}

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <button
          onClick={onOpenDevelop}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11px] font-bold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600"
        >
          <FlaskConical size={13} />
          {p.status === 'final' ? 'Xem trong Develop' : 'Mở trong Develop'}
        </button>
        {perms.manageProjects && (
          <button onClick={() => store.duplicateProject(p.pid)} title="Nhân bản" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 bg-white text-slate-500 transition-all hover:border-slate-400 hover:text-slate-700">
            <Copy size={13} />
          </button>
        )}
        {canDelete &&
          (confirmDel ? (
            <>
              <button onClick={() => store.deleteProject(p.pid)} className="flex h-8 items-center gap-1 rounded-lg bg-rose-600 px-2.5 text-[11px] font-bold text-white">
                <Trash2 size={12} /> Xóa vĩnh viễn?
              </button>
              <button onClick={() => setConfirmDel(false)} className="h-8 rounded-lg px-2 text-[11px] font-semibold text-slate-400">Hủy</button>
            </>
          ) : (
            <button onClick={() => setConfirmDel(true)} title="Xóa project" className="grid h-8 w-8 place-items-center rounded-lg border border-transparent text-slate-300 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500">
              <Trash2 size={13} />
            </button>
          ))}
      </div>
    </article>
  );
}

/* ================= QUEUE CARD (hàng đợi review chung — thẻ tối) ================= */
function QueueCard({ e, onView, onOpenDevelop }: { e: QueueEntry; onView: () => void; onOpenDevelop: () => void }) {
  const queue = useQueue();
  const { user, perms } = useAuth();
  const qm = queueStatusMeta[e.status];
  const isOwner = user?.username === e.ownerName;
  const canAct = perms.approve && !isOwner;
  const [showLog, setShowLog] = useState(false);

  const by = user ? { username: user.username, displayName: user.displayName } : { username: '?', displayName: '?' };

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 shadow-lg shadow-slate-900/20">
      <div className={`absolute inset-y-0 left-0 w-1.5 ${qm.dot}`} />
      <div className="p-5 pl-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
            <Inbox size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-2 font-display text-[15px] font-extrabold tracking-tight text-white">
              <span className="shrink-0 rounded-md bg-white/15 px-1.5 py-0.5 font-mono text-[9.5px] font-bold tracking-wider text-white" title="Project ID — duy nhất toàn hệ thống">
                {e.projectCode ?? 'PRJ-????'}
              </span>
              <span className="truncate">{e.projectName}</span>
            </h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[9.5px] text-slate-400">
              <span className="flex items-center gap-1"><Users size={10} /> @{e.ownerName} · {e.ownerRole}</span>
              <span>submitted {fmt(e.submittedAt)}</span>
            </p>
          </div>
          <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest ${qm.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${qm.dot}`} />
            {qm.label}
          </span>
        </div>

        {/* snapshot summary */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {Object.keys(e.snapshot.lines).map((code) => {
            const n = e.snapshot.lines[code]?.length ?? 0;
            if (!n) return null;
            return (
              <span key={code} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-300">
                {code}×{n}
              </span>
            );
          })}
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
            Σ {Object.values(e.snapshot.lines).reduce((a, l) => a + (l?.length ?? 0), 0)} lines (snapshot read-only)
          </span>
        </div>

        {/* actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {perms.approve && (
            <>
              <button
                onClick={() => {
                  queue.openPreview(e.qid);
                  onOpenDevelop();
                }}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[11px] font-bold text-slate-900 shadow-md transition-all hover:-translate-y-0.5 hover:bg-amber-300"
                title="Admin/L3: mở snapshot trong Develop — chỉ xem, không sửa"
              >
                <FlaskConical size={13} />
                Mở trong Develop (read-only)
              </button>
              <button
                onClick={onView}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-[11px] font-bold text-slate-200 transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <Wand2 size={13} />
                Xem master prompt
              </button>
            </>
          )}
          {e.status === 'review' && canAct && (
            <>
              <button
                onClick={() => queue.approve(e.qid, by)}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-sky-500 px-3 text-[11px] font-bold text-white shadow-md shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:bg-sky-400"
              >
                <ShieldCheck size={13} />
                Approve
              </button>
              <button
                onClick={() => queue.returnEntry(e.qid, by)}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-[11px] font-bold text-slate-300 transition-all hover:border-rose-400/50 hover:text-rose-300"
              >
                <Undo2 size={13} />
                Trả về draft
              </button>
            </>
          )}
          {e.status === 'review' && perms.approve && isOwner && (
            <span className="flex h-8 items-center gap-1.5 rounded-lg bg-white/5 px-3 text-[10.5px] font-semibold text-slate-400">
              <KeyRound size={12} />
              Two-person rule — bạn là owner, không thể tự approve
            </span>
          )}
          {e.status === 'approved' && perms.finalize && (
            <button
              onClick={() => queue.finalize(e.qid, by)}
              className="sheen relative flex h-8 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 text-[11px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
            >
              <Lock size={13} />
              Finalize & Deploy (admin)
            </button>
          )}
          {e.status === 'approved' && !perms.finalize && (
            <span className="flex h-8 items-center gap-1.5 rounded-lg bg-white/5 px-3 text-[10.5px] font-semibold text-slate-400">
              <Lock size={12} /> Chờ Admin finalize
            </span>
          )}
          {e.status === 'final' && (
            <span className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-400/10 px-3 text-[11px] font-bold text-emerald-300">
              <Rocket size={12} /> Deployed — snapshot đã khóa
            </span>
          )}
          <button onClick={() => setShowLog((v) => !v)} className="ml-auto flex h-8 items-center gap-1.5 rounded-lg px-2 font-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300">
            <History size={12} /> log ({e.history.length})
            <ChevronRight size={11} className={`transition-transform ${showLog ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className={`acc ${showLog ? 'open' : ''}`}>
          <div>
            <div className="mt-3 flex flex-col gap-1 rounded-xl bg-black/25 p-3">
              {e.history.slice().reverse().map((h, k) => (
                <div key={k} className="flex items-baseline gap-2 text-[10.5px]">
                  <span className="shrink-0 font-mono text-[9.5px] text-slate-500">{fmt(h.at)}</span>
                  <span className="h-1 w-1 shrink-0 self-center rounded-full bg-slate-500" />
                  <span className="text-slate-300">{h.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ================= HUB ================= */
export default function ProductionHub({ goDevelop }: { goDevelop: () => void }) {
  const store = useStore();
  const queue = useQueue();
  const { user, perms } = useAuth();
  const [viewEntry, setViewEntry] = useState<QueueEntry | null>(null);

  const sorted = store.projects.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  // Admin/L3 thấy TOÀN BỘ queue kể từ trạng thái review; L2 chỉ thấy submission của mình
  const visibleEntries = useMemo(() => {
    if (perms.approve) return queue.entries.slice().sort((a, b) => b.submittedAt - a.submittedAt);
    if (perms.submitReview && user) return queue.entries.filter((e) => e.ownerName === user.username).sort((a, b) => b.submittedAt - a.submittedAt);
    return [];
  }, [queue.entries, perms.approve, perms.submitReview, user]);

  const masterPrompt = useMemo(() => {
    if (!viewEntry) return '';
    return buildFullProject({
      projectName: viewEntry.projectName,
      data: viewEntry.snapshot.data,
      lines: viewEntry.snapshot.lines,
      agent: agents.find((a) => a.id === 'generic') ?? agents[0],
    });
  }, [viewEntry]);

  return (
    <div className="min-h-screen bg-slate-50/60 pt-14">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-emerald-600">Bước 3 · Production hub</span>
            <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-slate-900">
              Projects <span className="text-slate-300">· hybrid review queue</span>
            </h2>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-slate-500">
              Workspace cá nhân → <b className="text-amber-600">Submit to Review</b> (bản sao read-only vào queue chung, visible cho Admin/L3) →{' '}
              <b className="text-sky-600">Approve</b> (Admin/L3, khác owner) → <b className="text-emerald-600">Finalize & Deploy</b> (chỉ Admin).
            </p>
            {user && (
              <span className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-widest ${roleMeta[user.role].badge}`}>
                  <KeyRound size={11} />
                  {roleMeta[user.role].label}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-500" title="Mỗi account một workspace riêng">
                  <FolderKanban size={11} />
                  workspace: @{user.username}
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goDevelop} className="flex h-9 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 text-[12px] font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400">
              <ArrowLeft size={14} />
              Back to Develop
            </button>
            <button
              onClick={() => store.createProject()}
              disabled={!perms.manageProjects}
              title={perms.manageProjects ? 'Tạo project mới' : 'Cần L2 trở lên'}
              className="sheen relative flex h-9 items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-[12px] font-bold text-white shadow-lg shadow-emerald-500/25 transition-all enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={14} strokeWidth={2.5} />
              Tạo project
            </button>
          </div>
        </div>

        {/* personal projects */}
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {sorted.map((p) => (
            <ProjectCard key={p.pid} p={p} onOpenDevelop={() => { store.openProject(p.pid); goDevelop(); }} />
          ))}
        </div>

        {/* ---------- SHARED REVIEW QUEUE ---------- */}
        {visibleEntries.length > 0 || perms.approve ? (
          <section className="mt-12">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500">
                Shared review queue {perms.approve ? '· toàn bộ submissions' : '· của bạn'}
              </span>
              <div className="flow-line flex-1" />
              <span className="font-mono text-[9.5px] text-slate-400">{visibleEntries.length} entry</span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {visibleEntries.length === 0 && (
                <div className="col-span-full grid place-items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center">
                  <Inbox size={22} className="text-slate-300" />
                  <span className="text-[13px] font-semibold text-slate-400">
                    Queue trống — project sẽ xuất hiện ở đây (visible cho role cao hơn) ngay khi owner bấm Submit to Review.
                  </span>
                </div>
              )}
              {visibleEntries.map((e) => (
                <QueueCard key={e.qid} e={e} onView={() => setViewEntry(e)} onOpenDevelop={goDevelop} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* ---------- snapshot master prompt modal ---------- */}
      {viewEntry && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={() => setViewEntry(null)}>
          <div className="modal-in flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(ev) => ev.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              <Wand2 size={14} className="text-violet-300" />
              <span className="min-w-0 truncate font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
                Snapshot review · {viewEntry.projectName} · @{viewEntry.ownerName}
              </span>
              <button onClick={() => setViewEntry(null)} className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <pre className="scroll-x flex-1 overflow-auto p-5 font-mono text-[11px] leading-[1.8] text-slate-200">
              <code>{masterPrompt}</code>
            </pre>
            <div className="border-t border-white/10 bg-white/[0.03] px-5 py-2.5 text-[10.5px] text-slate-500">
              Master prompt dựng từ snapshot read-only (generic agent) — đúng nội dung sẽ được deploy khi Admin finalize.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
