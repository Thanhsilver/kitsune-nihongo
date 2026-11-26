import { useEffect, useRef, useState } from 'react'
import { shortMean } from '../data/items.js'
import { speak } from '../lib/audio.js'
import { getState, setState, addXP, bumpStat } from '../lib/store.js'
import { shuffle, cx } from '../lib/util.js'
import Icon from './Icons.jsx'
import { SpeakBtn } from './ui.jsx'

// Ghép cặp: chữ tiếng Nhật ↔ nghĩa, tính giờ
export function MatchGame({ items, onFinish, onExit }) {
  const [L] = useState(() => shuffle(items)), [R] = useState(() => shuffle(items))
  const [sel, setSel] = useState(null), [done, setDone] = useState({}), [bad, setBad] = useState({}), [miss, setMiss] = useState(0)
  const t0 = useRef(Date.now()), [t, setT] = useState(0)
  const finished = Object.keys(done).length === items.length
  useEffect(() => { if (finished) return; const h = setInterval(() => setT((Date.now() - t0.current) / 1000), 200); return () => clearInterval(h) }, [finished])
  const click = (side, c) => {
    if (done[c.id] || finished) return
    if (side === 'L') speak(c.say)
    if (!sel || sel.side === side) { setSel({ side, id: c.id }); return }
    if (sel.id === c.id) {
      const nd = { ...done, [c.id]: 1 }; setDone(nd); setSel(null)
      if (Object.keys(nd).length === items.length) {
        const secs = (Date.now() - t0.current) / 1000; setT(secs)
        const best = getState().stats.matchBest; if (!best || secs < best) bumpStat('matchBest', () => +secs.toFixed(1))
        addXP(20 + Math.max(0, 20 - Math.round(secs))); onFinish?.({ secs, miss, record: !best || secs < best })
      }
    } else {
      setMiss(m => m + 1); const k = { [sel.side + sel.id]: 1, [side + c.id]: 1 }; setBad(k); setSel(null); setTimeout(() => setBad({}), 450)
      setState(s => ({ due: { ...s.due, [c.id]: Date.now(), [sel.id]: Date.now() } }))
    }
  }
  const Btn = ({ c, side }) => (
    <button type="button" onClick={() => click(side, c)} disabled={!!done[c.id]}
      className={cx('rounded-2xl border-2 border-b-4 min-h-[64px] px-3 transition bg-white dark:bg-night',
        done[c.id] ? 'opacity-30 border-dashed border-matcha-600' : bad[side + c.id] ? 'border-primary bg-sakura-50 animate-wiggle' : sel && sel.side === side && sel.id === c.id ? 'border-primary bg-sakura-50 dark:bg-primary/20 -translate-y-0.5' : 'border-ink/10 dark:border-night-line hover:border-primary/40',
        side === 'L' ? 'jp text-[26px]' : 'font-semibold text-[16px]')}>
      {side === 'L' ? c.w : shortMean(c)}
    </button>
  )
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button className="btn-ghost !min-h-[44px] !px-3" onClick={onExit} aria-label="Thoát"><Icon name="close" size={20} /></button>
        <div className="flex-1 font-head font-extrabold">{Object.keys(done).length}/{items.length} cặp · Lỗi {miss}</div>
        <div className="font-head font-extrabold text-primary tabular-nums text-xl">{t.toFixed(1)}s</div>
      </div>
      <div className="card p-4 sm:p-6 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="grid gap-3">{L.map(c => <Btn key={c.id} c={c} side="L" />)}</div>
        <div className="grid gap-3">{R.map(c => <Btn key={c.id} c={c} side="R" />)}</div>
      </div>
    </div>
  )
}

// Sắp xếp câu: chạm các cụm theo đúng thứ tự
export function SortGame({ words, onFinish, onExit }) {
  const [i, setI] = useState(0), [score, setScore] = useState(0)
  const w = words[i], parts = w.ex.jp.split('|')
  const [pool, setPool] = useState(() => shuffle(parts.map((p, k) => ({ p, k }))))
  const [ans, setAns] = useState([]), [res, setRes] = useState(null)
  useEffect(() => { let sh = shuffle(parts.map((p, k) => ({ p, k }))); if (parts.length > 1) while (sh.every((x, k) => x.k === k)) sh = shuffle(sh); setPool(sh); setAns([]); setRes(null) }, [i])
  const add = x => { if (res) return; setAns([...ans, x]); setPool(pool.filter(y => y !== x)) }
  const rem = x => { if (res) return; setPool([...pool, x]); setAns(ans.filter(y => y !== x)) }
  const check = () => { const ok = ans.map(x => x.p).join('') === parts.join(''); setRes(ok ? 'ok' : 'bad'); if (ok) { setScore(s => s + 1); addXP(10) } speak(w.ex.rd) }
  const next = () => { if (i + 1 >= words.length) { onFinish?.({ score: score, total: words.length }); return } setI(i + 1) }
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button className="btn-ghost !min-h-[44px] !px-3" onClick={onExit} aria-label="Thoát"><Icon name="close" size={20} /></button>
        <div className="flex-1 h-4 rounded-full bg-ink/5 dark:bg-white/10 overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: ((i + (res ? 1 : 0)) / words.length * 100) + '%' }} /></div>
        <span className="font-head font-extrabold text-primary">{score}/{words.length}</span>
      </div>
      <div className="card p-5 sm:p-8">
        <p className="font-head font-extrabold text-primary">Sắp xếp thành câu tiếng Nhật có nghĩa là</p>
        <p className="font-head text-[24px] sm:text-[28px] my-3 leading-snug">{w.ex.vi}</p>
        <div className={cx('min-h-[76px] rounded-3xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-center', res === 'ok' ? 'border-matcha-600 bg-matcha-50 dark:bg-matcha/10' : res === 'bad' ? 'border-primary bg-sakura-50 dark:bg-primary/10' : 'border-sakura-200 dark:border-night-line')}>
          {ans.length === 0 && <span className="muted px-2">Chạm vào các cụm bên dưới theo đúng thứ tự</span>}
          {ans.map(x => <button key={x.k} type="button" onClick={() => rem(x)} className="jp text-[22px] rounded-2xl border-2 border-b-4 border-ink/10 dark:border-night-line bg-white dark:bg-night px-4 min-h-[52px]">{x.p}</button>)}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 min-h-[56px]">{pool.map(x => <button key={x.k} type="button" onClick={() => add(x)} className="jp text-[22px] rounded-2xl border-2 border-b-4 border-sakura-200 dark:border-night-line bg-sakura-50 dark:bg-primary/10 px-4 min-h-[52px] hover:-translate-y-0.5 transition">{x.p}</button>)}</div>
        {res && <div className="mt-4 flex flex-wrap items-center gap-3 animate-pop"><b className={res === 'ok' ? 'text-matcha-700 dark:text-matcha font-head text-lg' : 'text-primary font-head text-lg'}>{res === 'ok' ? 'Chính xác!' : 'Câu đúng:'}</b><span className="jp text-xl">{parts.join('')}</span><span className="jp muted">{w.ex.rd}</span><SpeakBtn text={w.ex.rd} /></div>}
        <div className="flex justify-end gap-2 mt-5">
          {!res ? <button className="btn-primary min-w-[150px]" disabled={ans.length !== parts.length} onClick={check}>Kiểm tra</button>
            : <button className={res === 'ok' ? 'btn-matcha min-w-[150px]' : 'btn-primary min-w-[150px]'} onClick={next}>{i + 1 >= words.length ? 'Xem kết quả' : 'Tiếp tục'}</button>}
        </div>
      </div>
    </div>
  )
}
