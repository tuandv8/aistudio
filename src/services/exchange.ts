import * as XLSX from 'xlsx';
import type { Category, ControlType, PipelineStep, SuggestionItem } from '../data/pipeline';

/* ================================================================
 * DATA EXCHANGE — Import / Export JSON & Excel (admin only)
 *  - Export: JSON (có metadata) + Excel (.xlsx, mỗi step 1 sheet)
 *  - Import: thay thế category/built-in tương ứng kể từ file được nạp
 *  - Dữ liệu import vào sẽ được CHUẨN HÓA thành built-in (khóa chống xóa)
 * ================================================================ */

const VERSION = 'aivp-1.2';

export interface StepPayload {
  format: 'aivp-step';
  version: string;
  exportedAt: string;
  code: string;
  title: string;
  categories: Category[];
}
export interface FullPayload {
  format: 'aivp-full';
  version: string;
  exportedAt: string;
  steps: { code: string; title: string; categories: Category[] }[];
}

const strip = (c: Category): Category => ({
  id: c.id,
  en: c.en,
  vi: c.vi,
  control: c.control,
  ...(c.required ? { required: true } : {}),
  ...(c.group ? { group: c.group } : {}),
  ...(c.note ? { note: c.note } : {}),
  items: c.items.map((i) => ({ en: i.en, ...(i.vi ? { vi: i.vi } : {}) })),
});

export function buildStepJson(step: PipelineStep): StepPayload {
  return {
    format: 'aivp-step',
    version: VERSION,
    exportedAt: new Date().toISOString(),
    code: step.code,
    title: step.title,
    categories: step.categories.map(strip),
  };
}
export function buildFullJson(data: PipelineStep[]): FullPayload {
  return {
    format: 'aivp-full',
    version: VERSION,
    exportedAt: new Date().toISOString(),
    steps: data.map((s) => ({ code: s.code, title: s.title, categories: s.categories.map(strip) })),
  };
}

export function downloadFile(name: string, content: string, mime = 'application/json') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

/* ---------------- EXCEL EXPORT ---------------- */

const HEADERS = ['step_code', 'category_id', 'category_en', 'category_vi', 'control', 'required', 'group', 'note', 'item_en', 'item_vi'];

function stepRows(step: PipelineStep): (string | number)[][] {
  const rows: (string | number)[][] = [HEADERS];
  step.categories.forEach((c) => {
    if (c.items.length === 0) {
      rows.push([step.code, c.id, c.en, c.vi, c.control, c.required ? 1 : 0, c.group ?? '', c.note ?? '', '', '']);
    }
    c.items.forEach((it) => {
      rows.push([step.code, c.id, c.en, c.vi, c.control, c.required ? 1 : 0, c.group ?? '', c.note ?? '', it.en, it.vi ?? '']);
    });
  });
  return rows;
}

function sheetName(s: PipelineStep): string {
  return `${s.code}-${s.title}`.replace(/[[\]*?/\\:]/g, ' ').slice(0, 31);
}

export function exportStepXLSX(step: PipelineStep) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(stepRows(step));
  ws['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 10 }, { wch: 8 }, { wch: 9 }, { wch: 30 }, { wch: 26 }, { wch: 26 }];
  XLSX.utils.book_append_sheet(wb, ws, sheetName(step));
  XLSX.writeFile(wb, `${step.code}-${step.title.replace(/\s+/g, '_')}_categories.xlsx`);
}

export function exportFullXLSX(data: PipelineStep[]) {
  const wb = XLSX.utils.book_new();
  data.forEach((s) => {
    const ws = XLSX.utils.aoa_to_sheet(stepRows(s));
    ws['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 10 }, { wch: 8 }, { wch: 9 }, { wch: 30 }, { wch: 26 }, { wch: 26 }];
    XLSX.utils.book_append_sheet(wb, ws, sheetName(s));
  });
  XLSX.writeFile(wb, 'AIVP_all_8_steps_categories.xlsx');
}

/* ---------------- SANITIZE ---------------- */

const CONTROLS: ControlType[] = ['combobox', 'checkbox', 'multi'];
function sanitizeItems(raw: unknown): SuggestionItem[] {
  if (!Array.isArray(raw)) return [];
  const out: SuggestionItem[] = [];
  for (const it of raw) {
    const o = it as Partial<SuggestionItem>;
    const en = typeof o?.en === 'string' ? o.en.trim() : '';
    if (!en) continue;
    const vi = typeof o?.vi === 'string' && o.vi.trim() ? o.vi.trim() : undefined;
    out.push(vi ? { en, vi } : { en });
  }
  return out;
}

export function sanitizeCategories(raw: unknown): Category[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => {
      const o = c as Partial<Category>;
      if (typeof o?.id !== 'string' || typeof o?.en !== 'string' || !o.en.trim()) return null;
      const control = CONTROLS.includes(o.control as ControlType) ? (o.control as ControlType) : 'combobox';
      const items =
        control === 'checkbox'
          ? sanitizeItems(o.items).slice(0, 2)
          : sanitizeItems(o.items);
      return {
        id: o.id.trim(),
        en: o.en.trim(),
        vi: typeof o.vi === 'string' ? o.vi : '',
        control,
        required: !!o.required,
        group: o.group === 'form' || o.group === 'portrait' || o.group === 'body' ? o.group : undefined,
        note: typeof o.note === 'string' ? o.note : undefined,
        items: control === 'checkbox' && items.length < 2 ? [...items, { en: 'Yes' }, { en: 'No' }].slice(items.length) : items,
        // dữ liệu import → built-in (không cờ custom, không xóa được)
      } as Category;
    })
    .filter((x): x is Category => !!x);
}

/* ---------------- IMPORT: JSON ---------------- */

export type ImportResult =
  | { kind: 'step'; code: string; cats: Category[] }
  | { kind: 'full'; byCode: Record<string, Category[]> };

export function parseImportJson(text: string): ImportResult {
  const obj = JSON.parse(text) as Record<string, unknown> & {
    format?: string;
    code?: string;
    categories?: unknown;
    steps?: { code: string; title: string; categories: unknown }[];
  };
  if (obj.format === 'aivp-step' && typeof obj.code === 'string') {
    return { kind: 'step', code: obj.code, cats: sanitizeCategories(obj.categories) };
  }
  if (obj.format === 'aivp-full' && Array.isArray(obj.steps)) {
    const byCode: Record<string, Category[]> = {};
    obj.steps.forEach((s) => {
      const cats = sanitizeCategories(s.categories);
      if (typeof s.code === 'string' && s.code) byCode[s.code] = cats;
    });
    return { kind: 'full', byCode };
  }
  // chấp nhận thêm format trần {code, categories:[...]}
  if (typeof obj.code === 'string' && Array.isArray(obj.categories)) {
    return { kind: 'step', code: obj.code, cats: sanitizeCategories(obj.categories) };
  }
  throw new Error('File JSON không đúng định dạng AIVP (cần format aivp-step hoặc aivp-full).');
}

/* ---------------- IMPORT: XLSX ---------------- */

function catsFromRows(rows: (string | number)[][]): { code: string; cats: Category[] } | null {
  if (rows.length < 2) return null;
  const head = rows[0].map((h) => String(h).toLowerCase().trim());
  const idx = (k: string) => head.indexOf(k);
  const iCode = idx('step_code');
  const iId = idx('category_id');
  const iEn = idx('category_en');
  const iVi = idx('category_vi');
  const iCtl = idx('control');
  const iReq = idx('required');
  const iGrp = idx('group');
  const iNote = idx('note');
  const iItemEn = idx('item_en');
  const iItemVi = idx('item_vi');
  if (iId < 0 || iEn < 0) return null;

  const code = iCode >= 0 ? String(rows[1][iCode] ?? '').trim() : '';
  const map = new Map<string, Category>();
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const id = String(row[iId] ?? '').trim();
    if (!id) continue;
    if (!map.has(id)) {
      const ctl = String(row[iCtl] ?? 'combobox').trim() as ControlType;
      map.set(id, {
        id,
        en: String(row[iEn] ?? '').trim(),
        vi: String(row[iVi] ?? ''),
        control: CONTROLS.includes(ctl) ? ctl : 'combobox',
        required: iReq >= 0 && (String(row[iReq]) === '1' || String(row[iReq]).toLowerCase() === 'true'),
        group: ['form', 'portrait', 'body'].includes(String(row[iGrp])) ? (String(row[iGrp]) as Category['group']) : undefined,
        note: iNote >= 0 && String(row[iNote] ?? '').trim() ? String(row[iNote]) : undefined,
        items: [],
      });
    }
    if (iItemEn >= 0) {
      const en = String(row[iItemEn] ?? '').trim();
      const vi = iItemVi >= 0 ? String(row[iItemVi] ?? '').trim() : '';
      if (en && !map.get(id)!.items.some((x) => x.en === en)) map.get(id)!.items.push({ en, vi: vi || undefined });
    }
  }
  return { code, cats: [...map.values()] };
}

export async function parseImportXLSX(file: File): Promise<ImportResult> {
  const wb = XLSX.read(await file.arrayBuffer());
  const results: { code: string; cats: Category[] }[] = [];
  for (const name of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<(string | number)[]>(wb.Sheets[name], { header: 1, defval: '' });
    const got = catsFromRows(rows);
    if (got && got.cats.length) results.push(got);
  }
  if (results.length === 0) throw new Error('File Excel không có sheet nào đúng cấu trúc (cần các cột: step_code, category_id, category_en …).');
  if (results.length === 1) return { kind: 'step', code: results[0].code, cats: results[0].cats };
  const byCode: Record<string, Category[]> = {};
  results.forEach((r) => {
    if (r.code) byCode[r.code] = r.cats;
  });
  return { kind: 'full', byCode };
}

/** Import thống nhất: cho file .json | .xlsx | .xls */
export async function parseImportFile(file: File): Promise<ImportResult> {
  if (/\.json$/i.test(file.name)) return parseImportJson(await file.text());
  if (/\.(xlsx|xls|csv)$/i.test(file.name)) return parseImportXLSX(file);
  throw new Error('Chỉ nhận file .json hoặc .xlsx');
}
