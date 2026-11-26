import { KANA, GRID, KJ, V, KAMN, JMN, PIC } from './core.js'
import { EX } from './examples.js'
import { DAK, YOON, EXT, EXT_EX } from './kana2.js'
import { GRAMMAR } from './grammar.js'

export const LEVELS = [
  { id: 'nm', name: 'Nhập môn', sub: 'Hiragana & Katakana' },
  { id: 'n5', name: 'N5', sub: 'Sơ cấp 1' },
  { id: 'n4', name: 'N4', sub: 'Sơ cấp 2' },
]
export const CAT_NAMES = { c: 'Chào hỏi', n: 'Danh từ', v: 'Động từ', a: 'Tính từ', t: 'Thời gian' }

const kanaItems = KANA.flatMap(c => [
  { id: 'h:' + c.r, type: 'kana', w: c.h, r: c.r, cat: 'h', say: c.h, lv: 'nm', pair: c.k },
  { id: 'k:' + c.r, type: 'kana', w: c.k, r: c.r, cat: 'k', say: c.h, lv: 'nm', pair: c.h },
])
// Bảng chữ mở rộng
const dakItems = DAK.flatMap(([key, h, k, r]) => [
  { id: 'h:' + key, type: 'kana', w: h, r, cat: 'h', grp: 'dak', say: h, lv: 'nm', pair: k },
  { id: 'k:' + key, type: 'kana', w: k, r, cat: 'k', grp: 'dak', say: h, lv: 'nm', pair: h },
])
const yoonItems = YOON.flatMap(([key, h, k, r]) => [
  { id: 'h:' + key, type: 'kana', w: h, r, cat: 'h', grp: 'yoon', say: h, lv: 'nm', pair: k },
  { id: 'k:' + key, type: 'kana', w: k, r, cat: 'k', grp: 'yoon', say: h, lv: 'nm', pair: h },
])
const extItems = EXT.map(([key, k, r]) => ({ id: 'k:x' + key, type: 'kana', w: k, r, cat: 'k', grp: 'ext', say: k, lv: 'nm', pair: '', ex: EXT_EX[key] }))
// Mẹo nhớ dạng công thức cho chữ mở rộng
export const MK = {}
for (const it of dakItems) { const c = it.w.charCodeAt(0), hand = 'ぱぴぷぺぽパピプペポ'.includes(it.w); const base = String.fromCharCode(c - (hand ? 2 : 1)); MK[it.w] = { parts: [[base, ''], [hand ? '゜' : '゛', hand ? 'maru' : 'tenten']], s: hand ? `Thêm vòng tròn nhỏ ゜ vào ${base}: âm h đổi thành p.` : `Thêm hai chấm ゛ vào ${base}: âm trở nên "đục" hơn (${it.r}).` + (it.r === 'ji' || it.r === 'zu' ? ` Lưu ý: đọc giống ${it.r === 'ji' ? 'じ' : 'ず'}.` : '') } }
for (const it of yoonItems) MK[it.w] = { parts: [[it.w[0], ''], [it.w[1], 'viết nhỏ']], s: `${it.w[0]} ghép với ${it.w[1]} viết nhỏ, đọc liền một nhịp: ${it.r} (không đọc tách thành hai âm).` }
for (const [key, k, r, how] of EXT) MK[k] = { parts: k.length > 1 ? [[k[0], ''], [k[1], 'viết nhỏ']] : [['ウ', ''], ['゛', 'tenten']], s: `${how}: âm "${r}" dùng cho từ mượn nước ngoài. Ví dụ: ${EXT_EX[key]}.` }
const kanjiItems = KJ.map(k => ({ id: 'K' + k.c, type: 'kanji', w: k.c, k, lv: k.lv, say: k.er, cat: 'kanji' }))
const wordItems = V.map(v => { const e = EX[v.w] || []; return { ...v, type: 'word', say: v.h, cat: v.t, ex: e[0] ? { jp: e[0], rd: e[1], vi: e[2] } : null, icon: e[3] || null } })

const gramItems = GRAMMAR.map(g => ({ id: 'G:' + g.id, type: 'grammar', gid: g.id, g, w: g.title, m: g.short, say: g.ex[0][1], lv: 'n5', cat: 'gram' }))
export const ITEMS = [...kanaItems.map(i => ({ ...i, grp: 'base' })), ...dakItems, ...yoonItems, ...extItems, ...kanjiItems, ...wordItems, ...gramItems]
export const BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]))
export const itemsOf = (lv, type) => ITEMS.filter(i => i.lv === lv && (!type || i.type === type))

export const glyph = c => c.w
export const meanOf = c => c.type === 'kana' ? c.r : c.type === 'kanji' ? c.k.hv + ' · ' + c.k.m : c.m
export const shortMean = c => c.type === 'kana' ? c.r : c.type === 'kanji' ? c.k.hv : c.m
export const readOf = c => c.type === 'kana' ? c.r : c.type === 'kanji' ? c.k.er : c.r
export const hasMN = c => c.type !== 'word' && !!(KAMN[c.w] || JMN[c.w] || MK[c.w])
export const romOf = ch => { const c = KANA.find(x => x.h === ch || x.k === ch); if (c) return c.r; const i = ITEMS.find(x => x.type === 'kana' && x.w === ch); return i ? i.r : '' }
export { KANA, GRID, KJ, V, KAMN, JMN, PIC, EX }
