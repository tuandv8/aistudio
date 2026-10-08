/**
 * ============================================================
 *  AI VIDEO PIPELINE — BLUEPRINT v1.0  (BƯỚC 1: PHÂN TÍCH)
 * ------------------------------------------------------------
 *  8 bước sản xuất → mỗi bước là 1 "tab" ở web-app Bước 2.
 *  Mỗi bước gồm các CATEGORY, mỗi category có:
 *    - control: 'combobox' (3–20 items, chọn 1) | 'checkbox' (đúng 2 lựa chọn)
 *    - items:   gợi ý EN (chuẩn ngành, đưa thẳng vào prompt GenAI) + chú thích VI
 *
 *  ⚠️ PHÁT HIỆN: step 4 & step 6 trong brief đều là "Locations ID".
 *  ĐỀ XUẤT: step 6 = VOICE ID (nhận diện giọng nói) — vì transcript (5)
 *  cần voice cast trước khi lồng vào Scenes (7) & Shots (8). Chờ duyệt.
 * ============================================================
 */

export type ControlType = 'combobox' | 'checkbox' | 'multi';
export type CharGroup = 'form' | 'portrait' | 'body';

export interface SuggestionItem {
  en: string;
  vi?: string;
  /** item do ngườI dùNG tự thêm — cho phép sửa/xóa; built-in thì không */
  custom?: boolean;
}

export interface Category {
  id: string;
  en: string;
  vi: string;
  control: ControlType;
  required?: boolean;
  group?: CharGroup;
  note?: string;
  /** category do ngườI dùNG tự thêm — cho phép sửa/xóa; built-in thì không */
  custom?: boolean;
  items: SuggestionItem[];
}

export interface PipelineStep {
  no: number;
  code: string;
  title: string;
  titleVi: string;
  purpose: string;
  output: string;
  categories: Category[];
}

export const it = (en: string, vi?: string): SuggestionItem => ({ en, vi });

const raw: PipelineStep[] = [
  /* =========================================================
   * STEP 1 — STORYLINE
   * ======================================================= */
  {
    no: 1,
    code: 'ST',
    title: 'Storyline',
    titleVi: 'Cốt truyện',
    purpose: 'Định nghĩa ý tưởng truyện: logline, kết cấu, mục tiêu cảm xúc. Nền móng của toàn pipeline — mọi step sau đều tham chiếu về đây.',
    output: 'Logline + Synopsis + Narrative brief (prompt gốc cho cả pipeline).',
    categories: [
      {
        id: 'ST-01', en: 'Genre', vi: 'Thể loại chính', control: 'combobox', required: true,
        items: [
          it('Action', 'Hành động'), it('Adventure', 'Phiêu lưu'), it('Animation', 'Hoạt hình'),
          it('Biography', 'Tiểu sử'), it('Comedy', 'Hài kịch'), it('Crime', 'Tội phạm'),
          it('Documentary', 'Tài liệu'), it('Drama', 'Chính kịch'), it('Family', 'Gia đình'),
          it('Fantasy', 'Giả tưởng'), it('Historical', 'Lịch sử'), it('Horror', 'Kinh dị'),
          it('Musical', 'Nhạc kịch'), it('Mystery', 'Bí ẩn'), it('Romance', 'Lãng mạn'),
          it('Sci-Fi', 'Khoa học viễn tưởng'), it('Sport', 'Thể thao'), it('Thriller', 'Giật gân'),
          it('War', 'Chiến tranh'), it('Western', 'Viễn Tây'),
        ],
      },
      {
        id: 'ST-02', en: 'Sub-Genre', vi: 'Phân thể loại lai', control: 'combobox',
        items: [
          it('Neo-noir', 'Tân hắc kịch'), it('Heist', 'Phi vụ kỹ nghệ'),
          it('Space opera', 'Sử thi vũ trụ'), it('Cyberpunk', 'Đô thị tương lai u tối'),
          it('Slasher', 'Kinh dị chém giết'), it('Found footage', 'Thước phim thô tìm được'),
          it('Isekai', 'Xuyên không dị giới'), it('Slice of life', 'Lát cắt đồi thường'),
          it('Kaiju', 'Quái vật khổng lồ'), it('Romantic comedy', 'Lãng mạn hài'),
          it('Folk horror', 'Kinh dị dân gian'), it('Anthology', 'Tuyển truyện ngắn'),
        ],
      },
      {
        id: 'ST-03', en: 'Theme', vi: 'Chủ đề nền', control: 'combobox', required: true,
        items: [
          it('Redemption', 'Chuộc lỗi'), it('Coming of age', 'Trưởng thành'),
          it('Survival', 'Sinh tồn'), it('Love & loss', 'Yêu & mất mát'),
          it('Power & corruption', 'Quyền lực & tha hóa'), it('Identity', 'Bản sắc'),
          it('Revenge', 'Báo thù'), it('Sacrifice', 'Hy sinh'),
          it('Friendship', 'Tình bạn'), it('Good vs evil', 'Thiện đối đầu ác'),
          it('Technology & humanity', 'Công nghệ & con người'),
          it('Freedom', 'Tự do'), it('Family bonds', 'Huyết thống'),
          it('Justice', 'Công lý'), it('Betrayal', 'Phản bội'),
          it('Dreams & ambition', 'Ước mơ & hoài bão'),
        ],
      },
      {
        id: 'ST-04', en: 'Tone & Mood', vi: 'Tông giọng & tâm khí', control: 'combobox', required: true,
        items: [
          it('Dark & brooding', 'Tối trầm'), it('Uplifting', 'Khích lệ'),
          it('Melancholic', 'U sầu'), it('Epic', 'Hùng tráng'),
          it('Whimsical', 'Kỳ ảo nghịch ngợm'), it('Suspenseful', 'Nghẹt thở căng thẳng'),
          it('Humorous', 'Hài hước'), it('Romantic', 'Lãng mạn'),
          it('Gritty', 'Sắc lạnh gai góc'), it('Hopeful', 'Tràn hy vọng'),
          it('Surreal', 'Siêu thực'), it('Nostalgic', 'Hoài niệm'),
          it('Dreamlike', 'Mộng mơ'), it('Ominous', 'Điềm gở'),
        ],
      },
      {
        id: 'ST-05', en: 'Narrative Structure', vi: 'Cấu trúc kể chuyện', control: 'combobox',
        items: [
          it('Three-act', 'Kết cấu 3 hồi'), it('Five-act', 'Kết cấu 5 hồi'),
          it("Hero's journey", 'Hành trình anh hùng'), it('Non-linear', 'Phi tuyến tính'),
          it('In medias res', 'Vào ngay giữa sự việc'), it('Frame story', 'Truyện nhúng truyện'),
          it('Circular', 'Cấu trúc vòng'), it('Parallel storylines', 'Tuyến truyện song song'),
          it('Reverse chronology', 'Kể ngược tuyến tính'),
          it('Kishōtenketsu', 'Khởi–Thừa–Chuyển–Hợp'),
        ],
      },
      {
        id: 'ST-06', en: 'Conflict Type', vi: 'Kiểu xung đột', control: 'combobox',
        items: [
          it('Person vs self', 'Nội tâm tranh đấu'), it('Person vs person', 'Đối đầu cá nhân'),
          it('Person vs nature', 'Chống lại thiên nhiên'), it('Person vs society', 'Chống lại xã hội'),
          it('Person vs technology', 'Chống lại công nghệ'), it('Person vs supernatural', 'Đối đầu siêu nhiên'),
          it('Person vs fate', 'Chống lại định mệnh'), it('Interwoven mix', 'Nhiều tuyến đan xen'),
        ],
      },
      {
        id: 'ST-07', en: 'Pacing', vi: 'Nhịp truyện', control: 'combobox',
        items: [
          it('Slow burn', 'Cháy chậm sâu'), it('Steady build', 'Đều đặn tăng trưởng'),
          it('Fast-paced', 'Nhanh dồn nén'), it('Hyper-cut', 'Dựng siêu tốc'),
        ],
      },
      {
        id: 'ST-08', en: 'Format', vi: 'Định dạng video', control: 'combobox',
        items: [
          it('Micro-short (15–60s)', 'Phim siêu ngắn'), it('Vertical social short', 'Video dọc mạng xã hội'),
          it('Commercial / ad', 'Quảng cáo'), it('Music video', 'MV âm nhạc'),
          it('Trailer / teaser', 'Trailer giới thiệu'), it('Web episode', 'Tập phim web'),
          it('Short film (5–20 min)', 'Phim ngắn'), it('Documentary short', 'Tài liệu ngắn'),
          it('Concept film', 'Phim ý niệm'), it('Feature scene extract', 'Trích đoạn phim trường'),
        ],
      },
      {
        id: 'ST-09', en: 'Duration', vi: 'Độ dài', control: 'combobox',
        items: [
          it('15 seconds'), it('30 seconds'), it('45 seconds'), it('60 seconds'),
          it('90 seconds'), it('3 minutes'), it('5 minutes'), it('10 minutes'),
          it('20 minutes'), it('30 minutes+'),
        ],
      },
      {
        id: 'ST-10', en: 'Aspect Ratio', vi: 'Tỷ lệ khung hình', control: 'combobox',
        items: [
          it('16:9 landscape', 'Ngang tiêu chuẩn'), it('9:16 vertical', 'Dọc cho di động'),
          it('1:1 square', 'Vuông'), it('4:5 portrait', 'Dọc feed 4:5'),
          it('4:3 classic', 'Kinh điển 4:3'), it('2.39:1 cinemascope', 'Điện ảnh scope'),
        ],
      },
      {
        id: 'ST-11', en: 'Target Audience', vi: 'Đối tượng khán giả', control: 'combobox',
        items: [
          it('Kids 3–7', 'Thiếu nhi 3–7'), it('Children 8–12', 'Trẻ em 8–12'),
          it('Teens 13–17', 'Thiếu niên'), it('Young adults 18–25', 'Thanh niên'),
          it('Adults 26–45', 'Trưởng thành'), it('Mature 45+', 'Trung niên 45+'),
          it('Family, all ages', 'Mọi lứa tuổi'),
        ],
      },
      {
        id: 'ST-12', en: 'Opening Hook', vi: 'Cú mở màn', control: 'combobox',
        items: [
          it('Cold open action', 'Mở thẳng hành động'), it('Question hook', 'Đặt câu hỏi'),
          it('Flashforward teaser', 'Hé cảnh tương lai'), it('Mystery tease', 'Gợi mở bí ẩn'),
          it('Visual spectacle', 'Phô diễn hình ảnh'), it('Character intro', 'Giới thiệu nhân vật'),
          it('Voiceover quote', 'Trích đoạn narration'), it('POV immersion', 'Nhập vai POV'),
        ],
      },
      {
        id: 'ST-13', en: 'Ending Type', vi: 'Kiểu kết', control: 'combobox',
        items: [
          it('Happy ending', 'Hạnh phúc'), it('Bittersweet', 'Ngọt đắng'),
          it('Tragic', 'Bi kịch'), it('Cliffhanger', 'Treo ngọn'),
          it('Twist', 'Xoắn bất ngờ'), it('Open ending', 'Kết mở'),
          it('Circular', 'Kết vòng khép kín'), it('Ambiguous', 'Đa nghĩa'),
        ],
      },
    ],
  },

  /* =========================================================
   * STEP 2 — WORLD BIBLE
   * ======================================================= */
  {
    no: 2,
    code: 'WB',
    title: 'World Bible',
    titleVi: 'Thế giới quan',
    purpose: 'Khóa luật chơi của vũ trụ: niên đại, địa lý, công nghệ, phép thuật, văn hóa & bảng màu — để mọi cảnh quay nhất quán.',
    output: 'World Bible 1 trang: quy luật vật lý, thẩm mỹ, môi trường nhân vật tồn tại.',
    categories: [
      {
        id: 'WB-01', en: 'World Type', vi: 'Loại thế giới', control: 'combobox', required: true,
        items: [
          it('Contemporary real-world', 'Thế giới thật đương đại'), it('Historical period', 'Cổ trang lịch sử'),
          it('Near-future sci-fi', 'Viễn tưởng cận tương lai'), it('Space-faring sci-fi', 'Viễn tưởng vũ trụ'),
          it('Cyberpunk', 'Cyberpunk đô thị tối'), it('High fantasy', 'Giả tưởng cao'),
          it('Low / urban fantasy', 'Giả tưởng đô thị'), it('Post-apocalyptic', 'Hậu tận thế'),
          it('Dystopia', 'Phản địa đàng'), it('Utopia', 'Địa đàng'),
          it('Steampunk', 'Cơ khí hơi nước'), it('Mythological', 'Thần thoại'),
          it('Dream / surreal', 'Mộng huyễn'), it('Multiverse', 'Đa vũ trụ'),
        ],
      },
      {
        id: 'WB-02', en: 'Era', vi: 'Niên đại', control: 'combobox', required: true,
        items: [
          it('Prehistoric', 'Tiền sử'), it('Ancient civilizations', 'Cổ đại'),
          it('Medieval', 'Trung cổ'), it('Renaissance', 'Phục Hưng'),
          it('Victorian 19th century', 'Victoria thế kỷ 19'), it('Early 1900s', 'Đầu thế kỷ 20'),
          it('1950s–1970s retro', 'Trung niên retro'), it('1980s', 'Thập niên 80'),
          it('1990s', 'Thập niên 90'), it('Y2K 2000s', 'Đầu 2000'),
          it('Present day (2026)', 'Hiện tại'), it('Near future 2030–2080', 'Cận tương lai'),
          it('Far future 2100+', 'Tương lai xa'),
        ],
      },
      {
        id: 'WB-03', en: 'Geography', vi: 'Địa lý trục', control: 'combobox',
        items: [
          it('Metropolis', 'Đô thị khổng lồ'), it('Small town', 'Thị trấn nhỏ'),
          it('Rural village', 'Làng quê'), it('Coastal island', 'Duyên hải / đảo'),
          it('Desert', 'Sa mạc'), it('Jungle rainforest', 'Rừng mưa nhiệt đới'),
          it('Mountain range', 'Vùng núi cao'), it('Arctic tundra', 'Đất hàn đới'),
          it('Space / off-world', 'Ngoài trái đất'), it('Underwater', 'Dưới đáy biển'),
          it('Underground', 'Lòng đất'), it('Floating sky realm', 'Lơ lửng trên không'),
          it('Cyberspace / virtual', 'Không gian ảo'),
        ],
      },
      {
        id: 'WB-04', en: 'Technology Level', vi: 'Trình độ công nghệ', control: 'combobox',
        items: [
          it('Primitive', 'Nguyên thủy'), it('Bronze / iron age', 'Đồ đồng / đồ sắt'),
          it('Medieval craft', 'Thủ công trung cổ'), it('Industrial steam', 'Cách mạng hơi nước'),
          it('Analog 20th century', 'Cơ điện tử thế kỷ 20'), it('Digital present', 'Kỷ nguyên số hiện tại'),
          it('High-tech', 'Cao công nghệ'), it('Cybernetic augmentation', 'Cơ khí hóa cơ thể'),
          it('Biotech / genetic', 'Sinh học gen'), it('Post-singularity AI', 'Hậu kỳ dị AI'),
        ],
      },
      {
        id: 'WB-05', en: 'Power / Magic System', vi: 'Hệ thống phép / sức mạnh', control: 'combobox',
        items: [
          it('None — grounded reality', 'Không có, sát thế giới thật'),
          it('Soft magic (mysterious)', 'Phép mềm mơ hồ'),
          it('Hard magic (rule-based)', 'Phép cứng có luật'), it('Elemental', 'Nguyên tố ngũ hành'),
          it('Psychic / Esper', 'Ngoại cảm tâm linh'), it('Chi / spiritual energy', 'Nội lực khí công'),
          it('Divine powers', 'Thần lực'), it('Alchemy', 'Giả kim thuật'),
          it('Technomagic', 'Ma thuật công nghệ'), it('Spirit bonded beasts', 'Linh thú giao ước'),
        ],
      },
      {
        id: 'WB-06', en: 'Societal Structure', vi: 'Cấu trúc xã hội', control: 'combobox',
        items: [
          it('Democracy', 'Dân chủ'), it('Monarchy', 'Quân chủ'),
          it('Empire', 'Đế chế'), it('Theocracy', 'Thần quyền'),
          it('Corporate rule', 'Tập đoàn cai trị'), it('Feudal lords', 'Phong kiến'),
          it('Tribal clans', 'Bộ lạc gia tộc'), it('Military junta', 'Quân phiệt'),
          it('Anarchy', 'Vô chính phủ'), it('Technocracy', 'Chuyên trị kỹ thuật'),
        ],
      },
      {
        id: 'WB-07', en: 'Cultural Inspiration', vi: 'Ảnh hưởng văn hóa', control: 'combobox',
        items: [
          it('Western European', 'Tây Âu'), it('Japanese', 'Nhật Bản'),
          it('Chinese', 'Trung Hoa'), it('Korean', 'Hàn Quốc'),
          it('Southeast Asian / Vietnamese', 'Đông Nam Á / Việt Nam'), it('South Asian', 'Nam Á'),
          it('Middle Eastern', 'Trung Đông'), it('Nordic', 'Bắc Âu'),
          it('African', 'Châu Phi'), it('Latin American', 'Mỹ Latinh'),
          it('Multicultural blend', 'Dung hợp đa văn hóa'),
        ],
      },
      {
        id: 'WB-08', en: 'World Color Palette', vi: 'Bảng màu thế giới', control: 'combobox', required: true,
        items: [
          it('Warm amber', 'Vàng ấm'), it('Cool blue', 'Lam lạnh'),
          it('Neon cyber pink–cyan', 'Neon hồng–cyan'), it('Earthy muted', 'Nâu đất dịu'),
          it('Monochrome noir', 'Đen trắng noir'), it('Pastel dream', 'Pastel mộng'),
          it('Vivid saturated', 'Rực bão hòa'), it('Desaturated bleak', 'Nhạt lạnh lẽo'),
          it('Sepia vintage', 'Nâu sepia cổ'), it('Teal & orange', 'Teal–cam điện ảnh'),
          it('Gothic dark', 'Gothic u tối'), it('Emerald natural', 'Xanh lá tự nhiên'),
        ],
      },
      {
        id: 'WB-09', en: 'Climate Rule', vi: 'Quy luật khí hậu', control: 'combobox',
        items: [
          it('Temperate four-season', 'Bốn mùa ôn hòa'), it('Perpetual rain', 'Mưa bất tận'),
          it('Eternal night', 'Đêm vĩnh viễn'), it('Endless golden sun', 'Nắng vàng bất tận'),
          it('Storm season', 'Mùa bão'), it('Deep snow', 'Tuyết phủ'),
          it('Arid wind', 'Gió cát khô'), it('Volcanic ash', 'Tro núi lửa'),
          it('Bioluminescent glow', 'Ánh phát quang sinh học'), it('Toxic haze', 'Sương độc'),
        ],
      },
      {
        id: 'WB-10', en: 'Visual Style Reference', vi: 'Phong cách tham chiếu', control: 'combobox',
        items: [
          it('Photoreal cinematic', 'Điện ảnh chân thực'), it('Ghibli-inspired', 'Mộng kiểu Ghibli'),
          it('Anime cel-shaded', 'Anime tô khối'), it('Blade Runner-esque', 'Kiểu Blade Runner'),
          it('Wes Anderson symmetry', 'Đối xứng Wes Anderson'), it('Nolan-style realism', 'Thực tế kiểu Nolan'),
          it('Villeneuve-scale minimal', 'Tối giản quy mô lớn'), it('Oil-painting look', 'Như tranh sơn dầu'),
          it('Retro film grain', 'Kết cấu phim cổ'), it('Analog horror', 'Kinh dị analog'),
          it('Macro miniature diorama', 'Mô hình thu nhỏ'), it('Mixed-media collage', 'Collage hỗn hợp'),
        ],
      },
      {
        id: 'WB-11', en: 'Physics Rule', vi: 'Quy luật vật lý', control: 'combobox',
        items: [
          it('Realistic physics', 'Như thực'), it('Heightened cinematic physics', 'Cường điệu điện ảnh'),
          it('Gravity-defying', 'Phi trọng lực'), it('Dream logic', 'Logic mộng'),
          it('Magic-altered reality', 'Phép thuật can thiệp'), it('Glitched reality', 'Thực tại nhiễu loạn'),
        ],
      },
    ],
  },

  /* =========================================================
   * STEP 3 — CHARACTER ID (Portrait + Body)
   * ======================================================= */
  {
    no: 3,
    code: 'CH',
    title: 'Characters ID',
    titleVi: 'Nhân diện nhân vật',
    purpose: 'Tạo "hồ sơ nhận diện" cho từng nhân vật: portrait (khuôn mặt) + body (dáng, trang phục) để GenAI render đồng nhất xuyên suốt phim.',
    output: 'Character sheet prompt: portrait + full-body, gắn ID CH-### dùng lại ở mọi scene/shot.',
    categories: [
      /* ——— FORM GROUP: reference sheet bắt buộc ——— */
      {
        id: 'CH-F1', en: 'Reference Form', vi: 'Form ảnh tham chiếu', control: 'checkbox', required: true, group: 'form',
        note: 'Mỗi line nhân vật gắn 1 form: Portrait (cận mặt) hoặc Full Body (toàn thân).',
        items: [it('Portrait sheet', 'Chân dung cận mặt'), it('Full-body sheet', 'Toàn thân')],
      },
      {
        id: 'CH-F2', en: 'Sheet Camera Angle', vi: 'Góc máy của sheet', control: 'multi', required: true, group: 'form',
        note: 'Multi-choice — chọn một hoặc nhiều góc cho sheet (khuyến nghị đủ 4 góc để agent giữ consistency).',
        items: [
          it('Front view', 'Chính diện'), it('Left three-quarter', 'Nghiêng trái'),
          it('Right three-quarter', 'Nghiêng phải'), it('Back view', 'Đằng sau'),
        ],
      },
      {
        id: 'CH-F3', en: 'Sheet Expression', vi: 'Biểu cảm của sheet', control: 'combobox', required: true, group: 'form',
        items: [
          it('Neutral', 'Bình thường'), it('Happy', 'Vui'),
          it('Angry', 'Tức giận'),
        ],
      },
      {
        id: 'CH-01', en: 'Role', vi: 'Vai trò', control: 'combobox', required: true, group: 'portrait',
        items: [
          it('Protagonist', 'Nhân vật chính'), it('Antagonist', 'Phản diện'),
          it('Deuteragonist', 'Phụ chính'), it('Mentor', 'Bậc thầy'),
          it('Love interest', 'Tình duyên'), it('Sidekick', 'Phò tá'),
          it('Rival', 'Đối thủ'), it('Comic relief', 'Gánh hài'),
          it('Herald / guide', 'Vai dẫn truyện'), it('Supporting ensemble', 'Dàn phụ'),
        ],
      },
      {
        id: 'CH-02', en: 'Gender', vi: 'Giới tính', control: 'combobox', group: 'portrait',
        items: [it('Male', 'Nam'), it('Female', 'Nữ'), it('Androgynous', 'Phi nhị nguyên')],
      },
      {
        id: 'CH-03', en: 'Apparent Age', vi: 'Tuổi hiển thị', control: 'combobox', group: 'portrait',
        items: [
          it('Child 6–12', 'Trẻ em'), it('Teen 13–17', 'Thiếu niên'),
          it('Young adult 18–25', 'Thanh niên'), it('Adult 26–40', 'Trưởng thành'),
          it('Middle-aged 41–60', 'Trung niên'), it('Elderly 60+', 'Cao tuổi'),
        ],
      },
      {
        id: 'CH-04', en: 'Heritage', vi: 'Nguồn gốc', control: 'combobox', group: 'portrait',
        items: [
          it('East Asian', 'Đông Á'), it('Southeast Asian / Vietnamese', 'Đông Nam Á / Việt Nam'),
          it('South Asian', 'Nam Á'), it('Caucasian European', 'Gốc Âu'),
          it('African descent', 'Gốc Phi'), it('Latino', 'Mỹ Latinh'),
          it('Middle Eastern', 'Trung Đông'), it('Pacific Islander', 'Đảo Thái Bình Dương'),
          it('Indigenous', 'Thổ dân'), it('Mixed heritage', 'Lai đa nguồn'),
        ],
      },
      {
        id: 'CH-05', en: 'Face Shape', vi: 'Dáng mặt', control: 'combobox', group: 'portrait',
        items: [
          it('Oval', 'Trái xoan'), it('Round', 'Tròn'),
          it('Square, sharp jawline', 'Vuông góc cạnh'), it('Heart-shaped', 'Trái tim'),
          it('Oblong', 'Thuôn dài'), it('Diamond', 'Kim cương'),
        ],
      },
      {
        id: 'CH-06', en: 'Eye Shape', vi: 'Dáng mắt', control: 'combobox', group: 'portrait',
        items: [
          it('Almond', 'Hạnh nhân'), it('Round large', 'Tròn lớn'),
          it('Monolid', 'Một mí'), it('Hooded deep set', 'Mí trùm sâu'),
          it('Upturned', 'Hơi xếch'), it('Downturned', 'Chủng nhẹ buồn'),
          it('Deep-set', 'Hốc sâu'), it('Wide-set', 'Hai mắt xa nhau'),
        ],
      },
      {
        id: 'CH-07', en: 'Eye Color', vi: 'Màu mắt', control: 'combobox', group: 'portrait',
        items: [
          it('Deep brown', 'Nâu sẫm'), it('Black', 'Đen'),
          it('Ice blue', 'Xanh băng'), it('Emerald green', 'Lục bảo'),
          it('Hazel', 'Nâu xanh'), it('Steel grey', 'Xám thép'),
          it('Amber', 'Hổ phách'), it('Heterochromia', 'Hai màu khác nhau'),
        ],
      },
      {
        id: 'CH-08', en: 'Hair Style', vi: 'Kiểu tóc', control: 'combobox', group: 'portrait',
        items: [
          it('Buzz cut', 'Đầu đinh'), it('Crew cut', 'Cua nam tính'),
          it('Undercut', 'Undercut'), it('Slicked back', 'Vuốt ngược'),
          it('Side part', 'Rẽ ngôi'), it('Bob', 'Tóc bob'),
          it('Pixie', 'Tóc pixie'), it('Long straight', 'Dài thẳng'),
          it('Shoulder-length wavy', 'Ngang vai gợn sóng'), it('Voluminous curls', 'Xoăn bồng'),
          it('Afro', 'Afro'), it('Braids', 'Bím / tết'),
          it('Ponytail', 'Đuôi ngựa'), it('Man bun', 'Búi nam'),
          it('Dreadlocks', 'Dreadlocks'), it('Bald', 'Trọc'),
        ],
      },
      {
        id: 'CH-09', en: 'Hair Color', vi: 'Màu tóc', control: 'combobox', group: 'portrait',
        items: [
          it('Jet black', 'Đen tuyền'), it('Dark brown', 'Nâu sẫm'),
          it('Light brown', 'Nâu sáng'), it('Blonde', 'Vàng'),
          it('Auburn', 'Nâu hung đỏ'), it('Red', 'Đỏ'),
          it('Silver grey', 'Màu bạc'), it('White', 'Trắng'),
          it('Pastel dye', 'Nhuộm pastel'), it('Vivid dye', 'Nhuộm rực rỡ'),
        ],
      },
      {
        id: 'CH-10', en: 'Skin Tone', vi: 'Tông da', control: 'combobox', group: 'portrait',
        items: [
          it('Porcelain', 'Bạch ngọc'), it('Fair', 'Sáng da'),
          it('Warm ivory', 'Ngà ấm'), it('Olive', 'Oliu'),
          it('Golden tan', 'Vàng rám nắng'), it('Caramel', 'Caramen'),
          it('Bronze', 'Đồng'), it('Deep ebony', 'Nâu sâu'),
        ],
      },
      {
        id: 'CH-11', en: 'Distinctive Marks', vi: 'Dấu ấn khuôn mặt', control: 'combobox', group: 'portrait',
        items: [
          it('None visible', 'Không nổi bật'), it('Freckles', 'Tàn nhang'),
          it('Beauty mole', 'Nốt ruồi duyên'), it('Scar across brow', 'Sẹo qua lông mày'),
          it('Cheek scar', 'Sẹo má'), it('Dimples', 'Má đồng tiền'),
          it('Eyeglasses', 'Đeo kính'), it('Piercings', 'Khuyên xỏ'),
          it('Light wrinkles of age', 'Nếp nhăn tuổi'), it('Tribal face tattoo', 'Xăm dân tộc'),
          it('Full beard', 'Râu quai nón'), it('Stubble', 'Râu lởm chởm'),
        ],
      },

      /* ——— BODY GROUP ——— */
      {
        id: 'CH-12', en: 'Body Type', vi: 'Thể hình', control: 'combobox', group: 'body',
        items: [
          it('Slim', 'Thon'), it('Lean athletic', 'Mảnh gọn thể thao'),
          it('Muscular build', 'Cơ bắp cuồn cuộn'), it('Average', 'Trung bình'),
          it('Curvy', 'Đường cong đậm'), it('Plus-size', 'Ngoại cỡ đầy đặn'),
          it('Heavyset', 'Chắc nặng'), it('Petite', 'Nhỏ nhắn'),
          it('Tall & lanky', 'Cao dong dỏng'),
        ],
      },
      {
        id: 'CH-13', en: 'Height', vi: 'Chiều cao', control: 'combobox', group: 'body',
        items: [
          it('Petite (under 160cm)', 'Dưới 1m60'), it('Average (160–175cm)', '1m60 – 1m75'),
          it('Tall (175–190cm)', '1m75 – 1m90'), it('Very tall (190cm+)', 'Trên 1m90'),
          it('Child-proportioned', 'Theo dáng thiếu nhi'),
        ],
      },
      {
        id: 'CH-14', en: 'Bearing / Posture', vi: 'Tư thế & khí chất', control: 'combobox', group: 'body',
        items: [
          it('Confident upright', 'Ngẩng cao tự tin'), it('Relaxed slouch', 'Thoải mái gù vai'),
          it('Graceful, dance-like', 'Duyên dáng mềm mại'), it('Militarily rigid', 'Nghiêm như quân đội'),
          it('Light-footed energetic', 'Bước nhẹ tung tăng'), it('Heavy deliberate', 'Nặng nhọc dứt khoát'),
        ],
      },
      {
        id: 'CH-15', en: 'Outfit Style', vi: 'Phong cách trang phục', control: 'combobox', group: 'body',
        items: [
          it('Casual streetwear', 'Đường phố'), it('Business formal', 'Công sở sang trọng'),
          it('Military uniform', 'Quân phục'), it('Cyberpunk techwear', 'Techwear công nghệ'),
          it('Fantasy armor', 'Giáp giả tưởng'), it('Medieval robe', 'Áo choàng trung cổ'),
          it('Retro 80s vintage', 'Retro thập niên 80'), it('Bohemian', 'Bohemian tự do'),
          it('Athleisure', 'Thể thao hiện đại'), it('Traditional áo dài', 'Áo dài Việt Nam'),
          it('Kimono / Hanbok', 'Kimono / Hanbok'), it('Post-apocalyptic scavenger', 'Lượm nhặt hậu tận thế'),
          it('High fashion couture', 'Sàn diễn cao cấp'), it('Scientist lab coat', 'Áo khoác nhà khoa học'),
        ],
      },
      {
        id: 'CH-16', en: 'Signature Accessory', vi: 'Phụ kiện thương hiệu', control: 'combobox', group: 'body',
        items: [
          it('Cap / hat', 'Mũ'), it('Hood', 'Mũ trùm đầu'),
          it('Scarf', 'Khăn quàng'), it('Sunglasses', 'Kính râm'),
          it('Mask', 'Mặt nạ'), it('Gloves', 'Găng tay'),
          it('Katana', 'Kiếm katana'), it('Holstered pistol', 'Súng bao đai'),
          it('Magic staff', 'Gậy phép'), it('Amulet necklace', 'Bùa hộ mệnh'),
          it('Smartwatch', 'Đồng hồ thông minh'), it('Backpack', 'Ba lô'),
        ],
      },
      {
        id: 'CH-17', en: 'Default Expression', vi: 'Biểu cảm mặc định', control: 'combobox', group: 'body',
        items: [
          it('Warm smile', 'Ôn hòa, tươi tắn'), it('Stoic neutral', 'Lạnh lùng vô cảm'),
          it('Intense gaze', 'Ánh nhìn găm'), it('Playful grin', 'Vẻ tinh nghịch'),
          it('Weary eyes', 'Mắt mệt mỏi'), it('Calm mystery', 'Điềm tĩnh bí ẩn'),
          it('Fierce determination', 'Quả quyết mãnh liệt'), it('Gentle softness', 'Dịu dàng'),
        ],
      },
    ],
  },

  /* =========================================================
   * STEP 4 — LOCATION ID
   * ======================================================= */
  {
    no: 4,
    code: 'LC',
    title: 'Locations ID',
    titleVi: 'Nhân diện địa điểm',
    purpose: 'Chuẩn hóa không gian: kiến trúc, ánh sáng, khí hậu, không khí — địa điểm tái sử dụng giữa nhiều scene.',
    output: 'Location sheet prompt cho background / establishing shot, gắn ID LC-###.',
    categories: [
      {
        id: 'LC-01', en: 'Setting', vi: 'Bên trong / Bên ngoài', control: 'checkbox', required: true,
        note: 'Chỉ 2 lựa chọn đối lập → dùng checkbox / toggle thay combobox.',
        items: [it('Interior', 'Bên trong'), it('Exterior', 'Bên ngoài')],
      },
      {
        id: 'LC-02', en: 'Environment', vi: 'Phân loại môi trường', control: 'combobox', required: true,
        items: [
          it('Urban district', 'Đô thị'), it('Suburban neighborhood', 'Ngoại ô'),
          it('Rural countryside', 'Nông thôn'), it('Wilderness', 'Hoang dã'),
          it('Industrial zone', 'Khu công nghiệp'), it('Commercial center', 'Trung tâm thương mại'),
          it('Residential home', 'Nhà ở'), it('Institutional hall', 'Trường / viện / cơ quan'),
          it('Recreational space', 'Không gian giải trí'), it('Sacred ground', 'Nơi thiêng liêng'),
        ],
      },
      {
        id: 'LC-03', en: 'Architecture Style', vi: 'Kiến trúc', control: 'combobox',
        items: [
          it('Modern minimalist', 'Hiện đại tối giản'), it('Brutalist concrete', 'Bê tông thô Brutalist'),
          it('Gothic spires', 'Tháp nhọn Gothic'), it('Neoclassical', 'Tân cổ điển'),
          it('Traditional East Asian', 'Truyền thống Á Đông'), it('French colonial', 'Thuộc địa Pháp'),
          it('Futuristic', 'Tương lai'), it('Cyberpunk neon', 'Neon cyberpunk'),
          it('Rustic farmhouse', 'Nông trại mộc mạc'), it('Industrial warehouse', 'Nhà kho công nghiệp'),
          it('Art Deco', 'Art Deco'), it('Ancient ruins', 'Di tích cổ'),
          it('Organic curved', 'Hữu cơ cong mềm'),
        ],
      },
      {
        id: 'LC-04', en: 'Time of Day', vi: 'Buổi trong ngày', control: 'combobox',
        items: [
          it('Pre-dawn blue', 'Hừng đông xanh'), it('Golden sunrise', 'Bình minh vàng'),
          it('Bright morning', 'Sáng rực'), it('Harsh midday', 'Trưa chói gắt'),
          it('Late afternoon', 'Chiều muộn'), it('Golden sunset', 'Hoàng hôn vàng'),
          it('Blue hour', 'Giờ xanh lam'), it('Midnight', 'Đêm khuya'),
        ],
      },
      {
        id: 'LC-05', en: 'Weather', vi: 'Khí hậu hiện tại', control: 'combobox',
        items: [
          it('Clear sky', 'Quang đãng'), it('Overcast', 'Âm u'),
          it('Drizzle', 'Mưa phùn'), it('Heavy rain', 'Mưa to'),
          it('Thunderstorm', 'Giông bão'), it('Dense fog', 'Sương mù đặc'),
          it('Snowfall', 'Tuyết rơi'), it('Wind gusts', 'Gió giật'),
          it('Heat haze', 'Hơi nóng oi bức'),
        ],
      },
      {
        id: 'LC-06', en: 'Lighting Condition', vi: 'Ánh sáng', control: 'combobox', required: true,
        items: [
          it('Natural sunlight', 'Nắng tự nhiên'), it('Diffused window light', 'Sáng cửa sổ'),
          it('Fluorescent cold', 'Huỳnh quang lạnh'), it('Neon / LED colored', 'Neon nhiều màu'),
          it('Candle / fire warm', 'Nến & lửa ấm'), it('Mixed city glow', 'Ánh đèn phố hỗn hợp'),
          it('Backlit silhouette', 'Ngược sáng hình bóng'), it('Dramatic spotlight', 'Điểm sáng kịch tính'),
          it('Dim ambient night', 'Dạ quang dịu'), it('Bioluminescent', 'Phát quang sinh học'),
        ],
      },
      {
        id: 'LC-07', en: 'Scale', vi: 'Quy mô', control: 'combobox',
        items: [
          it('Intimate', 'Thu nhỏ ấm cúng'), it('Medium', 'Vừa phải'),
          it('Large', 'Rộng lớn'), it('Vast landscape', 'Mênh mông'),
          it('Monumental', 'Hùng vĩ'),
        ],
      },
      {
        id: 'LC-08', en: 'Crowd Density', vi: 'Mật độ đông – vắng', control: 'combobox',
        items: [
          it('Empty / abandoned', 'Trống vắng, bỏ hoang'), it('Sparse', 'Thưa thớt'),
          it('Moderate', 'Vừa phải'), it('Crowded', 'Đông đúc'),
          it('Packed', 'Chật kín'),
        ],
      },
      {
        id: 'LC-09', en: 'Place Mood', vi: 'Không khí nơi chốn', control: 'combobox',
        items: [
          it('Cozy warm', 'Ấm cúng'), it('Tense oppressive', 'Ngột ngạt căng thẳng'),
          it('Serene', 'Thanh bình'), it('Lively chaotic', 'Sôi động hỗn loạn'),
          it('Eerie haunted', 'Rợn ngược ma quái'), it('Melancholy', 'Bơ vơ u sầu'),
          it('Sacred solemn', 'Thiêng liêng trang nghiêm'), it('Vibrant hopeful', 'Rực rỡ hy vọng'),
        ],
      },
      {
        id: 'LC-10', en: 'Key Set Dressing', vi: 'Đạo cụ chủ đạo', control: 'combobox',
        items: [
          it('Vehicles & traffic', 'Xe cộ giao thông'), it('Street food stalls', 'Hàng ăn vỉa hè'),
          it('Open-air market', 'Chợ đường phố'), it('Towering bookshelves', 'Giá sách cao'),
          it('Screens everywhere', 'Màn hình khắp nơi'), it('Overgrown plants', 'Cây hoang mọc'),
          it('Water feature', 'Hồ nước / suối'), it('Decaying debris', 'Mảnh vỡ đổ nát'),
          it('Religious icons', 'Biểu tượng tín ngưỡng'), it('Holograms / AR overlays', 'Hologram / AR'),
        ],
      },
    ],
  },

  /* =========================================================
   * STEP 5 — TRANSCRIPT ID
   * ======================================================= */
  {
    no: 5,
    code: 'TR',
    title: 'Transcripts ID',
    titleVi: 'Kịch bản thoại',
    purpose: 'Chuẩn hóa thoại / bình thoại / nội tâm: ngôn ngữ, giọng điệu, nhịp độ, chức năng kể truyện — sẵn sàng cho TTS hoặc diễn viên lồng tiếng.',
    output: 'Transcript prompt cho text-to-speech / đạo diễn giọng nói, gắn ID TR-###.',
    categories: [
      {
        id: 'TR-01', en: 'Content Type', vi: 'Loại nội dung', control: 'combobox', required: true,
        items: [
          it('Dialogue', 'Hội thoại'), it('Monologue', 'Độc thoại'),
          it('Voiceover narration', 'Bình thoại'), it('Inner thoughts', 'Nội tâm'),
          it('Off-screen call', 'Thoại ngoài khung'), it('On-screen text', 'Chữ trên màn hình'),
          it('Song lyrics', 'Lyric bài hát'),
        ],
      },
      {
        id: 'TR-02', en: 'Language', vi: 'Ngôn ngữ', control: 'combobox', required: true,
        items: [
          it('Vietnamese', 'Tiếng Việt'), it('English', 'Tiếng Anh'),
          it('Japanese', 'Tiếng Nhật'), it('Korean', 'Tiếng Hàn'),
          it('Mandarin Chinese', 'Quan thoại'), it('Thai', 'Tiếng Thái'),
          it('French', 'Tiếng Pháp'), it('Spanish', 'Tây Ban Nha'),
          it('German', 'Tiếng Đức'), it('Mixed / multilingual', 'Đa ngôn ngữ'),
        ],
      },
      {
        id: 'TR-03', en: 'Dialect / Accent', vi: 'Phương ngữ / giọng vùng', control: 'combobox',
        items: [
          it('Standard', 'Chuẩn phổ thông'), it('Northern Vietnamese', 'Miền Bắc'),
          it('Central Vietnamese', 'Miền Trung'), it('Southern Vietnamese', 'Miền Nam'),
          it('British English', 'Anh–Anh'), it('American English', 'Anh–Mỹ'),
          it('Foreign-accented', 'Giọng lơ lớ nước ngoài'), it('Artificial / robotic', 'Nhân tạo máy móc'),
        ],
      },
      {
        id: 'TR-04', en: 'Speech Tone', vi: 'Giọng điệu', control: 'combobox',
        items: [
          it('Calm neutral', 'Điềm đạm'), it('Emotional dramatic', 'Xúc động kịch tính'),
          it('Angry', 'Giận dữ'), it('Whispered intimate', 'Thì thầm thân mật'),
          it('Cheerful energetic', 'Hào hứng rạng rỡ'), it('Sarcastic witty', 'Mỉa mai dí dỏm'),
          it('Melancholic', 'Sầu não'), it('Commanding', 'Uy lệnh'),
          it('Fearful trembling', 'Run sợ'), it('Storyteller warm', 'Ấm áp kể chuyện'),
        ],
      },
      {
        id: 'TR-05', en: 'Pace', vi: 'Tốc độ nói', control: 'combobox',
        items: [
          it('Slow deliberate', 'Chậm rãi, chắc chắn'), it('Conversational', 'Hội thoại tự nhiên'),
          it('Fast rapid', 'Nhanh, gấp gáp'), it('Variable emotional arc', 'Biến thiên theo cảm xúc'),
        ],
      },
      {
        id: 'TR-06', en: 'Emotion Arc', vi: 'Cung cảm xúc', control: 'combobox',
        items: [
          it('Steady flat', 'Ổn định đều'), it('Building tension', 'Dồn nén tăng tiến'),
          it('Breaking down', 'Vỡ òa'), it('Rising hope', 'Hướng về hy vọng'),
          it('Shifting to calm', 'Dịu lại cuối cùng'), it('Rollercoaster', 'Lên xuống thất thường'),
        ],
      },
      {
        id: 'TR-07', en: 'Length Target', vi: 'Độ dài mục tiêu', control: 'combobox',
        items: [
          it('Under 50 words', 'Dưới 50 từ'), it('50–150 words', '50 – 150 từ'),
          it('150–300 words', '150 – 300 từ'), it('300–600 words', '300 – 600 từ'),
          it('600+ words', 'Trên 600 từ'),
        ],
      },
      {
        id: 'TR-08', en: 'Narrative Function', vi: 'Chức năng kể truyện', control: 'combobox',
        items: [
          it('Exposition', 'Mở thông tin thế giới'), it('Character depth', 'Lộ chiều sâu nhân vật'),
          it('Plot advancement', 'Đẩy mạch truyện'), it('Emotional climax', 'Đỉnh cảm xúc'),
          it('Hook opener', 'Câu mở đầu chú ý'), it('CTA / outro', 'Kêu gọi hành động'),
          it('Thematic quote', 'Câu thấu chủ đề'),
        ],
      },
      {
        id: 'TR-09', en: 'Subtitles', vi: 'Phụ đề', control: 'checkbox',
        note: 'Có / Không → checkbox.',
        items: [it('Subtitles burned-in', 'Có phụ đề'), it('No subtitles', 'Không phụ đề')],
      },
    ],
  },

  /* =========================================================
   * STEP 6 — VOICE ID  (đề xuất thay cho "Locations ID" bị trùng)
   * ======================================================= */
  {
    no: 6,
    code: 'VO',
    title: 'Voice ID',
    titleVi: 'Nhân diện giọng nói',
    purpose: '(ĐỀ XUẤT THAY THẾ) Brief gốc trùng "Locations ID". Sau transcript cần "cast" giọng cho từng nhân vật trước khi lồng vào scene & shot.',
    output: 'Voice-cast prompt cho ElevenLabs / TTS — mỗi nhân vật một voice profile, gắn ID VO-###.',
    categories: [
      {
        id: 'VO-01', en: 'Voice Gender', vi: 'Giới giọng', control: 'combobox', required: true,
        items: [it('Male', 'Nam'), it('Female', 'Nữ'), it('Neutral / synthetic', 'Trung tính / tổng hợp')],
      },
      {
        id: 'VO-02', en: 'Voice Age', vi: 'Tuổi giọng', control: 'combobox',
        items: [
          it('Child', 'Trẻ em'), it('Teen', 'Thiếu niên'),
          it('Young adult', 'Thanh niên'), it('Adult', 'Trưởng thành'),
          it('Senior', 'Lão âm'),
        ],
      },
      {
        id: 'VO-03', en: 'Pitch', vi: 'Tông cao', control: 'combobox',
        items: [
          it('Very low', 'Rất trầm'), it('Low', 'Trầm'),
          it('Medium', 'Trung'), it('High', 'Cao'),
          it('Very high', 'Rất cao'),
        ],
      },
      {
        id: 'VO-04', en: 'Timbre', vi: 'Chất giọng', control: 'combobox', required: true,
        items: [
          it('Warm rich', 'Ấm tròn'), it('Gravelly raspy', 'Khàn sạn'),
          it('Clear bright', 'Sáng trong'), it('Breathy soft', 'Hơi nhẹ mềm'),
          it('Nasal', 'Mũi đặc trưng'), it('Deep resonant', 'Vang sâu'),
          it('Silky smooth', 'Mượt như lụa'), it('Harsh sharp', 'Gắt sắc'),
          it('Metallic robotic', 'Kim loại máy móc'),
        ],
      },
      {
        id: 'VO-05', en: 'Energy Level', vi: 'Năng lượng', control: 'combobox',
        items: [
          it('Calm subdued', 'Trầm tĩnh'), it('Moderate', 'Vừa phải'),
          it('Energetic', 'Sung sức'), it('Hyper', 'Siêu bật'),
        ],
      },
      {
        id: 'VO-06', en: 'Speaking Style', vi: 'Kiểu diễn đạt', control: 'combobox',
        items: [
          it('Conversational', 'Tự nhiên trò chuyện'), it('Declarative formal', 'Trang trọng tuyên bố'),
          it('Narrator storyteller', 'Giọng kể chuyện'), it('News reporter', 'Phát thanh viên'),
          it('Theatrical drama', 'Kịch nghệ sân khấu'), it('Deadpan comedic', 'Đùa kiểu lạnh'),
        ],
      },
      {
        id: 'VO-07', en: 'Processing / FX', vi: 'Hiệu ứng xử lý', control: 'combobox',
        items: [
          it('Clean dry', 'Khô trong trẻo'), it('Hall reverb', 'Vang hội trường'),
          it('Radio filtered', 'Lọc sóng radio'), it('Telephone line', 'Qua điện thoại'),
          it('Dramatic echo', 'Vọng kịch tính'), it('Distorted corrupted', 'Méo biến dạng'),
          it('AI synthesized', 'Tổng hợp AI'),
        ],
      },
    ],
  },

  /* =========================================================
   * STEP 7 — SCENE ID
   * ======================================================= */
  {
    no: 7,
    code: 'SC',
    title: 'Scenes ID',
    titleVi: 'Phân cảnh',
    purpose: 'Cắt storyline thành các đơn vị cảnh (địa điểm × khoảnh khắc × hành động): mỗi scene tham chiếu LC / CH / TR cụ thể.',
    output: 'Scene breakdown prompt: chức năng kịch, chuyển cảnh vào/ra — gắn ID SC-###.',
    categories: [
      {
        id: 'SC-01', en: 'Story Beat Position', vi: 'Vị trí nhịp truyện', control: 'combobox', required: true,
        items: [
          it('Cold open', 'Mở lạnh'), it('Setup', 'Thiết lập'),
          it('Inciting incident', 'Biến cố mở đầu'), it('Rising action', 'Thăng tiến'),
          it('Midpoint turn', 'Ngoặt giữa'), it('Crisis', 'Khủng hoảng'),
          it('Climax', 'Cao trào'), it('Falling action', 'Hạ trào'),
          it('Resolution', 'Giải kết'), it('Post-credit teaser', 'Hậu cảnh gợi mở'),
        ],
      },
      {
        id: 'SC-02', en: 'Scene Type', vi: 'Loại cảnh', control: 'combobox', required: true,
        items: [
          it('Establishing', 'Dẫn cảnh'), it('Dialogue-driven', 'Chủ đạo đối thoại'),
          it('Action set-piece', 'Trận hành động'), it('Montage', 'Dựng mông-ta'),
          it('Transition', 'Cầu nối'), it('Flashback', 'Hồi ức'),
          it('Dream sequence', 'Chuỗi giấc mơ'), it('Intimate two-hander', 'Đối thoại cặp đôi'),
          it('Chase / pursuit', 'Rượt đuổi'), it('Reveal / twist', 'Lật mặt'),
        ],
      },
      {
        id: 'SC-03', en: 'Dramatic Function', vi: 'Chức năng kịch', control: 'combobox',
        items: [
          it('Introduce world', 'Giới thiệu thế giới'), it('Introduce character', 'Giới thiệu nhân vật'),
          it('Build tension', 'Gây căng thẳng'), it('Deliver key information', 'Trao thông tin chốt'),
          it('Foreshadow', 'Gieo mầm ám chỉ'), it('Comic relief', 'Giải tỏa hài'),
          it('Catharsis release', 'Xả cảm xúc'), it('Narrative twist', 'Lật trục truyện'),
        ],
      },
      {
        id: 'SC-04', en: 'Duration', vi: 'Độ dài', control: 'combobox',
        items: [
          it('3 seconds'), it('5 seconds'), it('8 seconds'), it('10 seconds'),
          it('15 seconds'), it('20 seconds'), it('30 seconds'), it('60 seconds'),
        ],
      },
      {
        id: 'SC-05', en: 'Camera Base Style', vi: 'Phong cách máy nền', control: 'combobox',
        items: [
          it('Locked tripod', 'Chân máy tĩnh'), it('Handheld grit', 'Cầm tay thật'),
          it('Gimbal float', 'Gimbal lướt'), it('POV rig', 'Gắn POV'),
          it('Drone aerial', 'Flycam trên không'), it('Crane moves', 'Máy cẩu'),
        ],
      },
      {
        id: 'SC-06', en: 'Visual Treatment', vi: 'Xử lý hình ảnh', control: 'combobox',
        items: [
          it('Realistic grade', 'Màu chân thực'), it('Stylized color grade', 'Màu cường điệu'),
          it('Slow-motion emphasis', 'Nhấn quay chậm'), it('Time-lapse', 'Đẩy nhanh (timelapse)'),
          it('Split screen', 'Chia khung hình'), it('Film grain texture', 'Kết cấu phim analog'),
        ],
      },
      {
        id: 'SC-07', en: 'Transition In', vi: 'Chuyển cảnh vào', control: 'combobox',
        items: [
          it('Hard cut', 'Cắt thẳng'), it('Fade from black', 'Mở từ đen'),
          it('Dissolve', 'Hòa tan'), it('Match cut', 'Cắt khớp'),
          it('Whip pan', 'Vuốt pan'), it('J-cut (audio first)', 'Âm vào trước'),
          it('L-cut', 'Âm cảnh trước chạy qua'), it('Smash cut', 'Phá đột ngột'),
          it('Morph transition', 'Biến hình'),
        ],
      },
      {
        id: 'SC-08', en: 'Transition Out', vi: 'Chuyển cảnh ra', control: 'combobox',
        items: [
          it('Hard cut', 'Cắt thẳng'), it('Fade to black', 'Tắt dần về đen'),
          it('Dissolve', 'Hòa tan'), it('Match cut', 'Cắt khớp'),
          it('Whip pan', 'Vuốt pan'), it('J-cut (audio first)', 'Âm dẫn sang sau'),
          it('L-cut', 'Kéo dài âm hiện tại'), it('Smash cut', 'Phá đột ngột'),
          it('Morph transition', 'Biến hình'),
        ],
      },
    ],
  },

  /* =========================================================
   * STEP 8 — SHOT ID (Action · Prompt AI · Audio)
   * ======================================================= */
  {
    no: 8,
    code: 'SH',
    title: 'Shots ID',
    titleVi: 'Shot quay (Action · Prompt · Audio)',
    purpose: 'Đơn vị nhỏ nhất cho GenAI video: mỗi shot = ACTION (hành động) + PROMPT AI (máy quay, ống kính, bố cục, ánh sáng) + AUDIO (SFX, nhạc).',
    output: 'Shot prompt hoàn chỉnh cho Runway / Kling / Veo… kèm chỉ dẫn audio, gắn ID SH-###.',
    categories: [
      {
        id: 'SH-01', en: 'Shot Size', vi: 'Cỡ cảnh quay', control: 'combobox', required: true,
        items: [
          it('Extreme wide (EWS)', 'Tổng cảnh cực xa'), it('Wide shot (WS)', 'Toàn cảnh'),
          it('Medium wide (MWS)', 'Trung toàn'), it('Medium shot (MS)', 'Trung cảnh'),
          it('Medium close-up (MCU)', 'Trung cận'), it('Close-up (CU)', 'Cận cảnh'),
          it('Big close-up (BCU)', 'Đại cận'), it('Extreme close-up / insert (ECU)', 'Chi tiết đặc trưng'),
        ],
      },
      {
        id: 'SH-02', en: 'Camera Angle', vi: 'Góc máy', control: 'combobox', required: true,
        items: [
          it('Eye level', 'Ngang tầm mắt'), it('Low angle', 'Ngước lên'),
          it('High angle', 'Hạ xuống'), it("Bird's eye top-down", 'Từ trên thẳng xuống'),
          it('Dutch tilt', 'Nghiêng lệch'), it('Over-the-shoulder (OTS)', 'Qua vai'),
          it('POV', 'Chủ quan'), it("Worm's eye", 'Sát đất ngước'),
          it('Aerial drone', 'Từ không trung'), it('Profile side view', 'Cạnh hông'),
        ],
      },
      {
        id: 'SH-03', en: 'Camera Movement', vi: 'Chuyển động máy', control: 'combobox', required: true,
        items: [
          it('Static locked', 'Tĩnh khóa khung'), it('Pan left / right', 'Quẹo ngang'),
          it('Tilt up / down', 'Ngửa / sấp dọc'), it('Dolly push-in', 'Tiến vào chủ thể'),
          it('Dolly pull-out', 'Lùi ra mở rộng'), it('Truck lateral', 'Dọc ngang'),
          it('Pedestal up / down', 'Nâng hạ đứng'), it('Arc / orbit', 'Quay quanh chủ thể'),
          it('Crane / jib rise', 'Cầu trục vươn'), it('Handheld follow', 'Cầm tay bám theo'),
          it('Steadicam chase', 'Rượt bám mượt'), it('SnorriCam body-mount', 'Gắn lên cơ thể diễn viên'),
          it('FPV drone dive', 'FPV lao xuống'), it('Whip pan', 'Vuốt pan vụt'),
          it('Slow zoom', 'Zoom chậm ý'),
        ],
      },
      {
        id: 'SH-04', en: 'Lens Feel', vi: 'Cảm giác ống kính', control: 'combobox',
        items: [
          it('Ultra-wide 14mm', 'Siêu rộng, méo biên'), it('Wide 24mm immersive', 'Rộng, nhập vai'),
          it('Standard 35mm', 'Chuẩn điện ảnh'), it('Nifty fifty 50mm', 'Góc mắt tự nhiên'),
          it('Portrait 85mm', 'Nén nền chân dung'), it('Telephoto 200mm', 'Dẹt nền xa'),
          it('Macro intimate', 'Vi mô cận cảnh'), it('Anamorphic oval flare', 'Ánh lóe anamorphic'),
        ],
      },
      {
        id: 'SH-05', en: 'Focus & Depth', vi: 'Tiêu cự & chiều sâu', control: 'combobox',
        items: [
          it('Deep focus — all sharp', 'Nét toàn vùng'), it('Shallow bokeh isolation', 'Bokeh tách chủ thể'),
          it('Rack focus shift', 'Chuyển nét luân phiên'), it('Tilt-shift miniature', 'Hiệu ứng mô hình thu nhỏ'),
          it('Soft dreamy glow', 'Mềm mộng'), it('Split diopter dual-focus', 'Đôi tiêu cự'),
        ],
      },
      {
        id: 'SH-06', en: 'Action Type', vi: 'Hành động chính', control: 'combobox', required: true,
        items: [
          it('Performing a task', 'Thực thi một việc'), it('Dialogue exchange', 'Trao đổi đối thoại'),
          it('Stunt / fight choreography', 'Stunt / võ thuật'), it('Running / chase', 'Chạy rượt'),
          it('Reaction / emotional beat', 'Khoảnh khắc phản ứng'), it('Object interaction insert', 'Tương tác vật'),
          it('Environment survey', 'Quan sát môi trường'), it('Crowd dynamics', 'Đám đông chuyển động'),
        ],
      },
      {
        id: 'SH-07', en: 'Motion Energy', vi: 'Năng lượng động thái', control: 'combobox',
        items: [
          it('Still contemplative', 'Tĩnh, chiêm nghiệm'), it('Slow deliberate', 'Chậm, chu đáo'),
          it('Natural pace', 'Nhịp tự nhiên'), it('Brisk', 'Nhanh gọn'),
          it('Frantic intense', 'Điên cuồng'), it('Slow-motion glory', 'Slow-mo đẹp'),
          it('Speed ramped', 'Tăng–giảm tốc'), it('Freeze frame', 'Đông khung'),
        ],
      },
      {
        id: 'SH-08', en: 'Composition', vi: 'Bố cục khung', control: 'combobox',
        items: [
          it('Rule of thirds', 'Quy tắc 1/3'), it('Center symmetry', 'Đối xứng trung tâm'),
          it('Leading lines', 'Đường dẫn'), it('Frame within frame', 'Khung trong khung'),
          it('Negative space isolation', 'Khoảng trống cô lập'), it('Layered foreground parallax', 'Tiền cảnh parallax'),
          it('Dynamic diagonal', 'Đường chéo'), it('Golden spiral flow', 'Xoắn ốc'),
        ],
      },
      {
        id: 'SH-09', en: 'Lighting Modifier', vi: 'Bổ chỉnh ánh sáng', control: 'combobox',
        items: [
          it('Chiaroscuro high contrast', 'Tương phản chiaroscuro'), it('Soft beauty wrap', 'Bao sáng mềm'),
          it('Hard noon shadows', 'Bóng trưa gãy'), it('Golden rim backlight', 'Viền vàng ngược sáng'),
          it('Neon gel colors', 'Màu gel neon'), it('Single-source drama', 'Đơn nguồn kịch'),
          it('Broadcast flat', 'Phẳng phát sóng'),
        ],
      },
      {
        id: 'SH-10', en: 'SFX Layer', vi: 'Lớp âm hiệu ứng', control: 'combobox',
        items: [
          it('Room tone ambience', 'Nền không gian'), it('Foley steps & cloth', 'Tiếng chân, vải'),
          it('Impacts & whooshes', 'Va đập, lướt gió'), it('Mechanical hum', 'Rên máy móc'),
          it('Nature rain/thunder/wind', 'Mưa sấm gió'), it('Digital / UI blips', 'Tín hiệu số'),
          it('Dramatic silence', 'Im lặng kịch'),
        ],
      },
      {
        id: 'SH-11', en: 'Music Cue', vi: 'Điểm nhấn nhạc', control: 'combobox',
        items: [
          it('Continuation', 'Tiếp nối trước'), it('Stinger accent', 'Nhấn đột xuất'),
          it('Riser swell', 'Dồn crescendo'), it('Drop to silence', 'Rơi vào im lặng'),
          it('Beat-synced cut', 'Khớp nhịp nhạc'),
        ],
      },
      {
        id: 'SH-12', en: 'Shot Duration', vi: 'Độ dài', control: 'combobox',
        items: [
          it('2 seconds'), it('3 seconds'), it('4 seconds'), it('5 seconds'),
          it('6 seconds'), it('8 seconds'), it('10 seconds'),
        ],
      },
      {
        id: 'SH-13', en: 'Loop Mode', vi: 'Vòng lặp', control: 'checkbox',
        note: 'Cho GenAI looping (Runway / Kling) — Có / Không → checkbox.',
        items: [it('Seamless loop', 'Lặp mượt vô hạn'), it('One-shot', 'Không lặp')],
      },
    ],
  },
];

/* ---------------- merge expansions + derived stats ---------------- */

import { extraItems } from './expansions';

/** built-in dataset = raw + expansion v1.1 (combobox có thể vượt 20 → không giới hạn) */
export const pipeline: PipelineStep[] = raw.map((s) => ({
  ...s,
  categories: s.categories.map((c) =>
    extraItems[c.id] ? { ...c, items: [...c.items, ...extraItems[c.id]] } : c,
  ),
}));

const flat = pipeline.flatMap((s) => s.categories);
export const stats = {
  steps: pipeline.length,
  categories: flat.length,
  items: flat.reduce((a, c) => a + c.items.length, 0),
  combobox: flat.filter((c) => c.control === 'combobox').length,
  checkbox: flat.filter((c) => c.control === 'checkbox').length,
};

export const categoryOf = (code: string) => flat.filter((c) => c.id.startsWith(code));
