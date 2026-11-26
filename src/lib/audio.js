import { getState } from './store.js'
const RATE = { vslow: [0.75, 0.6], slow: [1, 0.75], mid: [1.2, 0.9] }
let AI = null, OLD = null, EXA = null, jaV = null
const player = typeof Audio !== 'undefined' ? new Audio() : null
const load = (f, set) => fetch(f).then(r => { if (!r.ok) throw 0; return r.json() }).then(set).catch(() => {})
export const initAudio = () => { load('audio-ai.json', d => AI = d); load('audio-ex.json', d => EXA = d); load('audio.json', d => OLD = d); loadV(); try { speechSynthesis.addEventListener('voiceschanged', loadV) } catch (e) {} }
function loadV() { try { const v = speechSynthesis.getVoices().filter(x => /^ja/i.test(x.lang)); jaV = v.find(x => /google|kyoko|o-ren|haruka|nanami/i.test(x.name)) || v[0] || null } catch (e) {} }
const rate = () => RATE[getState().settings.rate || 'slow']
function clip(t) {
  const v = getState().settings.voice; const src = v === 'old' ? OLD : AI
  const b = (src && src[t]) || (EXA && EXA[t]) || (AI && AI[t]) || (OLD && OLD[t]); if (!b || !player) return false
  try { player.pause(); player.src = 'data:audio/mpeg;base64,' + b; player.preservesPitch = true; player.playbackRate = rate()[0]; const p = player.play(); if (p) p.catch(() => {}) } catch (e) { return false }
  return true
}
function device(t) {
  try {
    if (!window.speechSynthesis) return false; if (!jaV) loadV(); if (!jaV) return false
    if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(t); u.lang = 'ja-JP'; u.voice = jaV; u.rate = rate()[1]; let ok = false; u.onstart = () => { ok = true }
    speechSynthesis.speak(u); setTimeout(() => { if (!ok) { speechSynthesis.cancel(); clip(t) } }, 900); return true
  } catch (e) { return false }
}
export const speak = t => { if (!t) return; if (getState().settings.voice === 'device') { if (!device(t)) clip(t); return } if (!clip(t)) device(t) }
export const hasDeviceVoice = () => { loadV(); return !!jaV }
