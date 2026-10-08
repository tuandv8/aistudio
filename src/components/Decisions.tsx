import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Copy, Dices, GitBranch, Infinity as InfinityIcon, Layers3, PenSquare, ScanFace } from 'lucide-react';
import { Reveal } from '../hooks/useReveal';

const SAMPLE = `# SH-001 · SHOTS — từ Scene SC-001 · đưa vào Runway / Kling / Veo
[CONTEXT REFS]
- Scene: SC-001 “Đối thoại cà phê hoàng hôn”
- Character: CH-001 “Linh — chính diện”
- Transcript: TR-001 “Câu mở đầu hook”
- Voice: VO-001
- Location: LC-001 “Quán cà phê cổ — interior”

- Shot Size: Medium close-up (MCU)
- Camera Angle: Eye level
- Camera Movement: Dolly push-in
- Lens Feel: Portrait 85mm
- Composition: Center symmetry
- Lighting Modifier: Golden rim backlight

[ACTION]
- Action Type: Dialogue exchange
- Motion Energy: Natural pace
- Shot Duration: 5 seconds
- Loop Mode: Seamless loop

[AUDIO]
- SFX Layer: Room tone ambience
- Music Cue: Riser swell

→ Output: shot prompt hoàn chỉnh đưa thẳng vào Runway / Kling / Veo / Sora.`;

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
    body: 'Mở bất kỳ category nào trong gridlines — chạm nút "+ Thêm category" cuối mỗi step hoặc thêm item ngay trong danh sách. Những gì do bạn tự thêm sẽ mang badge custom, cho phép sửa / xóa tự do; built-in của tôi thì bị khóa chống xóa. Mọi thứ được lưu tự động.',
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
      </div>
    </section>
  );
}
