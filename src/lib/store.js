import { useSyncExternalStore } from 'react'
import { today, daysAgo } from './util.js'

const KEY = 'kitsune-nihongo-v2'
export const fresh = () => ({
  box: {}, due: {}, sk: { listen: {}, recall: {}, speak: {} }, viewed: {}, unlocks: {}, onboarded: false, level0: '', write: {}, xp: 0, xpDays: {}, days: [], lessons: {}, chests: {}, badges: {},
  stats: { ans: 0, ok: 0, perfect: 0, wroteMem: 0, matchBest: 0, lessons: 0 },
  goal: 50, settings: { dark: null, voice: 'ai', rate: 'slow', script: 'h', lv: 'nm', speak: true }, name: '',
})
let S = fresh()
try {
  const d = JSON.parse(localStorage.getItem(KEY) || 'null')
  if (d) { S = { ...fresh(), ...d, stats: { ...fresh().stats, ...d.stats }, settings: { ...fresh().settings, ...d.settings }, sk: { ...fresh().sk, ...(d.sk || {}) } }; if (d.onboarded === undefined) S.onboarded = (d.xp || 0) > 0 || Object.keys(d.box || {}).length > 0
    // Người dùng bản trước đã học N5/N4: giữ quyền vào các vùng đó
    if (!d.unlocks) { const ks = [...Object.keys(d.lessons || {}), ...Object.keys(d.box || {})]; S.unlocks = { n5: ks.some(k => /^n5|^K|^[^hk:]/.test(k) && !/^[hk]:/.test(k)), n4: ks.some(k => k.startsWith('n4')) } } }
  else {
    const o = JSON.parse(localStorage.getItem('hoc-tieng-nhat-v1') || 'null') // tiến độ từ bản cũ
    if (o) { S.onboarded = true; S.unlocks = { n5: true }; S.box = o.box || {}; S.due = o.due || {}; S.write = Object.fromEntries(Object.entries(o.write || {}).map(([k, v]) => [k.startsWith('wK') ? 'w:' + k.slice(1) : /^w[hk]/.test(k) ? 'w:' + k[1] + ':' + k.slice(2) : k, v])); if (o.day) S.days = [o.day]; S.settings.voice = o.voice === 'device' ? 'device' : 'ai'; S.settings.rate = o.rate || 'slow' }
  }
} catch (e) {}

const subs = new Set()
let events = []
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) {} }
export const getState = () => S
// Thay toàn bộ trạng thái (dùng khi đồng bộ tài khoản)
export const replaceState = n => { S = { ...fresh(), ...n, stats: { ...fresh().stats, ...(n.stats || {}) }, settings: { ...fresh().settings, ...(n.settings || {}) }, sk: { ...fresh().sk, ...(n.sk || {}) } }; save(); subs.forEach(f => f()) }
export const setState = fn => { const n = fn(S); S = { ...S, ...n }; save(); checkBadges(); subs.forEach(f => f()) }
export const subscribe = f => { subs.add(f); return () => subs.delete(f) }
export const useStore = sel => useSyncExternalStore(subscribe, () => sel ? sel(S) : S)

// ---- sự kiện giao diện (ăn mừng, huy hiệu) ----
const evSubs = new Set()
export const emit = e => { events = [...events, { ...e, key: Math.random() }]; evSubs.forEach(f => f()) }
export const popEvent = () => { events = events.slice(1); evSubs.forEach(f => f()) }
export const useEvents = () => useSyncExternalStore(f => { evSubs.add(f); return () => evSubs.delete(f) }, () => events)

// ---- XP, cấp độ, chuỗi ngày ----
export const levelOf = xp => { let l = 1, need = 100, acc = 0; while (xp >= acc + need) { acc += need; l++; need = 100 + (l - 1) * 50 } return { level: l, into: xp - acc, need } }
export const streakOf = days => { const set = new Set(days); let n = 0, i = set.has(today()) ? 0 : 1; if (!set.has(daysAgo(i))) return 0; while (set.has(daysAgo(i))) { n++; i++ } return n }
export const addXP = (n) => setState(s => { const t = today(); const days = s.days.includes(t) ? s.days : [...s.days, t].slice(-400); const before = s.xpDays[t] || 0; const after = before + n; if (before < s.goal && after >= s.goal) setTimeout(() => emit({ kind: 'goal' }), 50); return { xp: s.xp + n, xpDays: { ...s.xpDays, [t]: after }, days } })

// ---- lặp lại ngắt quãng, tách theo kỹ năng ----
// recog: nhận diện nghĩa (box/due cũ) · listen: nghe · recall: tự nhớ ra/gõ · speak: nói
const DAY = 864e5, INT = [6e5, DAY, 3 * DAY, 7 * DAY, 16 * DAY]
export const SKILL = { mc: 'recog', rev: 'recog', img: 'recog', imgpick: 'recog', pic: 'recog', card: 'recog', listen: 'listen', type: 'recall', sort: 'recall', speak: 'speak', cloze: 'recog', gmean: 'recog', glisten: 'listen', gpat: 'recog' }
export const SKILL_NAME = { recog: 'Nhận diện', listen: 'Nghe', recall: 'Tự nhớ ra', speak: 'Phát âm' }
export const boxOf = (s, id, sk = 'recog') => sk === 'recog' ? s.box[id] : s.sk[sk]?.[id]?.[0]
export const dueOf = (s, id, sk = 'recog') => sk === 'recog' ? s.due[id] : s.sk[sk]?.[id]?.[1]
export const seenSk = (s, id, sk = 'recog') => boxOf(s, id, sk) !== undefined
export const seen = (s, id) => seenSk(s, id) || ['listen', 'recall', 'speak'].some(k => seenSk(s, id, k))
export const isDue = (s, id, sk = 'recog') => seenSk(s, id, sk) && (dueOf(s, id, sk) || 0) <= Date.now()
export const dueList = s => { const now = Date.now(), out = []; for (const id in s.box) if ((s.due[id] || 0) <= now) out.push({ id, sk: 'recog' }); for (const k of ['listen', 'recall', 'speak']) for (const id in (s.sk[k] || {})) if (s.sk[k][id][1] <= now) out.push({ id, sk: k }); return out }
export const mastered1 = (s, id) => (s.box[id] || 0) >= 3
export const statusOf = (s, id) => mastered1(s, id) ? 'mastered' : seen(s, id) ? 'learning' : s.viewed[id] ? 'viewed' : 'new'
export const markViewed = ids => setState(s => { const v = { ...s.viewed }; let ch = false; for (const id of ids) if (!v[id]) { v[id] = 1; ch = true } return ch ? { viewed: v } : {} })
// Ghi một câu trả lời. retry = câu luyện lại trong cùng lượt: không đổi lịch ôn, không cộng XP.
export const answer = (id, ok, sk = 'recog', opt = {}) => {
  if (opt.retry) return
  const s0 = getState(), fresh = !seenSk(s0, id, sk) || isDue(s0, id, sk)
  setState(s => {
    const b = boxOf(s, id, sk) || 0, nb = ok ? Math.min(4, b + 1) : 0, d = Date.now() + INT[nb]
    const stats = { ...s.stats, ans: s.stats.ans + 1, ok: s.stats.ok + (ok ? 1 : 0) }
    if (sk === 'recog') return { box: { ...s.box, [id]: nb }, due: { ...s.due, [id]: d }, stats }
    return { sk: { ...s.sk, [sk]: { ...(s.sk[sk] || {}), [id]: [nb, d] } }, stats }
  })
  if (ok) addXP(fresh ? 5 : 1)
}
export const bumpStat = (k, v) => setState(s => ({ stats: { ...s.stats, [k]: typeof v === 'function' ? v(s.stats[k]) : (s.stats[k] || 0) + (v ?? 1) } }))
export const setSetting = (k, v) => setState(s => ({ settings: { ...s.settings, [k]: v } }))

// ---- huy hiệu ----
export const BADGES = [
  { id: 'first', name: 'Bước đầu tiên', desc: 'Hoàn thành bài học đầu tiên', g: '初', c: '#FFB7C5' },
  { id: 'hira', name: 'Bậc thầy Hiragana', desc: 'Qua thử thách Hiragana', g: 'あ', c: '#FFB7C5' },
  { id: 'kata', name: 'Bậc thầy Katakana', desc: 'Qua thử thách Katakana', g: 'ア', c: '#BFE3D0' },
  { id: 's3', name: 'Lửa nhỏ', desc: 'Học 3 ngày liên tiếp', g: '火', c: '#FFD3B0' },
  { id: 's7', name: 'Lửa bền bỉ', desc: 'Học 7 ngày liên tiếp', g: '炎', c: '#FFB38A' },
  { id: 's30', name: 'Ngọn đuốc', desc: 'Học 30 ngày liên tiếp', g: '灯', c: '#F08A4B' },
  { id: 'w50', name: 'Kho từ vựng', desc: 'Nhớ chắc 50 mục', g: '語', c: '#BFE3D0' },
  { id: 'xp1k', name: 'Ngàn điểm', desc: 'Đạt 1.000 XP', g: '千', c: '#FFE3B3' },
  { id: 'perfect', name: 'Hoàn hảo', desc: 'Đúng 100% một lượt quiz', g: '満', c: '#FFB7C5' },
  { id: 'pen', name: 'Bàn tay vàng', desc: 'Viết đúng 20 chữ từ trí nhớ', g: '書', c: '#FFE3B3' },
  { id: 'fast', name: 'Tia chớp', desc: 'Ghép cặp dưới 15 giây', g: '速', c: '#BFE3D0' },
  { id: 'chest', name: 'Thợ săn kho báu', desc: 'Mở rương thưởng đầu tiên', g: '宝', c: '#FFE3B3' },
  { id: 'n5', name: 'Chinh phục N5', desc: 'Qua bài thi thử N5', g: '五', c: '#BFE3D0' },
  { id: 'n4', name: 'Chinh phục N4', desc: 'Qua bài thi thử N4', g: '四', c: '#FFB7C5' },
]
const RULES = {
  first: s => s.stats.lessons > 0, hira: s => !!s.lessons.hS, kata: s => !!s.lessons.kS,
  s3: s => streakOf(s.days) >= 3, s7: s => streakOf(s.days) >= 7, s30: s => streakOf(s.days) >= 30,
  w50: s => Object.values(s.box).filter(b => b >= 3).length >= 50, xp1k: s => s.xp >= 1000, perfect: s => s.stats.perfect > 0,
  pen: s => s.stats.wroteMem >= 20, fast: s => s.stats.matchBest > 0 && s.stats.matchBest < 15, chest: s => Object.keys(s.chests).length > 0,
  n5: s => !!s.lessons.n5S4, n4: s => !!s.lessons.n4S3,
}
let checking = false
function checkBadges() {
  if (checking) return; checking = true
  const got = BADGES.filter(b => !S.badges[b.id] && RULES[b.id](S))
  if (got.length) { const t = today(); S = { ...S, badges: { ...S.badges, ...Object.fromEntries(got.map(b => [b.id, t])) } }; save(); got.forEach(b => setTimeout(() => emit({ kind: 'badge', badge: b }), 400)) }
  checking = false
}
