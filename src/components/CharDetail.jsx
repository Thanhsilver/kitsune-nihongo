import { StrokeAnim, SpeakBtn, Mnemonic } from './ui.jsx'
import Icon from './Icons.jsx'
import { go } from '../App.jsx'
import { TryIt } from './ItemCard.jsx'
// Bảng chi tiết của một chữ (kana hoặc kanji)
export default function CharDetail({ c }) {
  if (!c) return null
  return (
    <div className="card p-5 sm:p-6">
      <div className={'flex gap-5 items-start ' + ([...c.w].length > 1 ? 'flex-col' : 'flex-wrap sm:flex-nowrap')}>
        {[...c.w].length === 1 ? <StrokeAnim ch={c.w} size={190} className="mx-auto sm:mx-0 shrink-0" /> : <div className="flex gap-2 mx-auto sm:mx-0 shrink-0">{[...c.w].map((ch, i) => <StrokeAnim key={ch + i} ch={ch} size={110} />)}</div>}
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-3"><span className="jp text-[52px] font-medium leading-none">{c.w}</span><SpeakBtn text={c.say} label={c.type === 'kanji' ? 'Nghe từ ví dụ ' + c.k.ew : 'Nghe phát âm'} /></div>
          {c.type === 'kana' ? <>
            <div className="font-head text-[28px] text-primary mt-1">{c.r}</div>
            <p className="muted text-sm mt-1">{c.cat === 'k' ? 'Katakana' : 'Hiragana'}{c.pair && <> · cặp với <span className="jp text-lg text-ink dark:text-white">{c.pair}</span></>}</p>
            {c.ex && <p className="text-sm mt-1">Ví dụ: <span className="jp">{c.ex}</span></p>}
          </> : <>
            <div className="font-head text-[24px] mt-2">{c.k.hv} <span className="font-body text-base font-normal muted">· {c.k.m}</span></div>
            <dl className="grid grid-cols-[5.5em_1fr] gap-1 mt-2 text-[15px]"><dt className="muted">Âm On</dt><dd className="jp">{c.k.on}</dd><dt className="muted">Âm Kun</dt><dd className="jp">{c.k.kun}</dd><dt className="muted">Ví dụ</dt><dd><span className="jp">{c.k.ew}</span> ({c.k.er}): {c.k.em}</dd></dl>
          </>}
        </div>
      </div>
      <div className="mt-5 rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4"><Mnemonic ch={c.w} /></div>
      <div className="text-center"><TryIt c={c} /></div>
      <button className="btn-primary w-full mt-4" onClick={() => go('write', { id: c.id })}><Icon name="brush" size={22} />Luyện viết chữ này</button>
    </div>
  )
}
