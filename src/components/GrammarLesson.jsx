import { useMemo, useState } from 'react'
import { G_BY } from '../data/grammar.js'
import { BY_ID } from '../data/items.js'
import { makeQ } from '../lib/quiz.js'
import { speak } from '../lib/audio.js'
import { markViewed, bumpStat } from '../lib/store.js'
import { shuffle, cx } from '../lib/util.js'
import Quiz from './Quiz.jsx'
import Icon from './Icons.jsx'
import Mascot from './Mascot.jsx'
import { Celebrate } from './ui.jsx'
import { starsFor, recordPass } from '../pages/Lesson.jsx'

// Màu cho từng cụm trong câu ví dụ để thấy cấu trúc
const TINT = ['bg-sakura-100 dark:bg-primary/20', 'bg-matcha-50 dark:bg-matcha/15', 'bg-[#FFF3CC] dark:bg-[#3a3214]', 'bg-[#E8EEFF] dark:bg-[#232a45]']
export function GrammarCard({ g }) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-sakura-50 to-white dark:from-primary/15 dark:to-night-card border-2 border-sakura-100 dark:border-night-line p-5">
        <p className="text-sm muted font-head font-bold">Công thức</p>
        <p className="jp text-[24px] sm:text-[28px] mt-1 leading-snug">{g.form}</p>
        <p className="font-head text-lg text-primary mt-1">{g.short}</p>
      </div>
      {g.explain.map((p, i) => <p key={i} className="text-[16px] leading-relaxed max-w-[68ch]">{p}</p>)}
      <div>
        <h3 className="text-[18px] mb-3">Ví dụ</h3>
        <div className="space-y-3">{g.ex.map(([jp, rd, vi], i) => (
          <button key={i} type="button" onClick={() => speak(rd)} className="w-full text-left rounded-3xl border-2 border-ink/5 dark:border-night-line bg-white dark:bg-night p-4 flex items-start gap-3 hover:border-primary/40 transition">
            <span className="flex-1">
              <span className="flex flex-wrap gap-1.5">{jp.split('|').map((p, k) => <span key={k} className={cx('jp text-[22px] rounded-xl px-2 py-0.5', TINT[k % 4])}>{p}</span>)}</span>
              <span className="jp text-sm muted block mt-1.5">{rd}</span><span className="block mt-0.5">{vi}</span>
            </span>
            <span className="w-11 h-11 grid place-items-center rounded-full bg-sakura-100 dark:bg-primary/20 shrink-0"><Icon name="sound" size={22} /></span>
          </button>))}</div>
      </div>
      {g.notes.length > 0 && <div className="rounded-3xl bg-matcha-50 dark:bg-matcha/10 p-4"><b className="font-head">Lưu ý</b><ul className="list-disc pl-5 mt-1 space-y-1">{g.notes.map((n, i) => <li key={i}>{n}</li>)}</ul></div>}
    </div>
  )
}
// Bài học ngữ pháp: đọc giải thích → luyện 7 câu (điền ×2, xếp câu ×2, chọn mẫu, chọn nghĩa, nghe) → qua 70%
export default function GrammarLesson({ gid, nodeId, onExit }) {
  const g = G_BY[gid], item = BY_ID['G:' + gid], id = nodeId || 'gr_' + gid
  const [phase, setPhase] = useState('learn'), [run, setRun] = useState(0), [res, setRes] = useState(null)
  const qs = useMemo(() => shuffle(['cloze', 'cloze', 'sort', 'sort', 'gpat', 'gmean', 'glisten'].map(t => makeQ(item, t))), [gid, run])
  const finish = r => { const acc = r.score / r.total, stars = starsFor(acc, .7); let info = { xp: 0 }; if (stars) { info = recordPass(id, stars, 20); if (acc === 1) bumpStat('perfect') } setRes({ ...r, acc, stars, ...info }); setPhase('done') }
  if (phase === 'quiz') return <Quiz key={run} questions={qs} title={g.title} onExit={onExit} onFinish={finish} />
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button className="btn-ghost !min-h-[44px] !px-3" onClick={onExit} aria-label="Thoát"><Icon name="back" size={20} /></button>
        <div className="flex-1"><p className="muted text-sm">Ngữ pháp N5 · Bài {gid.slice(1)}</p><h1 className="text-[24px] sm:text-[28px] leading-tight jp">{g.title}</h1></div>
      </div>
      <div className="card p-5 sm:p-8 animate-pop"><GrammarCard g={g} /></div>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
        <p className="muted text-sm">7 câu luyện tập: điền chỗ trống, xếp câu, chọn mẫu đúng, chọn nghĩa, nghe. Cần đúng 70%.</p>
        <button className="btn-primary min-w-[170px]" onClick={() => { markViewed(['G:' + gid]); setPhase('quiz') }}>Luyện tập ngay</button>
      </div>
      {phase === 'done' && res && <Celebrate open title={res.stars ? 'Nắm được mẫu câu rồi!' : 'Gần được rồi!'} mood={res.stars ? 'cheer' : 'sad'} stars={res.stars}
        sub={`Đúng ${res.score}/${res.total} câu (${Math.round(res.acc * 100)}%).` + (res.stars ? '' : ' Cần 70% để qua. Đọc lại ví dụ rồi thử lại nhé.')} xp={res.xp}
        actions={<>{res.stars ? <button className="btn-primary" onClick={onExit}>Xong</button> : <button className="btn-primary" onClick={() => { setRes(null); setRun(x => x + 1); setPhase('quiz') }}>Làm lại</button>}
          <button className="btn-ghost" onClick={() => { setRes(null); setPhase('learn') }}>Xem lại bài</button></>} />}
    </div>
  )
}
