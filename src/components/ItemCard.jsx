import Mascot from './Mascot.jsx'
import { useEffect, useState } from 'react'
import SpeakCheck from './SpeakCheck.jsx'
import { useMic } from '../lib/mic.js'
import Icon from './Icons.jsx'
import { speak } from '../lib/audio.js'
import { SpeakBtn, Mnemonic, StrokeAnim } from './ui.jsx'
import Illus from './Illus.jsx'
import { CAT_NAMES } from '../data/items.js'

// Thẻ giới thiệu một mục (dùng trong bài học): chữ, cách đọc, nghĩa, hình, mẹo nhớ, câu ví dụ
function TryIt({ c }) {
  const mic = useMic(), [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [c.id])
  if (mic !== 'ready') return null
  const t = c.type === 'kana' ? [c.w, c.say, c.r] : c.type === 'kanji' ? [c.k.ew, c.k.er] : [c.w, c.h]
  return open ? <div className="mt-4 rounded-3xl border-2 border-dashed border-sakura-200 dark:border-night-line p-4"><p className="font-head font-bold mb-2 text-center">Đọc to: <span className="jp text-xl">{c.type === 'kanji' ? c.k.ew : c.w}</span></p><SpeakCheck targets={t} say={c.say} compact /></div>
    : <button type="button" className="btn-soft mt-4" onClick={() => setOpen(true)}><Icon name="mic" size={22} />Thử phát âm</button>
}
export { TryIt }
export default function ItemCard({ c, autoSay = true }) {
  useEffect(() => { if (autoSay) speak(c.say) }, [c.id])
  if (c.type === 'word') return (
    <div className="grid sm:grid-cols-[180px_1fr] gap-5 items-center">
      <div className="rounded-4xl bg-cream dark:bg-white/90 grid place-items-center aspect-square max-w-[180px] mx-auto w-full">{c.icon ? <Illus id={c.icon} size={150} /> : !c.k ? <Mascot mood="happy" size={130} /> : <div className="text-center px-3"><div className={'jp font-medium leading-tight ' + ((c.k || c.h).length > 4 ? 'text-[28px]' : c.k.length > 2 ? 'text-[38px]' : 'text-[56px]')}>{c.k.replace('〜', '')}</div>{c.hv && <div className="text-sm muted mt-1">{c.hv}</div>}</div>}</div>
      <div>
        <span className="chip !min-h-[30px] !px-3 text-xs">{CAT_NAMES[c.cat]}</span>
        <div className="flex items-center gap-3 mt-2"><span className="jp text-[48px] font-medium leading-tight">{c.w}</span><SpeakBtn text={c.say} /></div>
        {c.k && <div className="jp text-xl muted">{c.h}</div>}
        <div className="text-primary font-head font-extrabold text-lg">{c.r}</div>
        <div className="font-head text-[26px] mt-1">{c.m}{c.hv && <span className="muted text-base font-body font-normal"> · Hán Việt: {c.hv}</span>}</div>
        {c.ex && <div className="mt-4 rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4"><div className="flex items-start gap-2"><div className="flex-1"><div className="jp text-[20px]">{c.ex.jp.replaceAll('|', '')}</div><div className="jp text-sm muted">{c.ex.rd}</div><div className="mt-1">{c.ex.vi}</div></div><SpeakBtn text={c.ex.rd} label="Nghe câu ví dụ" /></div></div>}
        <TryIt c={c} />
      </div>
    </div>
  )
  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6 items-start">
      <StrokeAnim ch={c.w} size={240} className="mx-auto" />
      <div>
        <div className="flex items-center gap-3"><span className="jp text-[56px] font-medium leading-none">{c.w}</span><SpeakBtn text={c.say} /></div>
        {c.type === 'kana' ? <div className="font-head text-[30px] text-primary mt-1">{c.r}</div> : <>
          <div className="font-head text-[26px] mt-2">{c.k.hv} <span className="font-body text-lg font-normal muted">· {c.k.m}</span></div>
          <dl className="grid grid-cols-[6em_1fr] gap-1 mt-2 text-[15px]"><dt className="muted">Âm On</dt><dd className="jp">{c.k.on}</dd><dt className="muted">Âm Kun</dt><dd className="jp">{c.k.kun}</dd><dt className="muted">Ví dụ</dt><dd><span className="jp">{c.k.ew}</span> ({c.k.er}): {c.k.em}</dd></dl>
        </>}
        <div className="mt-4 rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4"><Mnemonic ch={c.w} /></div>
        <TryIt c={c} />
      </div>
    </div>
  )
}
