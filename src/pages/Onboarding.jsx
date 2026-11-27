import { useState } from 'react'
import { useStore, setState, setSetting } from '../lib/store.js'
import { speak } from '../lib/audio.js'
import { useMic } from '../lib/mic.js'
import { cx } from '../lib/util.js'
import Mascot from '../components/Mascot.jsx'
import Icon from '../components/Icons.jsx'
import Placement from '../components/Placement.jsx'
import { Petals } from '../components/ui.jsx'
import { openAuth, cloudReady } from '../lib/cloud.js'

const LEVELS = [
  ['zero', 'Mình chưa biết gì', 'Bắt đầu từ bảng chữ cái, Kitsune dẫn bạn từng bước.', 'あ?'],
  ['hira', 'Mình đọc được Hiragana', 'Làm bài kiểm tra ngắn để bỏ qua phần Hiragana.', 'あ'],
  ['kana', 'Đọc được cả Hiragana và Katakana', 'Kiểm tra nhanh để vào thẳng N5.', 'アあ'],
  ['n5', 'Mình đã học gần hết N5', 'Kiểm tra từ vựng và kanji N5 để mở N4.', '五'],
]
const TEST = { hira: 'hira', kana: 'n5', n5: 'n4' }
export default function Onboarding({ onDone }) {
  const s = useStore(), mic = useMic()
  const [step, setStep] = useState(0), [lvl, setLvl] = useState(s.level0 || 'zero'), [name, setName] = useState(s.name || ''), [test, setTest] = useState(false), [passed, setPassed] = useState(null)
  const finish = () => { setState(() => ({ onboarded: true, name: name.trim().slice(0, 30), level0: lvl })); onDone?.(passed ? (lvl === 'n5' ? 'n4' : lvl === 'kana' ? 'n5' : 'nm') : 'nm', lvl === 'zero') }
  if (test) return <div className="max-w-3xl mx-auto px-4 py-6"><Placement region={TEST[lvl]} onExit={() => { setTest(false); setPassed(false); setStep(4) }} onPass={() => { setTest(false); setPassed(true); setSetting('lv', lvl === 'n5' ? 'n4' : lvl === 'kana' ? 'n5' : 'nm'); setStep(4) }} /></div>
  const Dots = () => <div className="flex justify-center gap-2 mb-6">{[0, 1, 2, 3, 4].map(i => <span key={i} className={cx('h-2.5 rounded-full transition-all', i === step ? 'w-8 bg-primary' : 'w-2.5 bg-ink/15 dark:bg-white/20')} />)}</div>
  const Nav = ({ next, label = 'Tiếp tục', disabled }) => <div className="flex justify-between gap-3 mt-8">{step > 0 ? <button className="btn-ghost" onClick={() => setStep(step - 1)}><Icon name="back" size={20} />Quay lại</button> : <span />}<button className="btn-primary min-w-[160px]" disabled={disabled} onClick={next}>{label}</button></div>
  return (
    <div className="min-h-full grid place-items-center px-4 py-8 bg-gradient-to-b from-sakura-50 to-cream dark:from-night dark:to-night">
      <div className="w-full max-w-2xl">
        <Dots />
        <div className="card p-6 sm:p-10 animate-pop" key={step}>
          {step === 0 && <div className="text-center">
            <Mascot mood="wave" size={170} className="mx-auto animate-floaty" />
            <h1 className="text-[32px] sm:text-[40px] leading-tight mt-2">Chào bạn! Mình là Kitsune</h1>
            <p className="muted mt-3 max-w-md mx-auto text-[17px]">Mình sẽ cùng bạn học tiếng Nhật từ con số 0: bảng chữ cái, phát âm, từ vựng, kanji, mỗi ngày một chút.</p>
            <label className="block text-left max-w-sm mx-auto mt-6"><span className="font-head font-bold">Kitsune nên gọi bạn là gì?</span>
              <input id="ob-name" value={name} onChange={e => setName(e.target.value)} placeholder="Tên của bạn (không bắt buộc)" maxLength={30} className="mt-2 w-full min-h-[52px] rounded-2xl border-2 border-sakura-200 dark:border-night-line bg-white dark:bg-night px-4 text-[16px] outline-none focus:border-primary" /></label>
            <Nav next={() => setStep(1)} label="Bắt đầu" />
            {cloudReady && false && <p className="mt-4 text-sm">Đã có tài khoản? <button className="text-primary font-head font-bold underline" onClick={() => openAuth('login')}>Đăng nhập để học tiếp</button></p>}
          </div>}
          {step === 1 && <div>
            <h2 className="text-[28px] text-center">Bạn đang ở trình độ nào?</h2>
            <p className="muted text-center mt-1">Không sao nếu chưa biết gì, ai cũng bắt đầu từ あ.</p>
            <div className="grid gap-3 mt-6">{LEVELS.map(([k, t, d, g]) => (
              <button key={k} type="button" onClick={() => setLvl(k)} aria-pressed={lvl === k} className={cx('text-left rounded-3xl border-2 border-b-4 p-4 flex items-center gap-4 transition', lvl === k ? 'border-primary bg-sakura-50 dark:bg-primary/15' : 'border-ink/10 dark:border-night-line hover:border-primary/40')}>
                <span className="w-14 h-14 rounded-2xl bg-white dark:bg-night grid place-items-center jp text-xl font-bold shrink-0 border-2 border-sakura-100 dark:border-night-line">{g}</span>
                <span><b className="font-head text-[18px] block">{t}</b><span className="muted text-sm">{d}</span></span>
              </button>))}</div>
            <Nav next={() => setStep(2)} />
          </div>}
          {step === 2 && <div>
            <h2 className="text-[28px] text-center">Mục tiêu mỗi ngày</h2>
            <p className="muted text-center mt-1">Một bài học khoảng 30–60 XP. Đều đặn quan trọng hơn học nhiều.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">{[[20, 'Nhẹ nhàng', '5 phút/ngày'], [50, 'Đều đặn', '10–15 phút/ngày'], [100, 'Chăm chỉ', '20–30 phút/ngày'], [150, 'Thử thách', '30+ phút/ngày']].map(([v, t, d]) => (
              <button key={v} type="button" onClick={() => setState(() => ({ goal: v }))} aria-pressed={s.goal === v} className={cx('rounded-3xl border-2 border-b-4 p-4 text-left transition', s.goal === v ? 'border-primary bg-sakura-50 dark:bg-primary/15' : 'border-ink/10 dark:border-night-line hover:border-primary/40')}>
                <b className="font-head text-[18px]">{t}</b><span className="float-right font-head font-extrabold text-primary">{v} XP</span><span className="muted text-sm block mt-1">{d}</span></button>))}</div>
            <Nav next={() => setStep(3)} />
          </div>}
          {step === 3 && <div>
            <h2 className="text-[28px] text-center">Âm thanh và micro</h2>
            <div className="grid gap-4 mt-6">
              <div className="rounded-3xl bg-sakura-50 dark:bg-primary/10 p-5 flex flex-wrap items-center gap-4"><Icon name="sound" size={40} /><div className="flex-1 min-w-[200px]"><b className="font-head text-lg">Nghe phát âm</b><p className="muted text-sm">Bật loa rồi bấm thử. Bạn có thể chỉnh giọng và tốc độ trong Cài đặt.</p></div><button className="btn-soft" onClick={() => speak('こんにちは')}>Thử nghe</button></div>
              <div className="rounded-3xl bg-matcha-50 dark:bg-matcha/10 p-5">
                <div className="flex flex-wrap items-center gap-4"><Icon name="mic" size={40} /><div className="flex-1 min-w-[200px]"><b className="font-head text-lg">Bài tập phát âm (thu âm)</b><p className="muted text-sm">{mic === 'ready' ? 'Thiết bị này thu âm được. Lần đầu bấm micro, trình duyệt sẽ hỏi quyền.' : mic === 'checking' ? 'Đang kiểm tra micro…' : 'Thiết bị này không thu âm được, các bài nói sẽ tự bỏ qua.'}</p></div></div>
                <div className="flex flex-wrap gap-2 mt-3"><button className={cx('chip', s.settings.speak !== false && 'chip-on')} onClick={() => setSetting('speak', true)}>Có bài nói</button><button className={cx('chip', s.settings.speak === false && 'chip-on')} onClick={() => setSetting('speak', false)}>Bỏ qua bài nói</button></div>
              </div>
            </div>
            <Nav next={() => lvl === 'zero' ? setStep(4) : setTest(true)} label={lvl === 'zero' ? 'Tiếp tục' : 'Làm bài kiểm tra xếp lớp'} />
            {lvl !== 'zero' && <button className="block mx-auto mt-3 text-sm muted underline" onClick={() => setStep(4)}>Bỏ qua kiểm tra, học từ đầu</button>}
          </div>}
          {step === 4 && <div className="text-center">
            {passed && <Petals />}
            <Mascot mood="cheer" size={140} className="mx-auto" />
            <h2 className="text-[28px] mt-2">{passed ? 'Xuất sắc! Bạn được xếp lớp rồi' : passed === false ? 'Không sao, mình học chắc từ đầu nhé' : `Sẵn sàng rồi${name.trim() ? ', ' + name.trim() : ''}!`}</h2>
            <p className="muted mt-2 max-w-md mx-auto">{passed ? (lvl === 'hira' ? 'Phần Hiragana đã được đánh dấu hoàn thành. Bạn sẽ bắt đầu với Katakana.' : lvl === 'kana' ? 'Rừng Tre N5 đã mở. Bạn vẫn có thể ôn Làng Kana bất cứ lúc nào.' : 'Thị trấn N4 đã mở.') : 'Đây là cách học với Kitsune:'}</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-6 text-left">{[['map', 'Học theo lộ trình', 'Mỗi bài: xem từng chữ, rồi làm quiz. Qua bài để mở bài tiếp.'], ['review', 'Ôn tập mỗi ngày', 'App nhắc ôn đúng lúc bạn sắp quên, tách theo nghe, nhận diện, tự nhớ, nói.'], ['brush', 'Viết & nói', 'Luyện viết theo nét và đọc to để app chấm phát âm.']].map(([ic, t, d]) => <div key={t} className="rounded-3xl bg-sakura-50 dark:bg-primary/10 p-4"><Icon name={ic} size={34} /><b className="font-head block mt-2">{t}</b><span className="muted text-sm">{d}</span></div>)}</div>
            <button className="btn-primary mt-8 min-w-[220px]" onClick={finish}>{lvl === 'zero' || !passed ? 'Vào bài học đầu tiên' : 'Xem lộ trình'}</button>
          </div>}
        </div>
      </div>
    </div>
  )
}
