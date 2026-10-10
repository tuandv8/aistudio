import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/* ================================================================
 * AUTH / ROLES v1.5 — phân quyền sau khi được duyệt:
 *   admin : full quyền (custom data, import/export, approve, FINALIZE, xóa final)
 *   l3    : LEAD / REVIEWER — xem Blueprint, develop, APPROVE project của người
 *           khác (two-person rule); không custom data, không finalize
 *   l2    : DEVELOPER — tạo project, develop lines, random, lock, GEN đầy đủ,
 *           submit to review; không approve/finalize
 *   l1    : VIEWER — chỉ xem Develop & Production; CHỈ được GEN từng line
 * ================================================================ */

export type Role = 'admin' | 'l3' | 'l2' | 'l1';

export interface Account {
  username: string;
  pass: string;
  role: Role;
  displayName: string;
  initials: string;
}

export const accounts: Account[] = [
  { username: 'admin', pass: 'admin123', role: 'admin', displayName: 'Quản trị viên', initials: 'AD' },
  { username: 'lead', pass: 'lead123', role: 'l3', displayName: 'Lead / Reviewer', initials: 'L3' },
  { username: 'dev', pass: 'dev123', role: 'l2', displayName: 'Developer', initials: 'L2' },
  { username: 'guest', pass: 'view123', role: 'l1', displayName: 'Viewer', initials: 'L1' },
];

export const roleMeta: Record<Role, { label: string; short: string; badge: string; avatar: string; quote: string }> = {
  admin: {
    label: 'ADMIN · full quyền', short: 'ADMIN',
    badge: 'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700',
    avatar: 'from-fuchsia-600 to-pink-600',
    quote: 'Toàn quyền: custom data, import/export, develop, approve, FINALIZE (trực tiếp & trên queue), xóa cả project đã khóa.',
  },
  l3: {
    label: 'LEVEL 3 · LEAD / REVIEWER', short: 'L3',
    badge: 'border-indigo-300 bg-indigo-100 text-indigo-700',
    avatar: 'from-indigo-600 to-violet-600',
    quote: 'Xem Blueprint & Review, develop đầy đủ, APPROVE project của người khác (two-person rule — không tự duyệt của mình); không custom data, không finalize.',
  },
  l2: {
    label: 'LEVEL 2 · DEVELOPER', short: 'L2',
    badge: 'border-sky-300 bg-sky-100 text-sky-700',
    avatar: 'from-sky-500 to-cyan-600',
    quote: 'Tạo / đổi tên / nhân bản project, develop lines, Random, Lock, GEN line + tab + FULL, Submit to Review. Không approve, không finalize.',
  },
  l1: {
    label: 'LEVEL 1 · VIEWER', short: 'L1',
    badge: 'border-slate-300 bg-slate-100 text-slate-600',
    avatar: 'from-slate-500 to-slate-600',
    quote: 'Chỉ xem Develop & Production. Chỉ được GEN từng line (không GEN tab, không GEN FULL, không chỉnh sửa).',
  },
};

export interface Perms {
  /** vào Bước 1 (blueprint + review) */
  blueprint: boolean;
  /** custom data: thêm/sửa/xóa category & item — ADMIN only */
  editData: boolean;
  /** develop: thêm/sửa line, random, lock */
  editDevelop: boolean;
  /** GEN từng line — tất cả role */
  genLine: boolean;
  /** GEN {tab} (nhiều lines) */
  genTab: boolean;
  /** GEN FULL master prompt */
  genFull: boolean;
  /** tạo / đổi tên / nhân bản project */
  manageProjects: boolean;
  /** submit to review queue */
  submitReview: boolean;
  /** approve trên queue (phải khác owner) */
  approve: boolean;
  /** finalize & khóa — ADMIN only */
  finalize: boolean;
  /** xóa project đã final — ADMIN only */
  deleteFinal: boolean;
}

export const permsOf = (r: Role): Perms => {
  switch (r) {
    case 'admin':
      return {
        blueprint: true, editData: true, editDevelop: true,
        genLine: true, genTab: true, genFull: true,
        manageProjects: true, submitReview: true, approve: true,
        finalize: true, deleteFinal: true,
      };
    case 'l3':
      return {
        blueprint: true, editData: false, editDevelop: true,
        genLine: true, genTab: true, genFull: true,
        manageProjects: true, submitReview: true, approve: true,
        finalize: false, deleteFinal: false,
      };
    case 'l2':
      return {
        blueprint: false, editData: false, editDevelop: true,
        genLine: true, genTab: true, genFull: true,
        manageProjects: true, submitReview: true, approve: false,
        finalize: false, deleteFinal: false,
      };
    case 'l1':
    default:
      return {
        blueprint: false, editData: false, editDevelop: false,
        genLine: true, genTab: false, genFull: false,
        manageProjects: false, submitReview: false, approve: false,
        finalize: false, deleteFinal: false,
      };
  }
};

export interface Session {
  username: string;
  displayName: string;
  initials: string;
  role: Role;
}

interface AuthCtx {
  user: Session | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}

const KEY = 'aivp-auth-v1';
const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(KEY, JSON.stringify(user));
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  const api = useMemo<AuthCtx>(
    () => ({
      user,
      login: (username, pass) => {
        const acc = accounts.find((a) => a.username === username.trim() && a.pass === pass);
        if (!acc) return false;
        setUser({ username: acc.username, displayName: acc.displayName, initials: acc.initials, role: acc.role });
        return true;
      },
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth outside provider');
  const perms = useMemo(() => (c.user ? permsOf(c.user.role) : permsOf('l1')), [c.user]);
  return { ...c, perms };
}
