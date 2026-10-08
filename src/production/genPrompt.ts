import type { Category, PipelineStep } from '../data/pipeline';
import { stepRefDefs, type Line } from '../store';

/** Lấy giá trị đang chọn của 1 category (nếu được bật). */
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
  return l ? `${l.idText}${l.desc ? ` “${l.desc}”` : ''}` : null;
};

const ids8 = new Set([
  'SH-01', 'SH-02', 'SH-03', 'SH-04', 'SH-05', 'SH-06', 'SH-07',
  'SH-08', 'SH-09', 'SH-10', 'SH-11', 'SH-12', 'SH-13',
]);

export function genPromptFor(step: PipelineStep, line: Line, allLines: Record<string, Line[]>): string {
  const title = `# ${line.idText} · ${step.title.toUpperCase()}${line.desc ? ` — ${line.desc}` : ''}`;
  const c = step.categories;

  let body: string[] = [];
  if (step.code === 'CH') {
    const grp = (g: string) => c.filter((x) => x.group === g);
    const sheetVals = grp('form')
      .map((x) => { const v = pick(line, x); return v ? `${x.en.replace('Reference ', '').replace('Sheet ', '')}: ${v}` : null; })
      .filter(Boolean)
      .join('  |  ');
    if (sheetVals) body.push(`Sheet: ${sheetVals}`);
    const portrait = rows(line, grp('portrait'));
    if (portrait.length) body.push('', '[PORTRAIT]', ...portrait);
    const bodyCats = rows(line, grp('body'));
    if (bodyCats.length) body.push('', '[BODY & WARDROBE]', ...bodyCats);
    const custom = rows(line, c.filter((x) => !x.group));
    if (custom.length) body.push('', '[EXTRA]', ...custom);
    body.push(
      '',
      'Consistency rules: same face, same hair, same wardrobe in every render.',
      'Deliver: clean background, studio lighting, 8k reference quality.',
    );
  } else if (step.code === 'SH') {
    const grp = (ids: string[]) => rows(line, c.filter((x) => ids.includes(x.id)));
    body.push(...grp(['SH-01', 'SH-02', 'SH-03', 'SH-04', 'SH-05']));
    body.push(...grp(['SH-08', 'SH-09']));
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

  const tail = FOOTERS[step.code];
  return [title, refs.length ? '\n[CONTEXT REFS]\n' + refs.join('\n') : '', '', ...body, tail ? '\n' + tail : '']
    .filter((x) => x !== '')
    .join('\n');
}

const FOOTERS: Record<string, string> = {
  ST: '→ Output: logline (1 câu) + synopsis (1 đoạn) + beat outline theo structure đã chọn.',
  WB: '→ Output: world bible mô tả môi trường + quy luật + bảng màu ám chỉ, giữ nhất quán toàn phim.',
  LC: '→ Output: background/establishing reference, rõ layout, ánh sáng, đạo cụ chủ đạo.',
  TR: '→ Output: viết đúng tone/nhịp/chức năng, trả kèm timestamps gợi ý nếu thuộc dạng narration.',
  VO: '→ Output: mô tả voice profile (voice casting) để clone/TTS — kèm 1 câu đọc mẫu.',
  SC: '→ Output: mô tả diễn biến chính của scene + lý do tồn tại trong mạch truyện.',
  SH: '→ Output: shot prompt hoàn chỉnh đưa thẳng vào Runway / Kling / Veo / Sora.',
};

/* ===================== GEN FULL — master doc cho AI Agent ===================== */

export interface AgentOpt {
  id: string;
  label: string;
  note: string;
  preamble: string[];
}

export const agents: AgentOpt[] = [
  {
    id: 'gg-flow',
    label: 'GG Flow · Google (Veo)',
    note: 'Tối ưu cho Google Flow / Veo 3 — câu điện ảnh ngắn, camera terms mở đầu prompt.',
    preamble: [
      'Agent: Google Flow + Veo 3.',
      'Mỗi shot prompt: bắt đầu bằng cụm camera (shot size + angle + movement), sau đó subject/action, kết bằng lighting/mood.',
      'Shot chuẩn 8 giây; tránh mô tả dài — ưu tiên cụm danh từ điện ảnh (cinematic noun phrases).',
      'Negative (bắt buộc gắn): morphing face, identity drift, flicker, warped hands, extra limbs.',
    ],
  },
  {
    id: 'minimax-h3',
    label: 'MiniMax Hailuo H3',
    note: 'Tối ưu cho MiniMax Hailuo H3 — nhấn subject-motion clarity, chuyển động mượt ≤ 6s.',
    preamble: [
      'Agent: MiniMax Hailuo H3.',
      'Shots ≤ 6 giây; một hành động chính / shot; mô tả quỹ đạo chuyển động rõ ràng (in/out direction).',
      'Đi kèm cụm ổn định: "smooth camera, stable motion, no jitter, high temporal consistency".',
      'Character prompts đính kèm mô tả vóc dáng & trang phục đầy đủ để model lock identity.',
    ],
  },
  {
    id: 'seedance',
    label: 'Seedance · ByteDance',
    note: 'Tối ưu cho Seedance — hỗ trợ multi-shot sequence, cut list mạch lạc.',
    preamble: [
      'Agent: ByteDance Seedance.',
      'Có thể sinh nhiều shot liên tiếp — giữ nguyên cụm mô tả nhân vật/địa điểm ở MỌI shot prompt.',
      'Dùng cinematic adjectives tiếng Anh nguyên vẹn; lồng duration + transition ở cuối mỗi shot.',
      'Yêu cầu: coherent multi-shot sequence, consistent lighting direction, no scene jump.',
    ],
  },
  {
    id: 'generic',
    label: 'Generic · Bất kỳ GenAI nào',
    note: 'Prompt trung lập, tương thích Runway / Kling / Pika / Sora / GPT / Gemini.',
    preamble: [
      'Agent: generic GenAI (tương thích đa nền tảng).',
      'Viết prompt Anh rõ ràng, đầy đủ, không dùng thuật ngữ riêng của một engine cụ thể.',
    ],
  },
];

export function buildFullProject(opts: {
  projectName: string;
  data: PipelineStep[];
  lines: Record<string, Line[]>;
  agent: AgentOpt;
}): string {
  const { projectName, data, lines, agent } = opts;
  const out: string[] = [];
  const SEP = '═'.repeat(60);

  out.push(
    SEP,
    `# MASTER PRODUCTION PROMPT · “${projectName}”`,
    `# AI VIDEO PIPELINE v1.1 — full 8-step brief cho AI Agent`,
    `TARGET AGENT: ${agent.label}`,
    SEP,
    '',
    '## AGENT INSTRUCTIONS',
    ...agent.preamble.map((x) => `- ${x}`),
    '',
    '## GLOBAL CONSISTENCY LOCK (bắt buộc áp dụng toàn bộ dự án)',
    '1. CHARACTER LOCK — Mọi nhân vật CH-### giữ nguyên khuôn mặt, tóc, trang phục, phụ kiện ở mọi scene/shot tham chiếu.',
    '2. WORLD LOCK — Địa điểm LC-### giữ layout, ánh sáng, bảng màu nhất quán xuyên các scene.',
    '3. VOICE LOCK — Giọng VO-### giữ pitch/chất giọng/tempo ổn định cho từng nhân vật.',
    '4. MOTION SAFETY — Motion mượt tự nhiên (no jitter), tránh morph/warp; khi có thể khóa seed/reference.',
    '5. REFERENCE FIRST — Nếu agent cho upload ảnh: luôn up ảnh sheet CH-###/LC-### trước khi gen shot.',
    '',
  );

  for (const step of data) {
    const ls = lines[step.code] ?? [];
    out.push(SEP, `## SECTION 0${step.no} · ${step.title.toUpperCase()} (${step.code}) — ${ls.length} line(s)`, SEP);
    if (!ls.length) {
      out.push('_(chưa có line nào ở tab này — bỏ qua khi đưa vào agent)_', '');
      continue;
    }
    ls.forEach((l, i) => {
      if (i > 0) out.push('');
      out.push(genPromptFor(step, l, lines));
    });
    out.push('');
  }

  out.push(SEP, '# END OF MASTER PROMPT — dán toàn bộ vào AI Agent, hoặc tách từng section theo công đoạn.', SEP);
  return out.join('\n');
}
