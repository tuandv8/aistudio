import { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Copy, FolderKanban, FlaskConical, History, KeyRound, Lock, PenLine, Plus, Rocket, ShieldCheck, Trash2 } from 'lucide-react';
import { statusMeta, useStore, type Project, type ProjectStatus } from '../store';
import { roleMeta, useAuth } from '../auth';
import { stepTheme } from '../theme';

const fmt = (at: number) =>
  new Date(at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

const STATUS_FLOW: ProjectStatus[] = ['draft', 'review', 'approved', 'final'];

function StatusFlow({ status }: { status: ProjectStatus }) {
  const idx = STATUS_FLOW.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {STATUS_FLOW.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={`grid h-4.5 w-4.5 place-items-center rounded-full border text-[8px] font-bold ${
              i <= idx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-slate-300'
            }`}
            style={{ width: 18, height: 18 }}
            title={statusMeta[s].label}
          >
            {i < idx ? <Check size={9} strokeWidth={3.5} /> : i === idx ? '●' : i + 1}
          </span>
          {i < STATUS_FLOW.length - 1 && <span className={`h-px w-4 ${i < idx ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
        </div>
      ))}
      <span className="ml-1 font-mono text-[9px] uppercase tracking-widest text-slate-400">{statusMeta[status].label}</span>
    </div>
  );
}

function ProjectCard({ p, onOpenDevelop }: { p: Project; onOpenDevelop: () => void }) {
  const store = useStore();
  const { perms } = useAuth();
  const active = store.activePid === p.pid;
  const meta = statusMeta[p.status];
  const canDelete = perms.deleteFinal || (perms.manageProjects && p.status !== 'final');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(p.name);
  const [confirmDel, setConfirmDel] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const lineCount = (code: string) => p.lines[code]?.length ?? 0;
  const total = Object.values(p.lines).reduce((a, l) => a + l.length, 0);
  const history = showAllHistory ? p.history : p.history.slice(-5);

  return (
    <article className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${active ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
      {active && <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-widest text-white">Active</span>}

      <div className="p-5">
        {/* name + status */}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      store.renameProject(p.pid, name.trim() || p.name);
                      setEditing(false);
                    }
                  }}
                  className="h-8 w-full max-w-56 rounded-lg border border-indigo-300 px-2.5 text-[13px] font-bold outline-none"
                />
                <button
                  onClick={() => {
                    store.renameProject(p.pid, name.trim() || p.name);
                    setEditing(false);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white"
                >
                  <Check size={13} />
                </button>
              </div>
            ) : (
              <h3 className="flex items-center gap-2 font-display text-[16px] font-extrabold tracking-tight text-slate-900">
                <span className="truncate">{p.name}</span>
                {perms.manageProjects && (
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
              <span className="font-mono text-[9.5px] text-slate-400">id: {p.pid}</span>
            </div>
          </div>
        </div>

        {/* flow */}
        <div className="mt-4">
          <StatusFlow status={p.status} />
        </div>

        {/* tab line counters */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {stepTheme &&
            Object.keys(stepTheme).map((code) => {
              const n = lineCount(code);
              if (!n) return null;
              const t = stepTheme[code];
              return (
                <span key={code} className={`rounded-md border ${t.border} ${t.bgSoft} px-1.5 py-0.5 font-mono text-[9px] font-bold ${t.text}`}>
                  {code}×{n}
                </span>
              );
            })}
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500">Σ {total} lines</span>
        </div>

        {/* timestamps */}
        <div className="mt-4 grid gap-1 rounded-xl bg-slate-50 p-3 font-mono text-[10px] text-slate-500">
          <span>Tạo: <b className="text-slate-700">{fmt(p.createdAt)}</b></span>
          <span>Cập nhật: <b className="text-slate-700">{fmt(p.updatedAt)}</b></span>
        </div>

        {/* history */}
        <div className="mt-3">
          <button onClick={() => setShowAllHistory((v) => !v)} className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500">
            <History size={11} />
            Action log ({p.history.length}) — timestamps
            <ChevronRight size={11} className={`transition-transform ${showAllHistory ? 'rotate-90' : ''}`} />
          </button>
          <div className={`acc ${showAllHistory || p.history.length <= 5 ? 'open' : ''}`}>
            <div>
              <div className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto">
                {history
                  .slice()
                  .reverse()
                  .map((h, k) => (
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

      {/* actions — phân quyền theo role */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        {p.status === 'draft' &&
          (perms.reviewApprove ? (
            <button
              onClick={() => store.setProjectStatus(p.pid, 'review', 'Gửi review — chờ approve')}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-[11px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-600"
            >
              <ShieldCheck size={13} />
              Gửi review
            </button>
          ) : (
            <span className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-[11px] font-semibold text-slate-400" title="Cần Level 2 trở lên">
              <KeyRound size={12} />
              Gửi review (L2+)
            </span>
          ))}
        {p.status === 'review' &&
          (perms.reviewApprove ? (
            <>
              <button
                onClick={() => store.setProjectStatus(p.pid, 'approved', 'Approved — chấp thuận, sẵn sàng finalize')}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-sky-600 px-3 text-[11px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-sky-700"
              >
                <Check size={13} strokeWidth={3} />
                Approve
              </button>
              <button
                onClick={() => store.setProjectStatus(p.pid, 'draft', 'Trả về draft để chỉnh tiếp')}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11px] font-bold text-slate-600 transition-all hover:border-slate-400"
              >
                Trả về draft
              </button>
            </>
          ) : (
            <span className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-[11px] font-semibold text-slate-400" title="Cần Level 2 trở lên để approve">
              <KeyRound size={12} />
              Approve (L2+)
            </span>
          ))}
        {p.status === 'approved' &&
          (perms.finalize ? (
            <button
              onClick={() => store.setProjectStatus(p.pid, 'final', 'Finalize & KHÓA bản — deploy, không thể sửa')}
              className="sheen relative flex h-8 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 text-[11px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
            >
              <Lock size={13} />
              Finalize & Khóa
            </button>
          ) : (
            <span className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-[11px] font-semibold text-slate-400" title="Cần Level 3 hoặc Admin để finalize">
              <Lock size={12} />
              Finalize (L3+)
            </span>
          ))}
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
          <button
            onClick={() => store.duplicateProject(p.pid)}
            title="Nhân bản"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 bg-white text-slate-500 transition-all hover:border-slate-400 hover:text-slate-700"
          >
            <Copy size={13} />
          </button>
        )}
        {canDelete &&
          (confirmDel ? (
            <>
              <button
                onClick={() => store.deleteProject(p.pid)}
                className="flex h-8 items-center gap-1 rounded-lg bg-rose-600 px-2.5 text-[11px] font-bold text-white"
              >
                <Trash2 size={12} /> Xóa vĩnh viễn?
              </button>
              <button onClick={() => setConfirmDel(false)} className="h-8 rounded-lg px-2 text-[11px] font-semibold text-slate-400">
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmDel(true)}
              title={p.status === 'final' ? 'Xóa project final (admin only)' : 'Xóa project'}
              className="grid h-8 w-8 place-items-center rounded-lg border border-transparent text-slate-300 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 size={13} />
            </button>
          ))}
      </div>
    </article>
  );
}

export default function ProductionHub({ goDevelop }: { goDevelop: () => void }) {
  const store = useStore();
  const { user, perms } = useAuth();
  const sorted = store.projects.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="min-h-screen bg-slate-50/60 pt-14">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-emerald-600">
              Bước 3 · Production hub
            </span>
            <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-slate-900">
              Projects <span className="text-slate-300">· deploy & khóa bản</span>
            </h2>
            <p className="mt-1.5 max-w-xl text-[13px] text-slate-500">
              Quy trình: Develop → <b className="text-amber-600">Gửi review</b> → <b className="text-sky-600">Approve</b> →{' '}
              <b className="text-emerald-600">Finalize & khóa</b>. Mỗi action đều có timestamp trong action log.
            </p>
            {user && (
              <span className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-widest ${roleMeta[user.role].badge}`}>
                <KeyRound size={11} />
                {roleMeta[user.role].label} — {perms.reviewApprove ? (perms.finalize ? 'review · approve · finalize' : 'review · approve') : 'chỉ xem'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goDevelop}
              className="flex h-9 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 text-[12px] font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400"
            >
              <ArrowLeft size={14} />
              Back to Develop
            </button>
            <button
              onClick={() => store.createProject()}
              disabled={!perms.manageProjects}
              title={perms.manageProjects ? 'Tạo project mới' : 'Cần Level 3 / Admin'}
              className="sheen relative flex h-9 items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-[12px] font-bold text-white shadow-lg shadow-emerald-500/25 transition-all enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={14} strokeWidth={2.5} />
              Tạo project
            </button>
          </div>
        </div>

        {/* project list */}
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {sorted.map((p) => (
            <ProjectCard
              key={p.pid}
              p={p}
              onOpenDevelop={() => {
                store.openProject(p.pid);
                goDevelop();
              }}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2.5 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-[12px] text-slate-500">
          <Rocket size={15} className="shrink-0 text-indigo-400" />
          Project ở trạng thái <b>Finalized</b> sẽ chuyển sang chế độ chỉ đọc ở Develop — không sửa được khi đã deploy,
          nhưng vẫn GEN được và có thể nhân bản ra bản copy mới.
        </div>
      </div>
    </div>
  );
}
