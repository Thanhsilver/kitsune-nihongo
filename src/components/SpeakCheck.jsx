import { useEffect, useRef, useState } from 'react'
import { useMic, dictation, markDenied, scoreSpeech } from '../lib/mic.js'
import { speak } from '../lib/audio.js'
import { cx } from '../lib/util.js'
import Icon from './Icons.jsx'
import Mascot from './Mascot.jsx'

// Nút thu âm + chấm phát âm. targets: các dạng chấp nhận (chữ, cách đọc). say: câu mẫu để nghe.
export default function SpeakCheck({ targets, say, onResult, onSkip, compact = false, pass = 70 }) {
  const mic = useMic()
  const [st, setSt] = useState('idle'), [heard, setHeard] = useState(''), [partial, setPartial] = useState(''), [score, setScore] = useState(null), [err, setErr] = useState('')
  const acc = useRef(''), timer = useRef(null), unsub = useRef([])
  useEffect(() => () => { unsub.current.forEach(u => u()); clearTimeout(timer.current); const d = dictation(); if (d && d.active()) d.stop().catch(() => {}) }, [])
  useEffect(() => { setHeard(''); setPartial(''); setScore(null); setErr(''); acc.current = '' }, [targets.join('|')])
  const finish = () => { const text = acc.current.trim(); setHeard(text); setPartial(''); const sc = text ? scoreSpeech(text, targets) : 0; setScore(text ? sc : null); if (!text) setErr('Chưa nghe thấy gì. Thử nói to và rõ hơn nhé.'); else onResult?.(sc, text) }
  const start = () => {
    const d = dictation(); if (!d) return
    if (st === 'listening' || st === 'starting') { clearTimeout(timer.current); d.stop().catch(() => {}); return }
    acc.current = ''; setHeard(''); setScore(null); setErr(''); setPartial('')
    unsub.current.forEach(u => u())
    unsub.current = [
      d.onPartial(({ text }) => setPartial(text)),
      d.onFinal(({ text }) => { acc.current += text; setPartial(''); clearTimeout(timer.current); timer.current = setTimeout(() => d.stop().catch(() => {}), 900) }),
      d.onState(({ state, reason }) => { setSt(state); if (state === 'idle') { clearTimeout(timer.current); if (reason === 'not_granted') { markDenied(); setErr('Bạn chưa cho phép dùng micro. Có thể bật lại trong menu Quyền (Permissions) của trang.') } else if (reason === 'unavailable') setErr('Nhận giọng tiếng Nhật chưa dùng được ở đây.'); else if (reason === 'rate_limited') setErr('Micro đang bận, thử lại sau vài giây.'); else if (reason === 'upstream_error') setErr('Micro hoặc dịch vụ nhận giọng gặp lỗi. Thử lại nhé.'); finish() } }),
    ]
    d.start({ language: 'ja' }).catch(e => { const c = e && e.code; if (c === 'not_granted') { markDenied(); setErr('Bạn chưa cho phép dùng micro.') } else if (c === 'unavailable') setErr('Nhận giọng tiếng Nhật chưa dùng được ở đây.'); else if (c === 'dismissed') setErr('Bạn đã đóng hộp hỏi quyền. Bấm micro lần nữa để thử lại.'); else if (c !== 'stopped') setErr('Không bắt đầu thu âm được. Thử lại nhé.') })
    timer.current = setTimeout(() => d.stop().catch(() => {}), 7000)
  }
  if (mic !== 'ready') return (
    <div className={cx('rounded-3xl p-4 flex flex-wrap items-center gap-3 bg-ink/[.04] dark:bg-white/5', compact && 'p-3')}>
      <Icon name="mic" size={28} className="opacity-60" />
      <p className="flex-1 min-w-[180px] muted text-sm">{mic === 'checking' ? 'Đang kiểm tra micro…' : mic === 'denied' ? 'Micro chưa được cho phép, bài nói sẽ được bỏ qua.' : 'Thiết bị hoặc trình duyệt này không thu âm được. Bài nói sẽ được bỏ qua.'}</p>
      {onSkip && <button type="button" className="btn-ghost !min-h-[44px]" onClick={onSkip}>Bỏ qua</button>}
    </div>
  )
  const listening = st === 'listening' || st === 'starting' || st === 'finishing'
  const good = score !== null && score >= pass
  return (
    <div className={cx('flex flex-col items-center gap-3', compact && 'gap-2')}>
      <div className="flex items-center gap-3">
        {say && <button type="button" onClick={() => speak(say)} className="btn-soft !min-h-[48px]"><Icon name="sound" size={22} />Nghe mẫu</button>}
        <button type="button" onClick={start} aria-label={listening ? 'Dừng thu âm' : 'Bấm để nói'} className={cx('relative grid place-items-center rounded-full text-white transition', compact ? 'w-16 h-16' : 'w-24 h-24', listening ? 'bg-primary pulse-ring' : 'bg-primary hover:bg-primary-600 shadow-btn active:translate-y-[2px] active:shadow-none')}>
          <Icon name={listening ? 'stop' : 'micw'} size={compact ? 30 : 44} />
        </button>
        {onSkip && !compact && <button type="button" className="btn-ghost !min-h-[48px]" onClick={onSkip}>Bỏ qua</button>}
      </div>
      <p className="muted text-sm text-center min-h-[20px]" aria-live="polite">{st === 'starting' ? 'Đang mở micro…' : st === 'listening' ? (partial ? '' : 'Đang nghe… hãy nói bây giờ') : st === 'finishing' ? 'Đang xử lý…' : score === null && !err ? 'Bấm micro rồi đọc to từ trên' : ''}</p>
      {(partial || heard) && <div className="jp text-xl text-center">{partial ? <span className="opacity-60">{partial}</span> : <>Bạn nói: <b>{heard}</b></>}</div>}
      {score !== null && !listening && (
        <div className={cx('w-full rounded-3xl p-4 flex items-center gap-3 animate-pop', good ? 'bg-matcha-50 dark:bg-matcha/15' : 'bg-sakura-50 dark:bg-primary/15')}>
          <Mascot mood={good ? 'happy' : 'think'} size={54} />
          <div className="flex-1"><b className={cx('font-head text-lg', good ? 'text-matcha-700 dark:text-matcha' : 'text-primary')}>{score >= 90 ? 'Phát âm rất chuẩn!' : good ? 'Khá tốt!' : score >= 40 ? 'Gần đúng rồi, thử lại nhé' : 'Chưa giống lắm'}</b>
            <div className="h-2.5 rounded-full bg-white/70 dark:bg-white/10 mt-1.5 overflow-hidden"><div className={cx('h-full rounded-full', good ? 'bg-matcha-600' : 'bg-primary')} style={{ width: score + '%' }} /></div></div>
          <span className="font-head font-extrabold text-2xl tabular-nums">{score}%</span>
        </div>
      )}
      {err && <p className="text-primary text-sm text-center">{err}</p>}
    </div>
  )
}
