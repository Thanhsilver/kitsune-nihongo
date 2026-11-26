// Chuyển romaji → hiragana để chấm câu gõ (phân biệt trường âm, âm ngắt). Hỗ trợ Hepburn và Kunrei.
const T = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ', sa: 'さ', si: 'し', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', ti: 'ち', chi: 'ち', tu: 'つ', tsu: 'つ', te: 'て', to: 'と', na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', hu: 'ふ', fu: 'ふ', he: 'へ', ho: 'ほ', ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ', ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ', la: 'ら', li: 'り', lu: 'る', le: 'れ', lo: 'ろ',
  wa: 'わ', wo: 'を', ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご', za: 'ざ', zi: 'じ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど', ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ', pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ', je: 'じぇ', sha: 'しゃ', shu: 'しゅ', sho: 'しょ', she: 'しぇ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', che: 'ちぇ', tsa: 'つぁ', vu: 'ゔ',
}
for (const [c, k] of [['k', 'き'], ['s', 'し'], ['t', 'ち'], ['n', 'に'], ['h', 'ひ'], ['m', 'み'], ['r', 'り'], ['g', 'ぎ'], ['z', 'じ'], ['j', 'じ'], ['d', 'ぢ'], ['b', 'び'], ['p', 'ぴ']]) {
  T[c + 'ya'] = k + 'ゃ'; T[c + 'yu'] = k + 'ゅ'; T[c + 'yo'] = k + 'ょ'
}
export function toKana(s) {
  s = s.toLowerCase().replace(/[^a-z'\-]/g, ''); let o = '', i = 0
  while (i < s.length) {
    const c = s[i]
    if (c === '-') { o += 'ー'; i++; continue }
    if (c === "'") { i++; continue }
    if (c === 'n') { const n2 = s[i + 1]; if (n2 === 'n') { o += 'ん'; i += (s[i + 2] && 'aiueoy'.includes(s[i + 2])) ? 1 : 2; continue } if (!n2 || n2 === "'" || !'aiueoy'.includes(n2)) { o += 'ん'; i += n2 === "'" ? 2 : 1; continue } }
    if (c === s[i + 1] && !'aiueon'.includes(c)) { o += 'っ'; i++; continue }
    if (c === 't' && s[i + 1] === 'c') { o += 'っ'; i++; continue }
    let hit = false
    for (const L of [3, 2, 1]) { const k = s.slice(i, i + L); if (T[k]) { o += T[k]; i += L; hit = true; break } }
    if (!hit) { o += c; i++ }
  }
  return o
}
const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
// các biến thể khi người học gõ dấu gạch trên (ō có thể là ou hoặc oo)
function variants(s) {
  let v = [s.toLowerCase()]
  const M = { 'ā': ['aa'], 'ī': ['ii'], 'ū': ['uu'], 'ē': ['ei', 'ee'], 'ō': ['ou', 'oo'], 'â': ['aa'], 'î': ['ii'], 'û': ['uu'], 'ê': ['ei', 'ee'], 'ô': ['ou', 'oo'] }
  for (const [m, rs] of Object.entries(M)) if (v.some(x => x.includes(m))) v = v.flatMap(x => rs.map(r => x.split(m).join(r)))
  return v.slice(0, 16)
}
// So sánh câu gõ romaji với cách đọc kana. Chấp nhận "-" cho trường âm katakana.
export function romajiMatches(input, kana) {
  const target = kata2hira(kana).replace(/\s/g, '')
  return variants(input.trim()).some(v => kata2hira(toKana(v)) === target)
}
// Đúng nếu khớp cách đọc kana, hoặc khớp romaji chuẩn của dữ liệu (vd. konnichiwa cho こんにちは)
export function answerMatches(input, kana, romaji) {
  if (romajiMatches(input, kana)) return true
  if (!romaji) return false
  const ins = variants(input.trim()).map(v => kata2hira(toKana(v)))
  return variants(romaji).some(r => ins.includes(kata2hira(toKana(r))))
}
