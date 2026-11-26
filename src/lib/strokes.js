import { useEffect, useState } from 'react'
let STR = null, loading = null
const subs = new Set()
export const loadStrokes = () => loading || (loading = fetch('strokes.json').then(r => r.json()).then(d => { STR = d; subs.forEach(f => f()) }).catch(() => {}))
export const useStrokesReady = () => { const [, set] = useState(0); useEffect(() => { const f = () => set(x => x + 1); subs.add(f); loadStrokes(); return () => subs.delete(f) }, []); return !!STR }
const C = {}, N = 24, NS = 'http://www.w3.org/2000/svg'
let meas = null
export function SD(ch) {
  if (C[ch]) return C[ch]; const ds = STR && STR[ch]; if (!ds) return null
  if (!meas) { meas = document.createElementNS(NS, 'svg'); meas.setAttribute('width', '0'); meas.setAttribute('height', '0'); meas.style.cssText = 'position:absolute;visibility:hidden'; document.body.appendChild(meas) }
  const pts = [], len = []
  for (const d of ds) { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); meas.appendChild(p); const L = p.getTotalLength(); const a = []; for (let i = 0; i < N; i++) { const q = p.getPointAtLength(L * i / (N - 1)); a.push([q.x, q.y]) } pts.push(a); len.push(L); p.remove() }
  return (C[ch] = { d: ds, pts, len })
}
export const NPT = N
export function resample(a, n) {
  const c = [0]; for (let i = 1; i < a.length; i++) c.push(c[i - 1] + Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]))
  const T = c[c.length - 1]; if (T < 0.5 || a.length < 2) return Array(n).fill(a[0]); const o = []; let j = 0
  for (let i = 0; i < n; i++) { const t = T * i / (n - 1); while (j < c.length - 2 && c[j + 1] < t) j++; const f = (t - c[j]) / ((c[j + 1] - c[j]) || 1); o.push([a[j][0] + (a[j + 1][0] - a[j][0]) * f, a[j][1] + (a[j + 1][1] - a[j][1]) * f]) }
  return o
}
export const md = (a, b) => a.reduce((s, p, i) => s + Math.hypot(p[0] - b[i][0], p[1] - b[i][1]), 0) / a.length
export const numPos = (sd, i) => { const [x, y] = sd.pts[i][0], [x2, y2] = sd.pts[i][3]; let dx = x - x2, dy = y - y2; const n = Math.hypot(dx, dy) || 1; return [x + dx / n * 6 - 2, y + dy / n * 6 + 2] }
