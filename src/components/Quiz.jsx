import { useEffect, useRef, useState } from 'react'
import { BY_ID, meanOf } from '../data/items.js'
import { QLABEL, typeOK, makeQ, listenWord } from '../lib/quiz.js'
import { speak } from '../lib/audio.js'
import { answer, SKILL } from '../lib/store.js'
import { cx, shuffle } from '../lib/util.js'
import { Bar, SpeakBtn, Mnemonic } from './ui.jsx'
import Illus from './Illus.jsx'
import Icon from './Icons.jsx'
import Mascot from './Mascot.jsx'
import SpeakCheck from './SpeakCheck.jsx'
import { useMic } from '../lib/mic.js'

const Big = ({ children, vi }) => <div className={cx(vi ? 'font-head text-[30px] sm:text-[40px] leading-tight' : 'jp text-[64px] sm:text-[84px] leading-none font-medium')}>{children}</div>

function Prompt({ q }) {
  const c = q.c
  if (q.t === 'cloze') return <><div className="jp text-[28px] sm:text-[34px] leading-snug">{q.sent.split('＿＿').map((p, i, a) => <span key={i}>{p}{i < a.length - 1 && <span className="inline-block min-w-[3.2em] mx-1 border-b-4 border-primary text-primary">{' '}</span>}</span>)}</div><p className="muted mt-3">{q.vi}</p><p className="text-sm mt-1 font-head font-bold text-primary/80">{c.w}</p></>
  if (q.t === 'gmean') return <><div className="jp text-[28px] sm:text-[34px] leading-snug">{q.ex.jp.replaceAll('|', '')}</div><div className="jp muted mt-2">{q.ex.rd}</div></>
  if (q.t === 'glisten') return <button type="button" onClick={() => speak(q.say)} className="inline-flex items-center gap-3 rounded-full bg-sakura-100 dark:bg-primary/20 text-primary-700 dark:text-sakura px-8 min-h-[76px] text-lg font-head font-extrabold hover:bg-sakura-200"><Icon name="sound" size={36} />Nghe lại câu</button>
  if (q.t === 'speak') return <><p className="muted mb-2">Đọc to {c.type === 'kanji' ? 'từ' : 'chữ'} này</p><Big>{c.type === 'kanji' ? c.k.ew : c.w}</Big><div className="jp text-xl muted mt-2">{c.type === 'kanji' ? c.k.er : c.type === 'word' ? (c.k ? c.h : '') : ''}</div></>
  if (q.t === 'mc') return <><Big>{c.w}</Big>{c.type === 'word' && c.k && <div className="jp text-xl muted mt-2">{c.h}</div>}</>
  if (q.t === 'rev') return <Big vi>{c.type === 'kana' ? c.r : c.type === 'kanji' ? c.k.hv + ' · ' + c.k.m : c.m}</Big>
  if (q.t === 'listen') return <button type="button" onClick={() => speak(q.say)} className="inline-flex items-center gap-3 rounded-full bg-sakura-100 dark:bg-primary/20 text-primary-700 dark:text-sakura px-8 min-h-[76px] text-lg font-head font-extrabold hover:bg-sakura-200"><Icon name="sound" size={36} />Nghe lại</button>
  if (q.t === 'pic') return <div className="max-w-md mx-auto text-left"><Mnemonic ch={c.w} hide compact />{c.type === 'kanji' && <p className="muted text-sm mt-2">Nghĩa: {c.k.m}</p>}</div>
  if (q.t === 'img') return <div className="inline-block rounded-4xl bg-cream dark:bg-white/90 p-3"><Illus id={c.icon} size={150} /></div>
  if (q.t === 'imgpick') return <><Big>{c.w}</Big>{c.k && <div className="jp text-xl muted mt-2">{c.h}</div>}</>
  if (q.t === 'sort') return <><p className="muted mb-1">Xếp các cụm thành câu tiếng Nhật có nghĩa là</p><Big vi>{(q.ex || c.ex).vi}</Big>{c.type === 'grammar' && <p className="text-sm mt-2 font-head font-bold text-primary/80">{c.w}</p>}</>
  if (c.type === 'kana') return <><p className="muted mb-2">Gõ cách đọc bằng romaji</p><Big>{c.w}</Big></>
  if (c.type === 'kanji') return <><p className="muted mb-2">Gõ âm Hán Việt (không cần dấu)</p><Big>{c.w}</Big><p className="muted mt-2">Nghĩa: {c.k.m}</p></>
  return <><p className="muted mb-2">Gõ từ tiếng Nhật (romaji, đúng trường âm) có nghĩa là</p><Big vi>{c.m}</Big></>
}

function SortQ({ q, done, onCheck }) {
  const [pool, setPool] = useState(() => { let sh = shuffle(q.parts.map((p, k) => ({ p, k }))); if (q.parts.length > 1) while (sh.every((x, k) => x.k === k)) sh = shuffle(sh); return sh })
  const [ans, setAns] = useState([])
  const tile = 'jp text-[22px] rounded-2xl border-2 border-b-4 px-4 min-h-[52px] transition'
  return <div>
    <div className={cx('min-h-[72px] rounded-3xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-center', 'border-sakura-200 dark:border-night-line')}>
      {!ans.length && <span className="muted px-2">Chạm các cụm bên dưới theo đúng thứ tự</span>}
      {ans.map(x => <button key={x.k} type="button" disabled={done} onClick={() => { setAns(ans.filter(y => y !== x)); setPool([...pool, x]) }} className={cx(tile, 'border-ink/10 dark:border-night-line bg-white dark:bg-night')}>{x.p}</button>)}
    </div>
    <div className="flex flex-wrap gap-2 mt-3 min-h-[56px]">{pool.map(x => <button key={x.k} type="button" disabled={done} onClick={() => { setAns([...ans, x]); setPool(pool.filter(y => y !== x)) }} className={cx(tile, 'border-sakura-200 dark:border-night-line bg-sakura-50 dark:bg-primary/10 hover:-translate-y-0.5')}>{x.p}</button>)}</div>
    {!done && <div className="flex justify-end mt-4"><button className="btn-primary min-w-[150px]" disabled={ans.length !== q.parts.length} onClick={() => onCheck(ans.map(x => x.p).join('') === q.parts.join(''))}>Kiểm tra</button></div>}
  </div>
}

// questions: danh sách câu hỏi ban đầu. Câu sai lần đầu được đưa vào cuối lượt để luyện lại (chỉ tính điểm lần đầu).
export default function Quiz({ questions, onFinish, onExit, srs = true, title, retry = true }) {
  const [qs, setQs] = useState(questions)
  const [i, setI] = useState(0), [pick, setPick] = useState(null), [val, setVal] = useState(''), [ok, setOk] = useState(null)
  const res = useRef({ score: 0, wrong: [], skipped: 0 })
  const mic = useMic(), tries = useRef(0), keyRef = useRef(null)
  const q = qs[i]
  const base = questions.length
  useEffect(() => { if (q && (q.t === 'listen' || q.t === 'glisten')) speak(q.say) }, [i])
  useEffect(() => { const h = e => keyRef.current && keyRef.current(e); addEventListener('keydown', h); return () => removeEventListener('keydown', h) }, [])
  const end = () => onFinish?.({ ...res.current, total: Math.max(1, base - res.current.skipped) })
  const advance = () => { tries.current = 0; if (i + 1 >= qs.length) { end(); return } setI(i + 1); setPick(null); setVal(''); setOk(null) }
  useEffect(() => { if (!q || q.t !== 'speak' || (mic !== 'none' && mic !== 'denied')) return; const t = setTimeout(() => { if (!q.retry) res.current.skipped++; advance() }, 1600); return () => clearTimeout(t) }, [i, mic])
  if (!q) return null
  const done = ok !== null
  const finish = v => {
    setOk(v)
    if (!q.retry) { if (v) res.current.score++; else res.current.wrong.push(q.c.id) }
    if (srs) answer(q.c.id, v, SKILL[q.t], { retry: q.retry })
    if (!v && retry && !q.retry && q.t !== 'speak') setQs(list => [...list, { ...makeQ(q.c, q.t), retry: true }])
    speak(q.say || q.c.say)
  }
  const choose = idx => { if (done) return; setPick(idx); finish(q.opts[idx] === q.want) }
  const submit = e => { e.preventDefault(); if (done || !val.trim()) return; finish(typeOK(q, val)) }
  const skip = () => { if (!q.retry) res.current.skipped++; advance() }
  const spoke = sc => { tries.current++; if (sc >= 70) finish(true); else if (tries.current >= 3) finish(false) }
  keyRef.current = e => { if (e.target.tagName === 'INPUT' && !done) return; if (!done && q.opts && /^[1-4]$/.test(e.key)) choose(+e.key - 1); else if (done && e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); advance() } }
  const isJpOpt = ['rev', 'listen', 'pic', 'img', 'cloze'].includes(q.t)
  const shown = q.t === 'listen' ? listenWord(q.c) : q.c.w
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button className="btn-ghost !min-h-[44px] !px-3" onClick={onExit} aria-label="Thoát"><Icon name="close" size={20} /></button>
        <Bar value={i + (done ? 1 : 0)} max={qs.length} className="flex-1 !h-4" />
        <span className="font-head font-extrabold tabular-nums text-primary">{res.current.score}/{base}</span>
      </div>
      <div className="card p-5 sm:p-8">
        <p className="font-head font-extrabold text-primary mb-4 flex flex-wrap items-center gap-2">{q.retry && <span className="chip !min-h-[28px] !px-3 text-xs !border-primary/40 text-primary">Luyện lại câu sai</span>}{title && title !== QLABEL[q.t] ? title + ' · ' : ''}{QLABEL[q.t]}</p>
        <div className="text-center py-3 sm:py-6 min-h-[150px] grid place-items-center"><div className="w-full"><Prompt q={q} /></div></div>
        {q.t === 'speak' ? (done ? null : <SpeakCheck targets={q.targets} say={q.say} onResult={spoke} onSkip={skip} />)
          : q.t === 'sort' ? <SortQ key={i} q={q} done={done} onCheck={finish} />
          : q.t === 'type' ? (
            <form onSubmit={submit} className="flex flex-wrap gap-3 mt-2">
              <input autoFocus value={val} onChange={e => setVal(e.target.value)} disabled={done} autoComplete="off" autoCapitalize="off" spellCheck="false" placeholder={q.c.type === 'kanji' ? 'vd: nhat' : 'vd: gakkou'}
                className="flex-1 min-w-[200px] min-h-[56px] rounded-2xl border-2 border-sakura-200 dark:border-night-line bg-white dark:bg-night px-4 text-xl font-semibold outline-none focus:border-primary" />
              <button className="btn-primary min-w-[140px]" disabled={done}>Kiểm tra</button>
            </form>
          ) : (
            <div className={cx('grid gap-3', q.t === 'imgpick' ? 'grid-cols-2 sm:grid-cols-4' : 'sm:grid-cols-2')}>
              {q.opts.map((o, idx) => {
                const right = done && o === q.want, wrong = done && idx === pick && o !== q.want
                return (
                  <button key={idx} type="button" disabled={done} onClick={() => choose(idx)}
                    className={cx('relative rounded-3xl border-2 border-b-4 px-4 py-3 min-h-[64px] text-left transition flex items-center gap-3 bg-white dark:bg-night',
                      right ? 'border-matcha-600 bg-matcha-50 dark:bg-matcha/20' : wrong ? 'border-primary bg-sakura-50 dark:bg-primary/15 animate-wiggle' : 'border-ink/10 dark:border-night-line hover:border-primary/50 hover:-translate-y-0.5')}>
                    <span className="hidden sm:grid place-items-center w-7 h-7 rounded-lg border-2 border-ink/10 dark:border-night-line text-sm muted shrink-0">{idx + 1}</span>
                    {q.t === 'imgpick' ? <span className="mx-auto"><Illus id={BY_ID[o].icon} size={96} /></span> : <span className={cx(isJpOpt ? 'jp text-[26px]' : 'text-[17px] font-semibold')}>{o}</span>}
                  </button>
                )
              })}
            </div>
          )}
      </div>
      {done && (
        <div className={cx('mt-4 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center gap-4 animate-pop', ok ? 'bg-matcha-50 dark:bg-matcha/15' : 'bg-sakura-50 dark:bg-primary/15')} aria-live="polite">
          <Mascot mood={ok ? 'happy' : 'think'} size={64} />
          <div className="flex-1 min-w-[180px]">
            <b className={cx('font-head text-xl', ok ? 'text-matcha-700 dark:text-matcha' : 'text-primary')}>{ok ? ['Giỏi quá!', 'Chính xác!', 'Tuyệt vời!'][i % 3] : 'Chưa đúng rồi'}</b>
            {q.c.type === 'grammar' ? <div className="mt-1"><span className="jp text-xl">{q.full || (q.ex ? q.ex.jp.replaceAll('|', '') : q.parts.join(''))}</span><div className="text-[15px]">{q.vi || (q.ex && q.ex.vi)}</div><div className="text-sm muted">{q.c.w}: {q.c.m}</div></div>
              : q.t === 'sort' ? <div className="mt-1"><span className="jp text-xl">{q.parts.join('')}</span> <span className="jp muted">{q.c.ex.rd}</span></div>
              : <div className="mt-1 flex flex-wrap items-center gap-x-2"><span className="jp text-xl">{shown}</span>{q.t === 'listen' && q.c.type === 'kanji' ? <><span className="jp muted">{q.c.k.er}</span><span>· {q.c.k.em}</span></> : <>{q.c.type === 'word' && q.c.k && <span className="jp muted">{q.c.h}</span>}<span>· {meanOf(q.c)}</span>{q.c.r && q.c.type !== 'kanji' && <span className="muted">· {q.c.r}</span>}</>}</div>}
            {!ok && retry && !q.retry && q.t !== 'speak' && <p className="text-sm muted mt-1">Câu này sẽ quay lại ở cuối lượt để bạn luyện lại.</p>}
          </div>
          <SpeakBtn text={q.say || q.c.say} />
          <button autoFocus className={ok ? 'btn-matcha min-w-[150px]' : 'btn-primary min-w-[150px]'} onClick={advance}>{i + 1 >= qs.length ? 'Xem kết quả' : 'Tiếp tục'}</button>
        </div>
      )}
      <p className="muted text-sm text-center mt-4 hidden sm:block">Phím 1–4 để chọn · Enter để tiếp tục</p>
    </div>
  )
}
