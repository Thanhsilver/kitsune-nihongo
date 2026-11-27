import Mascot from '../components/Mascot.jsx'
import Icon from '../components/Icons.jsx'
import { openAuth } from '../lib/cloud.js'

const FEATURES = [
  ['あ', 'Bảng chữ cái từ con số 0', 'Hiragana, Katakana, thứ tự nét và quy tắc phát âm.', 'bg-sakura-100 dark:bg-primary/20'],
  ['字', 'Kanji & từ vựng N5', 'Thẻ ghi nhớ có hình, câu ví dụ và giọng đọc rõ.', 'bg-matcha/60 dark:bg-matcha/20'],
  ['✎', 'Luyện viết từng nét', 'App chấm từng nét bạn viết trên màn hình.', 'bg-amber-100 dark:bg-amber-400/20'],
  ['文', 'Ngữ pháp & lộ trình JLPT', 'Bài ngắn, bài tập và bản đồ lộ trình N5 → N1.', 'bg-indigo-100 dark:bg-indigo-400/20'],
]

export default function Welcome() {
  return (
    <div className="min-h-full bg-gradient-to-b from-sakura-50 to-cream dark:from-night dark:to-night">
      <header className="max-w-[1100px] mx-auto flex items-center gap-2 px-5 h-[72px]">
        <Mascot mood="happy" size={44} />
        <span className="font-head font-extrabold text-[20px]">Kitsune <span className="text-primary">Nihongo</span></span>
        <button className="ml-auto btn-ghost" onClick={() => openAuth('login')}>Đăng nhập</button>
      </header>
      <main className="max-w-[1100px] mx-auto px-5 pb-16">
        <section className="grid lg:grid-cols-[1.1fr_.9fr] items-center gap-6 pt-4 lg:pt-10">
          <div className="text-center lg:text-left">
            <p className="font-head font-extrabold text-primary jp">こんにちは！</p>
            <h1 className="text-[34px] sm:text-[48px] leading-[1.1] mt-2">Học tiếng Nhật mỗi ngày cùng Kitsune</h1>
            <p className="muted text-[18px] mt-4 max-w-xl mx-auto lg:mx-0">Từ bảng chữ cái đến JLPT N5, mỗi ngày một chút. Tạo tài khoản miễn phí để bắt đầu và lưu tiến độ trên mọi thiết bị.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7 justify-center lg:justify-start">
              <button className="btn-primary min-w-[220px]" onClick={() => openAuth('register')}><Icon name="user" size={22} />Tạo tài khoản miễn phí</button>
              <button className="btn-soft min-w-[180px]" onClick={() => openAuth('login')}>Mình đã có tài khoản</button>
            </div>
          </div>
          <div className="relative grid place-items-center order-first lg:order-none">
            <div className="absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full bg-sakura-100 dark:bg-primary/15" />
            <Mascot mood="wave" size={230} className="relative animate-floaty" />
          </div>
        </section>
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {FEATURES.map(([g, t, d, bg]) => (
            <div key={t} className="card p-5">
              <span className={'w-14 h-14 rounded-2xl grid place-items-center jp text-[26px] font-bold ' + bg}>{g}</span>
              <h3 className="font-head font-extrabold text-[18px] mt-3">{t}</h3>
              <p className="muted text-sm mt-1">{d}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
