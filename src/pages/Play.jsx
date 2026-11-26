import { useEffect, useState } from 'react'
import { ITEMS, hasMN } from '../data/items.js'
import { useStore, getState, setState, bumpStat, seen, dueList, SKILL_NAME } from '../lib/store.js'
import { makeQ, planQuiz, typesFor } from '../lib/quiz.js'
import { BY_ID } from '../data/items.js'
import { micOn } from '../lib/mic.js'
import { shuffle, cx } from '../lib/util.js'
import { PageHead, Chips, Celebrate } from '../components/ui.jsx'
import Quiz from '../components/Quiz.jsx'
import { MatchGame, SortGame } from '../components/Games.jsx'
import Icon from '../components/Icons.jsx'
import Mascot from '../components/Mascot.jsx'
import { useMic } from '../lib/mic.js'

const GAMES = [
  ['match', 'Ghép từ', 'Ghép 6 cặp chữ và nghĩa thật nhanh.', 'puzzle', 'bg-matcha-50 dark:bg-matcha/10'],
  ['imgpick', 'Chọn hình đúng', 'Đọc từ, chọn hình minh họa đúng.', 'image', 'bg-sakura-50 dark:bg-primary/10'],
  ['listen', 'Nghe & đoán từ', 'Nghe phát âm rồi chọn chữ đúng.', 'ear', 'bg-[#E8EEFF] dark:bg-[#232a45]'],
  ['sort', 'Sắp xếp câu', 'Xếp các cụm thành câu tiếng Nhật.', 'sort', 'bg-[#FFF3CC] dark:bg-[#3a3214]'],
  ['type', 'Gõ lại từ trí nhớ', 'Tự nhớ ra rồi gõ đáp án.', 'keyboard', 'bg-sakura-50 dark:bg-primary/10'],
  ['pic', 'Nhìn hình đoán chữ', 'Đoán chữ từ hình gợi nhớ, chữ Hán gốc hoặc các bộ ghép.', 'kanji', 'bg-matcha-50 dark:bg-matcha/10'],
  ['speak', 'Luyện phát âm', 'Đọc to, app nghe và chấm điểm phát âm.', 'mic', 'bg-sakura-50 dark:bg-primary/10'],
  ['mix', 'Trắc nghiệm tổng hợp', '15 câu trộn mọi dạng bài.', 'quiz', 'bg-[#FFF3CC] dark:bg-[#3a3214]'],
]
const poolOf = lv => lv === 'nm' ? ITEMS.filter(i => i.type === 'kana') : ITEMS.filter(i => i.lv === lv)
// Câu hỏi ôn tập theo đúng kỹ năng đến hạn
const SK_TYPES = { recog: ['mc', 'rev', 'pic', 'img', 'imgpick'], listen: ['listen'], recall: ['type', 'sort'], speak: ['speak'] }
const reviewQ = ({ id, sk }) => { const c = BY_ID[id]; if (!c) return null; const ok = typesFor(c).filter(t => SK_TYPES[sk].includes(t)); if (!ok.length) return null; return makeQ(c, shuffle(ok)[0]) }
const wordsOf = lv => ITEMS.filter(i => i.type === 'word' && i.lv === (lv === 'nm' ? 'n5' : lv))
const weak = (list, n) => shuffle(list).sort((a, b) => (getState().box[a.id] || 0) - (getState().box[b.id] || 0)).slice(0, Math.min(list.length, n * 2)).sort(() => Math.random() - .5).slice(0, n)
export default function Play() {
  const s = useStore(), mic = useMic()
  const [lv, setLv] = useState(s.settings.lv || 'nm')
  const [run, setRun] = useState(null), [res, setRes] = useState(null)
  const due = dueList(s).filter(d => BY_ID[d.id] && (d.sk !== 'speak' || micOn()))
  const bySk = due.reduce((a, d) => (a[d.sk] = (a[d.sk] || 0) + 1, a), {})
  const start = g => {
    let r
    if (g === 'review') { const d = shuffle(due).slice(0, 20).map(reviewQ).filter(Boolean); const nw = d.length >= 10 ? [] : planQuiz(shuffle(poolOf(lv).filter(i => !seen(getState(), i.id))).slice(0, 10 - d.length)); r = { g, qs: [...d, ...nw] } }
    else if (g === 'match') r = { g, items: weak(poolOf(lv).filter(i => i.type !== 'kana' || i.cat === (s.settings.script || 'h')), 6) }
    else if (g === 'sort') r = { g, words: shuffle(wordsOf(lv).filter(w => w.ex && w.ex.jp.includes('|'))).slice(0, 6) }
    else if (g === 'listen' || g === 'type') r = { g, qs: weak(poolOf(lv), 10).map(c => makeQ(c, g)) }
    else if (g === 'imgpick') r = { g, qs: weak(wordsOf(lv).filter(w => w.icon), 10).map(c => makeQ(c, 'imgpick')) }
    else if (g === 'pic') r = { g, qs: weak(poolOf(lv).filter(hasMN), 10).map(c => makeQ(c, 'pic')) }
    else if (g === 'mix') r = { g, qs: planQuiz(weak(poolOf(lv), 15)) }
    else if (g === 'speak') { if (mic !== 'ready') return; r = { g, qs: weak(poolOf(lv), 10).map(c => makeQ(c, 'speak')) } }
    else r = { g, qs: weak(poolOf(lv), 10).map(c => makeQ(c, g)) }
    if (r.qs && !r.qs.length) return
    setRun(r)
  }
  useEffect(() => { const p = window.__params; if (p && p.start) { window.__params = null; start(p.start) } }, [])
  const done = r => { const best = { ...(getState().best || {}) }; if (r.total) { const pct = Math.round(r.score / r.total * 100); best[run.g] = Math.max(best[run.g] || 0, pct); if (pct === 100) bumpStat('perfect') } setState(() => ({ best })); setRes({ ...r, g: run.g }); setRun(null) }
  if (run) {
    if (run.g === 'match') return <MatchGame items={run.items} onExit={() => setRun(null)} onFinish={r => { setRes({ ...r, g: 'match' }); setRun(null) }} />
    if (run.g === 'sort') return <SortGame words={run.words} onExit={() => setRun(null)} onFinish={done} />
    return <Quiz questions={run.qs} title={run.g === 'review' ? 'Ôn tập' : GAMES.find(x => x[0] === run.g)?.[1]} onExit={() => setRun(null)} onFinish={done} />
  }
  const best = s.best || {}
  return (
    <div>
      <PageHead title="Trò chơi & Quiz" sub="Chơi mà học: mỗi câu đúng đều được tính vào lịch ôn tập." mood="cheer" />
      <div className="card p-5 sm:p-6 mb-6 grid sm:grid-cols-[auto_1fr_auto] items-center gap-5 bg-gradient-to-r from-sakura-50 to-white dark:from-primary/10 dark:to-night-card">
        <Mascot mood={due.length ? 'think' : 'happy'} size={96} className="mx-auto" />
        <div><h2 className="text-[24px]">Ôn tập hôm nay</h2><p className="muted mt-1">{due.length ? <>Có <b className="text-primary">{due.length}</b> lượt ôn đến hạn. Ôn đúng lúc sắp quên giúp nhớ lâu nhất.</> : 'Không có mục nào đến hạn. Học thêm vài mục mới nhé!'}</p>
          {due.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{Object.entries(bySk).map(([k, v]) => <span key={k} className="chip !min-h-[30px] !px-3 text-sm">{SKILL_NAME[k]}: {v}</span>)}</div>}</div>
        <button className="btn-primary min-w-[170px]" onClick={() => start('review')}><Icon name="review" size={22} />{due.length ? 'Bắt đầu ôn' : 'Học mục mới'}</button>
      </div>
      <div className="flex items-center gap-3 mb-4 flex-wrap"><span className="font-head font-bold">Cấp độ:</span><Chips items={[['nm', 'Nhập môn (Kana)'], ['n5', 'N5'], ['n4', 'N4']]} value={lv} onChange={setLv} /></div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {GAMES.map(([id, t, d, ic, bg]) => (
          <button key={id} type="button" onClick={() => start(id)} disabled={id === 'speak' && mic !== 'ready'} className={cx('disabled:opacity-60 disabled:hover:translate-y-0 rounded-4xl p-5 text-left border border-ink/5 dark:border-night-line shadow-soft hover:-translate-y-1 transition flex gap-4 items-start', bg)}>
            <span className="w-14 h-14 rounded-2xl bg-white dark:bg-night grid place-items-center shrink-0 shadow-pop"><Icon name={ic} size={34} /></span>
            <span className="flex-1"><b className="font-head text-[18px] block">{t}</b><span className="muted text-sm block mt-1">{d}</span>
              <span className="text-xs font-head font-bold text-primary mt-2 block">{id === 'speak' && mic !== 'ready' ? (mic === 'checking' ? 'Đang kiểm tra micro…' : mic === 'denied' ? 'Micro chưa được cho phép' : 'Không thu âm được ở thiết bị này') : id === 'match' ? (s.stats.matchBest ? `Kỷ lục: ${s.stats.matchBest}s` : 'Chưa chơi') : best[id] !== undefined ? `Tốt nhất: ${best[id]}%` : 'Chưa chơi'}</span></span>
          </button>
        ))}
      </div>
      <Celebrate open={!!res} onClose={() => setRes(null)}
        title={res?.g === 'match' ? (res.record ? 'Kỷ lục mới!' : 'Ghép xong!') : res && res.score === res.total ? 'Hoàn hảo!' : 'Hoàn thành!'}
        mood={res && (res.g === 'match' || res.score / res.total >= .7) ? 'cheer' : 'happy'}
        sub={res?.g === 'match' ? `${res.secs.toFixed(1)} giây · ${res.miss} lần ghép sai` : res && `Đúng ${res.score}/${res.total}. Mục sai sẽ quay lại trong lịch ôn.`} />
    </div>
  )
}
