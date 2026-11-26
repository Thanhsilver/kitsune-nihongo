import { useState } from 'react'
import { GRID, BY_ID, ITEMS } from '../data/items.js'
import { DAK, YOON, EXT, RULES } from '../data/kana2.js'
import { useStore, setSetting, statusOf, markViewed } from '../lib/store.js'
import { planQuiz } from '../lib/quiz.js'
import { cx } from '../lib/util.js'
import { speak } from '../lib/audio.js'
import { PageHead, Chips, Celebrate } from '../components/ui.jsx'
import CharDetail from '../components/CharDetail.jsx'
import Quiz from '../components/Quiz.jsx'
import Icon from '../components/Icons.jsx'
import { RuleCard, PairDrill } from '../components/Rules.jsx'

const GROUPS = [['base', 'Cơ bản (46)'], ['dak', 'Biến âm ゛゜'], ['yoon', 'Âm ghép ゃゅょ'], ['ext', 'Mở rộng (Katakana)']]
const keysOf = g => g === 'base' ? GRID.map(x => x && x.r) : g === 'dak' ? DAK.map(x => x[0]) : g === 'yoon' ? YOON.map(x => x[0]) : EXT.map(x => 'x' + x[0])
const COLS = { base: 'grid-cols-5', dak: 'grid-cols-5', yoon: 'grid-cols-3', ext: 'grid-cols-4' }
const DOT = { mastered: 'bg-matcha-600', learning: 'bg-sakura', viewed: 'bg-ink/20' }

function Rules() {
  const [k, setK] = useState(0), r = RULES[k]
  return (
    <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
      <nav className="card p-3 flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
        {RULES.map((x, i) => <button key={x.id} type="button" onClick={() => setK(i)} aria-current={i === k} className={cx('shrink-0 text-left rounded-2xl px-3 min-h-[44px] font-head font-bold text-[15px]', i === k ? 'bg-sakura-100 text-primary-700 dark:bg-primary/20 dark:text-sakura' : 'hover:bg-ink/5')}>{i + 1}. {x.title}</button>)}
      </nav>
      <div className="space-y-5">
        <div className="card p-5 sm:p-8"><RuleCard r={r} /></div>
        {r.pairs && <div className="card p-5 sm:p-8"><h3 className="text-[20px] mb-3">Luyện tai: phân biệt cặp từ dễ nhầm</h3><PairDrill key={r.id} rules={[r.id]} /></div>}
        <div className="flex justify-between"><button className="btn-ghost" disabled={k === 0} onClick={() => setK(k - 1)}><Icon name="back" size={20} />Trước</button><button className="btn-primary" disabled={k === RULES.length - 1} onClick={() => setK(k + 1)}>Quy tắc tiếp<Icon name="next" size={20} /></button></div>
      </div>
    </div>
  )
}

export default function Kana() {
  const s = useStore(), sc = s.settings.script === 'k' ? 'k' : 'h'
  const [tab, setTab] = useState('chart'), [grp, setGrp] = useState('base')
  const g = grp === 'ext' && sc === 'h' ? 'base' : grp
  const keys = keysOf(g), pre = g === 'ext' ? 'k' : sc
  const [sel, setSel] = useState(null), [quiz, setQuiz] = useState(null), [res, setRes] = useState(null)
  const list = keys.filter(Boolean).map(k => BY_ID[pre + ':' + k])
  const c = (sel && list.find(x => x.id === sel)) || list[0]
  const start = () => setQuiz(planQuiz(list, { n: 10 }))
  if (quiz) return <Quiz questions={quiz} title="Nhận diện chữ" onExit={() => setQuiz(null)} onFinish={r => { setQuiz(null); setRes(r) }} />
  return (
    <div>
      <PageHead title="Bảng chữ cái" sub="Đủ 46 chữ cơ bản, biến âm, âm ghép, katakana mở rộng và các quy tắc phát âm." mood="happy"
        right={tab === 'chart' && <button className="btn-primary" onClick={start}><Icon name="quiz" size={22} />Bài tập nhận diện</button>} />
      <Chips items={[['chart', 'Bảng chữ'], ['rules', 'Quy tắc phát âm']]} value={tab} onChange={setTab} className="mb-4" />
      {tab === 'rules' ? <Rules /> : <>
        <div className="flex flex-wrap gap-3 items-center mb-5">
          <Chips items={[['h', 'Hiragana ひらがな'], ['k', 'Katakana カタカナ']]} value={g === 'ext' ? 'k' : sc} onChange={v => { setSetting('script', v); setSel(null); if (v === 'h' && grp === 'ext') setGrp('base') }} />
          <span className="w-px h-8 bg-ink/10 hidden sm:block" />
          <Chips items={GROUPS} value={g} onChange={v => { setGrp(v); setSel(null); if (v === 'ext') setSetting('script', 'k') }} />
        </div>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
          <div className="card p-3 sm:p-5 order-2 lg:order-1">
            <div className={cx('grid gap-2 sm:gap-3', COLS[g])}>
              {keys.map((k, i) => {
                if (!k) return <div key={i} />
                const it = BY_ID[pre + ':' + k], st = statusOf(s, it.id)
                return (
                  <button key={i} type="button" onClick={() => { setSel(it.id); speak(it.say); markViewed([it.id]) }}
                    className={cx('relative rounded-2xl sm:rounded-3xl border-2 border-b-4 flex flex-col items-center justify-center transition hover:-translate-y-0.5', g === 'yoon' || g === 'ext' ? 'min-h-[84px]' : 'aspect-square',
                      c.id === it.id ? 'border-primary bg-sakura-50 dark:bg-primary/15' : 'border-ink/10 dark:border-night-line bg-white dark:bg-night')}>
                    <span className="jp text-[28px] sm:text-[36px] leading-none">{it.w}</span><span className="text-xs sm:text-sm muted mt-1">{it.r}</span>
                    {DOT[st] && <span className={cx('absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full', DOT[st])} />}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-4 muted text-sm mt-4">{[['viewed', 'Đã xem'], ['learning', 'Đang học'], ['mastered', 'Thành thạo']].map(([k, l]) => <span key={k} className="flex items-center gap-1.5"><span className={cx('w-2.5 h-2.5 rounded-full', DOT[k])} />{l}</span>)}</div>
          </div>
          <div className="order-1 lg:order-2 lg:sticky lg:top-6"><CharDetail c={c} /></div>
        </div>
      </>}
      <Celebrate open={!!res} title={res && res.score === res.total ? 'Hoàn hảo!' : 'Xong bài nhận diện!'} mood={res && res.score / res.total >= .7 ? 'cheer' : 'happy'} sub={res && `Đúng ${res.score}/${res.total} câu. Câu sai đã được luyện lại và sẽ vào lịch ôn.`} onClose={() => setRes(null)} />
    </div>
  )
}
