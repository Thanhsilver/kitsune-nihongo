import { useState } from 'react'
import { REGIONS } from '../data/lessons.js'
import { BY_ID } from '../data/items.js'
import { useStore, setState, setSetting, addXP } from '../lib/store.js'
import { nodeDone, unlocked, regionProgress, regionOpen, nodeMastered } from '../lib/progress.js'
import { REQUIRE } from '../data/lessons.js'
import Placement from '../components/Placement.jsx'
import { cx } from '../lib/util.js'
import Icon from '../components/Icons.jsx'
import Illus, { ILL } from '../components/Illus.jsx'
import Mascot from '../components/Mascot.jsx'
import { Bar, PageHead, Celebrate } from '../components/ui.jsx'

const OFF = [0, 70, 100, 70, 0, -70, -100, -70], ROW = 132, W = 360
const Deco = ({ kind, x, y }) => (
  <svg viewBox="0 0 60 60" width="60" height="60" className="absolute opacity-90 pointer-events-none" style={{ left: x, top: y }} aria-hidden="true">
    {kind === 'tree' && <><path d="M28 40 L27 56 L33 56 L32 40Z" fill="#B9825A" stroke="#303345" strokeWidth="2" /><circle cx="30" cy="28" r="16" fill="#7CC4A0" stroke="#303345" strokeWidth="2" /></>}
    {kind === 'sakura' && <><path d="M28 40 L27 56 L33 56 L32 40Z" fill="#B9825A" stroke="#303345" strokeWidth="2" /><circle cx="30" cy="28" r="16" fill="#FFB7C5" stroke="#303345" strokeWidth="2" /><circle cx="24" cy="24" r="3" fill="#fff" /><circle cx="36" cy="31" r="2.5" fill="#fff" /></>}
    {kind === 'torii' && <><path d="M8 18 Q30 10 52 18" fill="none" stroke="#E85D75" strokeWidth="6" strokeLinecap="round" /><path d="M14 26 H46" stroke="#E85D75" strokeWidth="4" /><path d="M18 18 V54 M42 18 V54" stroke="#E85D75" strokeWidth="5" strokeLinecap="round" /></>}
    {kind === 'cloud' && <path d="M10 40 Q6 28 18 28 Q20 18 32 20 Q44 16 46 30 Q56 30 52 40Z" fill="#fff" stroke="#303345" strokeWidth="2" />}
    {kind === 'lantern' && <><path d="M30 6 V12" stroke="#303345" strokeWidth="2" /><ellipse cx="30" cy="30" rx="13" ry="18" fill="#FFB38A" stroke="#303345" strokeWidth="2" /><path d="M20 22 H40 M18 30 H42 M20 38 H40" stroke="#E85D75" strokeWidth="1.6" /></>}
  </svg>
)
function NodeBtn({ n, state, stars, onClick, crown }) {
  const icon = n.kind === 'guide' ? <Icon name="guide" size={40} /> : n.kind === 'station' ? <Icon name="flag" size={38} /> : n.kind === 'chest' ? <Icon name="chest" size={42} /> : ILL[n.icon] ? <Illus id={n.icon} size={50} /> : <span className="jp text-[30px] font-bold">{n.icon}</span>
  return (
    <button type="button" onClick={onClick} disabled={state === 'locked'} aria-label={n.title}
      className={cx('relative w-[78px] h-[78px] rounded-full grid place-items-center border-[3px] border-b-[7px] transition hover:-translate-y-0.5',
        state === 'done' ? 'bg-matcha border-matcha-600' : state === 'current' ? 'bg-sakura border-primary pulse-ring' : 'bg-[#ECEAF0] dark:bg-night-line border-ink/10 dark:border-night-line grayscale cursor-not-allowed',
        n.kind === 'station' && 'rounded-[28px] w-[86px] h-[86px]')}>
      {state === 'locked' ? <Icon name="lock" size={30} /> : icon}
      {crown && <span className="absolute -top-3 -right-2" title="Đã thành thạo toàn bộ"><Icon name="crown" size={30} /></span>}
      {state === 'done' && n.kind !== 'chest' && <span className="absolute -bottom-4 flex">{[1, 2, 3].map(i => <Icon key={i} name="star" size={18} className={i > stars ? 'opacity-25 grayscale' : ''} />)}</span>}
    </button>
  )
}
export default function Roadmap({ openLesson }) {
  const s = useStore()
  const [rid, setRid] = useState(['nm', 'n5', 'n4'].includes(s.settings.lv) ? s.settings.lv : 'nm')
  const [chest, setChest] = useState(null), [test, setTest] = useState(false)
  const r = REGIONS.find(x => x.id === rid)
  const open_ = regionOpen(s, r), locked = !open_
  const pr = !locked && regionProgress(s, r)
  const curIdx = locked ? -1 : r.nodes.findIndex((n, i) => !nodeDone(s, n) && unlocked(s, r, i))
  if (test) return <Placement region={rid} onExit={() => setTest(false)} onPass={() => { setTest(false); setSetting('lv', rid) }} />
  const open = (n, i) => {
    if (!unlocked(s, r, i)) return
    if (n.kind === 'chest') { if (nodeDone(s, n)) return; setState(st => ({ chests: { ...st.chests, [n.id]: 1 } })); addXP(100); setChest(n); return }
    openLesson(n.id)
  }
  const H = r.nodes.length * ROW + 40
  const pts = r.nodes.map((_, i) => [W / 2 + OFF[i % 8], 40 + i * ROW + 39])
  const path = pts.map((p, i) => i ? `C${pts[i - 1][0]} ${pts[i - 1][1] + ROW / 2} ${p[0]} ${p[1] - ROW / 2} ${p[0]} ${p[1]}` : `M${p[0]} ${p[1]}`).join(' ')
  const cur = curIdx >= 0 ? r.nodes[curIdx] : null
  return (
    <div>
      <PageHead title="Lộ trình JLPT" sub="Mở khóa từng bài, vượt trạm thử thách và nhận rương thưởng." />
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
        {REGIONS.map(x => <button key={x.id} type="button" onClick={() => { setRid(x.id); if (regionOpen(s, x)) setSetting('lv', x.id) }} aria-pressed={rid === x.id} className={cx('chip shrink-0', rid === x.id && 'chip-on')}>{!regionOpen(s, x) && <Icon name="lock" size={18} />}{x.id === 'nm' ? 'Nhập môn' : x.id.toUpperCase()}</button>)}
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 mt-4 items-start">
        <div className="rounded-4xl overflow-hidden border border-ink/5 dark:border-night-line" style={{ background: `linear-gradient(180deg, ${r.color || '#E9E7EF'}55, transparent 60%)` }}>
          {r.soon ? (
            <div className="p-10 text-center"><Mascot mood="sleep" size={150} className="mx-auto" /><h2 className="text-[26px] mt-2">{r.name} đang được xây dựng</h2><p className="muted mt-2 max-w-md mx-auto">Các bài {r.sub.toLowerCase()} sẽ có trong phiên bản sau. Trước mắt hãy chinh phục N5 và N4 nhé.</p></div>
          ) : locked ? (
            <div className="p-8 sm:p-10 text-center"><Mascot mood="think" size={140} className="mx-auto" /><h2 className="text-[26px] mt-2">{r.name} đang khóa</h2>
              <p className="muted mt-2 max-w-md mx-auto">Hoàn thành <b className="text-ink dark:text-white">{REQUIRE[r.id].label}</b> để mở vùng này. Nếu bạn đã biết phần trước, hãy làm bài kiểm tra xếp lớp 20 câu (cần đúng 80%).</p>
              <div className="flex flex-wrap justify-center gap-2 mt-5"><button className="btn-primary" onClick={() => setTest(true)}>Làm bài kiểm tra xếp lớp</button><button className="btn-ghost" onClick={() => setRid(r.id === 'n4' ? 'n5' : 'nm')}>Về vùng trước</button></div></div>
          ) : (
            <div className="relative mx-auto" style={{ width: W, maxWidth: '100%', height: H }}>
              {Array.from({ length: Math.floor(H / 230) }, (_, k) => [['sakura', 'tree', 'torii', 'lantern', 'cloud'][k % 5], k % 2 ? 335 : -65, 60 + k * 230]).map((d, i) => <Deco key={i} kind={d[0]} x={d[1]} y={d[2]} />)}
              <svg className="absolute inset-0" width={W} height={H} aria-hidden="true"><path d={path} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" /><path d={path} fill="none" stroke="#FFB7C5" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" /></svg>
              {r.nodes.map((n, i) => {
                const st = nodeDone(s, n) ? 'done' : unlocked(s, r, i) ? 'current' : 'locked'
                return (
                  <div key={n.id} className="absolute flex flex-col items-center" style={{ left: pts[i][0] - 70, top: pts[i][1] - 39, width: 140 }}>
                    {i === curIdx && <Mascot mood="wave" size={64} className={cx('absolute -top-6', OFF[i % 8] > 0 ? '-left-20 top-2' : '-right-20 top-2')} />}
                    <NodeBtn n={n} state={st} stars={s.lessons[n.id]?.stars || 0} crown={nodeMastered(s, n)} onClick={() => open(n, i)} />
                    <span className={cx('mt-5 text-center text-[13px] font-head font-bold leading-tight px-2 py-0.5 rounded-lg bg-white/85 dark:bg-night/80', st === 'locked' && 'muted')}>{n.title}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-6 space-y-4">
          <div className="card p-5">
            <h2 className="text-[22px]">{r.name}</h2><p className="muted">{r.sub}</p>
            {pr && <><Bar value={pr.done} max={pr.n} className="mt-3" /><p className="muted text-sm mt-1">{pr.done}/{pr.n} trạm đã qua</p></>}
            {cur && <div className="mt-4 rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4">
              <p className="text-sm muted">Trạm tiếp theo</p><h3 className="text-lg">{cur.title}</h3>
              {cur.items && <p className="jp text-lg mt-1 line-clamp-2">{cur.items.slice(0, 10).map(id => BY_ID[id].w).join(' · ')}</p>}
              <button className="btn-primary w-full mt-3" onClick={() => open(cur, curIdx)}>{cur.kind === 'chest' ? 'Mở rương' : cur.kind === 'station' ? 'Vào thử thách' : cur.kind === 'guide' ? 'Đọc hướng dẫn' : 'Bắt đầu học'}</button>
            </div>}
          </div>
          <div className="card p-5 space-y-3 text-sm">
            <h3 className="text-lg">Chú thích</h3>
            <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-sakura border-2 border-primary" />Bài đang mở</div>
            <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-matcha border-2 border-matcha-600" />Đã hoàn thành (1–3 sao)</div>
            <div className="flex items-center gap-3"><Icon name="flag" size={34} />Trạm thử thách: cần đúng 80%</div>
            <div className="flex items-center gap-3"><Icon name="chest" size={34} />Rương thưởng: +100 XP</div>
            <div className="flex items-center gap-3"><Icon name="guide" size={34} />Bài hướng dẫn phát âm</div>
            <div className="flex items-center gap-3"><Icon name="crown" size={34} />Thành thạo: mọi mục trong bài đã nhớ chắc</div>
            <p className="muted">Qua bài là xong lần học đầu. Thành thạo đến khi bạn ôn đúng nhiều lần theo lịch ôn tập.</p>
          </div>
        </aside>
      </div>
      <Celebrate open={!!chest} title="Mở rương!" sub="Bạn nhận được phần thưởng vì đã vượt thử thách." xp={100} onClose={() => setChest(null)} />
    </div>
  )
}
