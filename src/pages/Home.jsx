import { useStore, levelOf, streakOf } from '../lib/store.js'
import { nextNode, dueItems, mastered, viewedCount } from '../lib/progress.js'
import { ITEMS } from '../data/items.js'
import { today, daysAgo } from '../lib/util.js'
import Mascot from '../components/Mascot.jsx'
import Icon from '../components/Icons.jsx'
import { Ring, Bar } from '../components/ui.jsx'
import { go } from '../App.jsx'
import { GuestBanner } from '../components/Auth.jsx'

const hello = () => { const h = new Date().getHours(); return h < 11 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối' }
const TILES = [
  ['kana', 'Bảng chữ cái', 'Hiragana, Katakana, thứ tự nét', 'kana', 'bg-sakura-100 dark:bg-primary/15'],
  ['vocab', 'Từ vựng', 'Flashcard có hình và câu ví dụ', 'cards', 'bg-matcha-50 dark:bg-matcha/10'],
  ['write', 'Luyện viết', 'App chấm từng nét bạn viết', 'brush', 'bg-[#FFF3CC] dark:bg-[#3a3214]'],
  ['grammar', 'Ngữ pháp N5', '26 mẫu câu, ví dụ có audio', 'grammar', 'bg-[#E8EEFF] dark:bg-[#232a45]'],
]
export default function Home({ openLesson }) {
  const s = useStore()
  const nx = nextNode(s), due = dueItems(s).length, st = streakOf(s.days), lv = levelOf(s.xp), td = s.xpDays[today()] || 0
  const week = Array.from({ length: 7 }, (_, i) => { const k = daysAgo(6 - i); return { k, v: s.xpDays[k] || 0, d: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(k).getDay()] } })
  const mx = Math.max(s.goal, ...week.map(w => w.v))
  return (
    <div className="space-y-6">
      <GuestBanner />
      <section className="card overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-sakura-100 dark:bg-primary/10" />
        <div className="absolute right-24 bottom-[-60px] w-40 h-40 rounded-full bg-matcha-50 dark:bg-matcha/10" />
        <div className="relative grid sm:grid-cols-[1fr_auto] items-center gap-4 p-6 sm:p-8">
          <div>
            <p className="font-head font-bold text-primary">{hello()}{s.name ? ', ' + s.name : ''}! こんにちは</p>
            <h1 className="text-[30px] sm:text-[40px] leading-tight mt-1">Hôm nay mình học gì nào?</h1>
            <p className="muted mt-2 max-w-lg">{nx ? <>Bài tiếp theo trên lộ trình: <b className="text-ink dark:text-white">{nx.node.title}</b> ({nx.region.name}).</> : 'Bạn đã hoàn thành mọi bài đang có. Ôn tập để nhớ lâu nhé!'}</p>
            <div className="flex flex-wrap gap-3 mt-5">
              {nx && <button className="btn-primary" onClick={() => nx.node.kind === 'chest' ? go('map') : openLesson(nx.node.id)}><Icon name="play" size={22} />{nx.node.kind === 'lesson' ? 'Học tiếp' : nx.node.kind === 'station' ? 'Vào thử thách' : nx.node.kind === 'guide' ? 'Đọc hướng dẫn' : 'Mở rương'}</button>}
              <button className="btn-soft" onClick={() => go('games', { start: 'review' })}><Icon name="review" size={22} />Ôn tập {due > 0 && <span className="rounded-full bg-primary text-white text-sm px-2">{due}</span>}</button>
            </div>
          </div>
          <Mascot mood="wave" size={170} className="justify-self-center animate-floaty" />
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <Ring value={td} max={s.goal} size={96}><div><b className="font-head text-xl">{td}</b><div className="text-xs muted">/{s.goal} XP</div></div></Ring>
          <div><h3 className="text-lg">Mục tiêu hôm nay</h3><p className="muted text-sm">{td >= s.goal ? 'Hoàn thành rồi, tuyệt quá!' : `Còn ${s.goal - td} XP nữa`}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-[96px] h-[96px] rounded-full bg-[#FFEBDD] dark:bg-[#3d2a1f] grid place-items-center"><Icon name="flame" size={56} /></div>
          <div><h3 className="text-lg">{st} ngày liên tiếp</h3><p className="muted text-sm">{st ? 'Giữ lửa bằng một bài nhỏ mỗi ngày.' : 'Học một bài để bắt đầu chuỗi.'}</p></div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2"><Icon name="star" size={28} /><h3 className="text-lg">Cấp {lv.level}</h3><span className="ml-auto muted text-sm tabular-nums">{s.xp} XP</span></div>
          <Bar value={lv.into} max={lv.need} className="mt-3" />
          <p className="muted text-sm mt-2">Còn {lv.need - lv.into} XP để lên cấp {lv.level + 1}</p>
          <div className="flex items-end gap-1.5 h-12 mt-3">{week.map(w => <div key={w.k} className="flex-1 flex flex-col items-center gap-1"><div className={'w-full rounded-md ' + (w.v >= s.goal ? 'bg-primary' : 'bg-sakura')} style={{ height: Math.max(4, w.v / mx * 36) }} /><span className="text-[10px] muted">{w.d}</span></div>)}</div>
        </div>
      </section>

      <section>
        <h2 className="text-[22px] mb-3">Khám phá</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TILES.map(([id, t, d, ic, bg]) => (
            <a key={id} href={'#' + id} className={'rounded-3xl p-5 border border-ink/5 dark:border-night-line hover:-translate-y-1 transition shadow-soft ' + bg}>
              <Icon name={ic} size={44} /><h3 className="text-[18px] mt-3">{t}</h3><p className="muted text-sm mt-1">{d}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[['Kana', ITEMS.filter(i => i.type === 'kana')], ['Kanji', ITEMS.filter(i => i.type === 'kanji')], ['Từ vựng', ITEMS.filter(i => i.type === 'word')], ['Ngữ pháp', ITEMS.filter(i => i.type === 'grammar')]].map(([n, l]) => (
          <div key={n}><div className="flex justify-between font-head font-bold"><span>{n}</span><span className="muted tabular-nums">{mastered(s, l)}/{l.length}</span></div>
            <div className="h-3 rounded-full bg-ink/5 dark:bg-white/10 mt-2 relative overflow-hidden"><div className="absolute inset-y-0 left-0 bg-sakura-200 rounded-full" style={{ width: viewedCount(s, l) / l.length * 100 + '%' }} /><div className="absolute inset-y-0 left-0 bg-matcha-600 rounded-full" style={{ width: mastered(s, l) / l.length * 100 + '%' }} /></div>
            <p className="muted text-xs mt-1">{viewedCount(s, l)} đã xem · {mastered(s, l)} thành thạo</p></div>
        ))}
      </section>
    </div>
  )
}
