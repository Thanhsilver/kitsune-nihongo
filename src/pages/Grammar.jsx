import { useState } from 'react'
import { GRAMMAR, UNITS } from '../data/grammar.js'
import { useStore, statusOf } from '../lib/store.js'
import { planQuiz } from '../lib/quiz.js'
import { ITEMS } from '../data/items.js'
import { cx } from '../lib/util.js'
import { PageHead, Bar, Celebrate } from '../components/ui.jsx'
import Icon from '../components/Icons.jsx'
import GrammarLesson from '../components/GrammarLesson.jsx'
import Quiz from '../components/Quiz.jsx'

const ST = { mastered: ['Thành thạo', 'bg-matcha text-matcha-700'], learning: ['Đang học', 'bg-sakura-100 text-primary-700'], viewed: ['Đã xem', 'bg-ink/5'], new: ['Chưa học', 'bg-ink/5 muted'] }
export default function Grammar() {
  const s = useStore()
  const [open, setOpen] = useState(null), [quiz, setQuiz] = useState(null), [res, setRes] = useState(null)
  if (open) return <GrammarLesson gid={open} onExit={() => setOpen(null)} />
  if (quiz) return <Quiz questions={quiz} title="Ôn ngữ pháp" onExit={() => setQuiz(null)} onFinish={r => { setQuiz(null); setRes(r) }} />
  const done = GRAMMAR.filter(g => s.lessons['gr_' + g.id]).length
  const units = [...new Set(GRAMMAR.map(g => g.unit))]
  return (
    <div>
      <PageHead title="Ngữ pháp N5" sub="26 mẫu câu nền tảng, mỗi bài có giải thích, ví dụ có audio và bài luyện tập." mood="think"
        right={<button className="btn-primary" disabled={done < 2} onClick={() => setQuiz(planQuiz(ITEMS.filter(i => i.type === 'grammar' && s.lessons['gr_' + i.gid]), { n: 12 }))} title={done < 2 ? 'Học ít nhất 2 bài để ôn tổng hợp' : ''}><Icon name="review" size={22} />Ôn tổng hợp</button>} />
      <div className="card p-5 mb-6 flex flex-wrap items-center gap-4"><div className="flex-1 min-w-[200px]"><div className="flex justify-between font-head font-bold"><span>Đã học</span><span className="tabular-nums">{done}/{GRAMMAR.length} bài</span></div><Bar value={done} max={GRAMMAR.length} className="mt-2" /></div><p className="muted text-sm max-w-sm">Các bài ngữ pháp cũng nằm trên Lộ trình N5, xen giữa các bài từ vựng và kanji.</p></div>
      <div className="space-y-6">
        {units.map(u => (
          <section key={u}>
            <h2 className="text-[20px] mb-3">Chủ đề {u}: <span className="font-body font-semibold">{UNITS[u]}</span></h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {GRAMMAR.filter(g => g.unit === u).map(g => { const st = statusOf(s, 'G:' + g.id), stars = s.lessons['gr_' + g.id]?.stars || 0; return (
                <button key={g.id} type="button" onClick={() => setOpen(g.id)} className="card p-4 text-left hover:-translate-y-0.5 transition flex flex-col gap-2">
                  <div className="flex items-center gap-2"><span className="w-9 h-9 rounded-xl bg-sakura-100 dark:bg-primary/20 grid place-items-center font-head font-extrabold text-primary shrink-0">{+g.id.slice(1)}</span><span className={cx('chip !min-h-[26px] !px-2.5 text-xs !border-0', ST[st][1])}>{ST[st][0]}</span>{stars > 0 && <span className="ml-auto flex">{[1, 2, 3].map(i => <Icon key={i} name="star" size={16} className={i > stars ? 'opacity-25 grayscale' : ''} />)}</span>}</div>
                  <b className="jp text-[19px] leading-snug">{g.title}</b><span className="muted text-sm">{g.short}</span>
                </button>) })}
            </div>
          </section>
        ))}
      </div>
      <Celebrate open={!!res} title="Xong lượt ôn!" mood={res && res.score / res.total >= .7 ? 'cheer' : 'happy'} sub={res && `Đúng ${res.score}/${res.total}. Câu sai đã vào lịch ôn tập.`} onClose={() => setRes(null)} />
    </div>
  )
}
