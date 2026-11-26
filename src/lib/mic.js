import { useSyncExternalStore } from 'react'
import { getState } from './store.js'
// Nhận giọng nói qua capability "dictation" của artifact. null = môi trường không hỗ trợ.
let D = null, status = 'checking' // checking | ready | none | denied
const subs = new Set()
const set = s => { status = s; subs.forEach(f => f()) }
// Ngoài Claude (website riêng): dùng nhận giọng của trình duyệt (Web Speech API), cùng giao diện với dictation
function browserDictation() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  let rec = null, state = 'idle'
  const H = { p: new Set(), f: new Set(), s: new Set() }
  const emit = (k, v) => H[k].forEach(h => { try { h(v) } catch (e) {} })
  const setS = (st, reason) => { state = st; emit('s', reason ? { state: st, reason } : { state: st }) }
  const on = k => h => { H[k].add(h); return () => H[k].delete(h) }
  let endReason = 'stopped'
  return {
    start(opt = {}) {
      return new Promise((resolve, reject) => {
        try {
          rec = new SR(); rec.lang = opt.language === 'ja' ? 'ja-JP' : (opt.language || 'ja-JP'); rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1
          endReason = 'stopped'
          rec.onstart = () => { setS('listening'); resolve() }
          rec.onresult = e => { let interim = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) emit('f', { text: r[0].transcript }); else interim += r[0].transcript } emit('p', { text: interim }) }
          rec.onerror = e => { const m = { 'not-allowed': 'not_granted', 'service-not-allowed': 'not_granted', 'no-speech': 'stopped', 'aborted': 'stopped', 'network': 'upstream_error', 'audio-capture': 'upstream_error', 'language-not-supported': 'unavailable' }; endReason = m[e.error] || 'upstream_error'; if (state === 'starting') reject({ code: endReason === 'stopped' ? 'stopped' : endReason, message: e.error }) }
          rec.onend = () => { setS('idle', endReason) }
          setS('starting'); rec.start()
        } catch (e) { setS('idle', 'upstream_error'); reject({ code: 'upstream_error', message: String(e) }) }
      })
    },
    stop() { return new Promise(r => { if (!rec || state === 'idle') return r(); const done = () => r(); H.s.add(function f(e) { if (e.state === 'idle') { H.s.delete(f); done() } }); try { setS('finishing'); rec.stop() } catch (e) { r() } }) },
    active: () => state !== 'idle',
    onPartial: on('p'), onFinal: on('f'), onState: on('s'),
  }
}
export const initMic = () => {
  try {
    if (!window.claude || !window.claude.use) { D = browserDictation(); set(D ? 'ready' : 'none'); return }
    window.claude.use('dictation').then(d => { D = d; set(d ? 'ready' : 'none') }).catch(() => set('none'))
  } catch (e) { set('none') }
}
export const useMic = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f) }, () => status)
export const micOn = () => status === 'ready' && getState().settings.speak !== false
export const dictation = () => D
export const markDenied = () => set('denied')

// So khớp phát âm: đưa về hiragana, bỏ dấu câu, tính độ giống (Levenshtein)
const toHira = s => s.normalize('NFKC').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
export const jnorm = s => toHira(String(s || '')).toLowerCase().replace(/[\s、。，．,.!?！？「」『』…・~〜'"]/g, '')
const lev = (a, b) => { const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let p = Array.from({ length: n + 1 }, (_, j) => j); for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c } return p[n] }
export const targetsOf = c => [c.w, c.h, c.say, c.r, c.k && c.k.ew, c.k && c.k.er, c.ex && c.ex.jp.replaceAll('|', ''), c.ex && c.ex.rd].filter(Boolean)
export function scoreSpeech(heard, targets) {
  const h = jnorm(heard); if (!h) return 0
  let best = 0
  for (const t of targets) { const x = jnorm(t); if (!x) continue; if (h === x || (x.length >= 2 && h.includes(x))) return 100; best = Math.max(best, 1 - lev(h, x) / Math.max(h.length, x.length)) }
  return Math.round(best * 100)
}
