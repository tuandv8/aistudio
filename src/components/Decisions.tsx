import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Copy, Dices, GitBranch, Infinity as InfinityIcon, Layers3, Minus, PenSquare, ScanFace, ShieldCheck, UserCog } from 'lucide-react';
import { Reveal } from '../hooks/useReveal';

const SAMPLE = `# MASTER PRODUCTION PROMPT — "Sunset Café"
Target agent: GG Flow · Google (Veo)

## AGENT DIRECTIVES
- Open every shot prompt with the camera package (shot size + angle + movement),
  then subject and action, then lighting and mood.
- Mandatory negative prompt: morphing face, identity drift, flicker, warped hands.

## GLOBAL CONSISTENCY LOCK
1. CHARACTER LOCK — every referenced character (CH-###) keeps identical face,
   hair, wardrobe and props across all scenes and shots.
2. WORLD LOCK — every referenced location (LC-###) keeps identical layout,
   lighting direction and color palette.
3. MOTION SAFETY — smooth, physically plausible motion; no morphing, no flicker.
4. REFERENCE FIRST — generate reference sheets before any dependent shot.

## PRODUCTION SUMMARY
- 6 shots · ~34s total runtime

## SECTION 08 · SHOTS ID (SH) — 2 record(s)
# SH-001 · SHOTS ID — sunset confession
[CONTEXT REFS]
- Scene: SC-001 "Đối thoại cà phê hoàng hôn"
- Character: CH-001 "Linh — front view"
[CAMERA]
- Shot Size: Medium close-up (MCU)
- Camera Angle: Eye level
- Camera Movement: Dolly push-in
- Lens Feel: Portrait 85mm
[ACTION]
- Action Type: Dialogue exchange
- Shot Duration: 5 seconds
[AUDIO]
- SFX Layer: Room tone ambience
- Music Cue: Riser swell

— END OF MASTER PROMPT —`;

const cards = [
  {
    icon: CheckCircle2,
    status: 'ĐÃ CHỐT',
    statusClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconClass: 'bg-emerald-100 text-emerald-600',
    title: 'Step 6 → Voice ID (VO-###)',
    body: 'Đã xác nhận: bước 6 trùng tên được thay bằng Voice ID — cast giọng cho nhân vật sau Transcript, trước khi lồng vào Scene & Shot. Data đã có đủ 7 category giọng nói.',
  },
  {
    icon: InfinityIcon,
    status: 'ĐÃ CHỐT',
    statusClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconClass: 'bg-emerald-100 text-emerald-600',
    title: 'Combobox 3 → ∞ · Checkbox 2',
    body: 'Rule đã đổi: combobox không giới hạn số gợi ý. Built-in dataset đã nâng từ 748 lên ~1.000 items (expansion v1.1), và cả hệ thống lẫn bạn đều có thể thêm item mới bất kỳ lúc nào.',
  },
  {
    icon: PenSquare,
    status: 'MỚI',
    statusClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    iconClass: 'bg-indigo-100 text-indigo-600',
    title: 'Hệ thống mở: built-in vs custom',
    body: 'Mở bất kỳ category nào trong gridlines — chạm nút "+ Thêm category" cuối mỗi step hoặc thêm item ngay trong danh sách. Item tự thêm mang badge custom, sửa/xóa tự do; built-in khóa chống xóa. Từ v1.5: quyền custom data + import/export thu về ADMIN-only theo phê duyệt.',
  },
  {
    icon: ScanFace,
    status: 'MỚI',
    statusClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    iconClass: 'bg-indigo-100 text-indigo-600',
    title: 'Character Form: Portrait / Full Body × 4 góc × 3 biểu cảm',
    body: 'Tab Characters có 3 category chốt ở đầu: Reference Form (Portrait sheet / Full-body sheet — checkbox 2), Sheet Camera Angle (chính diện· trái· phải· sau — combo 4), Sheet Expression (bình thường· vui· tức giận — combo 3). GEN ra đúng format character sheet bạn yêu cầu.',
  },
  {
    icon: GitBranch,
    status: 'MỚI',
    statusClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    iconClass: 'bg-indigo-100 text-indigo-600',
    title: 'Step 7–8 tham chiếu ID ở tab khác',
    body: 'Scene line có cell chọn: Location (LC), Characters (CH, tối đa 4), Transcript (TR). Shot line chọn: Scene (SC), Characters (CH tối đa 3), Transcript (TR), Voice (VO), Location (LC). Các cell này xuất hiện dạng ô màu hổ phách trong gridline, và GEN tự ghép phần CONTEXT REFS.',
  },
  {
    icon: Dices,
    status: 'ĐÃ TRIỂN KHAI',
    statusClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconClass: 'bg-emerald-100 text-emerald-600',
    title: 'Random + GEN đang chạy ở Production',
    body: 'Sang menu "Bước 2 · Production": mỗi line có nút Random (roll mọi category, kể cả refs) và nút GEN xuất prompt vào modal có copy. Nút "GEN tất cả" ghép toàn bộ lines của tab. Data lines lưu tự động vào máy.',
  },
];

/* ================= PERMISSION AUDIT — ma trận quyền + đề xuất chờ duyệt ================= */

// 1 = có · 0.5 = một phần · 0 = không — MA TRẬN v1.5 ĐÃ ÁP DỤNG THEO PHÊ DUYỆT
const MATRIX: { cap: string; admin: number; l3: number; l2: number; l1: number }[] = [
  { cap: 'Xem Bước 1 · Blueprint & Review', admin: 1, l3: 1, l2: 0, l1: 0 },
  { cap: 'Custom data: thêm / sửa / xóa category & item', admin: 1, l3: 0, l2: 0, l1: 0 },
  { cap: 'Import / Export JSON · Excel', admin: 1, l3: 0, l2: 0, l1: 0 },
  { cap: 'Develop: thêm / sửa line · Random · Lock line', admin: 1, l3: 1, l2: 1, l1: 0 },
  { cap: 'GEN từng line', admin: 1, l3: 1, l2: 1, l1: 1 },
  { cap: 'GEN {tab} · GEN FULL (master prompt)', admin: 1, l3: 1, l2: 1, l1: 0 },
  { cap: 'Tạo / đổi tên / nhân bản project', admin: 1, l3: 1, l2: 1, l1: 0 },
  { cap: 'Submit to Review Queue', admin: 1, l3: 1, l2: 1, l1: 0 },
  { cap: 'Mở snapshot queue trong Develop (read-only)', admin: 1, l3: 1, l2: 0, l1: 0 },
  { cap: 'Approve (two-person: phải khác owner)', admin: 1, l3: 1, l2: 0, l1: 0 },
  { cap: 'Finalize & Khóa (queue + trực tiếp)', admin: 1, l3: 0, l2: 0, l1: 0 },
  { cap: 'Xóa project', admin: 1, l3: 0.5, l2: 0.5, l1: 0 },
];

const Mark = ({ v }: { v: number }) =>
  v === 1 ? (
    <Check size={13} strokeWidth={3} className="mx-auto text-emerald-500" />
  ) : v === 0.5 ? (
    <Minus size={13} strokeWidth={3} className="mx-auto text-amber-500" />
  ) : (
    <span className="mx-auto block h-1 w-1 rounded-full bg-slate-200" />
  );

const RESOLVED: { id: string; title: string; body: string }[] = [
  {
    id: 'P-1 ✓',
    title: 'Hybrid C + visibility từ trạng thái review',
    body: 'Workspace vẫn cá nhân theo account. Nút "Submit to Review" đẩy BẢN SAO read-only (snapshot data + lines) vào REVIEW QUEUE chung — project visible cho role cao hơn (Admin/L3) kể từ khi ở trạng thái review, và Admin/L3 mở được snapshot ngay trong Develop ở chế độ CHỈ XEM (không sửa, vẫn GEN được). Owner theo dõi tiến trình và được rút submission khi còn trong queue. Mỗi project mang Project ID (PRJ-####) duy nhất trên TOÀN hệ thống — độc lập với Project name (được phép trùng).',
  },
  {
    id: 'P-2 ✓',
    title: 'Two-person rule — không tự approve',
    body: 'Một account KHÔNG thể tự approve submission của chính mình: nút Approve bị khóa với owner kèm ghi chú. Approve chỉ thuộc về Admin & L3 (khác owner); kết quả returned/final tự đồng bộ về workspace owner kèm timestamp.',
  },
  {
    id: 'P-3 ✓',
    title: 'Level 1 chỉ được GEN từng line',
    body: 'L1 (Viewer) mất quyền GEN {tab} và GEN FULL — hai nút ẩn hoàn toàn. Nút GEN trên từng line vẫn hoạt động để viewer copy prompt; mọi chỉnh sửa (line, lock, random, project) đều bị chặn.',
  },
  {
    id: 'P-4 ✓',
    title: 'Finalize & Khóa — chỉ Admin',
    body: 'Trên queue: chỉ Admin thấy nút "Finalize & Deploy" (sau khi approved). Trong workspace: chỉ Admin có đường khóa trực tiếp. L3 sau khi approve chỉ có thể chờ Admin finalize.',
  },
  {
    id: 'ROLE ✓',
    title: 'Định nghĩa lại vai trò: L2 = Developer, L3 = Lead/Reviewer',
    body: 'L2 (dev/dev123): tạo · đổi tên · nhân bản project, develop lines, Random, Lock, GEN đầy đủ, Submit to Review — không approve/finalize. L3 (lead/lead123): xem Blueprint, develop, APPROVE project người khác — không custom data, không finalize. Custom data + Import/Export thu về ADMIN-only. Admin hỗ trợ mọi case.',
  },
];

const levelBadge: Record<string, string> = {
  resolved: 'border-emerald-300 bg-emerald-50 text-emerald-700',
};

function PermissionAudit() {
  return (
    <Reveal delay={80}>
      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow">
            <UserCog size={16} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[15px] font-extrabold tracking-tight text-slate-900">
              Permission Audit v1.5 — đã phê duyệt & áp dụng
              <span className="ml-2 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 align-middle font-mono text-[8.5px] font-bold uppercase tracking-widest text-emerald-700">
                5/5 quyết định đã vào code
              </span>
            </h3>
            <p className="font-mono text-[10px] text-slate-400">L1 = Viewer (chỉ GEN line) · L2 = Developer · L3 = Lead/Reviewer (approve ≠ owner) · Admin = full quyền</p>
          </div>
        </div>

        {/* matrix */}
        <div className="scroll-x overflow-x-auto px-5 py-4">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="pb-2 pr-4 font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-slate-400">Khả năng</th>
                {[
                  ['ADMIN', 'text-fuchsia-600'],
                  ['L3 LEAD', 'text-indigo-600'],
                  ['L2 DEV', 'text-sky-600'],
                  ['L1 VIEW', 'text-slate-500'],
                ].map(([label, cls]) => (
                  <th key={label} className={`w-16 pb-2 text-center font-mono text-[10px] font-bold ${cls}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((r, i) => (
                <tr key={r.cap} className={i % 2 ? 'bg-slate-50/60' : ''}>
                  <td className="rounded-l-lg py-1.5 pr-4 pl-2 text-[12px] font-medium text-slate-600">{r.cap}</td>
                  <td className="py-1.5 text-center"><Mark v={r.admin} /></td>
                  <td className="py-1.5 text-center"><Mark v={r.l3} /></td>
                  <td className="py-1.5 text-center"><Mark v={r.l2} /></td>
                  <td className="rounded-r-lg py-1.5 text-center"><Mark v={r.l1} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 font-mono text-[9.5px] text-slate-400">
            ✓ đầy đủ · − một phần (L3/L2 xóa được project chưa final; admin xóa cả bản final) · • không
          </p>
        </div>

        {/* quyết định đã duyệt */}
        <div className="grid gap-3 border-t border-slate-100 bg-slate-50/40 p-5 lg:grid-cols-2">
          {RESOLVED.map((p) => (
            <article
              key={p.id}
              className={`rounded-xl border border-emerald-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${p.id === 'P-1 ✓' ? 'lg:col-span-2' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-emerald-400">{p.id}</span>
                <h4 className="min-w-0 flex-1 text-[13px] font-bold tracking-tight text-slate-800">{p.title}</h4>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-widest ${levelBadge.resolved}`}>
                  đã áp dụng
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{p.body}</p>
            </article>
          ))}
          <article className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 lg:col-span-2">
            <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
            <p className="text-[12px] leading-relaxed text-emerald-800">
              <b>Luồng chuẩn v1.5:</b> L2 develop project cá nhân → Submit to Review (snapshot read-only vào queue, visible cho Admin/L3) →
              L3/Admin khác owner Approve → Admin Finalize & Deploy → kết quả + timestamp tự đồng bộ về workspace owner (returned → draft, final → khóa).
            </p>
          </article>
        </div>
      </div>
    </Reveal>
  );
}

export default function Decisions({ onOpenDevelop }: { onOpenDevelop: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="decisions" className="relative scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-emerald-600">
                Review gate · đã duyệt & cập nhật v1.1
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                6 quyết định <span className="text-slate-300">· trạng thái mới nhất</span>
              </h2>
            </div>
            <p className="max-w-sm text-[12.5px] leading-relaxed text-slate-400">
              Toàn bộ phản hồi của bạn đã nhập vào hệ thống. Nhấn nút bên dưới để chuyển thẳng sang Production làm việc
              với data này.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col gap-3.5">
            {cards.map((d, i) => (
              <Reveal key={d.title} delay={i * 50}>
                <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${d.iconClass}`}>
                      <d.icon size={17} strokeWidth={2.2} />
                    </span>
                    <h3 className="min-w-0 flex-1 truncate font-display text-[14.5px] font-bold tracking-tight text-slate-800">
                      {d.title}
                    </h3>
                    <span className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest ${d.statusClass}`}>
                      {d.status}
                    </span>
                  </div>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-slate-500">{d.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* ---------- GEN sample + CTA ---------- */}
          <div className="flex flex-col gap-4">
            <Reveal delay={120}>
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-900/20">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </span>
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    GEN output · ví dụ có refs
                  </span>
                  <button
                    onClick={copy}
                    className="ml-auto flex h-7 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 font-mono text-[10px] font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copied ? 'Đã copy' : 'Copy'}
                  </button>
                </div>
                <pre className="max-h-[430px] overflow-auto p-5 font-mono text-[11px] leading-[1.75] text-slate-300">
                  <code>{SAMPLE}</code>
                </pre>
                <div className="flex items-center gap-2.5 border-t border-white/10 bg-white/[0.03] px-5 py-3">
                  <Layers3 size={13} className="shrink-0 text-violet-300" />
                  <span className="text-[11px] leading-snug text-slate-400">
                    Các ID SC/CH/TR/VO/LC được resolve tự động từ line đã chọn ở tab khác.
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <button
                onClick={onOpenDevelop}
                className="sheen group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-left shadow-xl shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/35"
              >
                <div>
                  <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.26em] text-white/65">
                    Next step
                  </span>
                  <span className="mt-1 block font-display text-xl font-extrabold tracking-tight text-white">
                    Vào Bước 2 · Develop
                  </span>
                  <span className="mt-1 block text-[12px] text-white/70">
                    8 tabs · gridlines · tick category · combobox · random · GEN
                  </span>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-transform group-hover:translate-x-1">
                  <ArrowRight size={19} />
                </span>
              </button>
            </Reveal>
          </div>
        </div>

        <PermissionAudit />
      </div>
    </section>
  );
}
