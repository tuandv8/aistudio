import { useRef, useState } from 'react';
import { Check, ChevronDown, SearchX } from 'lucide-react';
import type { SuggestionItem } from '../data/pipeline';
import Popover from './Popover';

/** Combobox có search — dropdown chạy qua portal nên KHÔNG bị clip bởi panel. */
export default function ComboPicker({
  items,
  value,
  onPick,
  disabled,
  placeholder = '— trống —',
}: {
  items: SuggestionItem[];
  value: number;
  onPick: (i: number) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const anchorRef = useRef<HTMLButtonElement>(null);

  const filtered = q.trim()
    ? items.map((it, i) => ({ it, i })).filter(({ it }) => `${it.en} ${it.vi ?? ''}`.toLowerCase().includes(q.toLowerCase()))
    : items.map((it, i) => ({ it, i }));

  const sel = items[value];

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        disabled={disabled || items.length === 0}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border px-2.5 text-left transition-all ${
          disabled || items.length === 0
            ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
            : open
              ? 'border-indigo-400 bg-white ring-2 ring-indigo-100'
              : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold text-slate-800">{sel ? sel.en : placeholder}</span>
          {sel?.vi && <span className="block truncate text-[10px] text-slate-400">{sel.vi}</span>}
        </span>
        <ChevronDown size={13} className={`shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
        {items.length > 8 && (
          <div className="border-b border-slate-100 p-1.5">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Lọc gợi ý…"
              className="h-7 w-full rounded-lg bg-slate-50 px-2.5 text-[11.5px] text-slate-700 outline-none placeholder:text-slate-300 focus:bg-indigo-50/60"
            />
          </div>
        )}
        <div className="scroll-x max-h-[inherit] p-1">
          {filtered.length === 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-3 text-[11px] text-slate-400">
              <SearchX size={12} /> Không thấy kết quả
            </div>
          )}
          {filtered.map(({ it, i }) => (
            <button
              key={`${it.en}-${i}`}
              type="button"
              onClick={() => {
                onPick(i);
                setOpen(false);
                setQ('');
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                i === value ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-semibold">
                  {it.en}
                  {it.custom && (
                    <span className="ml-1.5 rounded bg-emerald-100 px-1 py-px align-middle font-mono text-[8px] font-bold uppercase tracking-wider text-emerald-600">
                      custom
                    </span>
                  )}
                </span>
                {it.vi && <span className="block truncate text-[10px] text-slate-400">{it.vi}</span>}
              </span>
              {i === value && <Check size={12} className="shrink-0 text-indigo-500" />}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
