import { ITEMS, meanOf, glyph, hasMN, shortMean } from '../data/items.js'
import { shuffle } from './util.js'
import { micOn, targetsOf } from './mic.js'
import { answerMatches } from './romaji.js'
// Dạng câu hỏi: mc (chữ → nghĩa) · rev (nghĩa → chữ) · listen (nghe → chữ/từ) · pic (gợi ý → chữ) · img (hình → từ)
// imgpick (từ → hình) · type (gõ lại) · sort (xếp câu) · speak (đọc to)
export const peersOf = c => ITEMS.filter(x => x.type === c.type && (c.type !== 'kana' || (x.cat === c.cat && x.grp === c.grp)) && (c.type === 'kana' || x.lv === c.lv))
const four = (c, f, pool) => { const a = f(c); const ds = shuffle([...new Set((pool || peersOf(c)).map(f))].filter(x => x && x !== a)).slice(0, 3); return shuffle([a, ...ds]) }
// Kanji: phần nghe dùng từ ví dụ, nên đáp án cũng là từ ví dụ (audio và đáp án luôn khớp nhau)
export const listenWord = c => c.type === 'kanji' ? c.k.ew : c.w
export const typesFor = (c, { speak = true } = {}) => {
  if (c.type === 'grammar') return ['cloze', 'cloze', 'gmean', 'glisten', 'sort', 'gpat']
  const t = ['mc', 'rev', 'listen', 'type']
  if (hasMN(c)) t.push('pic')
  if (c.type === 'word' && c.icon) t.push('img', 'imgpick')
  if (c.type === 'word' && c.ex && c.ex.jp.includes('|')) t.push('sort')
  if (speak && micOn()) t.push('speak')
  return t
}
const pick = a => a[Math.floor(Math.random() * a.length)]
const exOf = e => ({ jp: e[0], rd: e[1], vi: e[2] })
const viPool = c => ITEMS.filter(x => x.type === 'grammar' && x.id !== c.id).flatMap(x => x.g.ex.map(e => e[2]))
// Dấu hiệu nhận ra từng mẫu trong câu (dùng để loại phương án nhiễu cũng đúng)
const GMARK = {
  g01: /です/, g02: /じゃ|では/, g03: /か。|か$|ですか/, g04: /も/, g05: /の/, g06: /これ|それ|あれ|この|その|あの|どれ|どの/,
  g07: /ここ|そこ|あそこ|どこ|こちら|そちら|あちら|どちら/, g08: /ま[すせし]/, g09: /へ|行き|来ま|帰り|いき|きま|かえり/, g10: /で/,
  g11: /を/, g12: /で/, g13: /に/, g14: /から|まで/, g15: /と/, g16: /ませんか|ましょう/, g17: /いです|[^ん]です/,
  g18: /くない|じゃ|では/, g19: /[いな][一-龯ァ-ヶ]/, g20: /あります|います|ありません|いません/, g21: /好き|きらい|嫌い|上手|下手|すき|じょうず|へた/,
  g22: /たい/, g23: /[てで]ください/, g24: /[てで]います|[てで]いません/, g25: /から/, g26: /かった|でした/,
}
function makeGQ(c, t) {
  const g = c.g
  if (t === 'cloze') { const [sent, ans, ds, vi, rd] = pick(g.cloze); return { c, t, sent, opts: shuffle([ans, ...ds]), want: ans, vi, say: rd, full: sent.replace('＿＿', ans) } }
  const e = exOf(pick(t === 'sort' ? g.ex.filter(x => x[0].includes('|')) : g.ex))
  if (t === 'sort') return { c, t, parts: e.jp.split('|'), ex: e, say: e.rd }
  if (t === 'gpat') {
    // Bỏ các mẫu mà câu này cũng chứa, để chỉ có đúng một đáp án
    const txt = e.jp.replaceAll('|', '') + ' ' + e.rd
    const clash = x => { const m = GMARK[x.gid]; return m && m.test(txt) }
    // Chọn mẫu đúng: ưu tiên mẫu cùng bài/bài gần để dễ nhầm
    const lab = x => x.g.title + ' · ' + x.g.short
    const others = ITEMS.filter(x => x.type === 'grammar' && x.id !== c.id && !clash(x)).sort((a, b) => Math.abs(a.g.unit - g.unit) - Math.abs(b.g.unit - g.unit) || Math.random() - .5)
    const ds = shuffle(others.slice(0, 6)).slice(0, 3).map(lab)
    return { c, t, ex: e, opts: shuffle([lab(c), ...ds]), want: lab(c), say: e.rd }
  }
  const ds = shuffle([...new Set(viPool(c))].filter(v => v !== e.vi)).slice(0, 3)
  return { c, t, ex: e, opts: shuffle([e.vi, ...ds]), want: e.vi, say: e.rd }
}
export function makeQ(c, t) {
  t = t || shuffle(typesFor(c))[0]
  if (c.type === 'grammar') return makeGQ(c, ['cloze', 'gmean', 'glisten', 'sort', 'gpat'].includes(t) ? t : 'cloze')
  if (t === 'mc') return { c, t, opts: four(c, meanOf), want: meanOf(c) }
  if (t === 'rev' || t === 'pic') return { c, t, opts: four(c, glyph), want: glyph(c) }
  if (t === 'listen') return { c, t, opts: four(c, listenWord), want: listenWord(c), say: c.say }
  if (t === 'img') { const pool = peersOf(c).filter(x => x.icon && x.icon !== c.icon); return { c, t, opts: four(c, glyph, pool), want: glyph(c) } }
  if (t === 'imgpick') { const pool = shuffle(peersOf(c).filter(x => x.icon && x.icon !== c.icon)).filter((x, i, a) => a.findIndex(y => y.icon === x.icon) === i).slice(0, 3); return { c, t, opts: shuffle([c, ...pool]).map(x => x.id), want: c.id } }
  if (t === 'sort') { const parts = c.ex.jp.split('|'); return { c, t, parts, say: c.ex.rd } }
  if (t === 'speak') return { c, t, targets: c.type === 'kana' ? [c.w, c.say, c.r] : c.type === 'kanji' ? [c.k.ew, c.k.er] : [c.w, c.h], say: c.say }
  return { c, t: 'type', want: c.type === 'kanji' ? c.k.hv : c.type === 'word' ? c.h : c.w }
}
// Lên kế hoạch câu hỏi: mỗi mục ít nhất một câu, xoay vòng đủ các dạng để không lặp một kiểu
export function planQuiz(items, { n, mix = true } = {}) {
  const list = shuffle(items); const qs = []
  const counts = {}
  const pickT = c => { const ts = mix ? typesFor(c) : ['mc', 'rev', 'listen']; ts.sort((a, b) => (counts[a] || 0) - (counts[b] || 0) || Math.random() - .5); const t = ts[0]; counts[t] = (counts[t] || 0) + 1; return t }
  for (const c of list) qs.push(makeQ(c, pickT(c)))
  if (n && qs.length > n) return qs.slice(0, n)
  if (n && qs.length < n) { let k = 0; while (qs.length < n && list.length) { const c = list[k++ % list.length]; qs.push(makeQ(c, pickT(c))) } }
  return qs
}
const vnorm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z]/g, '')
export const typeOK = (q, v) => {
  if (!v.trim()) return false
  if (q.c.type === 'kanji') return vnorm(v) === vnorm(q.want)
  if (q.c.type === 'kana' && q.c.w === 'を' && vnorm(v) === 'o') return true
  return answerMatches(v, q.want, q.c.r)
}
export const QLABEL = { mc: 'Chọn nghĩa đúng', rev: 'Chọn chữ đúng', listen: 'Nghe và chọn', pic: 'Nhìn gợi ý đoán chữ', img: 'Hình này là từ nào?', imgpick: 'Chọn hình đúng', type: 'Gõ lại từ trí nhớ', sort: 'Sắp xếp thành câu', speak: 'Đọc to và chấm phát âm', cloze: 'Điền vào chỗ trống', gmean: 'Chọn nghĩa của câu', glisten: 'Nghe câu và chọn nghĩa', gpat: 'Câu này dùng mẫu ngữ pháp nào?' }
export { shortMean, targetsOf }
