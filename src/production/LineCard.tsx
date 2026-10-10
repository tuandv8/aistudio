import { useRef, useState } from 'react';
import { Check, Dices, Link2, Lock, LockOpen, Trash2, Wand2, X } from 'lucide-react';
import type { Category, PipelineStep } from '../data/pipeline';
import { stepRefDefs, useStore, type Line, type RefDef } from '../store';
import { stepTheme } from '../theme';
import ComboPicker from './ComboPicker';
import Popover from './Popover';

/* ---------------- checkbox control (đúng 2 lựa chọn) ---------------- */
function CheckboxControl({ cat, i, onPick, disabled }: { cat: Category; i: number; onPick: (n: number) => void; disabled?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {cat.items.map((it, idx) => (
        <button
          key={it.en}
          type="button"
          disabled={disabled}
          onClick={() => onPick(idx)}
          className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-[11.5px] font-semibold transition-all ${
            disabled
              ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
              : i === idx
                ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
          }`}
        >
          <span className={`grid h-3.5 w-3.5 place-items-center rounded-sm ${i === idx && !disabled ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-transparent'}`}>
            <Check size={9} strokeWidth={3.5} />
          </span>
          {it.en}
        </button>
      ))}
    </div>
  );
}

/* ---------------- multi control (chọn nhiều) ---------------- */
function MultiControl({ cat, picks, onToggle, disabled }: { cat: Category; picks: number[]; onToggle: (idx: number) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1">
      {cat.items.map((it, idx) => {
        const on = picks.includes(idx);
        return (
          <button
            key={`${it.en}-${idx}`}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(idx)}
            title={it.vi}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-left transition-all ${
              disabled
                ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                : on
                  ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:text-slate-600'
            }`}
          >
            <span className={`grid h-3 w-3 place-items-center rounded-sm ${on && !disabled ? 'bg-amber-500 text-white' : 'bg-slate-200 text-transparent'}`}>
              <Check size={8} strokeWidth={4} />
            </span>
            <span className="text-[10.5px] font-semibold leading-none">{it.en}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- ref picker: chọn ID ở tab khác (chạy qua portal) ---------------- */
function RefCell({ rd, current, pool, onChange, readOnly }: { rd: RefDef; current: string[]; pool: Line[]; onChange: (uids: string[]) => void; readOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const label = current.length
    ? pool.filter((l) => current.includes(l.uid)).map((l) => l.idText).join(' + ')
    : '—';

  return (
    <div className="relative bg-amber-50/60 p-2.5">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Link2 size={9} className="text-amber-500" />
        <span className="font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-amber-600">
          {rd.label} · {rd.from}-###
        </span>
      </div>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pool.length === 0 || readOnly}
        className={`flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border px-2.5 text-left transition-all ${
          pool.length === 0
            ? 'cursor-not-allowed border-amber-100 bg-amber-50/40 text-amber-300'
            : readOnly
              ? 'cursor-not-allowed border-amber-100 bg-amber-50/40 text-amber-700/50'
              : 'border-amber-200 bg-white hover:border-amber-300'
        }`}
      >
        <span className="truncate text-[12px] font-bold text-amber-800">
          {pool.length === 0 ? `chưa có line ở tab ${rd.from}` : label}
        </span>
        <span className="font-mono text-[9px] text-amber-400">{current.length ? `${current.length}${rd.multi ? `/${rd.max}` : ''}` : 'pick'}</span>
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
        <div className="scroll-x max-h-[inherit] p-1">
          {pool.map((l) => {
            const activePick = current.includes(l.uid);
            return (
              <button
                key={l.uid}
                type="button"
                onClick={() => {
                  if (rd.multi) {
                    onChange(activePick ? current.filter((x) => x !== l.uid) : current.length < (rd.max ?? 4) ? [...current, l.uid] : current);
                  } else {
                    onChange(activePick ? [] : [l.uid]);
                    setOpen(false);
                  }
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors ${activePick ? 'bg-amber-50' : 'hover:bg-slate-50'}`}
              >
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded ${activePick ? 'bg-amber-500 text-white' : 'bg-slate-100 text-transparent'}`}>
                  <Check size={10} strokeWidth={3.5} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[11px] font-bold text-slate-700">{l.idText}</span>
                  <span className="block truncate text-[10px] text-slate-400">{l.desc || '(chưa mô tả)'}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Popover>
    </div>
  );
}

/* ---------------- main line card ---------------- */
export default function LineCard({
  step,
  line,
  onGen,
  readOnly,
  allLines,
}: {
  step: PipelineStep;
  line: Line;
  onGen: () => void;
  readOnly?: boolean;
  /** pool lines cho ref-picker — ở preview mode là lines của SNAPSHOT, không phải workspace */
  allLines?: Record<string, Line[]>;
}) {
  const t = stepTheme[step.code];
  const store = useStore();
  const [diceKey, setDiceKey] = useState(0);
  const refDefs = stepRefDefs[step.code] ?? [];
  const lineLocked = !!line.locked;
  const disabled = readOnly || lineLocked; // khóa line: không sửa được nội dung (gồm random & xóa), chỉ GEN
  const tags = line.desc.match(/#[^\s#]+/g) ?? [];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* header */}
      <div className={`flex flex-wrap items-center gap-2 rounded-t-xl border-b px-3.5 py-2.5 transition-colors sm:px-4 ${lineLocked ? 'border-amber-200 bg-amber-50/60' : 'border-slate-100'}`}>
        <span className={`rounded-md bg-gradient-to-br ${t.grad} px-2 py-1 font-mono text-[11px] font-bold text-white shadow`}>
          {line.idText}
        </span>
        <input
          value={line.desc}
          readOnly={disabled}
          onChange={(e) => store.updateLine(step.code, line.uid, { desc: e.target.value })}
          placeholder="Mô tả ngắn gọn cho line này… (dùng #tag để gắn từ khóa)"
          className={`h-8 min-w-44 flex-1 rounded-lg border px-2.5 text-[12.5px] outline-none transition-all ${
            disabled
              ? 'cursor-not-allowed border-transparent bg-slate-50/60 text-slate-400'
              : 'border-transparent bg-slate-50 text-slate-700 placeholder:text-slate-300 focus:border-slate-200 focus:bg-white'
          }`}
        />
        {/* #tag chips từ description */}
        {tags.length > 0 && (
          <div className="hidden items-center gap-1 xl:flex">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-md bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-700">
                {tag}
              </span>
            ))}
            {tags.length > 3 && <span className="font-mono text-[9px] text-amber-500">+{tags.length - 3}</span>}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {/* LOCK line — bên trái Random; khi locked: cấm sửa nội dung, cấm random & xóa, chỉ GEN */}
          <button
            type="button"
            title={readOnly ? 'Chỉ xem (role)' : lineLocked ? 'Mở khóa line — cho phép chỉnh sửa lại' : 'Khóa line — chống sửa nội dung'}
            disabled={readOnly}
            onClick={() => store.updateLine(step.code, line.uid, { locked: !lineLocked })}
            className={`grid h-8 w-8 place-items-center rounded-lg border transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              lineLocked
                ? 'border-amber-400 bg-amber-100 text-amber-600 shadow-sm'
                : 'border-slate-200 bg-white text-slate-400 enabled:hover:border-amber-300 enabled:hover:text-amber-500'
            }`}
          >
            {lineLocked ? <Lock size={13} /> : <LockOpen size={13} />}
          </button>
          <button
            type="button"
            title={disabled ? 'Line đang khóa — không random được' : 'Random tất cả category của line'}
            disabled={disabled}
            onClick={() => {
              store.randomizeLine(step.code, line.uid);
              setDiceKey((k) => k + 1);
            }}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-[11px] font-bold text-amber-600 transition-all enabled:hover:-translate-y-0.5 enabled:hover:border-amber-300 enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Dices key={diceKey} size={14} className={diceKey ? 'dice-pop' : ''} />
            Random
          </button>
          <button
            type="button"
            onClick={onGen}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            <Wand2 size={13} />
            GEN
          </button>
          {!disabled && (
            <button
              type="button"
              title="Xóa line"
              onClick={() => store.deleteLine(step.code, line.uid)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-transparent text-slate-300 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* gridlines */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-xl bg-slate-200 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {refDefs.map((rd) => (
          <RefCell
            key={rd.key}
            rd={rd}
            current={line.refs[rd.key] ?? []}
            pool={(allLines ?? store.lines)[rd.from] ?? []}
            onChange={(uids) => store.setRef(step.code, line.uid, rd.key, uids)}
            readOnly={disabled}
          />
        ))}
        {step.categories.map((cat) => {
          const v = line.values[cat.id] ?? { on: true, i: 0 };
          const toggle = () => store.setCell(step.code, line.uid, cat.id, { on: !v.on });
          return (
            <div key={cat.id} className={`p-2.5 transition-colors ${v.on ? 'bg-white' : 'bg-slate-50/70'}`}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggle}
                  disabled={disabled}
                  title={v.on ? 'Bỏ chọn category' : 'Chọn category'}
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded transition-all disabled:cursor-not-allowed ${
                    v.on ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-transparent hover:bg-slate-300'
                  }`}
                >
                  <Check size={10} strokeWidth={3.5} />
                </button>
                <span className={`truncate font-mono text-[8.5px] font-bold uppercase tracking-[0.12em] ${v.on ? 'text-slate-500' : 'text-slate-300'}`}>
                  {cat.id} · {cat.en}
                  {cat.control === 'multi' && <span className="ml-1 text-amber-500">[{v.picks?.length ?? 0}]</span>}
                  {cat.custom && <span className="ml-1 text-emerald-500">●</span>}
                </span>
                {!v.on && !disabled && (
                  <button type="button" onClick={toggle} className="ml-auto text-slate-300 hover:text-slate-500">
                    <X size={10} />
                  </button>
                )}
              </div>
              {cat.control === 'checkbox' ? (
                <CheckboxControl cat={cat} i={v.i} disabled={!v.on || disabled} onPick={(i) => store.setCell(step.code, line.uid, cat.id, { i })} />
              ) : cat.control === 'multi' ? (
                <MultiControl
                  cat={cat}
                  picks={v.picks ?? []}
                  disabled={!v.on || disabled}
                  onToggle={(idx) => store.togglePick(step.code, line.uid, cat.id, idx)}
                />
              ) : (
                <ComboPicker
                  items={cat.items}
                  value={Math.min(v.i, Math.max(0, cat.items.length - 1))}
                  disabled={!v.on || disabled}
                  onPick={(i) => store.setCell(step.code, line.uid, cat.id, { i })}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
