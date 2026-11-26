import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import Mascot from './Mascot.jsx'
import { speak } from '../lib/audio.js'
import { SD, numPos, useStrokesReady } from '../lib/strokes.js'
import { useEvents, popEvent } from '../lib/store.js'
import { KAMN, JMN, PIC, MK, romOf } from '../data/items.js'
import { cx, RM, wait } from '../lib/util.js'

export const SpeakBtn = ({ text, size = 'md', label = 'Nghe phát âm', className = '' }) => (
  <button type="button" onClick={e => { e.stopPropagation(); speak(text) }} aria-label={label}
    className={cx('grid place-items-center rounded-full bg-sakura-100 text-primary-700 hover:bg-sakura-200 dark:bg-primary/20 dark:text-sakura transition', size === 'lg' ? 'w-14 h-14' : 'w-11 h-11', className)}>
    <Icon name="sound" size={size === 'lg' ? 30 : 22} />
  </button>
)

export const Bar = ({ value, max = 1, color = 'bg-primary', className = '' }) => (
  <div className={cx('h-3 rounded-full bg-ink/5 dark:bg-white/10 overflow-hidden', className)}>
    <div className={cx('h-full rounded-full transition-all duration-700', color)} style={{ width: Math.min(100, (value / (max || 1)) * 100) + '%' }} />
  </div>
)

export const Ring = ({ value, max, size = 120, stroke = 12, children }) => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, p = Math.min(1, value / (max || 1))
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-sakura-100 dark:stroke-white/10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" stroke="#E85D75" strokeDasharray={c} strokeDashoffset={c * (1 - p)} style={{ transition: 'stroke-dashoffset .8s' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

export const PageHead = ({ title, sub, mood, right }) => (
  <div className="flex flex-wrap items-center gap-4 mb-6">
    {mood && <Mascot mood={mood} size={72} className="shrink-0 -my-2" />}
    <div className="flex-1 min-w-[200px]">
      <h1 className="text-[30px] sm:text-[36px] leading-tight">{title}</h1>
      {sub && <p className="muted mt-1">{sub}</p>}
    </div>
    {right}
  </div>
)

export const Chips = ({ items, value, onChange, className = '' }) => (
  <div className={cx('flex flex-wrap gap-2', className)}>
    {items.map(([k, l]) => <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)} className={cx('chip', value === k && 'chip-on')}>{l}</button>)}
  </div>
)

export const Grid = () => <g><line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#FFCDD8" strokeWidth=".6" strokeDasharray="2 2" /><line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#FFCDD8" strokeWidth=".6" strokeDasharray="2 2" /></g>

// Hoạt ảnh thứ tự nét
export function StrokeAnim({ ch, size = 220, className = '', auto = true }) {
  const ready = useStrokesReady()
  const g = useRef(null), tok = useRef(0)
  const play = async () => {
    const sd = SD(ch); if (!sd || !g.current) return; const my = ++tok.current
    const ps = [...g.current.querySelectorAll('path.a')], ts = [...g.current.querySelectorAll('text')]
    ps.forEach(p => { p.style.opacity = 0 }); ts.forEach(t => { t.style.opacity = 0 })
    for (let i = 0; i < ps.length; i++) {
      if (tok.current !== my) return; const p = ps[i], L = sd.len[i]; p.style.opacity = 1; ts[i].style.opacity = 1
      if (RM) continue; p.style.strokeDasharray = L + ' ' + L
      try { await p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: Math.max(260, L * 13), easing: 'ease-in-out', fill: 'forwards' }).finished } catch (e) { return }
      await wait(120)
    }
  }
  useEffect(() => { if (ready && auto) play(); return () => { tok.current++ } }, [ch, ready])
  const sd = ready ? SD(ch) : null
  return (
    <div className={cx('relative', className)} style={{ width: size, maxWidth: '100%' }}>
      <svg viewBox="0 0 109 109" className="paper rounded-3xl border-2 border-sakura-100 dark:border-night-line w-full aspect-square stk">
        <Grid />
        {sd && <g>{sd.d.map((d, i) => <path key={'g' + i} d={d} className="s-ghost" />)}</g>}
        <g ref={g}>{sd && sd.d.map((d, i) => <path key={ch + i} d={d} className="a s-anim" style={{ opacity: 0 }} />)}
          {sd && sd.d.map((_, i) => { const [x, y] = numPos(sd, i); return <text key={'t' + ch + i} x={x.toFixed(1)} y={y.toFixed(1)} className="num" style={{ opacity: 0 }}>{i + 1}</text> })}</g>
      </svg>
      <button type="button" onClick={play} className="absolute bottom-2 right-2 chip !min-h-[36px] !px-3 text-sm" aria-label="Xem lại thứ tự nét"><Icon name="play" size={18} />Xem nét</button>
    </div>
  )
}

export const Glyph = ({ ch, className = 'stk' }) => { const ready = useStrokesReady(); const sd = ready ? SD(ch) : null; return <svg viewBox="0 0 109 109" className={className}>{sd && sd.d.map((d, i) => <path key={i} d={d} className="s-ink" />)}</svg> }

// Mẹo nhớ: kana (chữ Hán gốc), kanji tượng hình (hình → chữ), kanji ghép (bộ phận)
export function Mnemonic({ ch, hide = false, compact = false }) {
  const [on, setOn] = useState(false)
  const ready = useStrokesReady()
  useEffect(() => { setOn(false); if (hide) return; const t = setTimeout(() => setOn(true), RM ? 0 : 900); return () => clearTimeout(t) }, [ch, hide])
  const q = t => hide ? t.split(ch).map((p, i, a) => <span key={i}>{p}{i < a.length - 1 && <b className="text-primary">?</b>}</span>) : t
  const Part = ({ g, l, res }) => (
    <span className={cx('inline-flex flex-col items-center min-w-[64px] px-3 py-1.5 rounded-2xl border-2 bg-white dark:bg-night', res ? 'border-primary' : 'border-sakura-100 dark:border-night-line')}>
      <b className="jp text-[30px] leading-tight font-medium">{g}</b>{l && <small className="muted text-[13px] whitespace-nowrap">{l}</small>}
    </span>
  )
  if (KAMN[ch]) {
    const m = KAMN[ch]
    return (
      <div className="space-y-2">
        {!compact && <h3 className="text-primary text-[16px]">Mẹo nhớ</h3>}
        <div className="flex flex-wrap items-center gap-2"><Part g={m.o} l={m.ohv} /><span className="text-xl muted font-head">→</span><Part g={hide ? '?' : ch} l={hide ? '' : romOf(ch)} res /><span className="muted text-sm">{m.kata ? 'Katakana lấy một phần chữ Hán' : 'Hiragana viết thảo từ chữ Hán'}</span></div>
        <p className="text-[15px]">{q(m.s)}</p>
        {m.x && !hide && <p className="muted text-sm">Dễ nhầm với <span className="jp text-lg text-ink dark:text-white">{m.x}</span> ({romOf(m.x)})</p>}
      </div>
    )
  }
  if (MK[ch]) {
    const m = MK[ch]
    return (
      <div className="space-y-2">
        {!compact && <h3 className="text-primary text-[16px]">Cách tạo chữ</h3>}
        <div className="flex flex-wrap items-center gap-2">{m.parts.map(([g, l], i) => <span key={i} className="flex items-center gap-2">{i > 0 && <span className="text-xl muted font-head">+</span>}<Part g={g} l={l} /></span>)}<span className="text-xl muted font-head">=</span><Part g={hide ? '?' : ch} l={hide ? '' : romOf(ch)} res /></div>
        <p className="text-[15px]">{q(m.s)}</p>
      </div>
    )
  }
  if (JMN[ch]) {
    const [parts, story] = JMN[ch]
    const sd = ready ? SD(ch) : null
    return (
      <div className="space-y-2">
        {!compact && <h3 className="text-primary text-[16px]">Mẹo nhớ{PIC[ch] ? ' · chữ tượng hình' : ''}</h3>}
        {PIC[ch] ? (
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 109 109" className="w-[170px] h-[170px] rounded-3xl bg-white dark:bg-cream border-2 border-sakura-100 dark:border-night-line text-ink" onClick={() => { setOn(false); setTimeout(() => setOn(true), 700) }}>
              <g style={{ opacity: on && !hide ? .28 : 1, transition: 'opacity 1.1s' }} dangerouslySetInnerHTML={{ __html: PIC[ch] }} />
              {!hide && sd && <g className="stk" style={{ opacity: on ? 1 : 0, transition: 'opacity 1.1s' }}>{sd.d.map((d, i) => <path key={i} d={d} stroke="#303345" />)}</g>}
            </svg>
            {!hide && <button type="button" className="text-primary text-sm underline" onClick={() => { setOn(false); setTimeout(() => setOn(true), 700) }}>Xem lại hình → chữ</button>}
          </div>
        ) : parts ? (
          <div className="flex flex-wrap items-center gap-2">
            {parts.split('|').map((x, i) => { const [g, l] = x.split(':'); return <span key={i} className="flex items-center gap-2">{i > 0 && <span className="text-xl muted font-head">+</span>}<Part g={g} l={l} /></span> })}
            <span className="text-xl muted font-head">=</span><Part g={hide ? '?' : ch} res />
          </div>
        ) : null}
        <p className="text-[15px]">{q(story)}</p>
      </div>
    )
  }
  return null
}

// Hoa anh đào rơi + Kitsune ăn mừng
export function Petals({ n = 26 }) {
  const ps = useRef(Array.from({ length: n }, (_, i) => ({ l: Math.random() * 100, d: 2.6 + Math.random() * 2.4, delay: Math.random() * .8, s: 10 + Math.random() * 12, dx: (Math.random() * 30 - 15) + 'vw', c: ['#FFB7C5', '#FFCDD8', '#E85D75', '#BFE3D0'][i % 4] }))).current
  if (RM) return null
  return <div className="pointer-events-none fixed inset-0 overflow-hidden z-[60]">{ps.map((p, i) => <svg key={i} viewBox="0 0 20 20" width={p.s} height={p.s} className="absolute -top-8" style={{ left: p.l + '%', animation: `fall ${p.d}s ${p.delay}s cubic-bezier(.3,.6,.5,1) forwards`, '--dx': p.dx }}><path d="M10 2 C16 6 16 14 10 18 C4 14 4 6 10 2Z" fill={p.c} /></svg>)}</div>
}

export function Celebrate({ open, title, sub, xp, stars, mood = 'cheer', onClose, actions }) {
  useEffect(() => { if (!open) return; const k = e => { if (e.key === 'Escape') onClose?.() }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
      {mood !== 'sad' && <Petals />}
      <div className="card w-full max-w-sm p-7 text-center animate-pop relative">
        <Mascot mood={mood} size={140} className="mx-auto -mt-20 animate-floaty" />
        <h2 className="text-[28px] mt-1">{title}</h2>
        {stars !== undefined && <div className="flex justify-center gap-1 my-2">{[1, 2, 3].map(i => <Icon key={i} name="star" size={40} className={cx(i > stars && 'opacity-25 grayscale')} />)}</div>}
        {sub && <p className="muted">{sub}</p>}
        {xp > 0 && <div className="inline-flex items-center gap-1 mt-3 px-4 py-1.5 rounded-full bg-[#FFF3CC] text-[#8A6200] font-head font-extrabold dark:bg-[#4a3d10] dark:text-[#FFD36B]"><Icon name="bolt" size={20} />+{xp} XP</div>}
        <div className="flex flex-col gap-2 mt-5">{actions || <button className="btn-primary" onClick={onClose}>Tiếp tục</button>}</div>
      </div>
    </div>
  )
}

// Thông báo huy hiệu / đạt mục tiêu (từ store)
export function EventLayer() {
  const ev = useEvents(); const e = ev[0]
  useEffect(() => { if (!e) return; const t = setTimeout(popEvent, 4200); return () => clearTimeout(t) }, [e?.key])
  if (!e) return null
  return (
    <div className="fixed z-[70] left-1/2 -translate-x-1/2 bottom-24 lg:bottom-8 w-[min(92vw,380px)] animate-pop" role="status">
      {e.kind === 'goal' && <Petals n={18} />}
      <div className="card p-4 flex items-center gap-3 border-2 !border-primary/30">
        {e.kind === 'badge' ? <Medal b={e.badge} size={56} /> : <Mascot mood="cheer" size={56} />}
        <div className="flex-1"><b className="font-head text-[17px] block">{e.kind === 'badge' ? 'Huy hiệu mới: ' + e.badge.name : 'Đạt mục tiêu hôm nay!'}</b><span className="muted text-sm">{e.kind === 'badge' ? e.badge.desc : 'Kitsune tự hào về bạn. Giữ chuỗi ngày nhé!'}</span></div>
        <button onClick={popEvent} aria-label="Đóng" className="muted"><Icon name="close" size={20} /></button>
      </div>
    </div>
  )
}

export const Medal = ({ b, size = 72, locked = false }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} className={cx(locked && 'grayscale opacity-40')} aria-hidden="true">
    <path d="M26 50 L18 76 L30 70 L36 78 L40 56Z" fill="#E85D75" stroke="#303345" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M54 50 L62 76 L50 70 L44 78 L40 56Z" fill="#E85D75" stroke="#303345" strokeWidth="2.4" strokeLinejoin="round" />
    <circle cx="40" cy="34" r="26" fill={b.c} stroke="#303345" strokeWidth="2.6" />
    <circle cx="40" cy="34" r="19" fill="#fff" stroke="#303345" strokeWidth="2" strokeDasharray="3 3" />
    <text x="40" y="42" textAnchor="middle" fontFamily="Noto Sans JP" fontWeight="700" fontSize="22" fill="#303345">{b.g}</text>
  </svg>
)
