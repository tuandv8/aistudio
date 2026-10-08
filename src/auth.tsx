import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/* ================================================================
 * AUTH / ROLES — đăng nhập phân quyền (client-side demo)
 *   admin : full quyền (kể cả xóa project đã final)
 *   l1    : chỉ xem Develop & Production — KHÔNG review/approve
 *   l2    : chỉ xem Develop & Production — ĐƯỢC review & approve
 *   l3    : đầy đủ tính năng
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
  { username: 'lead', pass: 'lead123', role: 'l3', displayName: 'Lead Creator', initials: 'L3' },
  { username: 'reviewer', pass: 'rev123', role: 'l2', displayName: 'Reviewer', initials: 'L2' },
  { username: 'guest', pass: 'view123', role: 'l1', displayName: 'Khách xem', initials: 'L1' },
];

export const roleMeta: Record<Role, { label: string; short: string; badge: string; avatar: string; quote: string }> = {
  admin: {
    label: 'ADMIN · full quyền', short: 'ADMIN',
    badge: 'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700',
    avatar: 'from-fuchsia-600 to-pink-600',
    quote: 'Toàn quyền: custom data, develop, random, GEN, review, approve, finalize, xóa cả project đã khóa.',
  },
  l3: {
    label: 'LEVEL 3 · đầy đủ', short: 'L3',
    badge: 'border-indigo-300 bg-indigo-100 text-indigo-700',
    avatar: 'from-indigo-600 to-violet-600',
    quote: 'Đầy đủ: custom data, develop lines, random, GEN, review, approve, finalize, quản lý project.',
  },
  l2: {
    label: 'LEVEL 2 · xem + review', short: 'L2',
    badge: 'border-sky-300 bg-sky-100 text-sky-700',
    avatar: 'from-sky-500 to-cyan-600',
    quote: 'Xem Develop & Production; được Gửi review và Approve; không sửa lines, không finalize.',
  },
  l1: {
    label: 'LEVEL 1 · chỉ xem', short: 'L1',
    badge: 'border-slate-300 bg-slate-100 text-slate-600',
    avatar: 'from-slate-500 to-slate-600',
    quote: 'Chỉ xem Develop & Production; được GEN / copy output; không được review hay approve.',
  },
};

export interface Perms {
  /** vào được Bước 1 (blueprint) */
  blueprint: boolean;
  /** thêm/sửa/xóa custom categories & items */
  editData: boolean;
  /** thêm/sửa/xóa lines, randomize — Develop mode edit */
  editDevelop: boolean;
  /** gửi review + approve + trả về draft */
  reviewApprove: boolean;
  /** nút Finalize & khóa */
  finalize: boolean;
  /** tạo / đổi tên / nhân bản / xóa project (chưa final) */
  manageProjects: boolean;
  /** xóa cả project đã final (admin only) */
  deleteFinal: boolean;
}

export const permsOf = (r: Role): Perms => {
  switch (r) {
    case 'admin':
      return { blueprint: true, editData: true, editDevelop: true, reviewApprove: true, finalize: true, manageProjects: true, deleteFinal: true };
    case 'l3':
      return { blueprint: true, editData: true, editDevelop: true, reviewApprove: true, finalize: true, manageProjects: true, deleteFinal: false };
    case 'l2':
      return { blueprint: false, editData: false, editDevelop: false, reviewApprove: true, finalize: false, manageProjects: false, deleteFinal: false };
    case 'l1':
    default:
      return { blueprint: false, editData: false, editDevelop: false, reviewApprove: false, finalize: false, manageProjects: false, deleteFinal: false };
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
