import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PipelineStep } from './data/pipeline';
import type { HistoryEntry, Line } from './store';

/* ================================================================
 * REVIEW QUEUE (hybrid C) — hàng đợi review CHUNG, lưu global:
 *  - Submit to Review: đẩy BẢN SAO read-only (snapshot data + lines) vào queue
 *  - Visible cho role cao hơn (Admin/L3) kể từ trạng thái review
 *  - Approve: Admin/L3 và KHÁC owner (two-person rule)
 *  - Finalize & Deploy: CHỈ Admin
 *  - Owner được xem tiến trình + rút submission khi còn ở 'review'
 * ================================================================ */

export type QueueStatus = 'review' | 'approved' | 'returned' | 'final';

export interface QueueEntry {
  qid: string;
  pid: string;
  /** Project ID hiển thị — duy nhất toàn hệ thống (PRJ-0001…) */
  projectCode?: string;
  projectName: string;
  ownerName: string; // username
  ownerDisplay: string;
  ownerRole: string; // role label
  submittedAt: number;
  status: QueueStatus;
  history: HistoryEntry[];
  snapshot: { data: PipelineStep[]; lines: Record<string, Line[]> };
}

interface QueueCtx {
  entries: QueueEntry[];
  submit: (input: {
    pid: string;
    projectCode: string;
    projectName: string;
    owner: { username: string; displayName: string; roleLabel: string };
    data: PipelineStep[];
    lines: Record<string, Line[]>;
  }) => void;
  approve: (qid: string, by: { username: string; displayName: string }) => boolean;
  returnEntry: (qid: string, by: { username: string; displayName: string }) => void;
  finalize: (qid: string, by: { username: string; displayName: string }) => void;
  withdraw: (qid: string) => void;
  latestForProject: (pid: string) => QueueEntry | undefined;
  /** Admin/L3 mở snapshot trong Develop ở chế độ read-only */
  previewQid: string | null;
  openPreview: (qid: string) => void;
  closePreview: () => void;
}

const KEY = 'aivp-review-queue-v1';
const uid = () => Math.random().toString(36).slice(2, 10);
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function load(): QueueEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as QueueEntry[];
      if (Array.isArray(p)) return p;
    }
  } catch {
    /* ignore */
  }
  return [];
}

const QueueContext = createContext<QueueCtx | null>(null);
export const useQueue = () => {
  const c = useContext(QueueContext);
  if (!c) throw new Error('useQueue outside provider');
  return c;
};

export function QueueProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<QueueEntry[]>(load);
  const [previewQid, setPreviewQid] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
    } catch {
      /* quota */
    }
  }, [entries]);

  const api = useMemo<QueueCtx>(
    () => ({
      entries,
      submit: ({ pid, projectCode, projectName, owner, data, lines }) => {
        const now = Date.now();
        const entry: QueueEntry = {
          qid: uid(),
          pid,
          projectCode,
          projectName,
          ownerName: owner.username,
          ownerDisplay: owner.displayName,
          ownerRole: owner.roleLabel,
          submittedAt: now,
          status: 'review',
          history: [{ at: now, action: `@${owner.username} submit “${projectName}” to review queue` }],
          snapshot: { data: clone(data), lines: clone(lines) },
        };
        setEntries((cur) => [
          // dọn các entry 'returned' cũ của cùng project cho gọn
          ...cur.filter((e) => !(e.pid === pid && e.status === 'returned')),
          entry,
        ]);
      },
      approve: (qid, by) => {
        let ok = false;
        setEntries((cur) =>
          cur.map((e) => {
            if (e.qid !== qid) return e;
            // two-person rule: không tự approve project của chính mình
            if (e.status !== 'review' || e.ownerName === by.username) return e;
            ok = true;
            return {
              ...e,
              status: 'approved',
              history: [...e.history, { at: Date.now(), action: `@${by.username} APPROVED` }],
            };
          }),
        );
        return ok;
      },
      returnEntry: (qid, by) =>
        setEntries((cur) =>
          cur.map((e) =>
            e.qid === qid && (e.status === 'review' || e.status === 'approved') && e.ownerName !== by.username
              ? {
                  ...e,
                  status: 'returned',
                  history: [...e.history, { at: Date.now(), action: `@${by.username} RETURNED to draft` }],
                }
              : e,
          ),
        ),
      finalize: (qid, by) =>
        setEntries((cur) =>
          cur.map((e) =>
            e.qid === qid && e.status === 'approved'
              ? {
                  ...e,
                  status: 'final',
                  history: [...e.history, { at: Date.now(), action: `@${by.username} FINALIZED & DEPLOYED — locked` }],
                }
              : e,
          ),
        ),
      withdraw: (qid) => setEntries((cur) => cur.filter((e) => !(e.qid === qid && e.status === 'review'))),
      latestForProject: (pid) => {
        const list = entries.filter((e) => e.pid === pid);
        return list.length ? list[list.length - 1] : undefined;
      },
      previewQid,
      openPreview: (qid) => setPreviewQid(qid),
      closePreview: () => setPreviewQid(null),
    }),
    [entries, previewQid],
  );

  return <QueueContext.Provider value={api}>{children}</QueueContext.Provider>;
}

export const queueStatusMeta: Record<QueueStatus, { label: string; badge: string; dot: string }> = {
  review: { label: 'In review', badge: 'bg-amber-400/15 text-amber-300 border-amber-400/40', dot: 'bg-amber-400' },
  approved: { label: 'Approved', badge: 'bg-sky-400/15 text-sky-300 border-sky-400/40', dot: 'bg-sky-400' },
  returned: { label: 'Returned', badge: 'bg-slate-400/15 text-slate-300 border-slate-400/40', dot: 'bg-slate-400' },
  final: { label: 'Final · Deployed', badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40', dot: 'bg-emerald-400' },
};
