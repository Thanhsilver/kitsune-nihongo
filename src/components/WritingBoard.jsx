import { useEffect, useRef, useState } from 'react'
import { SD, NPT, resample, md, numPos, useStrokesReady } from '../lib/strokes.js'
import { RM, wait, cx, rnd } from '../lib/util.js'
import { Grid, Glyph } from './ui.jsx'
import Icon from './Icons.jsx'

// Bảng viết: chấm từng nét (vị trí, chiều, thứ tự). mode: trace (tô theo) | memory (viết từ trí nhớ)
export default function WritingBoard({ chars, mode = 'trace', onDone, resetKey }) {
  const ready = useStrokesReady()
  const [st, setSt] = useState({ ci: 0, si: 0, miss: 0, smiss: 0, done: false, peek: false })
  const [fb, setFb] = useState({ t: '', c: '' })
  const [live, setLive] = useState('')
  const [bad, setBad] = useState('')
  const [anim, setAnim] = useState(null)
  const svg = useRef(null), draw = useRef(null), tok = useRef(0), animG = useRef(null)
  useEffect(() => { setSt({ ci: 0, si: 0, miss: 0, smiss: 0, done: false, peek: false }); setFb({ t: '', c: '' }); setAnim(null); tok.current++ }, [chars.join(''), mode, resetKey])
  const ch = chars[st.ci], sd = ready ? SD(ch) : null
  const n = sd ? sd.d.length : 0, tr = mode === 'trace'

  const pt = e => { const s = svg.current, p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(s.getScreenCTM().inverse()); return [q.x, q.y] }
  const down = e => { if (!sd || st.done || anim) return; e.preventDefault(); svg.current.setPointerCapture(e.pointerId); draw.current = [pt(e)]; setLive('M' + draw.current[0].join(' ')) }
  const move = e => { if (!draw.current) return; const p = pt(e), l = draw.current[draw.current.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) < .8) return; draw.current.push(p); setLive('M' + draw.current.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L')) }
  const up = () => { if (!draw.current) return; const raw = draw.current; draw.current = null; setLive(''); judge(raw) }
  const judge = raw => {
    const exp = sd.pts[st.si], L = sd.len[st.si]
    let tl = 0; for (let i = 1; i < raw.length; i++) tl += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1])
    if (tl < 2 && L > 18) return
    const u = resample(raw, NPT), tol = L < 20 ? 16 : 13.5, f = md(u, exp), r = md(u, [...exp].reverse())
    if (f < tol) {
      const si = st.si + 1
      if (si < n) { setSt({ ...st, si, smiss: 0 }); setFb({ t: ['Đúng rồi!', 'Chuẩn!', 'Tốt lắm!'][rnd(3)], c: 'ok' }); return }
      if (st.ci < chars.length - 1) { setSt({ ...st, ci: st.ci + 1, si: 0, smiss: 0 }); setFb({ t: 'Xong chữ ' + (st.ci + 1) + '. Viết chữ tiếp theo.', c: 'ok' }); return }
      const total = chars.reduce((s, c) => s + (SD(c)?.d.length || 0), 0)
      const res = { miss: st.miss, peek: st.peek, total, good: !st.peek && st.miss <= Math.max(1, Math.floor(total / 5)) }
      setSt({ ...st, si, done: true }); setFb({ t: 'Hoàn thành!', c: 'ok' }); onDone?.(res); return
    }
    setBad('M' + raw.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L')); setTimeout(() => setBad(''), 700)
    let msg
    if (r < tol && r < f) msg = 'Đúng chỗ nhưng ngược chiều: nét ' + (st.si + 1) + ' viết từ chấm đỏ ra.'
    else { let j = -1; for (let k = st.si + 1; k < n; k++) if (md(u, sd.pts[k]) < tol) { j = k; break } msg = j >= 0 ? 'Sai thứ tự: đó là nét ' + (j + 1) + '. Hãy viết nét ' + (st.si + 1) + ' trước.' : st.smiss >= 1 && !tr ? 'Xem nét gợi ý màu hồng rồi viết lại.' : 'Chưa khớp nét ' + (st.si + 1) + '. Thử lại nhé.' }
    setSt({ ...st, miss: st.miss + 1, smiss: st.smiss + 1 }); setFb({ t: msg, c: 'bad' })
  }
  const play = async () => {
    if (!sd || anim) return; const my = ++tok.current; if (!tr && !st.done) setSt(s => ({ ...s, peek: true })); setAnim(ch); await wait(30)
    const g = animG.current; if (!g) return; const ps = [...g.querySelectorAll('path')], ts = [...g.querySelectorAll('text')]
    for (let i = 0; i < ps.length; i++) { if (tok.current !== my) return; const p = ps[i], L = sd.len[i]; p.style.opacity = 1; ts[i].style.opacity = 1; if (RM) continue; p.style.strokeDasharray = L + ' ' + L; try { await p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: Math.max(260, L * 13), easing: 'ease-in-out', fill: 'forwards' }).finished } catch (e) { return } await wait(120) }
    await wait(700); if (tok.current === my) setAnim(null)
  }
  const hintStart = sd && !st.done && st.si < n && (tr || st.smiss >= 2)
  return (
    <div>
      {chars.length > 1 && <div className="flex flex-wrap justify-center gap-2 mb-3">{chars.map((c, i) => <div key={i} className={cx('w-14 h-14 rounded-2xl paper border-2', i === st.ci && !st.done ? 'border-primary' : 'border-sakura-100 dark:border-night-line')}>{(i < st.ci || st.done) ? <Glyph ch={c} className="stk w-full h-full" /> : tr ? <Glyph ch={c} className="stk w-full h-full opacity-20" /> : null}</div>)}</div>}
      <div className="relative mx-auto w-full max-w-[460px] aspect-square rounded-4xl overflow-hidden border-2 border-sakura-200 dark:border-night-line shadow-soft paper touch-none select-none">
        <svg ref={svg} viewBox="0 0 109 109" className="absolute inset-0 w-full h-full stk cursor-crosshair" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { draw.current = null; setLive('') }}>
          <Grid />
          {sd && tr && !st.done && sd.d.map((d, i) => <path key={'g' + i} d={d} className={i === st.si ? 's-next' : 's-ghost'} />)}
          {sd && sd.d.slice(0, st.done ? n : st.si).map((d, i) => <path key={'d' + i} d={d} className="s-ink" />)}
          {hintStart && !tr && st.smiss >= 2 && <path d={sd.d[st.si]} className="s-hint" />}
          {hintStart && (() => { const [x, y] = sd.pts[st.si][0], [nx, ny] = numPos(sd, st.si); return <g><circle cx={x} cy={y} r="2.6" fill="#E85D75" /><text x={nx.toFixed(1)} y={ny.toFixed(1)} className="num">{st.si + 1}</text></g> })()}
          {anim && <g ref={animG}>{sd.d.map((d, i) => <path key={'a' + i} d={d} className="s-anim" style={{ opacity: 0 }} />)}{sd.d.map((_, i) => { const [x, y] = numPos(sd, i); return <text key={'n' + i} x={x.toFixed(1)} y={y.toFixed(1)} className="num" style={{ opacity: 0 }}>{i + 1}</text> })}</g>}
          {bad && <path d={bad} className="s-bad" />}
          {live && <path d={live} className="s-live" />}
        </svg>
        {!ready && <div className="absolute inset-0 grid place-items-center muted">Đang tải nét chữ…</div>}
      </div>
      <div className="flex justify-between max-w-[460px] mx-auto mt-3 text-sm muted tabular-nums">
        <span>{chars.length > 1 ? `Chữ ${st.ci + 1}/${chars.length} · ` : ''}Nét {Math.min(st.si + 1, n || 1)}/{n || '…'}</span><span>Lỗi: {st.miss}</span>
      </div>
      <p className={cx('text-center font-semibold min-h-[28px] mt-1', fb.c === 'ok' ? 'text-matcha-700 dark:text-matcha' : 'text-primary')} aria-live="polite">{fb.t}</p>
      <div className="flex justify-center mt-2"><button type="button" className="btn-soft" onClick={play}><Icon name="play" size={22} />Xem thứ tự nét</button></div>
    </div>
  )
}
