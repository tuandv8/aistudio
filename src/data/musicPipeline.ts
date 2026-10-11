/**
 * ============================================================
 *  AI MUSIC VIDEO PIPELINE — v1.0
 *  Same concept as AI VIDEO PIPELINE (8 steps, category + gợi ý)
 *  nhưng target: sản xuất VIDEO ÂM NHẠC.
 *  Dùng chung: user, review hybrid, Project ID (cùng workspace).
 *  Mã step tách biệt để không đụng video: SG SW AR VN LY VC SQ MS
 * ============================================================
 */

import type { PipelineStep } from './pipeline';
import { it } from './pipeline';

export const musicPipeline: PipelineStep[] = [
  /* ========== 1 · SONG CONCEPT ========== */
  {
    no: 1,
    code: 'SG',
    title: 'Song Concept',
    titleVi: 'Ý tưởng ca khúc',
    purpose: 'Định hình bài hát: thể loại, cảm xúc, nhịp, giọng, cấu trúc và thông điệp — nền móng cho toàn bộ music video.',
    output: 'Song brief: genre + mood + tempo + structure + hook strategy, làm prompt gốc cho composer/producer AI.',
    categories: [
      {
        id: 'SG-01', en: 'Music Genre', vi: 'Thể loại nhạc', control: 'combobox', required: true,
        items: [
          it('Nursery rhyme / Children song', 'Nhạc thiếu nhi'), it('Lullaby', 'Hát ru'),
          it('Pop', 'Pop'), it('EDM / Dance', 'EDM'), it('Hip-hop / Rap', 'Rap'),
          it('R&B / Soul', 'R&B'), it('Rock', 'Rock'), it('Ballad', 'Ballad'),
          it('Folk / Acoustic', 'Dân ca mộc'), it('Lo-fi chill', 'Lo-fi'),
          it('Country', 'Đồng quê'), it('Jazz / Swing', 'Jazz'),
          it('K-pop', 'K-pop'), it('V-pop', 'V-pop'), it('Latin / Reggaeton', 'Latin'),
          it('Classical crossover', 'Cổ điển giao thoa'), it('World / Ethnic', 'Dân gian thế giới'),
          it('Chiptune 8-bit', 'Âm thanh game 8-bit'),
        ],
      },
      {
        id: 'SG-02', en: 'Micro-Genre', vi: 'Nhánh nhỏ', control: 'combobox',
        items: [
          it('Sing-along kids pop', 'Pop thiếu nhi hát theo'), it('Educational song', 'Ca khúc giáo dục'),
          it('Toddler dance bounce', 'Nhún nhảy cho bé'), it('Bedtime lullaby', 'Ru ngủ'),
          it('Anime opening style', 'Kiểu opening anime'), it('Synth-pop', 'Synth-pop'),
          it('Afrobeat', 'Afrobeat'), it('Bossa nova', 'Bossa nova'),
          it('Orchestral cinematic', 'Dàn nhạc điện ảnh'), it('Nursery EDM', 'EDM thiếu nhi'),
          it('Campfire singalong', 'Hát quanh lửa trại'), it('Marching kids band', 'Diễu hành thiếu nhi'),
        ],
      },
      {
        id: 'SG-03', en: 'Mood & Emotion', vi: 'Cảm xúc chủ đạo', control: 'combobox', required: true,
        items: [
          it('Joyful', 'Vui sướng'), it('Playful silly', 'Tinh nghịch'),
          it('Warm cozy', 'Ấm áp'), it('Dreamy', 'Mộng mơ'),
          it('Energetic hype', 'Bùng nổ'), it('Melancholic', 'Man mác'),
          it('Hopeful', 'Hy vọng'), it('Calm soothing', 'Dịu êm'),
          it('Epic uplifting', 'Hùng tráng'), it('Romantic', 'Lãng mạn'),
          it('Mysterious', 'Huyền bí'), it('Celebratory', 'Ăn mừng'),
        ],
      },
      {
        id: 'SG-04', en: 'Tempo (BPM)', vi: 'Nhịp độ', control: 'combobox', required: true,
        items: [
          it('60–70 very slow', 'Rất chậm'), it('70–85 slow groove', 'Chậm groove'),
          it('85–100 mid tempo', 'Trung bình'), it('100–115 upbeat', 'Vừa nhanh'),
          it('115–128 dance', 'Nhạc nhảy'), it('128–140 high energy', 'Năng lượng cao'),
          it('140+ fast', 'Rất nhanh'), it('Half-time feel', 'Cảm giác nửa nhịp'),
        ],
      },
      {
        id: 'SG-05', en: 'Musical Key', vi: 'Giọng / điệu tính', control: 'combobox',
        items: [
          it('C major — bright simple', 'Đô trưởng'), it('G major — warm', 'Sol trưởng'),
          it('D major — cheerful', 'Rê trưởng'), it('F major — soft', 'Fa trưởng'),
          it('A major — sunny', 'La trưởng'), it('E major — bold', 'Mi trưởng'),
          it('Bb major — mellow', 'Si giáng trưởng'), it('A minor — moody', 'La thứ'),
          it('E minor — deep', 'Mi thứ'), it('D minor — dramatic', 'Rê thứ'),
          it('Pentatonic kid-friendly', 'Ngũ cung dễ hát'), it('Modal folk', 'Điệu thức dân gian'),
        ],
      },
      {
        id: 'SG-06', en: 'Song Structure', vi: 'Cấu trúc bài', control: 'combobox', required: true,
        items: [
          it('Verse – Chorus', 'Phiên khúc – Điệp khúc'), it('Chorus-first hook', 'Mở bằng điệp khúc'),
          it('Verse – Chorus – Bridge', 'Có cầu nối'), it('AABA classic', 'Cấu trúc AABA'),
          it('Loop-based (kids)', 'Vòng lặp'), it('Through-composed story', 'Kể chuyện liền mạch'),
          it('Call & response', 'Hô – đáp'), it('Build – Drop', 'Dồn – bung'),
          it('Ballad arc', 'Cung ballad'), it('Cumulative verse', 'Cộng dồn từng phiên'),
        ],
      },
      {
        id: 'SG-07', en: 'Duration', vi: 'Độ dài', control: 'combobox',
        items: [
          it('15s loop'), it('30 seconds'), it('45 seconds'), it('60 seconds'),
          it('90 seconds'), it('2 minutes'), it('2 min 30'), it('3 minutes'),
          it('3 min 30'), it('4 minutes+'),
        ],
      },
      {
        id: 'SG-08', en: 'Lyrical Theme', vi: 'Chủ đề ca từ', control: 'combobox', required: true,
        items: [
          it('Friendship', 'Tình bạn'), it('Family love', 'Tình cảm gia đình'),
          it('Animals & sounds', 'Con vật & tiếng kêu'), it('Colors & shapes', 'Màu sắc & hình khối'),
          it('Numbers & alphabet', 'Số đếm & bảng chữ'), it('Daily routines', 'Thói quen hằng ngày'),
          it('Nature & seasons', 'Thiên nhiên & mùa'), it('Imagination adventure', 'Phiêu lưu tưởng tượng'),
          it('Self-confidence', 'Tự tin'), it('Kindness & sharing', 'Tử tế & sẻ chia'),
          it('Movement & dance', 'Vận động & nhảy múa'), it('Bedtime & dreams', 'Giấc ngủ & giấc mơ'),
          it('Love story', 'Chuyện tình'), it('Motivation / hustle', 'Động lực'),
          it('Heartbreak', 'Tan vỡ'), it('Party & freedom', 'Tiệc & tự do'),
        ],
      },
      {
        id: 'SG-09', en: 'Language', vi: 'Ngôn ngữ', control: 'combobox', required: true,
        items: [
          it('Vietnamese', 'Tiếng Việt'), it('English', 'Tiếng Anh'),
          it('Bilingual VI–EN', 'Song ngữ Việt–Anh'), it('Japanese', 'Tiếng Nhật'),
          it('Korean', 'Tiếng Hàn'), it('Spanish', 'Tiếng Tây Ban Nha'),
          it('Instrumental (no vocal)', 'Không ca từ'), it('Scat / gibberish', 'Âm vô nghĩa vui tai'),
        ],
      },
      {
        id: 'SG-10', en: 'Vocal Arrangement', vi: 'Bố trí giọng hát', control: 'combobox',
        items: [
          it('Solo lead', 'Đơn ca'), it('Duet', 'Song ca'),
          it('Kids choir', 'Dàn đồng ca thiếu nhi'), it('Family group', 'Nhóm gia đình'),
          it('Lead + backing vocals', 'Chính + bè'), it('Rap verse + sung hook', 'Rap + hát điệp khúc'),
          it('Call & response', 'Hô – đáp'), it('A cappella', 'Không nhạc đệm'),
        ],
      },
      {
        id: 'SG-11', en: 'Hook Strategy', vi: 'Chiến lược điệp khúc', control: 'combobox',
        items: [
          it('Earworm repeat', 'Lặp dễ thuộc'), it('Chant-along', 'Hô theo tập thể'),
          it('Story-driven', 'Dẫn chuyện'), it('Big anthem lift', 'Bung kiểu anthem'),
          it('Whisper soft', 'Thì thầm'), it('Minimal subtle', 'Tối giản'),
          it('Question & answer', 'Hỏi – đáp'), it('Name-drop callout', 'Gọi tên nhân vật'),
        ],
      },
      {
        id: 'SG-12', en: 'Aspect Ratio', vi: 'Tỷ lệ khung hình', control: 'combobox',
        items: [
          it('16:9 landscape'), it('9:16 vertical'), it('1:1 square'),
          it('4:5 portrait'), it('2.39:1 cinemascope'), it('21:9 ultrawide'),
        ],
      },
      {
        id: 'SG-13', en: 'Release Format', vi: 'Định dạng phát hành', control: 'combobox',
        items: [
          it('YouTube full video', 'Video đầy đủ'), it('Shorts / Reels / TikTok', 'Video ngắn dọc'),
          it('Lyric video', 'Video ca từ'), it('Karaoke version', 'Bản karaoke'),
          it('Spotify canvas loop', 'Loop nền streaming'), it('Album visualizer', 'Visualizer'),
          it('TV broadcast', 'Phát sóng truyền hình'), it('Live performance cut', 'Bản diễn trực tiếp'),
        ],
      },
    ],
  },

  /* ========== 2 · SONIC WORLD BIBLE ========== */
  {
    no: 2,
    code: 'SW',
    title: 'Sonic World Bible',
    titleVi: 'Thế giới âm thanh',
    purpose: 'Khóa chất âm của sản phẩm: phong cách sản xuất, nhạc cụ, nhịp điệu, mix và ngưỡng an toàn thính giác.',
    output: 'Production brief cho music AI (Suno/Udio): âm sắc, phối khí, loudness, dynamic arc.',
    categories: [
      {
        id: 'SW-01', en: 'Production Style', vi: 'Phong cách sản xuất', control: 'combobox', required: true,
        items: [
          it('Acoustic organic', 'Mộc tự nhiên'), it('Polished pop', 'Pop trau chuốt'),
          it('EDM synth-heavy', 'EDM nhiều synth'), it('Orchestral cinematic', 'Dàn nhạc điện ảnh'),
          it('Lo-fi chill', 'Lo-fi thư giãn'), it('Retro 80s analog', 'Analog thập niên 80'),
          it('Folk handcrafted', 'Dân gian thủ công'), it('Toy-instrument playful', 'Nhạc cụ đồ chơi'),
          it('Minimal electronic', 'Điện tử tối giản'), it('Big band swing', 'Big band swing'),
          it('World percussion', 'Bộ gõ dân tộc'), it('Lullaby soft-pad', 'Pad mềm ru ngủ'),
        ],
      },
      {
        id: 'SW-02', en: 'Core Instrumentation', vi: 'Nhạc cụ chủ đạo', control: 'multi',
        note: 'Multi-choice — chọn nhiều nhạc cụ để phối khí.',
        items: [
          it('Piano'), it('Acoustic guitar', 'Guitar mộc'), it('Ukulele'),
          it('String ensemble', 'Dàn dây'), it('Synth pads', 'Nền synth'),
          it('Drum machine 808', 'Trống máy 808'), it('Live drum kit', 'Trống thật'),
          it('Xylophone / Glockenspiel', 'Mộc cầm'), it('Toy piano', 'Piano đồ chơi'),
          it('Flute / Whistle', 'Sáo'), it('Brass section', 'Bộ đồng'),
          it('Bass guitar', 'Bass'), it('Kalimba'), it('Music box', 'Hộp nhạc'),
          it('Hand claps', 'Vỗ tay'), it('Ethnic drums', 'Trống dân tộc'),
        ],
      },
      {
        id: 'SW-03', en: 'Rhythm Feel', vi: 'Cảm giác nhịp', control: 'combobox',
        items: [
          it('Straight 4/4', 'Nhịp 4/4 đều'), it('Shuffle swing', 'Swing đảo'),
          it('Bouncy off-beat', 'Nảy ngược phách'), it('Half-time slow', 'Nửa nhịp'),
          it('Syncopated funk', 'Funk đảo phách'), it('Waltz 3/4', 'Valse 3/4'),
          it('Marching pulse', 'Nhịp diễu hành'), it('Tribal percussion', 'Bộ gõ bộ lạc'),
          it('Breakbeat', 'Breakbeat'), it('Steady lullaby pulse', 'Đều êm ru ngủ'),
        ],
      },
      {
        id: 'SW-04', en: 'Sound Texture', vi: 'Chất âm', control: 'combobox',
        items: [
          it('Bright crisp', 'Sáng rõ'), it('Warm rounded', 'Ấm tròn'),
          it('Airy soft', 'Nhẹ bay'), it('Punchy tight', 'Chắc gọn'),
          it('Dreamy washed', 'Mơ màng'), it('Gritty raw', 'Thô ráp'),
          it('Glassy shimmer', 'Lấp lánh'), it('Bubbly playful', 'Bong bóng vui'),
        ],
      },
      {
        id: 'SW-05', en: 'Mix Character', vi: 'Tính chất bản mix', control: 'combobox',
        items: [
          it('Loud modern master', 'Master to hiện đại'), it('Gentle low-dynamic (kid-safe)', 'Êm, dải động thấp'),
          it('Airy reverb-heavy', 'Nhiều vang'), it('Dry intimate', 'Khô gần gũi'),
          it('Club-ready bass', 'Bass chuẩn club'), it('Radio-balanced', 'Cân bằng radio'),
          it('Cinematic wide', 'Rộng điện ảnh'), it('Mono-safe simple', 'An toàn mono'),
        ],
      },
      {
        id: 'SW-06', en: 'Vocal Production', vi: 'Xử lý giọng hát', control: 'combobox',
        items: [
          it('Clean dry lead', 'Giọng mộc rõ'), it('Layered doubles', 'Nhân đôi lớp'),
          it('Choir stacks', 'Xếp bè hợp xướng'), it('Light pitch correction', 'Chỉnh phô nhẹ'),
          it('Stylized autotune', 'Autotune phong cách'), it('Whisper close mic', 'Thì thầm sát mic'),
          it('Natural child voice', 'Giọng trẻ tự nhiên'), it('Vocoder robot', 'Vocoder'),
        ],
      },
      {
        id: 'SW-07', en: 'Dynamic Arc', vi: 'Cung động lực', control: 'combobox',
        items: [
          it('Flat steady', 'Đều phẳng'), it('Slow build', 'Dồn chậm'),
          it('Verse low → chorus lift', 'Phiên thấp → điệp khúc nâng'), it('Big drop', 'Bung mạnh'),
          it('Fade-out ending', 'Kết nhỏ dần'), it('Sudden stop', 'Dừng đột ngột'),
          it('Wave up-down', 'Lên xuống theo đợt'), it('Constant energy', 'Năng lượng không đổi'),
        ],
      },
      {
        id: 'SW-08', en: 'Sonic Palette', vi: 'Bảng màu âm thanh', control: 'combobox',
        items: [
          it('Sunny warm tones', 'Sắc nắng ấm'), it('Cool blue tones', 'Sắc lam mát'),
          it('Candy bright', 'Kẹo ngọt sáng'), it('Earthy organic', 'Mộc đất'),
          it('Neon electric', 'Neon điện'), it('Pastel soft', 'Pastel dịu'),
          it('Golden vintage', 'Vàng cổ'), it('Crystal clear', 'Pha lê trong'),
        ],
      },
      {
        id: 'SW-09', en: 'Loudness & Safety', vi: 'Độ to & an toàn', control: 'combobox', required: true,
        items: [
          it('Kid-safe gentle ≤ -16 LUFS', 'An toàn cho bé'), it('Streaming standard -14 LUFS', 'Chuẩn streaming'),
          it('Club loud -9 LUFS', 'To chuẩn club'), it('Broadcast -23 LUFS', 'Chuẩn phát sóng'),
          it('No sudden loud spikes', 'Không tăng âm đột ngột'), it('No harsh sibilance', 'Không gắt chữ s'),
        ],
      },
    ],
  },

  /* ========== 3 · ARTIST / PERFORMER ID ========== */
  {
    no: 3,
    code: 'AR',
    title: 'Artist / Performer ID',
    titleVi: 'Nhận diện nghệ sĩ',
    layout: 'portrait-body',
    purpose: 'Hồ sơ nhận diện ca sĩ / nhân vật biểu diễn: form tham chiếu (portrait, full body), 4 góc máy, biểu cảm, phong cách sân khấu.',
    output: 'Artist sheet prompt: portrait + full-body nhiều góc, gắn ID AR-### dùng lại ở mọi sequence/shot.',
    categories: [
      {
        id: 'AR-F1', en: 'Reference Form', vi: 'Form ảnh tham chiếu', control: 'checkbox', required: true, group: 'form',
        note: 'Mỗi line nghệ sĩ gắn 1 form: Portrait (cận mặt) hoặc Full Body (toàn thân).',
        items: [it('Portrait sheet', 'Chân dung cận mặt'), it('Full-body sheet', 'Toàn thân')],
      },
      {
        id: 'AR-F2', en: 'Sheet Camera Angle', vi: 'Góc máy của sheet', control: 'multi', required: true, group: 'form',
        note: 'Multi-choice — khuyến nghị đủ 4 góc để agent giữ nhất quán.',
        items: [
          it('Front view', 'Chính diện'), it('Left three-quarter', 'Nghiêng trái'),
          it('Right three-quarter', 'Nghiêng phải'), it('Back view', 'Đằng sau'),
        ],
      },
      {
        id: 'AR-F3', en: 'Sheet Expression', vi: 'Biểu cảm của sheet', control: 'combobox', required: true, group: 'form',
        items: [
          it('Neutral', 'Bình thường'), it('Happy', 'Vui'), it('Angry', 'Tức giận'),
          it('Singing open mouth', 'Đang hát mở khẩu hình'), it('Playful wink', 'Nháy mắt tinh nghịch'),
          it('Dreamy eyes closed', 'Nhắm mắt mơ màng'),
        ],
      },
      {
        id: 'AR-01', en: 'Performer Type', vi: 'Loại nghệ sĩ', control: 'combobox', required: true, group: 'portrait',
        items: [
          it('Child singer', 'Ca sĩ nhí'), it('Kids group / band', 'Nhóm thiếu nhi'),
          it('Teen idol', 'Thần tượng teen'), it('Adult solo artist', 'Solo trưởng thành'),
          it('Duo', 'Song tấu'), it('Family band', 'Ban nhạc gia đình'),
          it('Virtual avatar', 'Nhân vật ảo'), it('Animated character', 'Nhân vật hoạt hình'),
          it('Animal mascot', 'Linh vật thú'), it('Puppet', 'Rối'),
          it('Influencer creator', 'Nhà sáng tạo'), it('Choir', 'Dàn hợp xướng'),
        ],
      },
      {
        id: 'AR-02', en: 'Gender Presentation', vi: 'Giới tính thể hiện', control: 'combobox', group: 'portrait',
        items: [it('Male', 'Nam'), it('Female', 'Nữ'), it('Androgynous', 'Trung tính'), it('Group mixed', 'Nhóm hỗn hợp')],
      },
      {
        id: 'AR-03', en: 'Apparent Age', vi: 'Độ tuổi thể hiện', control: 'combobox', group: 'portrait',
        items: [
          it('Toddler 2–4', 'Mầm non'), it('Child 5–8', 'Nhi đồng'),
          it('Preteen 9–12', 'Thiếu nhi lớn'), it('Teen 13–17', 'Teen'),
          it('Young adult 18–25', 'Trẻ'), it('Adult 26–40', 'Trưởng thành'),
          it('Middle-aged 41–60', 'Trung niên'), it('Elderly 60+', 'Cao tuổi'),
        ],
      },
      {
        id: 'AR-04', en: 'Heritage', vi: 'Nguồn gốc', control: 'combobox', group: 'portrait',
        items: [
          it('East Asian'), it('Southeast Asian / Vietnamese', 'Việt Nam'),
          it('South Asian'), it('Caucasian European', 'Gốc Âu'),
          it('African descent', 'Gốc Phi'), it('Latino'), it('Middle Eastern', 'Trung Đông'),
          it('Pacific Islander', 'Đảo Thái Bình Dương'), it('Mixed heritage', 'Lai'),
        ],
      },
      {
        id: 'AR-05', en: 'Face Shape', vi: 'Dáng mặt', control: 'combobox', group: 'portrait',
        items: [
          it('Round soft', 'Tròn mềm'), it('Oval', 'Trái xoan'),
          it('Square jaw', 'Vuông góc cạnh'), it('Heart-shaped', 'Trái tim'),
          it('Chubby toddler cheeks', 'Má bầu bĩnh'), it('Long thin', 'Thuôn dài'),
        ],
      },
      {
        id: 'AR-06', en: 'Eye Shape', vi: 'Dáng mắt', control: 'combobox', group: 'portrait',
        items: [
          it('Big round doe eyes', 'Tròn to'), it('Almond', 'Hạnh nhân'),
          it('Monolid', 'Một mí'), it('Hooded', 'Mí trùm'),
          it('Upturned', 'Hơi xếch'), it('Sparkling wide', 'Long lanh'),
        ],
      },
      {
        id: 'AR-07', en: 'Eye Color', vi: 'Màu mắt', control: 'combobox', group: 'portrait',
        items: [
          it('Deep brown', 'Nâu sẫm'), it('Black', 'Đen'), it('Ice blue', 'Xanh băng'),
          it('Emerald green', 'Lục bảo'), it('Hazel', 'Nâu xanh'),
          it('Amber', 'Hổ phách'), it('Fantasy violet', 'Tím giả tưởng'),
        ],
      },
      {
        id: 'AR-08', en: 'Hair Style', vi: 'Kiểu tóc', control: 'combobox', group: 'portrait',
        items: [
          it('Short bob', 'Bob ngắn'), it('Pigtails / twin tails', 'Hai bím'),
          it('Curly afro', 'Xoăn afro'), it('Long straight', 'Dài thẳng'),
          it('Ponytail high', 'Đuôi ngựa cao'), it('Braided crown', 'Bím vương miện'),
          it('Buzz cut', 'Đầu đinh'), it('Wolf cut', 'Wolf cut'),
          it('Bun top knot', 'Búi cao'), it('Colorful dyed streaks', 'Nhuộm light màu'),
          it('Wavy shoulder length', 'Ngang vai gợn sóng'), it('Bald', 'Trọc'),
        ],
      },
      {
        id: 'AR-09', en: 'Hair Color', vi: 'Màu tóc', control: 'combobox', group: 'portrait',
        items: [
          it('Jet black', 'Đen tuyền'), it('Dark brown', 'Nâu sẫm'),
          it('Light brown', 'Nâu sáng'), it('Blonde', 'Vàng'),
          it('Auburn red', 'Đỏ hung'), it('Silver grey', 'Bạc'),
          it('Pastel pink', 'Hồng pastel'), it('Candy blue', 'Xanh kẹo'),
        ],
      },
      {
        id: 'AR-10', en: 'Skin Tone', vi: 'Tông da', control: 'combobox', group: 'portrait',
        items: [
          it('Porcelain', 'Bạch ngọc'), it('Fair', 'Sáng'), it('Warm ivory', 'Ngà ấm'),
          it('Olive', 'Oliu'), it('Golden tan', 'Vàng rám nắng'),
          it('Caramel', 'Caramen'), it('Bronze', 'Đồng'), it('Deep ebony', 'Nâu sâu'),
        ],
      },
      {
        id: 'AR-11', en: 'Distinctive Marks', vi: 'Dấu ấn riêng', control: 'combobox', group: 'portrait',
        items: [
          it('None', 'Không'), it('Freckles', 'Tàn nhang'), it('Dimples', 'Má lúm'),
          it('Beauty mole', 'Nốt ruồi duyên'), it('Round glasses', 'Kính tròn'),
          it('Star face paint', 'Vẽ sao lên mặt'), it('Glitter cheeks', 'Má nhũ'),
          it('Small scar', 'Sẹo nhỏ'),
        ],
      },
      {
        id: 'AR-12', en: 'Stage Persona', vi: 'Phong cách sân khấu', control: 'combobox', group: 'portrait',
        items: [
          it('Sweet innocent', 'Ngọt ngào ngây thơ'), it('Cool confident', 'Ngầu tự tin'),
          it('Shy gentle', 'Nhút nhát dịu dàng'), it('Energetic bouncy', 'Tăng động nhún nhảy'),
          it('Dreamy poetic', 'Mơ màng thơ'), it('Funny goofy', 'Hài hước ngố'),
          it('Fierce diva', 'Diva mãnh liệt'), it('Warm storyteller', 'Kể chuyện ấm áp'),
          it('Mysterious', 'Bí ẩn'),
        ],
      },
      {
        id: 'AR-13', en: 'Body Type', vi: 'Thể hình', control: 'combobox', group: 'body',
        items: [
          it('Toddler chubby', 'Bầu bĩnh mầm non'), it('Slim child', 'Trẻ thon'),
          it('Lean dancer', 'Vũ công mảnh'), it('Athletic', 'Thể thao'),
          it('Average', 'Trung bình'), it('Curvy', 'Đường cong'),
          it('Plus-size', 'Ngoại cỡ'), it('Petite', 'Nhỏ nhắn'),
        ],
      },
      {
        id: 'AR-14', en: 'Bearing / Posture', vi: 'Tư thế', control: 'combobox', group: 'body',
        items: [
          it('Bouncy light-footed', 'Nhún nhảy nhẹ'), it('Confident upright', 'Ngẩng cao tự tin'),
          it('Graceful dancer', 'Duyên dáng vũ công'), it('Relaxed slouch', 'Thoải mái'),
          it('Energetic jumping', 'Nhảy liên tục'), it('Calm still', 'Điềm tĩnh'),
        ],
      },
      {
        id: 'AR-15', en: 'Outfit Style', vi: 'Trang phục biểu diễn', control: 'combobox', group: 'body',
        items: [
          it('Sparkle stage costume', 'Đồ diễn lấp lánh'), it('Casual streetwear', 'Đường phố'),
          it('Cozy pajama', 'Pyjama êm'), it('School uniform', 'Đồng phục'),
          it('Traditional áo dài', 'Áo dài'), it('Fantasy costume', 'Trang phục giả tưởng'),
          it('Retro 80s', 'Retro 80s'), it('Sport / dance wear', 'Đồ nhảy thể thao'),
          it('Animal onesie', 'Đồ thú liền thân'), it('Formal concert dress', 'Váy concert'),
          it('Denim + tee', 'Jean + áo thun'), it('Futuristic metallic', 'Kim loại tương lai'),
        ],
      },
      {
        id: 'AR-16', en: 'Signature Accessory', vi: 'Phụ kiện thương hiệu', control: 'combobox', group: 'body',
        items: [
          it('Handheld microphone', 'Mic cầm tay'), it('Headset mic', 'Mic đeo tai'),
          it('Acoustic guitar', 'Guitar mộc'), it('Ukulele'), it('Keytar'),
          it('Drumsticks', 'Dùi trống'), it('Tambourine', 'Lục lạc'),
          it('Teddy bear prop', 'Gấu bông'), it('Star wand', 'Đũa sao'),
          it('Sunglasses', 'Kính râm'), it('Cap', 'Mũ lưỡi trai'),
          it('Light-up gloves', 'Găng phát sáng'),
        ],
      },
      {
        id: 'AR-17', en: 'Performance Style', vi: 'Lối biểu diễn', control: 'combobox', group: 'body',
        items: [
          it('Big choreography', 'Vũ đạo lớn'), it('Gentle sway', 'Đung đưa nhẹ'),
          it('Jump & clap', 'Nhảy & vỗ tay'), it('Play instrument along', 'Vừa đàn vừa hát'),
          it('Story acting', 'Diễn theo câu chuyện'), it('Dance battle', 'Đối kháng nhảy'),
          it('Static emotional sing', 'Đứng hát cảm xúc'), it('Interactive with camera', 'Tương tác ống kính'),
          it('Teach-along gesture', 'Cử chỉ dạy theo'),
        ],
      },
      {
        id: 'AR-18', en: 'Default Expression', vi: 'Biểu cảm mặc định', control: 'combobox', group: 'body',
        items: [
          it('Warm friendly', 'Thân thiện ấm áp'), it('Bright cheerful', 'Tươi sáng'),
          it('Stoic neutral', 'Lạnh lùng'), it('Playful grin', 'Tinh nghịch'),
          it('Dreamy soft', 'Mơ màng'), it('Fierce determined', 'Mãnh liệt'),
          it('Gentle calm', 'Dịu êm'),
        ],
      },
    ],
  },

  /* ========== 4 · VENUE & STAGE ID ========== */
  {
    no: 4,
    code: 'VN',
    title: 'Venue & Stage ID',
    titleVi: 'Bối cảnh & sân khấu',
    purpose: 'Chuẩn hóa không gian biểu diễn: loại sân khấu, thiết kế set, ánh sáng, đạo cụ — tái sử dụng giữa các sequence.',
    output: 'Stage sheet prompt cho background / establishing shot, gắn ID VN-###.',
    categories: [
      {
        id: 'VN-01', en: 'Setting', vi: 'Trong nhà / Ngoài trời', control: 'checkbox', required: true,
        items: [it('Interior', 'Trong nhà'), it('Exterior', 'Ngoài trời')],
      },
      {
        id: 'VN-02', en: 'Venue Type', vi: 'Loại bối cảnh', control: 'combobox', required: true,
        items: [
          it('Bedroom playroom', 'Phòng ngủ / phòng chơi'), it('Classroom', 'Lớp học'),
          it('Playground park', 'Sân chơi công viên'), it('Beach', 'Bãi biển'),
          it('Forest clearing', 'Trảng rừng'), it('Concert stage', 'Sân khấu concert'),
          it('TV studio', 'Phim trường'), it('Animated fantasy land', 'Vùng đất hoạt hình'),
          it('Spaceship cabin', 'Khoang tàu vũ trụ'), it('Candy land', 'Vùng kẹo ngọt'),
          it('Kitchen', 'Nhà bếp'), it('Garden', 'Vườn'),
          it('City rooftop', 'Sân thượng'), it('Library', 'Thư viện'),
          it('Arcade', 'Khu game'), it('Mountain lake', 'Hồ núi'),
        ],
      },
      {
        id: 'VN-03', en: 'Set Design Style', vi: 'Phong cách thiết kế', control: 'combobox',
        items: [
          it('Toy-brick playful', 'Xếp hình đồ chơi'), it('Storybook illustration', 'Minh họa truyện tranh'),
          it('Neon stage', 'Sân khấu neon'), it('Minimal pastel', 'Pastel tối giản'),
          it('Retro arcade', 'Arcade cổ'), it('Nature organic', 'Tự nhiên mộc'),
          it('Circus tent', 'Rạp xiếc'), it('Underwater dream', 'Giấc mơ dưới nước'),
          it('Space sci-fi', 'Khoa học vũ trụ'), it('Cozy home', 'Nhà ấm cúng'),
          it('Festival fairground', 'Hội chợ lễ hội'), it('Chalk classroom', 'Bảng phấn lớp học'),
        ],
      },
      {
        id: 'VN-04', en: 'Time of Day', vi: 'Buổi trong ngày', control: 'combobox',
        items: [
          it('Sunrise', 'Bình minh'), it('Bright morning', 'Sáng rực'),
          it('Noon', 'Trưa'), it('Golden afternoon', 'Chiều vàng'),
          it('Sunset', 'Hoàng hôn'), it('Blue hour', 'Giờ xanh'),
          it('Night', 'Đêm'), it('Starry midnight', 'Nửa đêm đầy sao'),
          it('Dream-timeless', 'Phi khái niệm'),
        ],
      },
      {
        id: 'VN-05', en: 'Weather & Atmosphere', vi: 'Khí hậu & không khí', control: 'combobox',
        items: [
          it('Clear sunny', 'Nắng trong'), it('Rainy cozy', 'Mưa ấm cúng'),
          it('Snowy', 'Tuyết'), it('Windy', 'Gió'), it('Foggy dream', 'Sương mơ'),
          it('Sparkle sunny', 'Nắng lấp lánh'), it('Storm dramatic', 'Bão kịch tính'),
          it('Rainbow after rain', 'Cầu vồng sau mưa'),
        ],
      },
      {
        id: 'VN-06', en: 'Stage Lighting', vi: 'Ánh sáng sân khấu', control: 'combobox', required: true,
        items: [
          it('Soft wash kid-safe', 'Rửa sáng êm, an toàn cho bé'), it('Colorful party lights', 'Đèn tiệc nhiều màu'),
          it('Spotlight follow', 'Đèn đuổi'), it('Golden rim backlight', 'Viền vàng ngược sáng'),
          it('Neon glow', 'Neon'), it('Fairy lights warm', 'Đèn dây ấm'),
          it('Natural daylight', 'Ánh sáng tự nhiên'), it('Silhouette dramatic', 'Bóng ngược kịch'),
          it('Strobe flash (teen+)', 'Nháy strobe'), it('Candle warm', 'Nến ấm'),
        ],
      },
      {
        id: 'VN-07', en: 'Scale', vi: 'Quy mô', control: 'combobox',
        items: [
          it('Intimate corner', 'Góc nhỏ ấm cúng'), it('Small room', 'Phòng nhỏ'),
          it('Medium hall', 'Sảnh vừa'), it('Large stage', 'Sân khấu lớn'),
          it('Arena', 'Nhà thi đấu'), it('Landscape vast', 'Cảnh quan rộng'),
        ],
      },
      {
        id: 'VN-08', en: 'Crowd in Frame', vi: 'Khán giả trong khung', control: 'combobox',
        items: [
          it('Empty set', 'Trống'), it('Few friends', 'Vài bạn nhỏ'),
          it('Kids group', 'Nhóm thiếu nhi'), it('Family crowd', 'Khán giả gia đình'),
          it('Concert crowd', 'Khán giả concert'), it('Stadium mass', 'Biển khán giả'),
          it('Dancers ensemble', 'Nhóm vũ công'),
        ],
      },
      {
        id: 'VN-09', en: 'Place Mood', vi: 'Không khí nơi chốn', control: 'combobox',
        items: [
          it('Cozy safe', 'An toàn ấm cúng'), it('Joyful playful', 'Vui nhộn'),
          it('Magical wonder', 'Kỳ diệu'), it('Energetic party', 'Tiệc năng lượng'),
          it('Calm dreamy', 'Êm mơ màng'), it('Epic grand', 'Hùng vĩ'),
          it('Nostalgic warm', 'Hoài niệm ấm'), it('Mysterious', 'Bí ẩn'),
        ],
      },
      {
        id: 'VN-10', en: 'Key Set Dressing', vi: 'Đạo cụ chủ đạo', control: 'combobox',
        items: [
          it('Toys & plush', 'Đồ chơi & thú bông'), it('Balloons & confetti', 'Bóng & pháo giấy'),
          it('Instrument props', 'Đạo cụ nhạc cụ'), it('Books & chalkboard', 'Sách & bảng'),
          it('Flowers & nature', 'Hoa & cây'), it('Neon signs', 'Biển neon'),
          it('Bubble machine', 'Máy bong bóng'), it('Swing & slide', 'Xích đu cầu trượt'),
          it('Curtains & fairy lights', 'Rèm & đèn dây'), it('Fruit & snacks', 'Trái cây & quà vặt'),
        ],
      },
    ],
  },

  /* ========== 5 · LYRICS & VOCAL SCRIPT ========== */
  {
    no: 5,
    code: 'LY',
    title: 'Lyrics & Vocal Script',
    titleVi: 'Ca từ & kịch bản hát',
    purpose: 'Chuẩn hóa ca từ theo đoạn: mức từ vựng, vần, cách hát, yếu tố giáo dục và thông điệp — an toàn theo đối tượng.',
    output: 'Lyric prompt cho music AI, kèm cấu trúc đoạn và mức ngôn ngữ phù hợp đối tượng.',
    categories: [
      {
        id: 'LY-01', en: 'Section Type', vi: 'Loại đoạn', control: 'combobox', required: true,
        items: [
          it('Verse', 'Phiên khúc'), it('Pre-chorus', 'Tiền điệp khúc'),
          it('Chorus / Hook', 'Điệp khúc'), it('Bridge', 'Cầu nối'),
          it('Rap verse', 'Đoạn rap'), it('Chant', 'Hô tập thể'),
          it('Spoken intro', 'Mở bằng nói'), it('Ad-lib', 'Ứng tác'),
          it('Lullaby hum', 'Ngâm ru'), it('Outro tag', 'Kết'),
        ],
      },
      {
        id: 'LY-02', en: 'Language', vi: 'Ngôn ngữ ca từ', control: 'combobox', required: true,
        items: [
          it('Vietnamese', 'Tiếng Việt'), it('English', 'Tiếng Anh'),
          it('Bilingual VI–EN', 'Song ngữ'), it('Japanese', 'Tiếng Nhật'),
          it('Korean', 'Tiếng Hàn'), it('Spanish', 'Tiếng Tây Ban Nha'),
          it('Instrumental only', 'Chỉ nhạc'), it('Scat / gibberish', 'Âm vui tai'),
        ],
      },
      {
        id: 'LY-03', en: 'Vocabulary Level', vi: 'Mức từ vựng', control: 'combobox', required: true,
        items: [
          it('Toddler simple (1–2 syllables)', 'Mầm non: 1–2 âm'), it('Child basic', 'Nhi đồng cơ bản'),
          it('Preteen conversational', 'Thiếu nhi lớn: khẩu ngữ'), it('Teen slang-light', 'Teen: tiếng lóng nhẹ'),
          it('Adult poetic', 'Trưởng thành: thơ'), it('Universal minimal words', 'Tối thiểu, phổ quát'),
        ],
      },
      {
        id: 'LY-04', en: 'Rhyme Scheme', vi: 'Cách gieo vần', control: 'combobox',
        items: [
          it('AABB simple', 'Vần đôi đơn giản'), it('ABAB alternating', 'Vần chéo'),
          it('Internal rhyme', 'Vần lưng'), it('Free verse', 'Tự do'),
          it('Repetitive chant', 'Lặp kiểu hô'), it('No rhyme spoken', 'Nói không vần'),
        ],
      },
      {
        id: 'LY-05', en: 'Delivery Tone', vi: 'Sắc thái thể hiện', control: 'combobox',
        items: [
          it('Cheerful bright', 'Tươi sáng'), it('Gentle soothing', 'Dịu êm'),
          it('Playful silly', 'Tinh nghịch'), it('Confident bold', 'Tự tin'),
          it('Emotional tender', 'Trìu mến'), it('Storytelling warm', 'Kể chuyện ấm'),
          it('Sassy', 'Đanh đá duyên'), it('Whispered', 'Thì thầm'),
        ],
      },
      {
        id: 'LY-06', en: 'Singing Pace', vi: 'Tốc độ hát', control: 'combobox',
        items: [
          it('Slow sustained', 'Chậm kéo dài'), it('Moderate', 'Vừa'),
          it('Fast rhythmic', 'Nhanh theo nhịp'), it('Rap double-time', 'Rap gấp đôi'),
          it('Rubato free', 'Tự do nhịp'),
        ],
      },
      {
        id: 'LY-07', en: 'Repetition Strategy', vi: 'Chiến lược lặp', control: 'combobox',
        items: [
          it('Hook repeats 3x', 'Lặp hook 3 lần'), it('Repeat every line', 'Lặp từng câu'),
          it('Minimal repeat', 'Ít lặp'), it('Call & response', 'Hô – đáp'),
          it('Cumulative build', 'Cộng dồn từng phiên'),
        ],
      },
      {
        id: 'LY-08', en: 'Educational Element', vi: 'Yếu tố giáo dục', control: 'combobox',
        items: [
          it('None', 'Không'), it('Counting 1–10', 'Đếm số'),
          it('ABC alphabet', 'Bảng chữ cái'), it('Colors', 'Màu sắc'),
          it('Shapes', 'Hình khối'), it('Body parts', 'Bộ phận cơ thể'),
          it('Animal sounds', 'Tiếng con vật'), it('Manners & kindness', 'Lễ phép & tử tế'),
          it('Daily routine', 'Thói quen hằng ngày'), it('Vietnamese tone practice', 'Luyện thanh tiếng Việt'),
        ],
      },
      {
        id: 'LY-09', en: 'Message & Value', vi: 'Thông điệp', control: 'combobox',
        items: [
          it('Friendship', 'Tình bạn'), it('Kindness & sharing', 'Tử tế & sẻ chia'),
          it('Courage', 'Can đảm'), it('Curiosity', 'Tò mò khám phá'),
          it('Family love', 'Tình gia đình'), it('Hygiene habits', 'Vệ sinh'),
          it('Sleep routine', 'Nề nếp ngủ'), it('Self-love', 'Yêu bản thân'),
          it('Nature care', 'Bảo vệ thiên nhiên'), it('Never give up', 'Không bỏ cuộc'),
        ],
      },
      {
        id: 'LY-10', en: 'On-screen Lyrics', vi: 'Ca từ trên màn hình', control: 'checkbox',
        items: [it('Karaoke-style burned-in', 'Có ca từ kiểu karaoke'), it('None', 'Không')],
      },
      {
        id: 'LY-11', en: 'Lyric Length', vi: 'Độ dài ca từ', control: 'combobox',
        items: [
          it('4 lines', '4 câu'), it('8 lines', '8 câu'), it('12 lines', '12 câu'),
          it('16 lines', '16 câu'), it('24+ lines', '24 câu trở lên'),
        ],
      },
    ],
  },

  /* ========== 6 · VOCAL IDENTITY ========== */
  {
    no: 6,
    code: 'VC',
    title: 'Vocal Identity',
    titleVi: 'Nhận diện giọng hát',
    purpose: 'Cast giọng cho từng nghệ sĩ: loại giọng, âm sắc, kỹ thuật, bè và xử lý — khóa nhất quán giữa các take.',
    output: 'Voice prompt cho vocal AI / TTS singing, gắn ID VC-###.',
    categories: [
      {
        id: 'VC-01', en: 'Vocal Gender', vi: 'Giới giọng', control: 'combobox', required: true,
        items: [it('Male', 'Nam'), it('Female', 'Nữ'), it('Child neutral', 'Trẻ em'), it('Synthetic', 'Tổng hợp')],
      },
      {
        id: 'VC-02', en: 'Vocal Age', vi: 'Tuổi giọng', control: 'combobox',
        items: [
          it('Toddler', 'Mầm non'), it('Child', 'Nhi đồng'), it('Teen', 'Teen'),
          it('Young adult', 'Trẻ'), it('Adult', 'Trưởng thành'), it('Senior', 'Lớn tuổi'),
        ],
      },
      {
        id: 'VC-03', en: 'Range / Voice Type', vi: 'Quãng giọng', control: 'combobox', required: true,
        items: [
          it('Soprano bright', 'Nữ cao sáng'), it('Mezzo warm', 'Nữ trung ấm'),
          it('Alto deep', 'Nữ trầm'), it('Tenor light', 'Nam cao nhẹ'),
          it('Baritone rich', 'Nam trung dày'), it('Bass low', 'Nam trầm'),
          it('Child treble', 'Giọng trẻ cao'),
        ],
      },
      {
        id: 'VC-04', en: 'Timbre', vi: 'Âm sắc', control: 'combobox',
        items: [
          it('Clear bell-like', 'Trong như chuông'), it('Warm honey', 'Ấm mật'),
          it('Airy breathy', 'Nhiều hơi'), it('Bright crystal', 'Sáng pha lê'),
          it('Soft cotton', 'Mềm như bông'), it('Raspy soul', 'Khàn soul'),
          it('Playful squeaky', 'Lanh lảnh vui'), it('Smooth velvet', 'Mượt nhung'),
        ],
      },
      {
        id: 'VC-05', en: 'Technique', vi: 'Kỹ thuật', control: 'combobox',
        items: [
          it('Natural child sing', 'Hát trẻ tự nhiên'), it('Belting power', 'Belt mạnh'),
          it('Falsetto float', 'Giả thanh bay'), it('Legato smooth', 'Legato mượt'),
          it('Staccato bouncy', 'Staccato nảy'), it('Rich vibrato', 'Rung dày'),
          it('Whisper-sing', 'Hát thì thầm'), it('Chant', 'Hô nhịp'),
        ],
      },
      {
        id: 'VC-06', en: 'Harmony Layer', vi: 'Lớp bè', control: 'combobox',
        items: [
          it('Solo only', 'Chỉ đơn ca'), it('Third harmony', 'Bè quãng ba'),
          it('Octave double', 'Nhân quãng tám'), it('Choir pad', 'Nền hợp xướng'),
          it('4-part stack', 'Xếp 4 bè'), it('Call & response echoes', 'Vọng hô đáp'),
        ],
      },
      {
        id: 'VC-07', en: 'Vocal FX', vi: 'Hiệu ứng giọng', control: 'combobox',
        items: [
          it('Clean dry', 'Khô sạch'), it('Light reverb', 'Vang nhẹ'),
          it('Hall reverb', 'Vang hội trường'), it('Delay echo', 'Vọng'),
          it('Vocoder', 'Vocoder'), it('Subtle pitch correction', 'Chỉnh phô nhẹ'),
          it('Stylized pitch correction', 'Chỉnh phô phong cách'), it('Telephone', 'Điện thoại'),
        ],
      },
      {
        id: 'VC-08', en: 'Emotion Arc', vi: 'Cung cảm xúc', control: 'combobox',
        items: [
          it('Steady joyful', 'Vui đều'), it('Build to big chorus', 'Dồn lên điệp khúc'),
          it('Soft to loud', 'Nhỏ rồi lớn'), it('Playful shifts', 'Đổi sắc tinh nghịch'),
          it('Soothing constant', 'Êm liên tục'),
        ],
      },
    ],
  },

  /* ========== 7 · SEQUENCE / MUSIC SCENES ========== */
  {
    no: 7,
    code: 'SQ',
    title: 'Sequence / Music Scenes',
    titleVi: 'Trình tự cảnh theo nhạc',
    purpose: 'Chẻ bài hát thành sequence theo đoạn nhạc, gắn quy tắc cắt theo phách và mức năng lượng hình ảnh.',
    output: 'Sequence breakdown: đoạn nhạc × cảnh × quy tắc beat-sync, gắn ID SQ-###.',
    categories: [
      {
        id: 'SQ-01', en: 'Song Section Position', vi: 'Vị trí đoạn nhạc', control: 'combobox', required: true,
        items: [
          it('Intro', 'Mở đầu'), it('Verse 1', 'Phiên 1'), it('Pre-chorus', 'Tiền điệp khúc'),
          it('Chorus 1', 'Điệp khúc 1'), it('Verse 2', 'Phiên 2'), it('Chorus 2', 'Điệp khúc 2'),
          it('Bridge / Solo', 'Cầu nối / solo'), it('Final chorus', 'Điệp khúc cuối'),
          it('Outro', 'Kết'), it('Post-hook tag', 'Tag sau hook'),
        ],
      },
      {
        id: 'SQ-02', en: 'Sequence Type', vi: 'Loại sequence', control: 'combobox', required: true,
        items: [
          it('Performance lip-sync', 'Hát nhép biểu diễn'), it('Story narrative', 'Kể chuyện'),
          it('Dance choreography', 'Vũ đạo'), it('Abstract visual', 'Hình ảnh trừu tượng'),
          it('Animation story', 'Hoạt hình'), it('Montage of moments', 'Mông-ta khoảnh khắc'),
          it('Single-take walk', 'Một cú máy đi'), it('Interactive teaching', 'Tương tác dạy học'),
          it('Dream sequence', 'Giấc mơ'), it('Behind-the-scenes style', 'Kiểu hậu trường'),
        ],
      },
      {
        id: 'SQ-03', en: 'Dramatic Function', vi: 'Chức năng', control: 'combobox',
        items: [
          it('Establish mood', 'Thiết lập cảm xúc'), it('Introduce hook', 'Giới thiệu hook'),
          it('Build energy', 'Dồn năng lượng'), it('Release / celebrate', 'Bung / ăn mừng'),
          it('Tell story beat', 'Kể một nhịp truyện'), it('Teach concept', 'Dạy khái niệm'),
          it('Cool down', 'Hạ nhiệt'), it('Surprise twist', 'Lật bất ngờ'),
        ],
      },
      {
        id: 'SQ-04', en: 'Duration', vi: 'Độ dài', control: 'combobox',
        items: [
          it('4 seconds'), it('8 seconds'), it('12 seconds'), it('16 seconds'),
          it('20 seconds'), it('30 seconds'), it('45 seconds'), it('60 seconds'),
        ],
      },
      {
        id: 'SQ-05', en: 'Beat Sync Rule', vi: 'Quy tắc cắt theo phách', control: 'combobox', required: true,
        items: [
          it('Cut on every beat', 'Cắt mỗi phách'), it('Cut every 2 beats', 'Cắt mỗi 2 phách'),
          it('Cut on bar (4 beats)', 'Cắt mỗi nhịp 4'), it('Cut on section change', 'Cắt khi đổi đoạn'),
          it('Free-flow no cut', 'Trôi tự do'), it('Cut on snare', 'Cắt theo snare'),
          it('Cut on drop', 'Cắt khi bung'),
        ],
      },
      {
        id: 'SQ-06', en: 'Camera Base Style', vi: 'Phong cách máy nền', control: 'combobox',
        items: [
          it('Locked tripod', 'Chân máy tĩnh'), it('Handheld energy', 'Cầm tay năng lượng'),
          it('Gimbal glide', 'Gimbal lướt'), it('Steadicam follow', 'Steadicam bám'),
          it('Drone aerial', 'Flycam'), it('Crane sweep', 'Cẩu quét'),
          it('POV', 'Góc nhìn chủ quan'), it('Slider tabletop', 'Slider bàn'),
        ],
      },
      {
        id: 'SQ-07', en: 'Visual Treatment', vi: 'Xử lý hình ảnh', control: 'combobox',
        items: [
          it('Realistic grade', 'Màu chân thực'), it('Candy color grade', 'Màu kẹo'),
          it('High-key bright', 'Sáng high-key'), it('Slow-motion accent', 'Nhấn quay chậm'),
          it('Time-lapse', 'Tua nhanh'), it('Split screen', 'Chia khung'),
          it('Film grain', 'Hạt phim'), it('Animation overlay', 'Lớp hoạt hình'),
          it('Glow bloom', 'Tỏa sáng bloom'),
        ],
      },
      {
        id: 'SQ-08', en: 'Transition In', vi: 'Chuyển cảnh vào', control: 'combobox',
        items: [
          it('Hard cut', 'Cắt thẳng'), it('Beat-synced cut', 'Cắt theo phách'),
          it('Whip pan', 'Vuốt pan'), it('Dissolve', 'Hòa tan'),
          it('Match cut', 'Cắt khớp'), it('Light flash', 'Chớp sáng'),
          it('Zoom punch', 'Zoom đánh'), it('Shape wipe', 'Quẹt theo hình'),
          it('Morph', 'Biến hình'),
        ],
      },
      {
        id: 'SQ-09', en: 'Transition Out', vi: 'Chuyển cảnh ra', control: 'combobox',
        items: [
          it('Hard cut', 'Cắt thẳng'), it('Beat-synced cut', 'Cắt theo phách'),
          it('Whip pan', 'Vuốt pan'), it('Fade to color', 'Chìm về màu'),
          it('Match cut', 'Cắt khớp'), it('Light flash', 'Chớp sáng'),
          it('Zoom out', 'Zoom lùi'), it('Shape wipe', 'Quẹt theo hình'),
          it('Morph', 'Biến hình'),
        ],
      },
      {
        id: 'SQ-10', en: 'Energy Level', vi: 'Mức năng lượng', control: 'combobox',
        items: [
          it('Low calm', 'Thấp êm'), it('Medium groove', 'Vừa groove'),
          it('High dance', 'Cao vũ đạo'), it('Peak drop', 'Đỉnh bung'),
          it('Wind-down', 'Hạ dần'),
        ],
      },
    ],
  },

  /* ========== 8 · MUSIC SHOTS ========== */
  {
    no: 8,
    code: 'MS',
    title: 'Music Shots',
    titleVi: 'Cảnh quay theo nhạc',
    layout: 'shot',
    purpose: 'Đơn vị nhỏ nhất đưa vào GenAI video: camera + look + hành động biểu diễn đồng bộ phách + stem âm thanh.',
    output: 'Shot prompt hoàn chỉnh cho Runway / Kling / Veo / Seedance, đồng bộ beat, gắn ID MS-###.',
    categories: [
      {
        id: 'MS-01', en: 'Shot Size', vi: 'Cỡ cảnh', control: 'combobox', required: true, group: 'camera',
        items: [
          it('Extreme wide (EWS)', 'Cực xa'), it('Wide shot (WS)', 'Toàn cảnh'),
          it('Medium wide (MWS)', 'Trung toàn'), it('Medium shot (MS)', 'Trung cảnh'),
          it('Medium close-up (MCU)', 'Trung cận'), it('Close-up (CU)', 'Cận cảnh'),
          it('Big close-up (BCU)', 'Đại cận'), it('Extreme close-up insert', 'Chi tiết'),
        ],
      },
      {
        id: 'MS-02', en: 'Camera Angle', vi: 'Góc máy', control: 'combobox', required: true, group: 'camera',
        items: [
          it('Eye level', 'Ngang tầm mắt'), it('Low angle', 'Ngước lên'),
          it('High angle', 'Hạ xuống'), it("Bird's eye top-down", 'Từ trên thẳng'),
          it('Dutch tilt', 'Nghiêng lệch'), it('Over-the-shoulder', 'Qua vai'),
          it('POV', 'Chủ quan'), it("Worm's eye", 'Sát đất ngước'),
          it('Aerial drone', 'Từ không trung'), it('Profile side', 'Cạnh hông'),
        ],
      },
      {
        id: 'MS-03', en: 'Camera Movement', vi: 'Chuyển động máy', control: 'combobox', required: true, group: 'camera',
        items: [
          it('Static locked', 'Tĩnh'), it('Pan left / right', 'Quẹo ngang'),
          it('Tilt up / down', 'Ngửa / sấp'), it('Dolly push-in', 'Tiến vào'),
          it('Dolly pull-out', 'Lùi ra'), it('Truck lateral', 'Dọc ngang'),
          it('Arc / orbit', 'Quay quanh'), it('Crane rise', 'Cẩu vươn'),
          it('Handheld bounce', 'Cầm tay nảy'), it('Steadicam chase', 'Steadicam bám'),
          it('Whip pan', 'Vuốt pan'), it('Slow zoom', 'Zoom chậm'),
          it('360 spin', 'Xoay 360'), it('FPV dive', 'FPV lao'),
        ],
      },
      {
        id: 'MS-04', en: 'Lens Feel', vi: 'Ống kính', control: 'combobox', group: 'camera',
        items: [
          it('Ultra-wide 14mm', 'Siêu rộng'), it('Wide 24mm immersive', 'Rộng nhập vai'),
          it('Standard 35mm', 'Chuẩn điện ảnh'), it('50mm natural eye', 'Tự nhiên'),
          it('Portrait 85mm', 'Chân dung'), it('Telephoto 200mm', 'Dẹt nền xa'),
          it('Macro intimate', 'Vi mô'), it('Anamorphic flare', 'Anamorphic lóe'),
        ],
      },
      {
        id: 'MS-05', en: 'Focus & Depth', vi: 'Tiêu cự & chiều sâu', control: 'combobox', group: 'camera',
        items: [
          it('Deep focus all sharp', 'Nét toàn vùng'), it('Shallow bokeh isolation', 'Bokeh tách chủ thể'),
          it('Rack focus shift', 'Chuyển nét'), it('Tilt-shift miniature', 'Mô hình thu nhỏ'),
          it('Soft dreamy glow', 'Mềm mơ'), it('Split diopter', 'Đôi tiêu cự'),
        ],
      },
      {
        id: 'MS-06', en: 'Composition', vi: 'Bố cục', control: 'combobox', group: 'look',
        items: [
          it('Rule of thirds', 'Quy tắc 1/3'), it('Center symmetry', 'Đối xứng giữa'),
          it('Leading lines', 'Đường dẫn'), it('Frame within frame', 'Khung trong khung'),
          it('Negative space', 'Khoảng trống'), it('Layered parallax', 'Parallax nhiều lớp'),
          it('Dynamic diagonal', 'Chéo động'), it('Kaleidoscope symmetry', 'Đối xứng vạn hoa'),
          it('Overhead flat-lay', 'Phẳng từ trên'),
        ],
      },
      {
        id: 'MS-07', en: 'Lighting Modifier', vi: 'Bổ chỉnh ánh sáng', control: 'combobox', group: 'look',
        items: [
          it('Chiaroscuro contrast', 'Tương phản cao'), it('Soft beauty wrap', 'Sáng mềm bao'),
          it('Hard noon shadows', 'Bóng trưa gãy'), it('Golden rim backlight', 'Viền vàng ngược sáng'),
          it('Neon gel colors', 'Gel neon'), it('Single-source drama', 'Đơn nguồn kịch'),
          it('Broadcast flat', 'Phẳng phát sóng'), it('Fairy-light practical', 'Đèn dây thực tế'),
          it('Ring-light glow', 'Vòng sáng ring'),
        ],
      },
      {
        id: 'MS-08', en: 'Color Treatment', vi: 'Xử lý màu', control: 'combobox', group: 'look',
        items: [
          it('Candy pastel grade', 'Màu kẹo pastel'), it('Vivid saturated', 'Rực bão hòa'),
          it('Teal & orange', 'Teal & cam'), it('Monochrome', 'Đơn sắc'),
          it('Sepia warm', 'Nâu ấm'), it('Neon cyber', 'Neon cyber'),
          it('Natural true-to-life', 'Tự nhiên'), it('High-key bright', 'Sáng high-key'),
        ],
      },
      {
        id: 'MS-09', en: 'Performance Action', vi: 'Hành động biểu diễn', control: 'combobox', required: true, group: 'action',
        items: [
          it('Lip-sync close', 'Hát nhép cận'), it('Sing to camera', 'Hát vào ống kính'),
          it('Dance choreography', 'Vũ đạo'), it('Play instrument', 'Chơi nhạc cụ'),
          it('Clap & jump', 'Vỗ tay & nhảy'), it('Walk-and-sing', 'Vừa đi vừa hát'),
          it('Group formation dance', 'Đội hình nhóm'), it('Act out lyric', 'Diễn theo ca từ'),
          it('Lead kids along', 'Dẫn dắt các bé'), it('Wave & beaming face', 'Vẫy tay rạng rỡ'),
          it('Spin / twirl', 'Xoay người'), it('Sit & strum', 'Ngồi đệm đàn'),
        ],
      },
      {
        id: 'MS-10', en: 'Motion Energy', vi: 'Năng lượng chuyển động', control: 'combobox', group: 'action',
        items: [
          it('Still contemplative', 'Tĩnh'), it('Slow deliberate', 'Chậm chủ ý'),
          it('Natural pace', 'Tự nhiên'), it('Brisk', 'Nhanh gọn'),
          it('Frantic intense', 'Cuồng nhiệt'), it('Slow-motion glory', 'Quay chậm đẹp'),
          it('Speed ramped', 'Tăng giảm tốc'), it('Freeze frame', 'Đứng khung'),
          it('Bouncy rhythmic', 'Nảy theo nhịp'),
        ],
      },
      {
        id: 'MS-11', en: 'Beat Sync', vi: 'Đồng bộ phách', control: 'combobox', required: true, group: 'action',
        items: [
          it('On every beat', 'Mỗi phách'), it('On 2 beats', 'Mỗi 2 phách'),
          it('On bar', 'Mỗi nhịp 4'), it('On snare / clap', 'Theo snare / vỗ tay'),
          it('On drop', 'Khi bung'), it('On vocal phrase', 'Theo câu hát'),
          it('Off-beat free', 'Lệch phách tự do'), it('None', 'Không'),
        ],
      },
      {
        id: 'MS-12', en: 'Shot Duration', vi: 'Độ dài cảnh', control: 'combobox', group: 'action',
        items: [
          it('2 seconds'), it('3 seconds'), it('4 seconds'), it('5 seconds'),
          it('6 seconds'), it('8 seconds'), it('10 seconds'), it('12 seconds'),
        ],
      },
      {
        id: 'MS-13', en: 'Loop Mode', vi: 'Vòng lặp', control: 'checkbox', group: 'action',
        items: [it('Seamless loop', 'Lặp mượt'), it('One-shot', 'Không lặp')],
      },
      {
        id: 'MS-14', en: 'Audio Stem Focus', vi: 'Stem âm thanh chính', control: 'combobox', group: 'audio',
        items: [
          it('Full mix', 'Bản mix đầy đủ'), it('Vocal lead', 'Giọng chính'),
          it('Drums & bass', 'Trống & bass'), it('Melody instrument', 'Nhạc cụ giai điệu'),
          it('Harmony layer', 'Lớp bè'), it('Ambient room', 'Âm phòng'),
          it('A cappella moment', 'Khoảnh không nhạc'),
        ],
      },
      {
        id: 'MS-15', en: 'SFX Layer', vi: 'Lớp hiệu ứng âm', control: 'combobox', group: 'audio',
        items: [
          it('None clean', 'Không, sạch'), it('Whoosh transitions', 'Vút chuyển cảnh'),
          it('Crowd cheer', 'Khán giả reo'), it('Toy squeak', 'Đồ chơi kêu'),
          it('Sparkle chime', 'Chuông lấp lánh'), it('Footsteps', 'Bước chân'),
          it('Hand claps', 'Vỗ tay'), it('Nature ambience', 'Âm thiên nhiên'),
          it('UI blip', 'Tín hiệu số'),
        ],
      },
      {
        id: 'MS-16', en: 'Music Cue', vi: 'Điểm nhấn nhạc', control: 'combobox', group: 'audio',
        items: [
          it('Continuation', 'Tiếp nối'), it('Stinger accent', 'Nhấn đột xuất'),
          it('Riser swell', 'Dồn crescendo'), it('Drop to silence', 'Rơi vào im lặng'),
          it('Beat-synced cut', 'Cắt khớp phách'), it('Key change lift', 'Lên giọng'),
          it('Fade-out tail', 'Đuôi nhỏ dần'),
        ],
      },
    ],
  },
];
