import { useEffect, useState } from 'react'
import { useStore, setSetting, levelOf, streakOf } from './lib/store.js'
import { today } from './lib/util.js'
import Icon from './components/Icons.jsx'
import Mascot from './components/Mascot.jsx'
import { EventLayer } from './components/ui.jsx'
import Home from './pages/Home.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Kana from './pages/Kana.jsx'
import Kanji from './pages/Kanji.jsx'
import Vocab from './pages/Vocab.jsx'
import Writing from './pages/Writing.jsx'
import Play from './pages/Play.jsx'
import Stats from './pages/Stats.jsx'
import Settings from './pages/Settings.jsx'
import Lesson from './pages/Lesson.jsx'
import Grammar from './pages/Grammar.jsx'
import Onboarding from './pages/Onboarding.jsx'

export const NAV = [
  ['home', 'Trang chủ', 'home'], ['map', 'Lộ trình JLPT', 'map'], ['kana', 'Bảng chữ cái', 'kana'], ['kanji', 'Kanji', 'kanji'],
  ['vocab', 'Từ vựng', 'cards'], ['grammar', 'Ngữ pháp', 'grammar'], ['write', 'Luyện viết', 'brush'], ['games', 'Trò chơi & Quiz', 'game'], ['stats', 'Thành tích', 'trophy'], ['settings', 'Cài đặt', 'gear'],
]
const MOBILE = ['home', 'map', 'vocab', 'games', 'stats']
const PAGES = { home: Home, map: Roadmap, kana: Kana, kanji: Kanji, vocab: Vocab, grammar: Grammar, write: Write2, games: Play, stats: Stats, settings: Settings }
function Write2(p) { return <Writing {...p} /> }

const readHash = () => { const h = location.hash.slice(1); return PAGES[h] ? h : 'home' }
export const go = (page, params) => { window.__params = params || null; if (location.hash.slice(1) === page) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = page; window.scrollTo({ top: 0 }) }

function useDark() {
  const pref = useStore(s => s.settings.dark)
  const sys = () => document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches)
  const dark = pref === null ? sys() : pref
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); document.documentElement.style.colorScheme = dark ? 'dark' : 'light' }, [dark])
  return dark
}

function TopStats({ compact }) {
  const s = useStore()
  const st = streakOf(s.days), lv = levelOf(s.xp), td = s.xpDays[today()] || 0
  return (
    <div className={compact ? 'flex items-center gap-3' : 'grid grid-cols-3 gap-2'}>
      <div className="flex items-center gap-1 font-head font-extrabold" title="Chuỗi ngày học"><Icon name="flame" size={compact ? 22 : 24} />{st}</div>
      <div className="flex items-center gap-1 font-head font-extrabold" title="Tổng XP"><Icon name="bolt" size={compact ? 22 : 24} />{s.xp}</div>
      <div className="flex items-center gap-1 font-head font-extrabold" title="Mục tiêu hôm nay"><Icon name="target" size={compact ? 22 : 24} />{Math.min(100, Math.round(td / s.goal * 100))}%</div>
      {!compact && <div className="col-span-3 mt-2"><div className="flex justify-between text-xs muted mb-1"><span>Cấp {lv.level}</span><span>{lv.into}/{lv.need} XP</span></div><div className="h-2 rounded-full bg-ink/5 dark:bg-white/10"><div className="h-full rounded-full bg-primary" style={{ width: lv.into / lv.need * 100 + '%' }} /></div></div>}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState(readHash())
  const [lesson, setLesson] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [nk, setNk] = useState(0)
  useEffect(() => { const f = e => { const a = e.target.closest && e.target.closest('a[href^="#"]'); if (a && a.getAttribute('href') === '#' + readHash()) { setLesson(null); setDrawer(false); setNk(k => k + 1); window.scrollTo({ top: 0 }) } }; document.addEventListener('click', f); return () => document.removeEventListener('click', f) }, [])
  const dark = useDark()
  useEffect(() => { const f = () => { setPage(readHash()); setLesson(null); setDrawer(false); setNk(k => k + 1) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const P = PAGES[page]
  const onboarded = useStore(s => s.onboarded)
  if (!onboarded) return <><Onboarding onDone={(lv, zero) => { setSetting('lv', lv); location.hash = 'map'; if (zero) setTimeout(() => setLesson('g0'), 60) }} /><EventLayer /></>
  const NavItem = ({ id, label, icon, onClick }) => (
    <a href={'#' + id} onClick={onClick} aria-current={page === id ? 'page' : undefined}
      className={'flex items-center gap-3 rounded-2xl px-3 min-h-[48px] font-head font-bold text-[16px] transition ' + (page === id ? 'bg-sakura-100 text-primary-700 dark:bg-primary/20 dark:text-sakura' : 'hover:bg-ink/5 dark:hover:bg-white/5')}>
      <Icon name={icon} size={26} />{label}
    </a>
  )
  const Side = () => (
    <div className="flex flex-col h-full p-4 gap-1">
      <a href="#home" className="flex items-center gap-2 px-2 mb-4"><Mascot mood="happy" size={48} /><span className="font-head font-extrabold text-[20px] leading-tight">Kitsune<br /><span className="text-primary">Nihongo</span></span></a>
      <nav className="flex flex-col gap-1">{NAV.map(([id, l, ic]) => <NavItem key={id} id={id} label={l} icon={ic} />)}</nav>
      <div className="mt-auto card p-4"><TopStats /></div>
      <button className="btn-ghost mt-2" onClick={() => setSetting('dark', !dark)}><Icon name={dark ? 'sun' : 'moon'} size={22} />{dark ? 'Giao diện sáng' : 'Giao diện tối'}</button>
    </div>
  )
  return (
    <div className="min-h-full lg:pl-[272px]">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[272px] bg-white/70 dark:bg-night-card/60 backdrop-blur border-r border-ink/5 dark:border-night-line overflow-y-auto"><Side /></aside>
      <header className="lg:hidden sticky top-0 z-30 bg-cream/90 dark:bg-night/90 backdrop-blur border-b border-ink/5 dark:border-night-line">
        <div className="flex items-center gap-3 px-4 h-[60px]">
          <a href="#home" className="flex items-center gap-1.5"><Mascot mood="happy" size={38} /><span className="font-head font-extrabold text-lg">Kitsune</span></a>
          <div className="ml-auto"><TopStats compact /></div>
          <button className="w-11 h-11 grid place-items-center rounded-xl hover:bg-ink/5" aria-label="Mở menu" onClick={() => setDrawer(true)}><Icon name="menu" /></button>
        </div>
      </header>
      {drawer && <div className="lg:hidden fixed inset-0 z-50"><div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} /><div className="absolute inset-y-0 left-0 w-[86vw] max-w-[300px] bg-cream dark:bg-night overflow-y-auto animate-pop"><button className="absolute right-3 top-3 w-11 h-11 grid place-items-center" aria-label="Đóng menu" onClick={() => setDrawer(false)}><Icon name="close" /></button><Side /></div></div>}
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 pt-5 lg:pt-10 pb-28 lg:pb-14">
        {lesson ? <Lesson id={lesson} onExit={() => setLesson(null)} /> : <P key={page + nk} openLesson={setLesson} />}
      </main>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-night-card/95 backdrop-blur border-t border-ink/5 dark:border-night-line grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {MOBILE.map(id => { const [, l, ic] = NAV.find(n => n[0] === id); return <a key={id} href={'#' + id} aria-current={page === id ? 'page' : undefined} className={'flex flex-col items-center justify-center gap-0.5 min-h-[62px] text-[11px] font-head font-bold ' + (page === id ? 'text-primary' : 'muted')}><span className={'grid place-items-center rounded-full w-12 h-8 ' + (page === id ? 'bg-sakura-100 dark:bg-primary/20' : '')}><Icon name={ic} size={24} /></span>{l.split(' ')[0] === 'Trò' ? 'Trò chơi' : l.replace(' JLPT', '').replace('Trang chủ', 'Trang chủ')}</a> })}
      </nav>
      <EventLayer />
    </div>
  )
}
