import { useEffect, useMemo, useState } from 'react'
import { ITEMS, BY_ID } from '../data/items.js'
import { useStore, setSetting, setState, addXP, bumpStat } from '../lib/store.js'
import { speak } from '../lib/audio.js'
import { cx, rnd } from '../lib/util.js'
import { PageHead, Chips, Mnemonic, SpeakBtn, Petals } from '../components/ui.jsx'
import WritingBoard from '../components/WritingBoard.jsx'
import Icon from '../components/Icons.jsx'

const SETS = [['h', 'Hiragana'], ['k', 'Katakana'], ['n5', 'Kanji N5'], ['n4', 'Kanji N4'], ['w5', 'Từ N5'], ['w4', 'Từ N4']]
const listOf = set => set === 'h' || set === 'k' ? ITEMS.filter(i => i.type === 'kana' && i.cat === set) : set[0] === 'w' ? ITEMS.filter(i => i.type === 'word' && i.lv === 'n' + set[1]) : ITEMS.filter(i => i.type === 'kanji' && i.lv === set)
export default function Writing() {
  const s = useStore()
  const p = window.__params; const init = p && p.id && BY_ID[p.id]
  const [set, setSet] = useState(init ? (init.type === 'kana' ? init.cat : init.lv) : (s.settings.wset || 'h'))
  const list = useMemo(() => listOf(set), [set])
  const [idx, setIdx] = useState(init ? Math.max(0, listOf(init.type === 'kana' ? init.cat : init.lv).findIndex(x => x.id === init.id)) : 0)
  const [mode, setMode] = useState('trace'), [done, setDone] = useState(null), [rk, setRk] = useState(0)
  useEffect(() => { window.__params = null }, [])
  const c = list[Math.min(idx, list.length - 1)]
  const wid = 'w:' + c.id, cnt = s.write[wid] || 0
  const mem = mode === 'memory' && !done
  const onDone = r => {
    if (mode === 'memory') { setState(st => ({ write: { ...st.write, [wid]: r.good ? (st.write[wid] || 0) + 1 : Math.max(0, (st.write[wid] || 0) - 1) } })); if (r.good) { bumpStat('wroteMem'); addXP(10) } } else addXP(3)
    speak(c.say); setDone(r)
  }
  const goIdx = i => { setIdx(i); setDone(null); setRk(k => k + 1) }
  const weakest = () => { const m = Math.min(...list.map(x => s.write['w:' + x.id] || 0)); const cand = list.map((x, i) => [x, i]).filter(([x, i]) => (s.write['w:' + x.id] || 0) === m && i !== idx); goIdx(cand.length ? cand[rnd(cand.length)][1] : 0) }
  const label = x => mode === 'memory' ? (x.type === 'kana' ? x.r : x.type === 'kanji' ? x.k.hv : x.m) : x.w
  return (
    <div>
      <PageHead title="Luyện viết" sub="Viết bằng ngón tay hoặc chuột. App chấm từng nét: đúng vị trí, đúng chiều, đúng thứ tự." mood="think" />
      <Chips items={SETS} value={set} onChange={v => { setSet(v); setSetting('wset', v); goIdx(0) }} className="mb-4" />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        <div className="card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <Chips items={[['trace', 'Tô theo mẫu'], ['memory', 'Viết từ trí nhớ']]} value={mode} onChange={v => { setMode(v); setDone(null); setRk(k => k + 1) }} />
            <div className="flex gap-2"><button className="btn-ghost !min-h-[44px]" onClick={() => { setDone(null); setRk(k => k + 1) }}><Icon name="reset" size={20} />Viết lại</button><button className="btn-primary !min-h-[44px]" onClick={() => goIdx((idx + 1) % list.length)}>Tiếp<Icon name="next" size={20} /></button></div>
          </div>
          <div className="text-center mb-3 font-head text-lg">
            {mem ? <>Viết: <span className="text-primary">{c.type === 'kana' ? `“${c.r}”` : c.type === 'kanji' ? `${c.k.hv} (${c.k.m})` : `“${c.m}” · ${c.k ? c.h + ' · ' : ''}${c.r}`}</span></> : <>Viết <span className="jp text-2xl">{c.w}</span> <span className="muted font-body text-base">{c.type === 'kanji' ? c.k.hv : c.r}</span></>}
          </div>
          <WritingBoard chars={[...c.w]} mode={mode} onDone={onDone} resetKey={rk + c.id} />
          {done && (done.good || mode === 'trace') && <Petals n={14} />}
          {done && <div className="mt-4 rounded-3xl p-4 text-center bg-matcha-50 dark:bg-matcha/15 animate-pop">
            <b className="font-head text-lg">{mode === 'memory' ? (done.good ? `Viết đúng từ trí nhớ! Lần thứ ${(s.write[wid] || 0)}${(s.write[wid] || 0) >= 2 ? ' · Đã thuộc' : ''}` : 'Xong, nhưng còn nhiều lỗi hoặc đã xem gợi ý. Thử lại nhé!') : 'Tô xong! Thử “Viết từ trí nhớ” để kiểm tra.'}</b>
            <div className="flex justify-center gap-2 mt-3"><button className="btn-ghost" onClick={() => { setDone(null); setRk(k => k + 1) }}>Viết lại</button><button className="btn-primary" onClick={() => goIdx((idx + 1) % list.length)}>Chữ tiếp theo</button></div>
          </div>}
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            {mem ? <div className="text-center py-4"><div className="font-head text-6xl text-primary">?</div><p className="muted mt-2">Chữ mẫu đang ẩn. Viết sai một nét 2 lần thì app hiện nét gợi ý.</p></div> : <>
              <div className="flex items-center gap-3"><span className="jp text-[44px] leading-none">{c.w}</span><SpeakBtn text={c.say} /><div className="ml-auto text-right"><div className="font-head font-extrabold text-primary">{c.type === 'kanji' ? c.k.hv : c.r}</div><div className="muted text-sm">{c.type === 'kanji' ? c.k.m : c.type === 'word' ? c.m : c.cat === 'k' ? 'Katakana' : 'Hiragana'}</div></div></div>
              {c.type !== 'word' && <div className="mt-4"><Mnemonic ch={c.w} /></div>}
            </>}
            <p className="muted text-sm mt-3">Đã viết đúng từ trí nhớ: <b className="text-ink dark:text-white">{cnt}</b> lần{cnt >= 2 ? ' · đã thuộc' : ''}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3"><h3 className="text-lg">Chọn bài</h3><button className="text-primary text-sm underline" onClick={weakest}>Ôn chữ yếu nhất</button></div>
            <div className="flex flex-wrap gap-1.5 max-h-[300px] overflow-auto">
              {list.map((x, i) => <button key={x.id} type="button" onClick={() => goIdx(i)} className={cx('relative rounded-xl border-2 min-h-[44px] min-w-[44px] px-2', mode === 'memory' ? 'text-sm' : 'jp text-xl', i === idx ? 'border-primary bg-sakura-50 dark:bg-primary/15' : 'border-ink/10 dark:border-night-line bg-white dark:bg-night')}>{label(x)}{(s.write['w:' + x.id] || 0) >= 2 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-matcha-600" />}</button>)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
