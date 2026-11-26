import { useEffect, useMemo, useState } from 'react'
import { NODE } from '../data/lessons.js'
import { BY_ID } from '../data/items.js'
import { planQuiz } from '../lib/quiz.js'
import { cx } from '../lib/util.js'
import { getState, setState, addXP, bumpStat, markViewed } from '../lib/store.js'
import ItemCard from '../components/ItemCard.jsx'
import Quiz from '../components/Quiz.jsx'
import Icon from '../components/Icons.jsx'
import Mascot from '../components/Mascot.jsx'
import { Celebrate } from '../components/ui.jsx'
import { RuleCard, PairDrill, RULE } from '../components/Rules.jsx'
import GrammarLesson from '../components/GrammarLesson.jsx'

// Sao: dưới ngưỡng qua = 0 sao (chưa qua). Qua rồi: 1–3 sao theo độ chính xác.
export const starsFor = (acc, pass) => acc < pass ? 0 : acc >= .95 ? 3 : acc >= (pass + .95) / 2 ? 2 : 1
// XP chỉ cho lần đầu hoàn thành và cho số sao tăng thêm, không nhận lặp
export function recordPass(id, stars, firstBonus, starXP = 15) {
  const prev = getState().lessons[id], ps = prev?.stars || 0
  const xp = (prev ? 0 : firstBonus) + Math.max(0, stars - ps) * starXP
  setState(s => ({ lessons: { ...s.lessons, [id]: { stars: Math.max(stars, ps), date: Date.now() } } }))
  if (!prev) bumpStat('lessons')
  if (xp) addXP(xp)
  return { xp, improved: stars > ps, first: !prev }
}

function Guide({ n, onExit }) {
  const [k, setK] = useState(0), [res, setRes] = useState(null)
  const rules = n.rules, hasPairs = rules.some(id => RULE[id].pairs)
  const pages = rules.length + (hasPairs ? 1 : 0)
  const complete = acc => { const r = recordPass(n.id, acc === undefined ? 3 : starsFor(acc, 0), 20, 5); setRes({ ...r, acc }) }
  return (<>
    <div className="flex gap-1.5 mb-4">{Array.from({ length: pages }, (_, i) => <button key={i} type="button" aria-label={'Trang ' + (i + 1)} onClick={() => setK(i)} className={cx('h-2.5 flex-1 rounded-full', i <= k ? 'bg-primary' : 'bg-ink/10 dark:bg-white/10')} />)}</div>
    <div className="card p-5 sm:p-8 animate-pop" key={k}>{k < rules.length ? <RuleCard r={RULE[rules[k]]} /> : <PairDrill rules={rules} onDone={complete} />}</div>
    <div className="flex justify-between gap-3 mt-5">
      <button className="btn-ghost" disabled={k === 0} onClick={() => setK(k - 1)}><Icon name="back" size={20} />Trước</button>
      {k < pages - 1 ? <button className="btn-primary min-w-[150px]" onClick={() => setK(k + 1)}>{k === rules.length - 1 && hasPairs ? 'Luyện nghe' : 'Tiếp'}<Icon name="next" size={20} /></button>
        : !hasPairs && <button className="btn-primary min-w-[150px]" onClick={() => complete()}>Hoàn thành</button>}
    </div>
    <Celebrate open={!!res} title="Xong bài hướng dẫn!" mood="cheer" stars={res ? (res.acc === undefined ? 3 : starsFor(res.acc, 0)) : 0} sub="Bạn có thể xem lại các quy tắc này bất cứ lúc nào ở trang Bảng chữ cái → Quy tắc phát âm." xp={res?.xp} actions={<button className="btn-primary" onClick={onExit}>Về lộ trình</button>} />
  </>)
}

export default function Lesson({ id, onExit }) {
  const n = NODE[id]
  const items = useMemo(() => (n.items || []).map(i => BY_ID[i]), [id])
  const station = n.kind === 'station'
  const [phase, setPhase] = useState(station ? 'intro' : 'learn')
  const [k, setK] = useState(0), [run, setRun] = useState(0), [res, setRes] = useState(null)
  const pass = station ? .8 : .7
  const qs = useMemo(() => station ? planQuiz(items, { n: n.final ? Math.min(items.length, 25) : Math.min(items.length, 15) }) : planQuiz(items), [id, run])
  useEffect(() => { if (phase === 'learn' && items[k]) markViewed([items[k].id]) }, [k, phase])
  if (n.kind === 'grammar') return <GrammarLesson gid={n.gid} nodeId={n.id} onExit={onExit} />
  if (n.kind === 'guide') return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-5"><button className="btn-ghost !min-h-[44px] !px-3" onClick={onExit} aria-label="Thoát"><Icon name="back" size={20} /></button><div><p className="muted text-sm">Bài hướng dẫn</p><h1 className="text-[24px] sm:text-[28px] leading-tight">{n.title}</h1></div></div>
      <Guide n={n} onExit={onExit} />
    </div>
  )
  const finish = r => {
    const acc = r.score / r.total, stars = starsFor(acc, pass)
    let info = { xp: 0 }
    if (stars > 0) { info = recordPass(id, stars, station ? 60 : 20); if (acc === 1) bumpStat('perfect') }
    setRes({ ...r, acc, stars, ...info }); setPhase('done')
  }
  const retry = () => { setRes(null); setRun(x => x + 1); setPhase('quiz') }
  if (phase === 'quiz') return <Quiz key={run} questions={qs} title={n.title} onExit={onExit} onFinish={finish} />
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button className="btn-ghost !min-h-[44px] !px-3" onClick={onExit} aria-label="Thoát bài học"><Icon name="back" size={20} /></button>
        <div className="flex-1"><p className="muted text-sm">{station ? (n.final ? 'Bài thi cuối vùng' : 'Trạm thử thách') : 'Bài học'}</p><h1 className="text-[24px] sm:text-[28px] leading-tight">{n.title}</h1></div>
      </div>
      {phase === 'intro' && (
        <div className="card p-8 text-center"><Mascot mood="think" size={140} className="mx-auto" /><h2 className="text-[26px] mt-2">Sẵn sàng thử thách?</h2>
          <p className="muted mt-2 max-w-md mx-auto">{qs.length} câu hỏi trộn nhiều dạng, lấy từ {items.length} mục đã học. Cần đúng ít nhất 80% để vượt trạm. Câu sai sẽ được luyện lại ở cuối lượt (không tính điểm lại).</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-xl mx-auto">{items.slice(0, 30).map(c => <span key={c.id} className="jp chip !min-h-[34px]">{c.w}</span>)}{items.length > 30 && <span className="chip !min-h-[34px]">+{items.length - 30}</span>}</div>
          <button className="btn-primary mt-6 min-w-[200px]" onClick={() => setPhase('quiz')}>Bắt đầu</button></div>
      )}
      {phase === 'learn' && (<>
        <div className="flex gap-1.5 mb-4">{items.map((_, i) => <button key={i} type="button" aria-label={'Mục ' + (i + 1)} onClick={() => setK(i)} className={cx('h-2.5 flex-1 rounded-full transition', i <= k ? 'bg-primary' : 'bg-ink/10 dark:bg-white/10')} />)}</div>
        <div className="card p-5 sm:p-8 animate-pop" key={k}><ItemCard c={items[k]} /></div>
        <div className="flex justify-between gap-3 mt-5">
          <button className="btn-ghost" disabled={k === 0} onClick={() => setK(k - 1)}><Icon name="back" size={20} />Trước</button>
          {k < items.length - 1 ? <button className="btn-primary min-w-[150px]" onClick={() => setK(k + 1)}>Tiếp<Icon name="next" size={20} /></button>
            : <button className="btn-primary min-w-[150px]" onClick={() => setPhase('quiz')}>Luyện tập ngay</button>}
        </div>
        <p className="muted text-sm text-center mt-3">Bài kiểm tra cuối bài có {items.length} câu, mỗi mục ít nhất một câu. Cần đúng 70% để qua.</p>
      </>)}
      {phase === 'done' && res && (
        <Celebrate open title={res.stars ? (station ? 'Vượt trạm thành công!' : 'Hoàn thành bài học!') : 'Gần được rồi!'} mood={res.stars ? 'cheer' : 'sad'} stars={res.stars}
          sub={`Đúng ${res.score}/${res.total} câu (${Math.round(res.acc * 100)}%).` + (res.stars ? (res.first ? '' : res.improved ? ' Bạn đã tăng số sao!' : ' Bạn đã qua bài này trước đó, XP chỉ cộng khi tăng sao.') : ` Cần ${Math.round(pass * 100)}% để qua.`)} xp={res.xp}
          actions={<>{res.stars ? <button className="btn-primary" onClick={onExit}>Về lộ trình</button> : <button className="btn-primary" onClick={retry}>Làm lại</button>}
            {res.stars ? res.stars < 3 && <button className="btn-ghost" onClick={retry}>Luyện lại để thêm sao</button> : !station && <button className="btn-ghost" onClick={() => { setRes(null); setK(0); setPhase('learn') }}>Học lại bài</button>}</>} />
      )}
    </div>
  )
}
