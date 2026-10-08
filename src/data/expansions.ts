/**
 * EXPANSIONS v1.1 — bổ sung gợi ý built-in (built-in: không xóa được bởi user).
 * Rule mới: combobox 3 → ∞ (không giới hạn số lượng — hệ thống và user đều
 * có thể thêm item bất kỳ lúc nào); checkbox vẫn đúng 2 lựa chọn.
 */

export interface ExtraItem {
  en: string;
  vi?: string;
}

const ex = (en: string, vi?: string): ExtraItem => ({ en, vi });

export const extraItems: Record<string, ExtraItem[]> = {
  /* ---------- STEP 1 · STORYLINE ---------- */
  'ST-01': [
    ex('Psychological thriller', 'Kinh dị tâm lý'), ex('Disaster', 'Thảm họa'),
    ex('Gangster', 'Xã hội đen'), ex('Espionage', 'Điệp viên'),
    ex('Courtroom drama', 'Pháp lý'), ex('Saga epic', 'Sử thi dài kỳ'),
    ex('Mockumentary', 'Tài liệu giả hài'), ex('Absurdist', 'Phi lý'),
  ],
  'ST-02': [
    ex('Body horror', 'Biến dị cơ thể'), ex('Neo-western', 'Cao bồi đương đại'),
    ex('Tech-noir', 'Noir công nghệ'), ex('Magical realism', 'Hiện thực ma thuật'),
    ex('Survival thriller', 'Sinh tồn kịch tính'), ex('Gothic romance', 'Lãng mạn gothic'),
  ],
  'ST-03': [
    ex('Grief', 'Nỗi đau mất mát'), ex('Belonging', 'Cảm giác thuộc về'),
    ex('Obsession', 'Ám ảnh'), ex('Legacy', 'Di sản'),
    ex('Class struggle', 'Đấu tranh giai tầng'), ex('Memory', 'Ký ức'),
    ex('Forgiveness', 'Sự tha thứ'), ex('Corruption of innocence', 'Ngây thơ mất đi'),
  ],
  'ST-04': [
    ex('Grimdark', 'Tối nghiệt ngã'), ex('Bittersweet', 'Ngọt đắng'),
    ex('Satirical', 'Châm biếm'), ex('Ethereal', 'Huyền ảo thanh thoát'),
    ex('Oppressive', 'Ngột ngạt áp bức'), ex('Awe-struck', 'Choáng ngợp hùng vĩ'),
  ],
  'ST-05': [
    ex('Time loop', 'Lặp vòng sự kiện'), ex('Two timelines', 'Hai tuyến mốc đối chiếu'),
    ex('Rashomon', 'Đa góc nhìn đối lập'), ex('Epistolary', 'Hồ sơ / nhật ký'),
    ex('Stream of consciousness', 'Dòng ý thức'),
  ],
  'ST-06': [
    ex('Group vs group', 'Va chạm tập thể'), ex('Person vs tradition', 'Chống truyền thống'),
    ex('Person vs AI', 'Chống trí tuệ nhân tạo'),
  ],
  'ST-07': [
    ex('Pulse-pounding', 'Dập nhịp liên liểu'), ex('Meditative', 'Thiền tính chậm'),
  ],
  'ST-08': [
    ex('Explainer video', 'Video giải minh'), ex('Brand film', 'Phim thương hiệu'),
    ex('Sizzle reel', 'Dựng nổi bật tóm gọn'), ex('Event recap', 'Tóm sự kiện'),
    ex('Lyric video', 'MV lyric'),
  ],
  'ST-09': [ex('2 minutes'), ex('8 minutes'), ex('45 minutes'), ex('60 minutes+')],
  'ST-10': [
    ex('21:9 ultrawide', 'Siêu rộng 21:9'), ex('3:2 photography', 'Tỉ lệ ảnh 3:2'),
    ex('5:4', 'Tỉ lệ 5:4'),
  ],
  'ST-11': [
    ex('Gen Z 13–24', 'Thế hệ Z'), ex('Millennial 26–40', 'Millennial'),
    ex('B2B professionals', 'Doanh nghiệp B2B'),
  ],
  'ST-12': [
    ex('Shocking statistic', 'Số liệu sốc'), ex('Montage tease', 'Trích nhanh mông-ta'),
    ex('Direct address', 'Nói thẳng vào ống'), ex('Silent beat', 'Im lặng gây chú ý'),
  ],
  'ST-13': [
    ex('Ironic echo', 'Vọng lại mỉa mai'), ex('Triumphant in tragedy', 'Thắng trong bi kịch'),
    ex('To be continued…', 'Còn tiếp'), ex('Bookend call', 'Gọi lại cảnh mở'),
  ],

  /* ---------- STEP 2 · WORLD BIBLE ---------- */
  'WB-01': [
    ex('Afrofuturism', 'Tương lai châu Phi'), ex('Solarpunk', 'Lạc quan xanh'),
    ex('Dark academia', 'Học viện u tối'), ex('Cottagecore', 'Nông thôn mộng'),
    ex('Space western', 'Viễn tây vũ trụ'), ex('Mythpunk', 'Thần thoại hoang đường'),
  ],
  'WB-02': [
    ex('Edo Japan', 'Edo Nhật Bản'), ex('French belle époque', 'Belle Époque Pháp'),
    ex('Cold war 1960s', 'Chiến tranh lạnh 60s'), ex('Disco 1970s', 'Kỷ disco 70s'),
    ex('Silk road prime', 'Con đường tơ lụa'),
  ],
  'WB-03': [
    ex('Archipelago', 'Quần đảo'), ex('Savanna', 'Xa van'),
    ex('Canyon', 'Hẻm núi'), ex('Undersea dome', 'Mái vòm đáy biển'),
    ex('Orbital ring', 'Vành quỹ đạo'), ex('Cloud city', 'Thành phố trên mây'),
  ],
  'WB-04': [
    ex('Clockwork', 'Răng cưa clockwork'), ex('Nano-swarm', 'Đàn nano'),
    ex('Quantum-era', 'Kỷ nguyên lượng tử'), ex('Retrofuturist 1950s', 'Tương lai kiểu 50s'),
    ex('Hybrid magic-tech', 'Lai phép-thuật & công nghệ'),
  ],
  'WB-05': [
    ex('Runic', 'Phép rune cổ'), ex('Bloodline gifts', 'Năng lực dòng máu'),
    ex('Pact / contract system', 'Giao ước khế ước'), ex('Artifact-based', 'Qua cổ vật'),
  ],
  'WB-06': [
    ex('Colonial frontier', 'Biên giới khai phá'), ex('Digital council', 'Hội đồng số'),
    ex('Guild-run cities', 'Đô thị công đoàn'), ex('Nomad fleets', 'Hạm đội du mục'),
  ],
  'WB-07': [
    ex('Greek / Hellenic', 'Hy Lạp'), ex('Egyptian', 'Ai Cập'),
    ex('Persian', 'Ba Tư'), ex('Native American', 'Thổ dân Bắc Mỹ'),
    ex('Celtic', 'Celtic'),
  ],
  'WB-08': [
    ex('Candy neon', 'Kẹo ngọt neon'), ex('Brass & teal', 'Đồng thau + teal'),
    ex('Wine & rose', 'Rượu + hồng'), ex('Ink & vermilion', 'Mực đen + son'),
    ex('Steel & rust', 'Thép + gỉ'),
  ],
  'WB-09': [
    ex('Aurora nights', 'Đêm cực quang'), ex('Binary sun glare', 'Nắng song ngôi'),
    ex('Seasonless grey', 'Xám quanh năm'), ex('Pollen storm', 'Bão phấn'),
  ],
  'WB-10': [
    ex('Hyperreal CGI', 'CGI siêu thực'), ex('Rotoscope', 'Rotoscope'),
    ex('Stop-motion felt', 'Stop-motion nỉ'), ex('Watercolor wash', 'Loang màu nước'),
    ex('Ukiyo-e engraved', 'Khắc Ukiyo-e'), ex('Pixel-art elevated', 'Pixel-art nâng cấp'),
  ],
  'WB-11': [
    ex('Low-gravity moon', 'Trọng lực thấp'), ex('Underwater dynamics', 'Động lực dưới nước'),
    ex('Fractured time-space', 'Mốc-không gian gãy'),
  ],

  /* ---------- STEP 3 · CHARACTER ---------- */
  'CH-01': [
    ex('Antihero', 'Phản anh hùng'), ex('Mastermind', 'Kẻ mưu mô điều khiển'),
    ex('Mother figure', 'Hình mẫu mẹ'), ex('Wildcard', 'Lá bài bất định'),
  ],
  'CH-03': [
    ex('Infant', 'Sơ sinh'), ex('Silver 70+', 'Bạc 70+'),
    ex('Ageless timeless', 'Không rõ tuổi'),
  ],
  'CH-04': [
    ex('Mediterranean', 'Địa Trung Hải'), ex('Caribbean', 'Caribe'),
    ex('Central Asian', 'Trung Á'), ex('Andean', 'Andes Nam Mỹ'),
    ex('Arabian', 'Ả Rập'),
  ],
  'CH-05': [
    ex('Rectangular long', 'Chữ nhật dài'), ex('Triangular', 'Tam giác'),
    ex('Wide square', 'Vuông rộng'), ex('Narrow thin', 'Thuôn nhỏ'),
  ],
  'CH-06': [
    ex('Doe eyes', 'Mắt hươu'), ex('Fox-lifted', 'Xếch cáo'),
    ex('Sanpaku', 'Sanpaku'), ex('Heavy-lidded', 'Mí chùng nửa'),
  ],
  'CH-07': [
    ex('Ocean blue', 'Xanh đại dương'), ex('Honey brown', 'Nâu mật ong'),
    ex('Ruby fantasy', 'Đỏ ruby giả tưởng'), ex('Mist grey-green', 'Xám xanh lục'),
  ],
  'CH-08': [
    ex('Wolf cut', 'Wolf cut'), ex('Curtain fringe', 'Mái rèm'),
    ex('Two-block', 'Two-block'), ex('Silver top knot', 'Búi bạc'),
    ex('Shaved artistic', 'Cạo họa tiết nghệ thuật'), ex('Long braids crown', 'Bím quấn vương miện'),
  ],
  'CH-09': [
    ex('Ash brown', 'Nâu tro'), ex('Copper', 'Đồng đỏ'),
    ex('Platinum blonde', 'Bạch kim'), ex('Midnight blue', 'Xanh nửa đêm'),
    ex('Split dye two-tone', 'Nhuộm đôi hai màu'),
  ],
  'CH-10': [
    ex('Rosé ivory', 'Hồng ngà'), ex('Golden medium', 'Vàng ấm giữa'),
    ex('Mahogany', 'Gỗ mahogany'), ex('Alabaster', 'Tuyết tạc'),
  ],
  'CH-11': [
    ex('Lip piercing ring', 'Khuyên môi'), ex('Asymmetric brow scar', 'Sẹo lông mày lệch'),
    ex('Temple tattoo', 'Xăm thái dương'), ex('Cleft chin', 'Cằm chẻ'),
    ex('Gold canine tooth', 'Răng nanh vàng'), ex('Round spectacles', 'Kính tròn cổ'),
  ],
  'CH-12': [
    ex('Power-lifter core', 'Khung sức nặng'), ex("Dancer's lean", 'Mảnh vũ công'),
    ex('Broad-shouldered', 'Vai rộng hào quang'),
  ],
  'CH-13': [
    ex('Small stature', 'Thấp bé gọn gàng'), ex('Mixed age-height', 'Lệch tuổi & dáng'),
  ],
  'CH-14': [
    ex('Swagger sway', 'Vung vẩy tự tin'), ex('Guarded hunch', 'Thu vai đề phòng'),
    ex('Cat-like fluid', 'Linh hoạt như mèo'),
  ],
  'CH-15': [
    ex('Biker leather', 'Da biker'), ex('Denim overalls', 'Yếm denim'),
    ex('Tactical ranger', 'Quân hành thám'), ex('Scholar mage robes', 'Áo pháp sư học giả'),
    ex('Floating silk layers', 'Lớp lụa trôi'), ex('Mod 60s suit', 'Vest Mod 60s'),
  ],
  'CH-16': [
    ex('Paper umbrella', 'Ô giấy'), ex('Halo drone', 'Drone vòng quanh đầu'),
    ex('Stethoscope', 'Ống nghe'), ex('Prayer beads', 'Chuỗi hạt'),
    ex('Walking cane', 'Gậy chống'), ex('Shoulder camera rig', 'Máy quay đeo vai'),
  ],
  'CH-17': [
    ex('Melancholic smile', 'Buồn man mác'), ex('Lip curl smirk', 'Nhếch mép'),
    ex('Thousand-yard stare', 'Ánh nhìn ngây xa'), ex('Deadpan blank', 'Mặt lạnh trơ'),
  ],

  /* ---------- STEP 4 · LOCATION ---------- */
  'LC-02': [
    ex('Space station', 'Trạm không gian'), ex('Metro underground', 'Ga metro ngầm'),
    ex('Theme park', 'Công viên giải trí'), ex('Military base', 'Căn cứ quân sự'),
    ex('Museum hall', 'Sảnh bảo tàng'),
  ],
  'LC-03': [
    ex('Bauhaus', 'Bauhaus'), ex('Spanish revival', 'Phục hồi Tây Ban Nha'),
    ex('Multi-tier pagoda', 'Pagoda tầng tháp'), ex('Soviet block', 'Khối chung cư Liên Xô'),
    ex('Shanty scrap', 'Lều gom nhặt'), ex('Ring megastructure', 'Cấu trúc vành khổng lồ'),
  ],
  'LC-04': [
    ex('Solar noon flash', 'Nắng trưa lóa'), ex('Blue-violet dusk', 'Hoàng tím lam'),
  ],
  'LC-05': [
    ex('Acid mist', 'Sương acid'), ex('Sandstorm', 'Bão cát'),
    ex('Meteor shower', 'Mưa sao băng'),
  ],
  'LC-06': [
    ex('LED wall glow', 'Tường LED'), ex('Moonlit silver', 'Bạc ánh trăng'),
    ex('Strobe flash', 'Nháy strobe'), ex('Underwater caustics', 'Caustics dưới nước'),
  ],
  'LC-07': [
    ex('Phone-booth micro', 'Nhỏ như buồng'), ex('World-scale panorama', 'Toàn cảnh cấp bản đồ'),
  ],
  'LC-08': [
    ex('Solo occupant', 'Một bóng duy nhất'), ex('Stadium mass', 'Đám đông sân vận động'),
  ],
  'LC-09': [
    ex('Apocalyptic dread', 'Đe dọa tận thế'), ex('Childhood warmth', 'Ấm ký ức thơ ấu'),
    ex('Neon decadence', 'Sa đọa neon'), ex('Holy silence', 'Yên linh thánh'),
  ],
  'LC-10': [
    ex('Server racks', 'Giá server'), ex('Marble & gold trim', 'Đá marble viền vàng'),
    ex('Laundry lines crossing', 'Dây phơi vắt ngang'), ex('Junkyard towers', 'Tháp phế liệt'),
    ex('Salt flat mirror', 'Mặt muối phản chiếu'),
  ],

  /* ---------- STEP 5 · TRANSCRIPT ---------- */
  'TR-01': [
    ex('Rap verse', 'Verse rap'), ex('Proverb quote', 'Chân ngôn'),
    ex('Voicemail recording', 'Thư thoại ghi âm'),
  ],
  'TR-02': [
    ex('Portuguese', 'Bồ Đào Nha'), ex('Italian', 'Ý'),
    ex('Russian', 'Nga'), ex('Arabic', 'Ả Rập'),
    ex('Hindi', 'Ấn'), ex('Indonesian', 'Indonesia'),
  ],
  'TR-03': [
    ex('Hue central accent', 'Giọng Huế'), ex('Mekong delta accent', 'Giọng miền Tây'),
    ex('Australian English', 'Anh–Úc'), ex('Irish English', 'Anh–Ireland'),
    ex('Scandinavian English', 'Bắc Âu nói tiếng Anh'),
  ],
  'TR-04': [
    ex('Urgent whisper', 'Thì thầm gấp'), ex('Tearful', 'Nghẹn nước mắt'),
    ex('Triumphant', 'Hân hoan thắng lợi'), ex('Apathetic flat', 'Thờ ơ phẳng lì'),
    ex('Cold sarcastic edge', 'Lạnh nhạt mỉa'),
  ],
  'TR-05': [
    ex('Rap flow ride', 'Nhịp rap dồn'), ex('Stretched slow-mo audio', 'Kéo giãn slow-mo'),
  ],
  'TR-06': [
    ex('Crescendo break-open', 'Vỡ lúc crescendo dâng'), ex('Suppressed burn', 'Nén lửa âm ỉ'),
    ex('Cynical dead-level', 'Dửng dưng lì'),
  ],
  'TR-07': [ex('Under 15 words (hook)', 'Dưới 15 từ')],
  'TR-08': [
    ex('Meme-able one-liner', 'Khoảnh meme 1 câu'), ex('Call-to-action shop', 'Kêu gọi mua'),
    ex('Hero quote drop', 'Câu thoại anh hùng'),
  ],

  /* ---------- STEP 6 · VOICE ---------- */
  'VO-02': [ex('Tween 10–13', 'Trẻ lớn 10–13'), ex('Frail elder whisper', 'Già thì thầm yếu')],
  'VO-03': [ex('Chest-deep bass', 'Trầm ngực'), ex('Head-voice high', 'Cao vùng thanh')],
  'VO-04': [
    ex('ASMR velvet', 'Nhung ASMR'), ex('Cartoon bouncy', 'Hoạt hình tưng'),
    ex('Operatic choral', 'Hòa quyện thanh nhạc'), ex('Vocoder synthetic', 'Vocoder'),
  ],
  'VO-05': [ex('Broadcast steady', 'Điều vững phát sóng')],
  'VO-06': [
    ex('Bedtime soft tell', 'Kể đêm ấm'), ex('Sermon resounding', 'Thuyết giảng vang'),
    ex('Interrogation clipped', 'Chất vấn cụt'),
  ],
  'VO-07': [
    ex('Trailer-boom effect', 'Boom trailer rền'), ex('Lo-fi cassette grain', 'Băng cassette lo-fi'),
    ex('Vinyl crackle bed', 'Đĩa than xào xạc'),
  ],

  /* ---------- STEP 7 · SCENE ---------- */
  'SC-01': [
    ex('B-plot breather', 'Nhánh phụ thở'), ex('Setup-payoff pair', 'Gieo hạt / gặt quả'),
    ex('Epilogue note', 'Điểm kết dư'),
  ],
  'SC-02': [
    ex('Training montage', 'Mông-ta tập luyện'), ex('Tension standstill', 'Đối đầu bế tắc'),
    ex('Grand entrance', 'Trình diễn xuất hiện'), ex('Escape flight', 'Chạy thoát vượt'),
    ex('Aftermath quiet', 'Im lặng hậu quả'),
  ],
  'SC-03': [
    ex('Raise the stakes', 'Nâng cược'), ex('Humanize the villain', 'Làm dịu phản diện'),
    ex('Comedic echo', 'Vọng hài'),
  ],
  'SC-04': [ex('2 seconds'), ex('45 seconds'), ex('90 seconds')],
  'SC-05': [
    ex('Cablecam glide', 'Dây cáp lướt'), ex('Car rig mounted', 'Gắn thân xe'),
    ex('Wide static master', 'Master tĩnh rộng'), ex('Tabletop slider', 'Slider bàn'),
  ],
  'SC-06': [
    ex('VHS decay', 'VHS rách nhiễu'), ex('Neon bloom', 'Bloom neon rự'),
    ex('Bleach bypass', 'Bleach bypass tương phản'), ex('Prism split rays', 'Lăng kính tách tia'),
  ],
  'SC-07': [
    ex('Sound bridge wash', 'Cầu âm gộp'), ex('Shutter flick', 'Cửa chớp'),
    ex('Iris in', 'Iris mở'), ex('Page-turn wipe', 'Quẹt lật trang'),
  ],
  'SC-08': [
    ex('White out bloom', 'Trắng rự mở'), ex('Iris out', 'Iris thu'),
    ex('Zoom-through travel', 'Zoom xuyên qua'), ex('Smash to silence', 'Phá về im lặng'),
  ],

  /* ---------- STEP 8 · SHOT ---------- */
  'SH-01': [
    ex('Cowboy shot (thigh-up)', 'Ngang đùi (cowboy)'), ex('Choker tight', 'Cận chặt choker'),
    ex('Macro insert object', 'Vi mô món đồ'), ex('Wide establishing drone', 'Dẫn cảnh flycam'),
  ],
  'SH-02': [
    ex('Overhead 45°', 'Đỉnh 45 độ'), ex('Follow behind back', 'Bám phía sau lưng'),
    ex('Through-object reveal', 'Xuyên vật hé'), ex('Reflection-based', 'Qua bề mặt phản chiếu'),
    ex('Vertigo dizzy angle', 'Góc chóng mặt'),
  ],
  'SH-03': [
    ex('Dolly-zoom vertigo', 'Dolly-zoom chóng mặt'), ex('Gyroscopic roll', 'Lắc con quay'),
    ex('Parallax slider sweep', 'Quét slider parallax'), ex('Creep float-in', 'Trôi tiến siêu chậm'),
    ex('Punch zoom hit', 'Zoom đánh chặt'),
  ],
  'SH-04': [
    ex('Cooke classic 32mm', 'Cooke 32'), ex('Helios swirl 58mm', 'Helios xoáy 58'),
    ex('Probe snorkel lens', 'Ống probe soi'), ex('Lomography flare-art', 'Lomo nghệ thuật'),
  ],
  'SH-05': [
    ex('Pinhole ultra-crisp', 'Lỗ kim siêu nét'), ex('Mist 1/8 softness', 'Mist 1/8 mềm'),
    ex('Selective tilt diagonal', 'Nghiêng chọn nét chéo'),
  ],
  'SH-06': [
    ex('Sneak-and-steal', 'Lẻn trộm'), ex('Rescue dive save', 'Lao mình cứu'),
    ex('Emotional collapse fall', 'Sụp đổ tinh thần'), ex('Training grind', 'Tập luyện'),
  ],
  'SH-07': [
    ex('Micro-shiver tension', 'Rung căng li'), ex('Controlled slow drift', 'Trôi kiểm soát'),
    ex('Accelerating chaos', 'Hỗn loạn tăng tốc'), ex('Rhythmic bounce', 'Nhịp nảy'),
  ],
  'SH-08': [
    ex('Overhead grid lines', 'Lưới từ trên'), ex('Canted pocket corner', 'Góc kín lệch'),
    ex('Masked scope bars', 'Thanh ngang scope'), ex('Rotating frame', 'Khung xoay'),
  ],
  'SH-09': [
    ex('Motivated practical source', 'Nguồn đèn thực tế'), ex('Lightning strobe', 'Nháy sét'),
    ex('Face-up underglow', 'Chiếu dưới lên mặt'), ex('Laser slash bands', 'Vệt laser cắt ngang'),
  ],
  'SH-10': [
    ex('Synth drone bed', 'Nền drone synth'), ex('Wood swish whoosh', 'Vút swish'),
    ex('Crowd wallah', 'Đám đông wallah'), ex('Low heartbeat sub', 'Nhịp tim trầm sub'),
  ],
  'SH-11': [
    ex('Hard percussion slam', 'Trống đánh chặt'), ex('Ambient pad float', 'Pad nổi êm'),
  ],
  'SH-12': [ex('12 seconds'), ex('15 seconds')],
};
