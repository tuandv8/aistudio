import { useState } from 'react';
import { Check, CheckSquare2, ChevronDown, Layers3, ListChecks, Lock, PenLine, Pin, Plus, Trash2 } from 'lucide-react';
import type { Category } from '../data/pipeline';
import type { StepTheme } from '../theme';
import { useStore } from '../store';
import { useAuth } from '../auth';

export default function CategoryRow({
  stepCode,
  cat,
  theme,
  open,
  onToggle,
  preview = 6,
}: {
  stepCode: string;
  cat: Category;
  theme: StepTheme;
  open: boolean;
  onToggle: () => void;
  preview?: number;
}) {
  const store = useStore();
  const { perms } = useAuth();
  const canEdit = perms.editData;
  const isCombo = cat.control === 'combobox';
  const [editCat, setEditCat] = useState(false);
  const [en, setEn] = useState(cat.en);
  const [vi, setVi] = useState(cat.vi);
  const [newEn, setNewEn] = useState('');
  const [newVi, setNewVi] = useState('');
  const [editItem, setEditItem] = useState<number | null>(null);
  const [iEn, setIEn] = useState('');
  const [iVi, setIVi] = useState('');

  const startEditItem = (idx: number) => {
    setEditItem(idx);
    setIEn(cat.items[idx].en);
    setIVi(cat.items[idx].vi ?? '');
  };
  const addItem = () => {
    const e = newEn.trim();
    if (!e) return;
    store.addItem(stepCode, cat.id, { en: e, vi: newVi.trim() || undefined });
    setNewEn('');
    setNewVi('');
  };

  return (
    <div className={`group/row border-t border-slate-200/90 transition-colors duration-300 ${open ? theme.bgSoft : 'hover:bg-slate-50/80'}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left sm:gap-4 sm:px-5" aria-expanded={open}>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all duration-300 ${
            open ? `${theme.badge} border-transparent text-white shadow` : 'border-slate-300 bg-white text-transparent'
          }`}
        >
          <Check size={13} strokeWidth={3} />
        </span>

        <span className={`hidden font-mono text-[10.5px] font-bold tracking-wider text-slate-300 transition-colors sm:block ${open ? theme.textSoft : ''}`}>
          {cat.id}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2">
            <span className="font-display text-[13.5px] font-bold tracking-tight text-slate-800">{cat.en}</span>
            <span className="truncate text-[11.5px] text-slate-400">{cat.vi}</span>
            {cat.required && (
              <span className="rounded bg-slate-100 px-1.5 py-px font-mono text-[8.5px] font-bold uppercase tracking-widest text-slate-500">key</span>
            )}
            {cat.custom && (
              <span className="rounded bg-emerald-100 px-1.5 py-px font-mono text-[8.5px] font-bold uppercase tracking-widest text-emerald-600">custom</span>
            )}
          </span>
          {!open && (
            <span className="mt-1 block truncate text-[11px] text-slate-400/90">
              {cat.items.slice(0, preview).map((i) => i.en).join('  ·  ')}
              {cat.items.length > preview && <span className={`ml-1 font-medium ${theme.text}`}>+{cat.items.length - preview}</span>}
              {cat.items.length === 0 && <span className="italic opacity-70">chưa có item — mở để thêm</span>}
            </span>
          )}
        </span>

        {/* lock or custom actions */}
        <span className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {cat.custom && canEdit ? (
            <>
              <button
                title="Sửa tên category (custom)"
                onClick={() => {
                  setEditCat((v) => !v);
                  if (!open) onToggle();
                }}
                className="grid h-6 w-6 place-items-center rounded-md text-slate-300 transition-colors hover:bg-white hover:text-indigo-500"
              >
                <PenLine size={12} />
              </button>
              <button
                title="Xóa category (custom)"
                onClick={() => store.deleteCategory(stepCode, cat.id)}
                className="grid h-6 w-6 place-items-center rounded-md text-slate-300 transition-colors hover:bg-white hover:text-rose-500"
              >
                <Trash2 size={12} />
              </button>
            </>
          ) : (
            <span title="Built-in — khóa chống sửa/xóa">
              <Lock size={11} className="text-slate-300" />
            </span>
          )}
        </span>

        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-widest ${
            cat.control === 'combobox'
              ? 'border-violet-200 bg-violet-50 text-violet-600'
              : cat.control === 'multi'
                ? 'border-amber-300 bg-amber-50 text-amber-600'
                : 'border-emerald-200 bg-emerald-50 text-emerald-600'
          }`}
        >
          {cat.control === 'combobox' ? <ListChecks size={11} strokeWidth={2.4} /> : cat.control === 'multi' ? <Layers3 size={11} strokeWidth={2.4} /> : <CheckSquare2 size={11} strokeWidth={2.4} />}
          {cat.control === 'combobox' ? `${cat.items.length} combo` : cat.control === 'multi' ? `multi · ${cat.items.length}` : 'checkbox'}
        </span>

        <ChevronDown size={16} className={`shrink-0 text-slate-300 transition-transform duration-300 ${open ? `rotate-180 ${theme.text}` : ''}`} />
      </button>

      <div className={`acc ${open ? 'open' : ''}`}>
        <div>
          <div className="px-4 pb-4 pl-11 sm:px-5 sm:pl-13">
            {editCat && cat.custom && canEdit && (
              <div className="mb-3 flex max-w-xl flex-wrap items-center gap-2 rounded-xl border border-indigo-200 bg-white p-2.5 shadow-sm">
                <input
                  value={en}
                  onChange={(e) => setEn(e.target.value)}
                  placeholder="Tên EN"
                  className="h-8 flex-1 rounded-lg bg-slate-50 px-2.5 text-[12px] outline-none focus:bg-indigo-50/60"
                />
                <input
                  value={vi}
                  onChange={(e) => setVi(e.target.value)}
                  placeholder="Chú thích VI"
                  className="h-8 flex-1 rounded-lg bg-slate-50 px-2.5 text-[12px] outline-none focus:bg-indigo-50/60"
                />
                <button
                  onClick={() => {
                    store.updateCategory(stepCode, cat.id, { en: en.trim() || cat.en, vi: vi.trim() });
                    setEditCat(false);
                  }}
                  className="h-8 rounded-lg bg-indigo-600 px-3 text-[11.5px] font-bold text-white"
                >
                  Lưu
                </button>
              </div>
            )}

            {cat.note && (
              <p className="mb-3 flex max-w-xl items-start gap-1.5 text-[11.5px] italic text-slate-400">
                <Pin size={11} className="mt-0.5 shrink-0" />
                {cat.note}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item, i) =>
                editItem === i && item.custom ? (
                  <span key={`edit-${i}`} className="flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-white p-1 shadow-sm">
                    <input
                      value={iEn}
                      autoFocus
                      onChange={(e) => setIEn(e.target.value)}
                      className="h-7 w-32 rounded-md bg-slate-50 px-2 text-[11.5px] outline-none"
                    />
                    <input
                      value={iVi}
                      onChange={(e) => setIVi(e.target.value)}
                      placeholder="vi"
                      className="h-7 w-28 rounded-md bg-slate-50 px-2 text-[11.5px] outline-none"
                    />
                    <button
                      onClick={() => {
                        store.updateItem(stepCode, cat.id, i, { en: iEn.trim() || item.en, vi: iVi.trim() || undefined });
                        setEditItem(null);
                      }}
                      className="grid h-7 w-7 place-items-center rounded-md bg-indigo-600 text-white"
                    >
                      <Check size={12} />
                    </button>
                    <button onClick={() => setEditItem(null)} className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-slate-500">
                      ×
                    </button>
                  </span>
                ) : (
                  <span
                    key={`${item.en}-${i}`}
                    className={`chip group/chip relative inline-flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1.5 ${theme.chipBorder} ${theme.chipBg}`}
                    style={{ '--i': Math.min(i, 40) } as React.CSSProperties}
                  >
                    <span className={`text-[12px] font-semibold leading-none ${theme.chipText}`}>{item.en}</span>
                    {item.vi && <span className="text-[10.5px] leading-none text-slate-400">{item.vi}</span>}
                    {item.custom && canEdit ? (
                      <span className="ml-0.5 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/chip:opacity-100">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" title="custom" />
                        <button onClick={() => startEditItem(i)} className="text-slate-400 hover:text-indigo-500" title="Sửa item (custom)">
                          <PenLine size={10} />
                        </button>
                        <button onClick={() => store.deleteItem(stepCode, cat.id, i)} className="text-slate-400 hover:text-rose-500" title="Xóa item (custom)">
                          <Trash2 size={10} />
                        </button>
                      </span>
                    ) : item.custom ? (
                      <span className="ml-0.5 h-1 w-1 self-center rounded-full bg-emerald-500" title="custom" />
                    ) : (
                      <Lock size={8} className="self-center text-slate-300" />
                    )}
                  </span>
                ),
              )}

              {/* add item */}
              {isCombo && canEdit && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/50 px-2 py-1">
                  <input
                    value={newEn}
                    onChange={(e) => setNewEn(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="+ item EN"
                    className="h-7 w-28 rounded-md bg-white/70 px-2 text-[11.5px] outline-none placeholder:text-emerald-400"
                  />
                  <input
                    value={newVi}
                    onChange={(e) => setNewVi(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="note VI"
                    className="h-7 w-24 rounded-md bg-white/70 px-2 text-[11.5px] outline-none placeholder:text-emerald-400"
                  />
                  <button
                    onClick={addItem}
                    disabled={!newEn.trim()}
                    className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500 text-white transition-all enabled:hover:bg-emerald-600 disabled:opacity-40"
                    title="Thêm item custom"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
