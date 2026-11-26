// Bảng chữ mở rộng: biến âm (dakuten/handakuten), âm ghép (yōon), katakana mở rộng
// Mỗi mục: [khóa, hiragana, katakana, romaji]
export const DAK = [
  ['ga', 'が', 'ガ', 'ga'], ['gi', 'ぎ', 'ギ', 'gi'], ['gu', 'ぐ', 'グ', 'gu'], ['ge', 'げ', 'ゲ', 'ge'], ['go', 'ご', 'ゴ', 'go'],
  ['za', 'ざ', 'ザ', 'za'], ['ji', 'じ', 'ジ', 'ji'], ['zu', 'ず', 'ズ', 'zu'], ['ze', 'ぜ', 'ゼ', 'ze'], ['zo', 'ぞ', 'ゾ', 'zo'],
  ['da', 'だ', 'ダ', 'da'], ['di', 'ぢ', 'ヂ', 'ji'], ['du', 'づ', 'ヅ', 'zu'], ['de', 'で', 'デ', 'de'], ['do', 'ど', 'ド', 'do'],
  ['ba', 'ば', 'バ', 'ba'], ['bi', 'び', 'ビ', 'bi'], ['bu', 'ぶ', 'ブ', 'bu'], ['be', 'べ', 'ベ', 'be'], ['bo', 'ぼ', 'ボ', 'bo'],
  ['pa', 'ぱ', 'パ', 'pa'], ['pi', 'ぴ', 'ピ', 'pi'], ['pu', 'ぷ', 'プ', 'pu'], ['pe', 'ぺ', 'ペ', 'pe'], ['po', 'ぽ', 'ポ', 'po'],
]
export const DAK_BASE = { g: 'k', z: 's', j: 's', d: 't', b: 'h', p: 'h' }
const Y = [['k', 'き', 'キ'], ['s', 'し', 'シ', 'sh'], ['c', 'ち', 'チ', 'ch'], ['n', 'に', 'ニ'], ['h', 'ひ', 'ヒ'], ['m', 'み', 'ミ'], ['r', 'り', 'リ'], ['g', 'ぎ', 'ギ'], ['j', 'じ', 'ジ', 'j'], ['b', 'び', 'ビ'], ['p', 'ぴ', 'ピ']]
export const YOON = Y.flatMap(([c, h, k, pre]) => [['ゃ', 'ャ', 'a'], ['ゅ', 'ュ', 'u'], ['ょ', 'ョ', 'o']].map(([sh, sk, v]) => { const r = (pre || c + 'y') + v; return [r, h + sh, k + sk, r] }))
export const EXT = [
  ['fa', 'ファ', 'fa', 'フ + ァ nhỏ'], ['fi', 'フィ', 'fi', 'フ + ィ nhỏ'], ['fe', 'フェ', 'fe', 'フ + ェ nhỏ'], ['fo', 'フォ', 'fo', 'フ + ォ nhỏ'],
  ['ti', 'ティ', 'ti', 'テ + ィ nhỏ'], ['di', 'ディ', 'di', 'デ + ィ nhỏ'], ['tu', 'トゥ', 'tu', 'ト + ゥ nhỏ'], ['du', 'ドゥ', 'du', 'ド + ゥ nhỏ'],
  ['wi', 'ウィ', 'wi', 'ウ + ィ nhỏ'], ['we', 'ウェ', 'we', 'ウ + ェ nhỏ'], ['wo', 'ウォ', 'wo', 'ウ + ォ nhỏ'], ['vu', 'ヴ', 'vu', 'ウ thêm dấu ゛'],
  ['she', 'シェ', 'she', 'シ + ェ nhỏ'], ['je', 'ジェ', 'je', 'ジ + ェ nhỏ'], ['che', 'チェ', 'che', 'チ + ェ nhỏ'], ['tsa', 'ツァ', 'tsa', 'ツ + ァ nhỏ'],
]
export const EXT_EX = { fa: 'ファン (fan: người hâm mộ)', fi: 'フィルム (phim)', fe: 'カフェ (quán cà phê)', fo: 'フォーク (cái nĩa)', ti: 'パーティー (bữa tiệc)', di: 'ディズニー (Disney)', tu: 'タトゥー (hình xăm)', du: 'ドゥ (do)', wi: 'ウィキ (wiki)', we: 'ウェブ (web)', wo: 'ウォーター (nước, water)', vu: 'ヴァイオリン (vĩ cầm, còn viết バイオリン)', she: 'シェフ (đầu bếp)', je: 'ジェット (máy bay phản lực)', che: 'チェック (kiểm tra)', tsa: 'モーツァルト (Mozart)' }

// Quy tắc phát âm. ex: [chữ, cách đọc để phát âm, nghĩa]; pairs: [[A, nghĩa A], [B, nghĩa B]] để luyện nghe phân biệt
export const RULES = [
  { id: 'scripts', title: 'Ba bộ chữ của tiếng Nhật', icon: 'kana',
    body: ['Tiếng Nhật dùng cùng lúc ba bộ chữ. Hiragana (ひらがな) nét mềm, dùng cho từ thuần Nhật, đuôi động từ và trợ từ. Katakana (カタカナ) nét thẳng, dùng cho từ mượn nước ngoài và tên riêng nước ngoài. Kanji (漢字) là chữ Hán, mang nghĩa, đọc được theo nhiều cách.',
      'Mỗi chữ kana là một âm tiết (gọi là "mora"), luôn đọc rõ và đều nhau, không có dấu thanh như tiếng Việt. Người mới bắt đầu nên học Hiragana trước, rồi Katakana, sau đó mới tới Kanji.'],
    ex: [['わたしは がくせいです。', 'わたしはがくせいです。', 'Tôi là học sinh (chỉ dùng hiragana).'], ['コーヒー', 'コーヒー', 'cà phê (từ mượn, viết katakana)'], ['日本', 'にほん', 'Nhật Bản (kanji)']] },
  { id: 'vowels', title: 'Năm nguyên âm あ い う え お', icon: 'sound',
    body: ['Tiếng Nhật chỉ có 5 nguyên âm: a, i, u, e, o. Mọi chữ kana đều kết thúc bằng một trong năm âm này, trừ ん.',
      'a đọc như "a"; i như "i"; u đọc giữa "u" và "ư", môi không tròn; e như "ê"; o như "ô". Đọc ngắn, gọn, không kéo dài và không lên xuống giọng.'],
    ex: [['あ', 'あ', 'a'], ['い', 'い', 'i'], ['う', 'う', 'u (giữa u và ư)'], ['え', 'え', 'e (như ê)'], ['お', 'お', 'o (như ô)'], ['あおい', 'あおい', 'xanh dương: a-o-i, ba nhịp đều']] },
  { id: 'dakuten', title: 'Biến âm: dấu ゛ và ゜', icon: 'kana',
    body: ['Thêm hai chấm ゛ (tenten) vào góc trên bên phải, âm sẽ "đục" hơn: k → g, s → z, t → d, h → b. Thêm vòng tròn nhỏ ゜ (maru) vào hàng h, âm đổi thành p.',
      'Lưu ý: じ và ぢ đều đọc "ji", ず và づ đều đọc "zu". Trong thực tế じ, ず dùng nhiều hơn hẳn.'],
    ex: [['かき', 'かき', 'quả hồng'], ['かぎ', 'かぎ', 'chìa khóa'], ['はん', 'はん', 'một nửa'], ['ばん', 'ばん', 'buổi tối'], ['ぱん', 'パン', 'bánh mì']],
    pairs: [[['かき', 'quả hồng'], ['かぎ', 'chìa khóa']], [['てんき', 'thời tiết'], ['でんき', 'điện']], [['さる', 'con khỉ'], ['ざる', 'cái rổ']]] },
  { id: 'yoon', title: 'Âm ghép: ゃ ゅ ょ nhỏ', icon: 'kana',
    body: ['Ghép chữ thuộc cột i (き し ち に ひ み り ぎ じ び ぴ) với ゃ ゅ ょ viết nhỏ để tạo một âm duy nhất: き + ゃ → きゃ (kya). Đọc liền một nhịp, không tách thành "ki-ya".',
      'Viết ゃ ゅ ょ nhỏ bằng khoảng một nửa chữ thường, đặt ở góc dưới bên trái ô. Nếu viết to, từ sẽ thành nghĩa khác.'],
    ex: [['きょう', 'きょう', 'hôm nay (kyō)'], ['きよう', 'きよう', 'khéo tay (ki-yō)'], ['しゃしん', 'しゃしん', 'ảnh chụp']],
    pairs: [[['びょういん', 'bệnh viện'], ['びよういん', 'thẩm mỹ viện']], [['きょう', 'hôm nay'], ['きよう', 'khéo tay']]] },
  { id: 'sokuon', title: 'Âm ngắt: っ nhỏ', icon: 'sound',
    body: ['Chữ っ viết nhỏ không có âm riêng, mà là một nhịp ngừng ngắn trước phụ âm phía sau. Trong romaji, phụ âm đó được viết gấp đôi: きって = kitte.',
      'Mẹo: khi đọc, giữ miệng ở tư thế của phụ âm tiếp theo khoảng một nhịp, rồi mới bật ra. Có っ hay không thì nghĩa của từ khác hẳn.'],
    ex: [['きって', 'きって', 'con tem'], ['がっこう', 'がっこう', 'trường học'], ['ちょっと', 'ちょっと', 'một chút']],
    pairs: [[['きて', 'hãy đến'], ['きって', 'con tem']], [['おと', 'âm thanh'], ['おっと', 'chồng']], [['さか', 'con dốc'], ['さっか', 'tác giả']]] },
  { id: 'choon', title: 'Trường âm: kéo dài nguyên âm', icon: 'sound',
    body: ['Trường âm là nguyên âm được kéo dài gấp đôi, tính là hai nhịp. Trong hiragana: あ + あ, い + い, う + う, え + い (hoặc え), お + う (hoặc お). Trong katakana dùng dấu gạch ー.',
      'Romaji thường ghi bằng dấu gạch trên (ō, ū) hoặc viết đôi (ou, oo). Khi gõ trả lời trong app, hãy gõ đúng theo chữ kana: おおきい là ookii, がっこう là gakkou.'],
    ex: [['おばあさん', 'おばあさん', 'bà'], ['せんせい', 'せんせい', 'giáo viên (sen-sē)'], ['コーヒー', 'コーヒー', 'cà phê']],
    pairs: [[['おばさん', 'cô, dì'], ['おばあさん', 'bà']], [['おじさん', 'chú, bác'], ['おじいさん', 'ông']], [['ゆき', 'tuyết'], ['ゆうき', 'dũng khí']], [['ここ', 'chỗ này'], ['こうこう', 'trường cấp 3']]] },
  { id: 'n', title: 'Âm mũi ん', icon: 'sound',
    body: ['ん là một nhịp riêng, đọc bằng mũi. Âm của nó thay đổi theo chữ phía sau: trước b, p, m đọc gần như "m" (さんぽ → sampo); trước k, g đọc như "ng" (りんご → ringo, nghe như ring-go); còn lại đọc như "n".',
      'Không nối ん với nguyên âm phía sau: きんえん đọc là kin-en, không phải ki-nen.'],
    ex: [['さんぽ', 'さんぽ', 'đi dạo (âm m)'], ['りんご', 'りんご', 'quả táo (âm ng)'], ['せんせい', 'せんせい', 'giáo viên (âm n)'], ['きんえん', 'きんえん', 'cấm hút thuốc (kin-en)']] },
  { id: 'devoice', title: 'Âm i, u bị "nuốt"', icon: 'ear',
    body: ['Khi i hoặc u nằm giữa hai phụ âm vô thanh (k, s, t, h, p), hoặc ở cuối câu sau phụ âm vô thanh, chúng thường bị đọc rất nhẹ gần như mất.',
      'Vì vậy です nghe như "dess", ～ます nghe như "mass", すき nghe như "ski", ひと nghe như "h\'to". Đây là cách nói tự nhiên, không phải đọc sai.'],
    ex: [['です', 'です', 'là (đọc như dess)'], ['すき', 'すき', 'thích (đọc như ski)'], ['いきます', 'いきます', 'đi (i-ki-mass)']] },
  { id: 'particles', title: 'Trợ từ は, へ, を', icon: 'kana',
    body: ['Ba chữ này đọc khác đi khi dùng làm trợ từ (từ nhỏ đứng sau danh từ để chỉ vai trò trong câu): は đọc là "wa", へ đọc là "e", を đọc là "o".',
      'Trong từ bình thường, chúng vẫn đọc như cũ: はな (hoa) là hana, へや (phòng) là heya.'],
    ex: [['わたしは', 'わたしは', 'tôi thì (wa)'], ['がっこうへ', 'がっこうへ', 'đến trường (e)'], ['ほんを', 'ほんを', 'quyển sách (o, làm tân ngữ)'], ['はな', 'はな', 'hoa (ha)']] },
  { id: 'r', title: 'Âm r của tiếng Nhật', icon: 'sound',
    body: ['Hàng ら り る れ ろ không giống r rung của tiếng Việt, cũng không giống l. Đầu lưỡi chạm nhẹ một lần vào nướu ngay sau răng cửa trên rồi bật ra, nghe nằm giữa "r" và "l".'],
    ex: [['りんご', 'りんご', 'quả táo'], ['くるま', 'くるま', 'xe ô tô'], ['ありがとう', 'ありがとう', 'cảm ơn']] },
  { id: 'pitch', title: 'Trọng âm cao thấp', icon: 'ear',
    body: ['Tiếng Nhật không có thanh điệu như tiếng Việt, nhưng mỗi từ có độ cao thấp riêng giữa các nhịp. Ví dụ あめ: khi nghĩa là "mưa" (雨) thì nhịp đầu cao, khi nghĩa là "kẹo" (飴) thì nhịp đầu thấp, nhịp sau cao.',
      'Ở trình độ N5 bạn chưa cần học kỹ phần này. Hãy nghe nhiều và bắt chước theo audio mẫu, độ cao thấp sẽ dần tự nhiên.'],
    ex: [] },
]
// Các mục nhập môn hướng dẫn (bài hướng dẫn trên lộ trình) dùng những quy tắc này
export const GUIDES = {
  g0: { title: 'Làm quen tiếng Nhật', rules: ['scripts', 'vowels'] },
  g1: { title: 'Biến âm & âm ghép', rules: ['dakuten', 'yoon'] },
  g2: { title: 'Âm ngắt, trường âm, ん', rules: ['sokuon', 'choon', 'n'] },
  g3: { title: 'Mẹo nghe tự nhiên', rules: ['devoice', 'particles', 'r', 'pitch'] },
}
