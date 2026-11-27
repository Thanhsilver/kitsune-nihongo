import { useEffect, useMemo, useState } from 'react'
import { ITEMS, CAT_NAMES, TOPICS } from '../data/items.js'
import { useStore, setSetting, answer, getState, statusOf, markViewed } from '../lib/store.js'
import { speak } from '../lib/audio.js'
import { cx, rnd } from '../lib/util.js'
import { PageHead, Chips, SpeakBtn, Bar } from '../components/ui.jsx'
import Illus from '../components/Illus.jsx'
import Icon from '../components/Icons.jsx'

export default function Vocab() {
  const s = useStore(), lv = s.settings.lv === 'n4' ? 'n4' : 'n5'
  const [cat, setCat] = useState('all'), [tp, setTp] = useState('all'), [q, setQ] = useState(''), [front, setFront] = useState('jp'), [view, setView] = useState('cards')
  const deck = useMemo(() => ITEMS.filter(i => i.type === 'word' && i.lv === lv && (cat === 'all' || i.cat === cat) && (tp === 'all' || i.tp === tp)), [lv, cat, tp])
  const qn = q.trim().toLowerCase(), shownList = qn ? deck.filter(w => [w.w, w.h, w.r, w.m, w.hv].some(x => x && x.toLowerCase().includes(qn))) : deck
  const [cur, setCur] = useState(null), [flip, setFlip] = useState(false)
  const box = id => getState().box[id] || 0
  const pick = (avoid) => { if (!deck.length) return; const min = Math.min(...deck.map(w => box(w.id))); let pool = deck.filter(w => box(w.id) <= min + 1 && w.id !== avoid); if (!pool.length) pool = deck; const lo = Math.min(...pool.map(w => box(w.id))); const c = pool.filter(w => box(w.id) === lo); setCur(c[rnd(c.length)]); setFlip(false) }
  useEffect(() => { pick() }, [deck])
  const grade = ok => { if (!cur) return; answer(cur.id, ok, 'recog'); pick(cur.id) }
  useEffect(() => { const k = e => { if (view !== 'cards' || e.target.tagName === 'INPUT') return; if (e.key === ' ') { e.preventDefault(); setFlip(f => !f) } else if (e.key === '1') grade(false); else if (e.key === '2') grade(true) }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) })
  useEffect(() => { if (flip && cur && front === 'vi') speak(cur.say); if (flip && cur) markViewed([cur.id]) }, [flip])
  const cats = [['all', 'Tất cả'], ...Object.entries(CAT_NAMES).filter(([k]) => ITEMS.some(i => i.type === 'word' && i.lv === lv && i.cat === k))]
  const m = deck.filter(w => statusOf(s, w.id) === 'mastered').length, learning = deck.filter(w => statusOf(s, w.id) === 'learning').length, viewedN = deck.filter(w => statusOf(s, w.id) === 'viewed').length
  const c = cur
  const JP = () => <><div className="jp text-[54px] sm:text-[64px] font-medium leading-tight">{c.w}</div>{c.k && <div className="jp text-xl muted">{c.h}</div>}</>
  return (
    <div>
      <PageHead title="Từ vựng" sub="Lật thẻ để xem nghĩa, câu ví dụ và nghe phát âm." mood="happy"
        right={<Chips items={[['cards', 'Thẻ ghi nhớ'], ['list', 'Danh sách']]} value={view} onChange={setView} />} />
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <Chips items={[['n5', 'N5'], ['n4', 'N4']]} value={lv} onChange={v => { setSetting('lv', v); setCat('all'); setTp('all') }} />
        {lv === 'n5' && <select value={tp} onChange={e => setTp(e.target.value)} aria-label="Chủ đề" className="min-h-[44px] rounded-2xl border-2 border-ink/10 dark:border-night-line bg-white dark:bg-night px-3 font-head font-bold">
          <option value="all">Tất cả chủ đề ({ITEMS.filter(i => i.type === 'word' && i.lv === 'n5').length} từ)</option>
          {TOPICS.map(([id, name]) => <option key={id} value={id}>{name} ({ITEMS.filter(i => i.type === 'word' && i.tp === id && i.lv === 'n5').length})</option>)}
        </select>}
        <span className="w-px h-8 bg-ink/10 hidden sm:block" />
        <Chips items={cats} value={cat} onChange={setCat} />
      </div>
      {view === 'list' ? (<>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm từ: tiếng Nhật, romaji hoặc nghĩa…" className="w-full sm:max-w-md mb-4 min-h-[48px] rounded-2xl border-2 border-sakura-200 dark:border-night-line bg-white dark:bg-night px-4 outline-none focus:border-primary" />
        {!shownList.length && <p className="muted">Không tìm thấy từ nào.</p>}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {shownList.map(w => (
            <button key={w.id} type="button" onClick={() => speak(w.say)} className="card p-4 text-left flex gap-3 items-center hover:-translate-y-0.5 transition">
              {w.icon && <div className="rounded-2xl bg-cream dark:bg-white/90 shrink-0"><Illus id={w.icon} size={64} /></div>}
              <div className="min-w-0"><div className="jp text-2xl">{w.w}</div><div className="text-sm muted">{w.k ? w.h + ' · ' : ''}{w.r}</div><div className="font-semibold">{w.m}</div></div>
              {statusOf(s, w.id) === 'mastered' && <span className="ml-auto self-start w-2.5 h-2.5 rounded-full bg-matcha-600 shrink-0" title="Thành thạo" />}
            </button>
          ))}
        </div></>
      ) : c && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
          <div>
            <div className={cx('flip relative h-[460px] sm:h-[480px] cursor-pointer select-none', flip && 'on')} onClick={() => setFlip(!flip)} role="button" tabIndex={0} aria-label="Lật thẻ" onKeyDown={e => { if (e.key === 'Enter') setFlip(!flip) }}>
              <div className="flip-inner absolute inset-0">
                <div className="face absolute inset-0 card flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute top-5 left-5 flex gap-1.5">{[0, 1, 2, 3].map(i => <i key={i} className={cx('w-3 h-3 rounded-full border-2 border-primary', i < (s.box[c.id] || 0) && 'bg-primary')} />)}</div>
                  <span className="absolute top-4 right-4 chip !min-h-[30px] !px-3 text-xs">{CAT_NAMES[c.cat]}</span>
                  {front === 'jp' ? <>{c.icon && <div className="rounded-4xl bg-cream dark:bg-white/90 p-2 mb-4"><Illus id={c.icon} size={130} /></div>}<JP /></>
                    : <>{c.icon && <div className="rounded-4xl bg-cream dark:bg-white/90 p-2 mb-4"><Illus id={c.icon} size={130} /></div>}<div className="font-head text-[36px]">{c.m}</div><p className="muted mt-2">Nhớ ra từ tiếng Nhật rồi lật thẻ</p></>}
                  <p className="muted text-sm absolute bottom-5">Chạm để lật thẻ</p>
                </div>
                <div className="face face-b absolute inset-0 card flex flex-col items-center justify-center p-6 text-center">
                  {front === 'jp' ? <><div className="text-primary font-head font-extrabold text-xl">{c.r}</div><div className="font-head text-[34px] leading-tight">{c.m}</div>{c.hv && <div className="muted">Hán Việt: {c.hv}</div>}</> : <><JP /><div className="text-primary font-head font-extrabold text-xl mt-1">{c.r}</div></>}
                  <div className="mt-2"><SpeakBtn text={c.say} size="lg" /></div>
                  {c.ex && <div className="mt-4 w-full max-w-md rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4 text-left flex gap-2 items-start"><div className="flex-1"><div className="jp text-[19px]">{c.ex.jp.replaceAll('|', '')}</div><div className="jp text-sm muted">{c.ex.rd}</div><div className="mt-1 text-[15px]">{c.ex.vi}</div></div><SpeakBtn text={c.ex.rd} label="Nghe câu ví dụ" /></div>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="btn-ghost !text-primary !border-primary/40" onClick={() => grade(false)}>Chưa nhớ</button>
              <button className="btn-matcha" onClick={() => grade(true)}>Nhớ rồi</button>
            </div>
            <p className="muted text-sm text-center mt-3 hidden sm:block">Space lật thẻ · 1 chưa nhớ · 2 nhớ rồi</p>
          </div>
          <aside className="space-y-4">
            <div className="card p-5"><h3 className="text-lg mb-3">Mặt trước</h3><Chips items={[['jp', 'Tiếng Nhật'], ['vi', 'Tiếng Việt']]} value={front} onChange={v => { setFront(v); setFlip(false) }} /></div>
            <div className="card p-5 space-y-3">
              <h3 className="text-lg">Tiến độ bộ thẻ</h3>
              {[['Chưa học', deck.length - m - learning - viewedN, 'bg-ink/20'], ['Đã xem', viewedN, 'bg-sakura-200'], ['Đang học', learning, 'bg-sakura'], ['Thành thạo', m, 'bg-matcha-600']].map(([l, v, col]) => <div key={l}><div className="flex justify-between text-sm"><span>{l}</span><b className="tabular-nums">{v}</b></div><Bar value={v} max={deck.length} color={col} className="mt-1 !h-2.5" /></div>)}
              <p className="muted text-sm">Thẻ “chưa nhớ” sẽ quay lại sớm hơn.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
