import { useMemo, useState } from 'react'
import { RULES } from '../data/kana2.js'
import { speak } from '../lib/audio.js'
import { addXP } from '../lib/store.js'
import { shuffle, cx } from '../lib/util.js'
import { SpeakBtn } from './ui.jsx'
import Icon from './Icons.jsx'
import Mascot from './Mascot.jsx'

export const RULE = Object.fromEntries(RULES.map(r => [r.id, r]))
// Một quy tắc phát âm: giải thích + ví dụ có audio
export function RuleCard({ r }) {
  return (
    <div className="space-y-4">
      <h2 className="text-[24px] flex items-center gap-2"><Icon name={r.icon} size={30} />{r.title}</h2>
      {r.body.map((p, i) => <p key={i} className="text-[16px] leading-relaxed max-w-[68ch]">{p}</p>)}
      {r.ex.length > 0 && <div className="grid sm:grid-cols-2 gap-3">
        {r.ex.map(([jp, rd, vi], i) => (
          <button key={i} type="button" onClick={() => speak(rd)} className="text-left rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
            <span className="flex-1"><span className="jp text-[24px] block leading-tight">{jp}</span><span className="muted text-sm">{vi}</span></span>
            <span className="w-11 h-11 grid place-items-center rounded-full bg-white dark:bg-night shrink-0"><Icon name="sound" size={22} /></span>
          </button>
        ))}
      </div>}
    </div>
  )
}
// Luyện nghe phân biệt cặp từ dễ nhầm
export function PairDrill({ rules, onDone }) {
  const items = useMemo(() => shuffle(rules.flatMap(id => (RULE[id].pairs || []).map(p => { const k = Math.random() < .5 ? 0 : 1; return { p, k } }))), [rules.join()])
  const [i, setI] = useState(0), [pick, setPick] = useState(null), [score, setScore] = useState(0)
  if (!items.length) return null
  if (i >= items.length) return (
    <div className="text-center py-4"><Mascot mood={score === items.length ? 'cheer' : 'happy'} size={110} className="mx-auto" /><h3 className="text-[22px] mt-1">Nghe đúng {score}/{items.length}</h3><p className="muted">{score === items.length ? 'Tai bạn rất thính!' : 'Nghe lại các ví dụ phía trên rồi thử lần nữa nhé.'}</p>
      <div className="flex justify-center gap-2 mt-3"><button className="btn-ghost" onClick={() => { setI(0); setScore(0); setPick(null) }}>Làm lại</button>{onDone && <button className="btn-primary" onClick={() => onDone(score / items.length)}>Hoàn thành</button>}</div></div>
  )
  const it = items[i], ans = it.p[it.k][0]
  return (
    <div>
      <div className="flex items-center justify-between mb-3"><b className="font-head text-primary">Nghe và chọn từ bạn nghe thấy</b><span className="muted text-sm tabular-nums">{i + 1}/{items.length}</span></div>
      <div className="flex justify-center mb-4"><button type="button" onClick={() => speak(ans)} className="inline-flex items-center gap-3 rounded-full bg-sakura-100 dark:bg-primary/20 text-primary-700 dark:text-sakura px-7 min-h-[64px] font-head font-extrabold"><Icon name="sound" size={30} />Nghe</button></div>
      <div className="grid grid-cols-2 gap-3">
        {it.p.map(([w, m], k) => (
          <button key={k} type="button" disabled={pick !== null} onClick={() => { setPick(k); if (k === it.k) { setScore(s => s + 1); addXP(2) } }}
            className={cx('rounded-3xl border-2 border-b-4 p-4 text-center bg-white dark:bg-night transition', pick === null ? 'border-ink/10 dark:border-night-line hover:border-primary/50' : k === it.k ? 'border-matcha-600 bg-matcha-50 dark:bg-matcha/20' : k === pick ? 'border-primary bg-sakura-50 dark:bg-primary/15' : 'border-ink/10 opacity-60')}>
            <span className="jp text-[28px] block">{w}</span><span className="muted text-sm">{m}</span>
          </button>
        ))}
      </div>
      {pick !== null && <div className="flex justify-center gap-2 mt-4"><SpeakBtn text={it.p[0][0]} label="Nghe từ thứ nhất" /><SpeakBtn text={it.p[1][0]} label="Nghe từ thứ hai" /><button className="btn-primary" onClick={() => { setI(i + 1); setPick(null); if (i + 1 < items.length) setTimeout(() => speak(items[i + 1].p[items[i + 1].k][0]), 150) }}>Tiếp</button></div>}
    </div>
  )
}
