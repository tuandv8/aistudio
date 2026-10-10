import type { Category, PipelineStep } from '../data/pipeline';
import { stepRefDefs, type Line } from '../store';

/* ================================================================
 * PROMPT GENERATOR — OUTPUT 100% ENGLISH, PROFESSIONAL FILM TERMS
 *  - genPromptFor : 1 line  (footer hướng dẫn — tiếng Anh)
 *  - buildFullProject : master prompt cho AI Agent
 *      · chỉ gồm sections CÓ data (step rỗng bị loại)
 *      · không footer, không metadata thừa — copy/paste dùng ngay
 * ================================================================ */

const pick = (line: Line, cat: Category): string | null => {
  const v = line.values[cat.id];
  if (!v || !v.on || cat.items.length === 0) return null;
  if (cat.control === 'multi') {
    const picks = (v.picks ?? []).filter((i) => i < cat.items.length);
    if (!picks.length) return null;
    return picks.map((i) => cat.items[i].en).join(' + ');
  }
  return cat.items[Math.min(v.i, cat.items.length - 1)]?.en ?? null;
};

const rows = (line: Line, cats: Category[], prefix = '- '): string[] =>
  cats
    .map((c) => {
      const v = pick(line, c);
      return v ? `${prefix}${c.en}: ${v}` : null;
    })
    .filter((r): r is string => !!r);

const refLine = (uid: string, pool: Line[]): string | null => {
  const l = pool.find((x) => x.uid === uid);
  return l ? `${l.idText}${l.desc ? ` "${l.desc}"` : ''}` : null;
};

const ids8 = new Set([
  'SH-01', 'SH-02', 'SH-03', 'SH-04', 'SH-05', 'SH-06', 'SH-07',
  'SH-08', 'SH-09', 'SH-10', 'SH-11', 'SH-12', 'SH-13',
]);

export interface GenOpts {
  /** false = bỏ footer "Deliverable:" (dùng trong master doc cho gọn) */
  footer?: boolean;
}

export function genPromptFor(step: PipelineStep, line: Line, allLines: Record<string, Line[]>, opts: GenOpts = {}): string {
  const { footer = true } = opts;
  const title = `# ${line.idText} · ${step.title.toUpperCase()}${line.desc ? ` — ${line.desc}` : ''}`;
  const c = step.categories;

  let body: string[] = [];
  if (step.code === 'CH') {
    const grp = (g: string) => c.filter((x) => x.group === g);
    const sheetVals = grp('form')
      .map((x) => {
        const v = pick(line, x);
        return v ? `${x.en.replace('Reference ', '').replace('Sheet ', '')}: ${v}` : null;
      })
      .filter(Boolean)
      .join(' | ');
    if (sheetVals) body.push(`Reference sheet — ${sheetVals}`);
    const portrait = rows(line, grp('portrait'));
    if (portrait.length) body.push('', '[PORTRAIT]', ...portrait);
    const bodyCats = rows(line, grp('body'));
    if (bodyCats.length) body.push('', '[BODY & WARDROBE]', ...bodyCats);
    const custom = rows(line, c.filter((x) => !x.group));
    if (custom.length) body.push('', '[EXTRA]', ...custom);
    body.push(
      '',
      'Consistency: identical face, hair, wardrobe and props in every render.',
      'Output: clean neutral background, soft studio lighting, 8K reference quality.',
    );
  } else if (step.code === 'SH') {
    const grp = (ids: string[]) => rows(line, c.filter((x) => ids.includes(x.id)));
    body.push('[CAMERA]', ...grp(['SH-01', 'SH-02', 'SH-03', 'SH-04', 'SH-05']));
    const look = grp(['SH-08', 'SH-09']);
    if (look.length) body.push('', '[FRAMING & LIGHTING]', ...look);
    const action = grp(['SH-06', 'SH-07', 'SH-12', 'SH-13']);
    if (action.length) body.push('', '[ACTION]', ...action);
    const audio = grp(['SH-10', 'SH-11']);
    if (audio.length) body.push('', '[AUDIO]', ...audio);
    const others = rows(line, c.filter((x) => !ids8.has(x.id)));
    if (others.length) body.push('', '[EXTRA]', ...others);
  } else {
    body = rows(line, c);
  }

  const refs: string[] = [];
  (stepRefDefs[step.code] ?? []).forEach((rd) => {
    const uids = line.refs[rd.key] ?? [];
    const resolved = uids.map((u) => refLine(u, allLines[rd.from] ?? [])).filter(Boolean);
    if (resolved.length) refs.push(`- ${rd.label}: ${resolved.join(' + ')}`);
  });

  const parts = [title];
  if (refs.length) parts.push('', '[CONTEXT REFS]', ...refs);
  parts.push('', ...body);
  if (footer && FOOTERS[step.code]) parts.push('', FOOTERS[step.code]);
  return parts.join('\n');
}

const FOOTERS: Record<string, string> = {
  ST: 'Deliverable: one-sentence logline, short synopsis, and beat outline following the selected structure.',
  WB: 'Deliverable: world bible — environment, ground rules, color palette — consistent across the entire film.',
  CH: 'Deliverable: character reference sheet (portrait + full body) for downstream consistency.',
  LC: 'Deliverable: establishing/background reference — layout, lighting, key set dressing.',
  TR: 'Deliverable: script in the selected tone, pace and narrative function; include suggested timecodes for narration.',
  VO: 'Deliverable: voice profile for casting / TTS cloning, plus one sample read.',
  SC: 'Deliverable: scene breakdown — main action beats and dramatic purpose.',
  SH: 'Deliverable: ready-to-run shot prompt for Runway / Kling / Veo / Sora.',
};

/* ===================== GEN FULL — master prompt cho AI Agent ===================== */

export interface AgentOpt {
  id: string;
  label: string;
  note: string; // note UI (tiếng Việt ok)
  preamble: string[]; // 100% English
}

export const agents: AgentOpt[] = [
  {
    id: 'gg-flow',
    label: 'GG Flow · Google (Veo)',
    note: 'Tối ưu cho Google Flow / Veo 3 — câu điện ảnh ngắn, camera terms mở đầu prompt.',
    preamble: [
      'Agent: Google Flow + Veo 3.',
      'Open every shot prompt with the camera package (shot size + angle + movement), then subject and action, then lighting and mood.',
      'Target 8-second shots; prefer dense cinematic noun phrases over long prose.',
      'Mandatory negative prompt: morphing face, identity drift, flicker, warped hands, extra limbs.',
    ],
  },
  {
    id: 'minimax-h3',
    label: 'MiniMax Hailuo H3',
    note: 'Tối ưu cho MiniMax Hailuo H3 — nhấn subject-motion clarity, chuyển động mượt ≤ 6s.',
    preamble: [
      'Agent: MiniMax Hailuo H3.',
      'Shots up to 6 seconds; one primary action per shot; state motion direction explicitly (in/out, left/right).',
      'Append stability clause: "smooth camera, stable motion, no jitter, high temporal consistency".',
      'Always include full physique and wardrobe description in character prompts to lock identity.',
    ],
  },
  {
    id: 'seedance',
    label: 'Seedance · ByteDance',
    note: 'Tối ưu cho Seedance — hỗ trợ multi-shot sequence, cut list mạch lạc.',
    preamble: [
      'Agent: ByteDance Seedance.',
      'Multi-shot sequences supported: repeat identical character and location descriptors in every shot prompt.',
      'Keep the English cinematic adjectives verbatim; append duration and transition at the end of each shot.',
      'Require: coherent multi-shot sequence, consistent lighting direction, no scene jumps.',
    ],
  },
  {
    id: 'generic',
    label: 'Generic · Any GenAI',
    note: 'Prompt trung lập, tương thích Runway / Kling / Pika / Sora / GPT / Gemini.',
    preamble: [
      'Agent: generic (Runway / Kling / Pika / Sora / GPT / Gemini compatible).',
      'Plain, explicit English prompts; avoid engine-specific jargon.',
    ],
  },
];

/** ước lượng runtime từ SH-12 Shot Duration */
function estimateRuntime(lines: Record<string, Line[]>, data: PipelineStep[]): string | null {
  const sh = data.find((s) => s.code === 'SH');
  if (!sh) return null;
  const durCat = sh.categories.find((c) => c.id === 'SH-12');
  if (!durCat) return null;
  let total = 0;
  let n = 0;
  (lines['SH'] ?? []).forEach((l) => {
    const v = l.values['SH-12'];
    if (!v || !v.on) return;
    const en = durCat.items[Math.min(v.i, durCat.items.length - 1)]?.en ?? '';
    const sec = parseFloat(en);
    if (!Number.isNaN(sec)) {
      total += sec;
      n++;
    }
  });
  return n ? `${n} shots · ~${total}s total runtime` : null;
}

export function buildFullProject(opts: {
  projectName: string;
  projectCode?: string;
  data: PipelineStep[];
  lines: Record<string, Line[]>;
  agent: AgentOpt;
}): string {
  const { projectName, projectCode, data, lines, agent } = opts;

  // CHỈ giữ sections có data — step rỗng bị loại hoàn toàn
  const included = data.filter((s) => (lines[s.code] ?? []).length > 0);
  if (!included.length) {
    return `# MASTER PRODUCTION PROMPT — "${projectName}"${projectCode ? ` · ${projectCode}` : ''}\n\nNo production data yet. Add lines in Develop, then run GEN FULL again.`;
  }

  const out: string[] = [];
  out.push(
    `# MASTER PRODUCTION PROMPT — "${projectName}"${projectCode ? ` · ${projectCode}` : ''}`,
    `Target agent: ${agent.label}`,
    '',
    '## AGENT DIRECTIVES',
    ...agent.preamble.map((x) => `- ${x}`),
    '',
    '## GLOBAL CONSISTENCY LOCK',
    '1. CHARACTER LOCK — every referenced character (CH-###) keeps identical face, hair, wardrobe and props across all scenes and shots.',
    '2. WORLD LOCK — every referenced location (LC-###) keeps identical layout, lighting direction and color palette.',
    '3. VOICE LOCK — every referenced voice (VO-###) keeps identical pitch, timbre and tempo.',
    '4. MOTION SAFETY — smooth, physically plausible motion; no morphing, no identity drift, no flicker; lock seed / reference frames where supported.',
    '5. REFERENCE FIRST — generate or upload character and location reference sheets before any dependent shot.',
    '',
  );

  const runtime = estimateRuntime(lines, data);
  if (runtime) {
    out.push(`## PRODUCTION SUMMARY`, `- ${runtime}`, '');
  }

  included.forEach((step) => {
    const ls = lines[step.code] ?? [];
    out.push(`## SECTION ${String(step.no).padStart(2, '0')} · ${step.title.toUpperCase()} (${step.code}) — ${ls.length} record(s)`);
    ls.forEach((l, i) => {
      if (i > 0) out.push('');
      out.push(genPromptFor(step, l, lines, { footer: false }));
    });
    out.push('');
  });

  out.push('— END OF MASTER PROMPT —');
  return out.join('\n');
}
