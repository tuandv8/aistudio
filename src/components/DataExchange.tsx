import { useRef, useState } from 'react';
import { CheckCircle2, Crown, FileDown, FileSpreadsheet, FileUp, UploadCloud } from 'lucide-react';
import { useAuth } from '../auth';
import { Reveal } from '../hooks/useReveal';
import { useStore } from '../store';
import { stepTheme } from '../theme';
import {
  buildFullJson,
  buildStepJson,
  downloadFile,
  exportFullXLSX,
  exportStepXLSX,
  parseImportFile,
} from '../services/exchange';

type Msg = { kind: 'ok' | 'err'; text: string } | null;

export default function DataExchange() {
  const { user } = useAuth();
  const store = useStore();
  const [msg, setMsg] = useState<Msg>(null);
  const fullInput = useRef<HTMLInputElement>(null);
  const stepInput = useRef<HTMLInputElement>(null);
  const [importingStep, setImportingStep] = useState<string | null>(null);

  // CHỈ ADMIN mới nhìn thấy & dùng được
  if (!user || user.role !== 'admin') return null;

  const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

  const exportStepJson = (code: string) => {
    const s = store.data.find((x) => x.code === code);
    if (!s) return;
    downloadFile(`${code}-${s.title.replace(/\s+/g, '_')}_categories_${stamp()}.json`, JSON.stringify(buildStepJson(s), null, 2));
    setMsg({ kind: 'ok', text: `Đã export JSON step ${code} · ${s.categories.length} categories.` });
  };
  const exportStepXls = (code: string) => {
    const s = store.data.find((x) => x.code === code);
    if (!s) return;
    exportStepXLSX(s);
    setMsg({ kind: 'ok', text: `Đã export Excel step ${code} (sheet “${code}-${s.title.slice(0, 24)}”).` });
  };
  const exportFullJson = () => {
    downloadFile(`AIVP_all_8_steps_${stamp()}.json`, JSON.stringify(buildFullJson(store.data), null, 2));
    setMsg({ kind: 'ok', text: 'Đã export JSON tổng hợp 8 steps.' });
  };

  const onFullFile = async (file: File) => {
    try {
      const res = await parseImportFile(file);
      if (res.kind === 'step') {
        // file 1 step nhưng nạp ở nút tổng hợp — vẫn nhận, thay đúng step đó
        const exists = store.data.some((s) => s.code === res.code);
        if (!exists) throw new Error(`Không tìm thấy step code “${res.code}” trong pipeline.`);
        store.replaceStepData(res.code, res.cats);
        setMsg({ kind: 'ok', text: `Import thành công ${res.code}: ${res.cats.length} categories thay thế built-in (từ “${file.name}”).` });
      } else {
        // full: merge theo step code — step nào có trong file thì thay, step nào không có thì giữ nguyên
        const codes = Object.keys(res.byCode).filter((k) => store.data.some((s) => s.code === k));
        if (!codes.length) throw new Error('Không có step code nào trong file khớp pipeline (ST/WB/CH/LC/TR/VO/SC/SH).');
        const merged = store.data.map((s) => (res.byCode[s.code] ? { ...s, categories: res.byCode[s.code] } : s));
        store.replaceAllData(merged);
        setMsg({
          kind: 'ok',
          text: `Import TỔNG HỢP thành công: thay thế ${codes.length}/8 step(s) [${codes.join(', ')}] từ “${file.name}” — built-in đã thay đổi theo file.`,
        });
      }
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Import thất bại.' });
    }
  };

  const onStepFile = async (code: string, file: File) => {
    try {
      const res = await parseImportFile(file);
      if (res.kind !== 'step') throw new Error('File này chứa nhiều step — hãy dùng ô Import tổng hợp bên trên.');
      if (res.code && res.code !== code) setMsg({ kind: 'ok', text: `Lưu ý: file mang code “${res.code}” — sẽ nạp vào step ${code} đang chọn.` });
      store.replaceStepData(code, res.cats);
      setMsg({ kind: 'ok', text: `Import thành công cho step ${code}: ${res.cats.length} categories (${file.name}). Built-in đã thay đổi.` });
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Import thất bại.' });
    }
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50/80 via-white to-white shadow-md shadow-fuchsia-100">
            {/* header */}
            <div className="flex flex-wrap items-center gap-3 border-b border-fuchsia-100 bg-white/70 px-5 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white shadow-md">
                <Crown size={16} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-[15px] font-extrabold tracking-tight text-slate-900">
                  Import / Export dữ liệu
                  <span className="ml-2 rounded-full border border-fuchsia-300 bg-fuchsia-100 px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-widest text-fuchsia-700 align-middle">
                    ADMIN ONLY
                  </span>
                </h2>
                <p className="truncate font-mono text-[10px] text-slate-400">
                  Chuẩn JSON & Excel (.xlsx) · import sẽ THAY THẾ built-in của step tương ứng · số lượng nạp bao nhiêu thì hệ thống nhận bấy nhiêu
                </p>
              </div>
              {/* full actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportFullJson}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
                >
                  <FileDown size={13} />
                  Export ALL · JSON
                </button>
                <button
                  onClick={() => {
                    exportFullXLSX(store.data);
                    setMsg({ kind: 'ok', text: 'Đã export Excel tổng hợp (1 file, 8 sheets).' });
                  }}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[11px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  <FileSpreadsheet size={13} />
                  Export ALL · Excel
                </button>
                <button
                  onClick={() => fullInput.current?.click()}
                  className="flex h-8 items-center gap-1.5 rounded-lg border-2 border-dashed border-fuchsia-300 bg-white px-3 text-[11px] font-bold text-fuchsia-600 transition-all hover:-translate-y-0.5 hover:border-fuchsia-400 hover:bg-fuchsia-50"
                >
                  <UploadCloud size={13} />
                  Import ALL (.json/.xlsx)
                </button>
                <input
                  ref={fullInput}
                  type="file"
                  accept=".json,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onFullFile(f);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>

            {/* status */}
            {msg && (
              <div
                className={`flex items-start gap-2 border-b px-5 py-2.5 text-[12px] font-semibold ${
                  msg.kind === 'ok' ? 'border-emerald-100 bg-emerald-50/60 text-emerald-700' : 'border-rose-100 bg-rose-50/60 text-rose-600'
                }`}
              >
                <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                {msg.text}
              </div>
            )}

            {/* per-step rows */}
            <div className="grid gap-px bg-fuchsia-100/60 sm:grid-cols-2 lg:grid-cols-4">
              {store.data.map((s) => {
                const t = stepTheme[s.code];
                return (
                  <div key={s.code} className="flex items-center gap-2.5 bg-white px-4 py-3">
                    <span className={`rounded-md bg-gradient-to-br ${t.grad} px-2 py-1 font-mono text-[10px] font-bold text-white`}>
                      {s.code}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-bold text-slate-800">{s.title}</span>
                      <span className="block font-mono text-[9px] text-slate-400">
                        {s.categories.length} cats · {s.categories.reduce((a, c) => a + c.items.length, 0)} items
                      </span>
                    </span>
                    <button
                      onClick={() => exportStepJson(s.code)}
                      title={`Export JSON step ${s.code}`}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:border-indigo-400 hover:text-indigo-600"
                    >
                      <FileDown size={13} />
                    </button>
                    <button
                      onClick={() => exportStepXls(s.code)}
                      title={`Export Excel step ${s.code}`}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-emerald-600 transition-all hover:border-emerald-400 hover:bg-emerald-50"
                    >
                      <FileSpreadsheet size={13} />
                    </button>
                    <button
                      onClick={() => {
                        setImportingStep(s.code);
                        stepInput.current?.click();
                      }}
                      title={`Import (thay thế) step ${s.code}`}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-dashed border-fuchsia-300 text-fuchsia-500 transition-all hover:border-fuchsia-400 hover:bg-fuchsia-50"
                    >
                      <FileUp size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
            <input
              ref={stepInput}
              type="file"
              accept=".json,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && importingStep) void onStepFile(importingStep, f);
                e.target.value = '';
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
