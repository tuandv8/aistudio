import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { pipeline as built, type Category, type PipelineStep, type SuggestionItem } from './data/pipeline';

/* ================================================================
 * STORE v3 — PROJECT MANAGEMENT
 *  - Mỗi Project = 1 workspace (custom data + production lines)
 *  - Lifecycle: draft → review → approved → final (FINAL = khóa sửa)
 *  - Mọi action quan trọng có timestamp trong history
 *  - Data custom & lines autosave localStorage
 * ================================================================ */

export interface CellValue {
  on: boolean;
  i: number;
  picks?: number[]; // cho control 'multi'
}
export interface Line {
  uid: string;
  idText: string;
  desc: string;
  locked?: boolean; // lock riêng của line — user tự khóa để không sửa được, chỉ GEN
  values: Record<string, CellValue>;
  refs: Record<string, string[]>;
}
export type ProjectStatus = 'draft' | 'review' | 'approved' | 'final';
export interface HistoryEntry {
  at: number;
  action: string;
}
export interface Project {
  pid: string;
  name: string;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
  history: HistoryEntry[];
  data: PipelineStep[];
  lines: Record<string, Line[]>;
}
interface Persisted {
  schema: number;
  projects: Project[];
  activePid: string;
}

interface Ctx {
  data: PipelineStep[];
  lines: Record<string, Line[]>;
  projects: Project[];
  activePid: string;
  activeProject: Project;
  isLocked: boolean; // active project đã finalize → chỉ đọc
  // project ops
  createProject: (name?: string) => void;
  openProject: (pid: string) => void;
  renameProject: (pid: string, name: string) => void;
  duplicateProject: (pid: string) => void;
  deleteProject: (pid: string) => void;
  setProjectStatus: (pid: string, status: ProjectStatus, action: string) => void;
  logActive: (action: string) => void;
  /** IMPORT: thay thế toàn bộ categories của 1 step (built-in thay đổi theo file import) */
  replaceStepData: (code: string, cats: Category[]) => void;
  /** IMPORT: thay thế toàn bộ data 8 steps */
  replaceAllData: (steps: PipelineStep[]) => void;
  // data ops
  addCategory: (code: string, draft: { en: string; vi: string; control: 'combobox' | 'checkbox' }) => void;
  updateCategory: (code: string, catId: string, patch: Partial<Pick<Category, 'en' | 'vi'>>) => void;
  deleteCategory: (code: string, catId: string) => void;
  addItem: (code: string, catId: string, item: SuggestionItem) => void;
  updateItem: (code: string, catId: string, idx: number, patch: Partial<SuggestionItem>) => void;
  deleteItem: (code: string, catId: string, idx: number) => void;
  // line ops
  addLine: (code: string) => Line;
  deleteLine: (code: string, uid: string) => void;
  updateLine: (code: string, uid: string, patch: Partial<Omit<Line, 'uid' | 'idText'>>) => void;
  setCell: (code: string, uid: string, catId: string, patch: Partial<CellValue>) => void;
  togglePick: (code: string, uid: string, catId: string, idx: number) => void;
  randomizeLine: (code: string, uid: string) => void;
  setRef: (code: string, uid: string, refKey: string, uids: string[]) => void;
}

const KEY = 'aivp-store-v3';
const KEY_V2 = 'aivp-store-v2';
const uid = () => Math.random().toString(36).slice(2, 10);

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}
function mkProject(name: string): Project {
  const now = Date.now();
  return {
    pid: uid(),
    name,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    history: [{ at: now, action: `Khởi tạo project “${name}”` }],
    data: clone(built),
    lines: Object.fromEntries(built.map((s) => [s.code, []])) as Record<string, Line[]>,
  };
}
function seed(): Persisted {
  const p = mkProject('Project 01');
  return { schema: 3, projects: [p], activePid: p.pid };
}
function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Persisted;
      if (p?.schema === 3 && p.projects?.length) return p;
    }
    // migrate từ v2 (1 workspace → project)
    const legacy = localStorage.getItem(KEY_V2);
    if (legacy) {
      const v2 = JSON.parse(legacy) as { data: PipelineStep[]; lines: Record<string, Line[]> };
      if (v2?.data && v2?.lines) {
        const p = mkProject('Project 01');
        p.data = v2.data;
        p.lines = v2.lines;
        p.history.push({ at: Date.now(), action: 'Migrate từ workspace cũ v2' });
        return { schema: 3, projects: [p], activePid: p.pid };
      }
    }
  } catch {
    /* ignore */
  }
  return seed();
}

const StoreCtx = createContext<Ctx | null>(null);
export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore outside provider');
  return c;
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, [state]);

  const api = useMemo<Ctx>(() => {
    const active = state.projects.find((p) => p.pid === state.activePid) ?? state.projects[0];
    const locked = active?.status === 'final';

    const touch = (mut: (p: Project) => Partial<Project>) =>
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.pid === s.activePid ? { ...p, ...mut(p), updatedAt: Date.now() } : p,
        ),
      }));

    const mutateData = (code: string, fn: (cats: Category[]) => Category[]) => {
      if (locked) return;
      touch((p) => ({
        data: p.data.map((step) => (step.code === code ? { ...step, categories: fn(clone(step.categories)) } : step)),
      }));
    };
    const mutateLines = (code: string, fn: (lines: Line[]) => Line[]) => {
      if (locked) return;
      touch((p) => ({ lines: { ...p.lines, [code]: fn(clone(p.lines[code] ?? [])) } }));
    };

    const mkDefaults = (code: string): Line => {
      const step = active.data.find((d) => d.code === code)!;
      const existing = state.projects.find((p) => p.pid === state.activePid)?.lines[code] ?? [];
      const maxSeq = existing.reduce((m, l) => Math.max(m, parseInt(l.idText.split('-')[1] ?? '0', 10) || 0), 0);
      const values: Record<string, CellValue> = {};
      step.categories.forEach((c) => {
        values[c.id] = {
          on: true,
          i: 0,
          ...(c.control === 'multi' ? { picks: c.items.map((_, idx) => idx).slice(0, 4) } : {}),
        };
      });
      return { uid: uid(), idText: `${code}-${String(maxSeq + 1).padStart(3, '0')}`, desc: '', values, refs: {} };
    };

    return {
      data: active.data,
      lines: active.lines,
      projects: state.projects,
      activePid: active.pid,
      activeProject: active,
      isLocked: locked,

      /* ---------- project ops ---------- */
      createProject: (name) =>
        setState((s) => {
          const p = mkProject(name ?? `Project ${String(s.projects.length + 1).padStart(2, '0')}`);
          return { ...s, projects: [...s.projects, p], activePid: p.pid };
        }),
      openProject: (pid) => setState((s) => (s.projects.some((p) => p.pid === pid) ? { ...s, activePid: pid } : s)),
      renameProject: (pid, name) =>
        setState((s) => ({
          ...s,
          projects: s.projects.map((p) =>
            p.pid === pid
              ? { ...p, name, updatedAt: Date.now(), history: [...p.history, { at: Date.now(), action: `Đổi tên → “${name}”` }] }
              : p,
          ),
        })),
      duplicateProject: (pid) =>
        setState((s) => {
          const src = s.projects.find((p) => p.pid === pid);
          if (!src) return s;
          const now = Date.now();
          const copy: Project = {
            ...clone(src),
            pid: uid(),
            name: `${src.name} (copy)`,
            status: 'draft',
            createdAt: now,
            updatedAt: now,
            history: [{ at: now, action: `Nhân bản từ “${src.name}”` }],
          };
          return { ...s, projects: [...s.projects, copy], activePid: copy.pid };
        }),
      deleteProject: (pid) =>
        setState((s) => {
          let projects = s.projects.filter((p) => p.pid !== pid);
          if (projects.length === 0) projects = [mkProject('Project 01')];
          const activePid = s.activePid === pid ? projects[0].pid : s.activePid;
          return { ...s, projects, activePid };
        }),
      setProjectStatus: (pid, status, action) =>
        setState((s) => ({
          ...s,
          projects: s.projects.map((p) =>
            p.pid === pid
              ? { ...p, status, updatedAt: Date.now(), history: [...p.history, { at: Date.now(), action }] }
              : p,
          ),
        })),
      logActive: (action) => touch((p) => ({ history: [...p.history, { at: Date.now(), action }] })),

      /* ---------- import (thay thế built-in) ---------- */
      replaceStepData: (code, cats) => {
        if (locked) return;
        touch((p) => ({
          data: p.data.map((s) => (s.code === code ? { ...s, categories: cats } : s)),
          history: [
            ...p.history,
            { at: Date.now(), action: `Import data cho step ${code} — thay thế ${cats.length} categories / ${cats.reduce((a, c) => a + c.items.length, 0)} items` },
          ],
        }));
      },
      replaceAllData: (steps) => {
        if (locked) return;
        const totalCats = steps.reduce((a, s) => a + s.categories.length, 0);
        const totalItems = steps.reduce((a, s) => a + s.categories.reduce((b, c) => b + c.items.length, 0), 0);
        touch((p) => ({
          data: steps,
          history: [
            ...p.history,
            { at: Date.now(), action: `Import TỔNG HỢP 8 steps — ${totalCats} categories / ${totalItems} items` },
          ],
        }));
      },

      /* ---------- data ops ---------- */
      addCategory: (code, draft) =>
        mutateData(code, (cats) => [
          ...cats,
          {
            id: `${code}-U${uid().slice(0, 3).toUpperCase()}`,
            en: draft.en || 'Custom category',
            vi: draft.vi || '',
            control: draft.control,
            custom: true,
            items:
              draft.control === 'checkbox'
                ? [
                    { en: 'Yes', vi: 'Có', custom: true },
                    { en: 'No', vi: 'Không', custom: true },
                  ]
                : [],
          } as Category,
        ]),
      updateCategory: (code, catId, patch) =>
        mutateData(code, (cats) => cats.map((c) => (c.id === catId && c.custom ? { ...c, ...patch } : c))),
      deleteCategory: (code, catId) => mutateData(code, (cats) => cats.filter((c) => !(c.id === catId && c.custom))),
      addItem: (code, catId, item) =>
        mutateData(code, (cats) =>
          cats.map((c) => (c.id === catId ? { ...c, items: [...c.items, { ...item, custom: true }] } : c)),
        ),
      updateItem: (code, catId, idx, patch) =>
        mutateData(code, (cats) =>
          cats.map((c) =>
            c.id === catId
              ? { ...c, items: c.items.map((it, i) => (i === idx && it.custom ? { ...it, ...patch } : it)) }
              : c,
          ),
        ),
      deleteItem: (code, catId, idx) =>
        mutateData(code, (cats) =>
          cats.map((c) => (c.id === catId ? { ...c, items: c.items.filter((it, i) => !(i === idx && it.custom)) } : c)),
        ),

      /* ---------- line ops ---------- */
      addLine: (code) => {
        const line = mkDefaults(code);
        mutateLines(code, (ls) => [...ls, line]);
        return line;
      },
      deleteLine: (code, u) => mutateLines(code, (ls) => ls.filter((l) => l.uid !== u)),
      updateLine: (code, u, patch) =>
        mutateLines(code, (ls) => ls.map((l) => (l.uid === u ? { ...l, ...patch } : l))),
      setCell: (code, u, catId, patch) =>
        mutateLines(code, (ls) =>
          ls.map((l) => {
            if (l.uid !== u) return l;
            const base: CellValue = l.values[catId] ?? { on: true, i: 0 };
            const next: CellValue = { ...base, on: patch.on ?? base.on, i: patch.i ?? base.i, ...(patch.picks ? { picks: patch.picks } : {}) };
            return { ...l, values: { ...l.values, [catId]: next } };
          }),
        ),
      togglePick: (code, u, catId, idx) =>
        mutateLines(code, (ls) =>
          ls.map((l) => {
            if (l.uid !== u) return l;
            const base: CellValue = l.values[catId] ?? { on: true, i: 0, picks: [] };
            const cur = base.picks ?? [];
            const picks = cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx].sort((a, b) => a - b);
            return { ...l, values: { ...l.values, [catId]: { ...base, picks } } };
          }),
        ),
      randomizeLine: (code, u) => {
        if (locked) return;
        setState((s) => {
          const proj = s.projects.find((p) => p.pid === s.activePid)!;
          const step = proj.data.find((d) => d.code === code);
          if (!step) return s;
          const updated = (clone(proj.lines[code] ?? []) as Line[]).map((l) => {
            if (l.uid !== u) return l;
            const values: Record<string, CellValue> = {};
            step.categories.forEach((c) => {
              const cur = l.values[c.id] ?? { on: true, i: 0 };
              const len = Math.max(1, c.items.length);
              const base: CellValue = { ...cur, i: Math.floor(Math.random() * len) };
              if (c.control === 'multi') {
                const n = Math.max(1, Math.min(3, Math.floor(Math.random() * Math.min(3, len)) + 1));
                const pool = c.items.map((_, idx) => idx).sort(() => Math.random() - 0.5);
                base.picks = pool.slice(0, n).sort((a, b) => a - b);
              }
              values[c.id] = base;
            });
            const refs: Line['refs'] = { ...l.refs };
            stepRefDefs[code]?.forEach((rd) => {
              const pool = proj.lines[rd.from] ?? [];
              if (!pool.length) return;
              const pick = pool[Math.floor(Math.random() * pool.length)].uid;
              if (rd.multi) {
                if (!refs[rd.key]?.length) {
                  refs[rd.key] = [pick];
                  const second = pool[Math.floor(Math.random() * pool.length)].uid;
                  if (second !== pick && Math.random() > 0.5) refs[rd.key] = [pick, second].slice(0, rd.max ?? 4);
                }
              } else refs[rd.key] = [pick];
            });
            return { ...l, values, refs };
          });
          return {
            ...s,
            projects: s.projects.map((p) =>
              p.pid === s.activePid
                ? { ...p, lines: { ...p.lines, [code]: updated }, updatedAt: Date.now() }
                : p,
            ),
          };
        });
      },
      setRef: (code, u, key, uids) =>
        mutateLines(code, (ls) => ls.map((l) => (l.uid === u ? { ...l, refs: { ...l.refs, [key]: uids } } : l))),
    };
  }, [state]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

/* ---------- cross-tab reference defs ---------- */
export interface RefDef {
  key: string;
  label: string;
  from: string;
  multi?: boolean;
  max?: number;
}
export const stepRefDefs: Record<string, RefDef[] | undefined> = {
  SC: [
    { key: 'loc', label: 'Location', from: 'LC' },
    { key: 'chars', label: 'Characters', from: 'CH', multi: true, max: 4 },
    { key: 'transcript', label: 'Transcript', from: 'TR' },
  ],
  SH: [
    { key: 'scene', label: 'Scene', from: 'SC' },
    { key: 'chars', label: 'Character', from: 'CH', multi: true, max: 3 },
    { key: 'transcript', label: 'Transcript', from: 'TR' },
    { key: 'voice', label: 'Voice', from: 'VO' },
    { key: 'loc', label: 'Location', from: 'LC' },
  ],
};

export const statusMeta: Record<ProjectStatus, { label: string; badge: string; dot: string }> = {
  draft: { label: 'Draft', badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  review: { label: 'Đang review', badge: 'bg-amber-100 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
  approved: { label: 'Approved', badge: 'bg-sky-100 text-sky-700 border-sky-300', dot: 'bg-sky-500' },
  final: { label: 'Finalized · Khóa', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500' },
};
