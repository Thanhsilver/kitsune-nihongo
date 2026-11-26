import { useStore, levelOf, streakOf, BADGES, setState, SKILL_NAME } from '../lib/store.js'
import { ITEMS } from '../data/items.js'
import { mastered, viewedCount } from '../lib/progress.js'
import { REGIONS } from '../data/lessons.js'
import { daysAgo, today, cx } from '../lib/util.js'
import { PageHead, Bar, Ring, Medal, Chips } from '../components/ui.jsx'
import Icon from '../components/Icons.jsx'

export default function Stats() {
  const s = useStore()
  const lv = levelOf(s.xp), st = streakOf(s.days), td = s.xpDays[today()] || 0
  const set = new Set(s.days)
  const weeks = 14, cells = Array.from({ length: weeks * 7 }, (_, i) => { const back = weeks * 7 - 1 - i; const k = daysAgo(back); return { k, v: s.xpDays[k] || 0, on: set.has(k) } })
  const last7 = Array.from({ length: 7 }, (_, i) => { const k = daysAgo(6 - i); return { k, v: s.xpDays[k] || 0, d: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(k).getDay()] } })
  const mx = Math.max(s.goal, ...last7.map(x => x.v))
  const acc = s.stats.ans ? Math.round(s.stats.ok / s.stats.ans * 100) : 0
  const lessonsDone = Object.keys(s.lessons).length, lessonsAll = REGIONS.reduce((a, r) => a + r.nodes.filter(n => n.kind !== 'chest').length, 0)
  const groups = [['Hiragana', ITEMS.filter(i => i.type === 'kana' && i.cat === 'h')], ['Katakana', ITEMS.filter(i => i.type === 'kana' && i.cat === 'k')], ['Kanji N5', ITEMS.filter(i => i.type === 'kanji' && i.lv === 'n5')], ['Kanji N4', ITEMS.filter(i => i.type === 'kanji' && i.lv === 'n4')], ['Từ vựng N5', ITEMS.filter(i => i.type === 'word' && i.lv === 'n5')], ['Từ vựng N4', ITEMS.filter(i => i.type === 'word' && i.lv === 'n4')]]
  const heat = v => v === 0 ? 'bg-ink/5 dark:bg-white/5' : v < s.goal / 2 ? 'bg-sakura-200' : v < s.goal ? 'bg-sakura' : 'bg-primary'
  return (
    <div className="space-y-6">
      <PageHead title="Thành tích" sub="XP, chuỗi ngày, huy hiệu và tiến độ học của bạn." mood="cheer" />
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-5"><div className="flex items-center gap-2 muted text-sm"><Icon name="star" size={22} />Cấp độ</div><div className="font-head text-[34px] mt-1">Cấp {lv.level}</div><Bar value={lv.into} max={lv.need} className="mt-2" /><p className="muted text-sm mt-1 tabular-nums">{lv.into}/{lv.need} XP · tổng {s.xp} XP</p></div>
        <div className="card p-5"><div className="flex items-center gap-2 muted text-sm"><Icon name="flame" size={22} />Chuỗi ngày</div><div className="font-head text-[34px] mt-1">{st} ngày</div><p className="muted text-sm mt-1">Tổng {s.days.length} ngày đã học</p></div>
        <div className="card p-5 flex items-center gap-3"><Ring value={td} max={s.goal} size={72} stroke={9}><b className="font-head">{Math.min(100, Math.round(td / s.goal * 100))}%</b></Ring><div><div className="muted text-sm">Mục tiêu hôm nay</div><div className="font-head text-xl">{td}/{s.goal} XP</div></div></div>
        <div className="card p-5"><div className="flex items-center gap-2 muted text-sm"><Icon name="target" size={22} />Độ chính xác</div><div className="font-head text-[34px] mt-1">{acc}%</div><p className="muted text-sm mt-1">{s.stats.ok}/{s.stats.ans} câu đúng · {lessonsDone}/{lessonsAll} bài</p></div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5 sm:p-6">
          <h2 className="text-[20px]">XP 7 ngày qua</h2>
          <div className="flex items-end gap-2 sm:gap-3 h-44 mt-4 relative">
            <div className="absolute inset-x-0 border-t-2 border-dashed border-primary/40" style={{ bottom: 24 + s.goal / mx * 120 }}><span className="absolute right-0 -top-5 text-xs text-primary font-bold">mục tiêu {s.goal}</span></div>
            {last7.map(x => <div key={x.k} className="flex-1 flex flex-col items-center justify-end gap-1 h-full"><span className="text-xs tabular-nums muted">{x.v || ''}</span><div className={cx('w-full rounded-xl', x.v >= s.goal ? 'bg-primary' : 'bg-sakura')} style={{ height: Math.max(6, x.v / mx * 120) }} /><span className="text-xs muted h-4">{x.d}</span></div>)}
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="text-[20px]">Lịch học {weeks} tuần</h2>
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 mt-4 overflow-x-auto pb-1" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(14px,1fr))` }}>
            {cells.map(c => <div key={c.k} title={`${c.k}: ${c.v} XP`} className={cx('aspect-square rounded-[5px]', heat(c.v), c.k === today() && 'ring-2 ring-primary')} />)}
          </div>
          <div className="flex items-center gap-2 text-xs muted mt-3">Ít<span className="w-3.5 h-3.5 rounded bg-ink/5 dark:bg-white/5" /><span className="w-3.5 h-3.5 rounded bg-sakura-200" /><span className="w-3.5 h-3.5 rounded bg-sakura" /><span className="w-3.5 h-3.5 rounded bg-primary" />Đạt mục tiêu</div>
          <div className="mt-4 flex flex-wrap items-center gap-3"><span className="font-head font-bold">Mục tiêu mỗi ngày</span><Chips items={[[20, '20 XP'], [50, '50 XP'], [100, '100 XP'], [150, '150 XP']]} value={s.goal} onChange={v => setState(() => ({ goal: v }))} /></div>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-[20px]">Huy hiệu <span className="muted text-base font-body font-normal">· {Object.keys(s.badges).length}/{BADGES.length}</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
          {BADGES.map(b => { const got = s.badges[b.id]; return <div key={b.id} className={cx('rounded-3xl p-3 text-center', got ? 'bg-sakura-50 dark:bg-primary/10' : 'bg-ink/[.03] dark:bg-white/5')}><Medal b={b} size={68} locked={!got} /><b className="font-head text-[14px] block mt-1 leading-tight">{b.name}</b><span className="muted text-xs block mt-0.5">{got ? 'Đạt ' + got.split('-').reverse().join('/') : b.desc}</span></div> })}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-[20px]">Tiến độ theo nhóm</h2>
        <p className="muted text-sm mt-1">Màu hồng nhạt: đã xem. Màu xanh: thành thạo (nhận diện đúng nhiều lần theo lịch ôn).</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {groups.map(([n, l]) => <div key={n}><div className="flex justify-between font-head font-bold"><span>{n}</span><span className="muted tabular-nums">{mastered(s, l)}/{l.length}</span></div><div className="h-3 rounded-full bg-ink/5 dark:bg-white/10 mt-2 relative overflow-hidden"><div className="absolute inset-y-0 left-0 bg-sakura-200 rounded-full" style={{ width: viewedCount(s, l) / l.length * 100 + '%' }} /><div className="absolute inset-y-0 left-0 bg-matcha-600 rounded-full" style={{ width: mastered(s, l) / l.length * 100 + '%' }} /></div><p className="muted text-xs mt-1">{viewedCount(s, l)} đã xem · {mastered(s, l)} thành thạo</p></div>)}
        </div>
        <h3 className="text-lg mt-6">Theo kỹ năng</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">{['recog', 'listen', 'recall', 'speak'].map(k => { const m = k === 'recog' ? s.box : Object.fromEntries(Object.entries(s.sk[k] || {}).map(([id, v]) => [id, v[0]])); const n = Object.keys(m).length, good = Object.values(m).filter(b => b >= 3).length; return <div key={k} className="rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4"><div className="font-head font-bold">{SKILL_NAME[k]}</div><div className="text-2xl font-head mt-1 tabular-nums">{good}<span className="muted text-base">/{n}</span></div><div className="muted text-xs">thành thạo / đã luyện</div></div> })}</div>
      </section>
    </div>
  )
}
