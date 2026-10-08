import { useState } from 'react';
import { Clapperboard, KeyRound, Lock, LogIn, ShieldCheck, UserRound } from 'lucide-react';
import { accounts, roleMeta, useAuth, type Role } from '../auth';

const roleDot: Record<Role, string> = {
  admin: 'bg-fuchsia-500',
  l3: 'bg-indigo-500',
  l2: 'bg-sky-500',
  l1: 'bg-slate-400',
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user.trim() || !pass) {
      setError('Nhập tài khoản và mật khẩu');
      setShake((k) => k + 1);
      return;
    }
    if (login(user, pass)) return;
    setError('Sai tài khoản hoặc mật khẩu');
    setShake((k) => k + 1);
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-16">
      <div className="blueprint-bg" />
      {/* ambience */}
      <div className="pointer-events-none absolute -left-40 top-[-15%] h-[420px] w-[420px] rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-[-15%] h-[420px] w-[420px] rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          {/* ---------- left: form ---------- */}
          <div className="p-7 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
                <Clapperboard size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold tracking-tight text-slate-900">AI VIDEO PIPELINE</p>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-indigo-500">studio access · v1.2</p>
              </div>
            </div>

            <h1 className="mt-9 font-display text-3xl font-extrabold tracking-tight text-slate-900">Đăng nhập</h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Phân quyền theo 4 cấp độ — chọn tài khoản demo bên phải hoặc nhập thủ công.
            </p>

            <form onSubmit={submit} className="mt-7 flex flex-col gap-3.5">
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <UserRound size={16} className="shrink-0 text-slate-400" />
                <input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Tài khoản (admin / lead / reviewer / guest)"
                  autoComplete="username"
                  className="h-12 w-full bg-transparent text-[14px] text-slate-800 outline-none placeholder:text-slate-300"
                />
              </label>
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <KeyRound size={16} className="shrink-0 text-slate-400" />
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  className="h-12 w-full bg-transparent text-[14px] text-slate-800 outline-none placeholder:text-slate-300"
                />
              </label>

              {error && (
                <p key={shake} className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-600">
                  <Lock size={12} />
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="sheen relative mt-1 flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-[14px] font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
              >
                <LogIn size={17} />
                Vào studio
              </button>
            </form>

            <p className="mt-7 flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-400">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-500" />
              Phiên đăng nhập lưu cục bộ trên máy (demo). Dữ liệu projects mỗi vai trò dùng chung cùng workspace.
            </p>
          </div>

          {/* ---------- right: demo accounts ---------- */}
          <div className="border-t border-slate-100 bg-slate-50/70 p-7 sm:p-8 md:border-l md:border-t-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
              Tài khoản demo — click để fill
            </span>
            <div className="mt-4 flex flex-col gap-3">
              {accounts.map((a) => {
                const m = roleMeta[a.role];
                return (
                  <button
                    key={a.username}
                    onClick={() => {
                      setUser(a.username);
                      setPass(a.pass);
                      setError('');
                    }}
                    className="group rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${m.avatar} font-mono text-[10px] font-bold text-white`}>
                        {a.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[12.5px] font-bold text-slate-800">
                          {a.username}
                          <span className="ml-2 font-normal text-slate-400">/ {a.pass}</span>
                        </span>
                        <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-1.5 py-px font-mono text-[9px] font-bold uppercase tracking-widest ${m.badge}`}>
                          <span className={`h-1 w-1 rounded-full ${roleDot[a.role]}`} />
                          {m.label}
                        </span>
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{m.quote}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
