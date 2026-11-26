import { useState } from 'react'
import { useStore, setSetting, setState } from '../lib/store.js'
import { speak, hasDeviceVoice } from '../lib/audio.js'
import { PageHead, Chips } from '../components/ui.jsx'
import Icon from '../components/Icons.jsx'
import { useMic } from '../lib/mic.js'

export default function Settings() {
  const mic = useMic()
  const s = useStore(), dark = document.documentElement.classList.contains('dark')
  const [arm, setArm] = useState(false), [note, setNote] = useState('')
  return (
    <div className="max-w-3xl">
      <PageHead title="Cài đặt" sub="Giao diện, giọng đọc và mục tiêu học." mood="happy" />
      <div className="space-y-4">
        <div className="card p-5 sm:p-6"><h2 className="text-[20px] mb-3">Giao diện</h2><Chips items={[['light', 'Sáng'], ['dark', 'Tối'], ['auto', 'Theo hệ thống']]} value={s.settings.dark === null ? 'auto' : s.settings.dark ? 'dark' : 'light'} onChange={v => setSetting('dark', v === 'auto' ? null : v === 'dark')} /></div>
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="text-[20px]">Giọng đọc</h2>
          <Chips items={[['ai', 'Giọng AI nữ (rõ, tự nhiên)'], ['old', 'Giọng cũ'], ['device', 'Giọng của máy']]} value={s.settings.voice} onChange={v => { setSetting('voice', v); setNote(v === 'device' && !hasDeviceVoice() ? 'Máy này chưa có giọng tiếng Nhật, app sẽ dùng giọng AI.' : ''); setTimeout(() => speak('こんにちは'), 50) }} />
          <div className="flex flex-wrap items-center gap-3"><span className="font-head font-bold">Tốc độ</span><Chips items={[['vslow', 'Rất chậm'], ['slow', 'Chậm'], ['mid', 'Vừa']]} value={s.settings.rate} onChange={v => { setSetting('rate', v); setTimeout(() => speak('こんにちは'), 50) }} /></div>
          <button className="btn-soft" onClick={() => speak('こんにちは')}><Icon name="sound" size={22} />Thử âm thanh</button>
          {note && <p className="text-primary font-semibold">{note}</p>}
        </div>
        <div className="card p-5 sm:p-6 space-y-3">
          <h2 className="text-[20px]">Bài tập phát âm (thu âm)</h2>
          <Chips items={[['on', 'Bật'], ['off', 'Tắt (bỏ qua bài nói)']]} value={s.settings.speak === false ? 'off' : 'on'} onChange={v => setSetting('speak', v === 'on')} />
          <p className="muted text-sm">{mic === 'ready' ? 'Micro dùng được ở đây. Lần đầu bấm micro, trình duyệt sẽ hỏi quyền.' : mic === 'checking' ? 'Đang kiểm tra micro…' : mic === 'denied' ? 'Micro chưa được cho phép, bài nói đang được bỏ qua. Bật lại trong menu Quyền (Permissions) của trang.' : 'Trình duyệt này không hỗ trợ nhận giọng nói (hãy dùng Chrome hoặc Edge). Bài nói sẽ tự bỏ qua.'}</p>
          <p className="muted text-sm">Tắt khi bạn đang ở nơi công cộng: các câu hỏi nói sẽ không xuất hiện nữa.</p>
        </div>
        <div className="card p-5 sm:p-6"><h2 className="text-[20px] mb-3">Mục tiêu mỗi ngày</h2><Chips items={[[20, 'Nhẹ nhàng · 20 XP'], [50, 'Đều đặn · 50 XP'], [100, 'Chăm chỉ · 100 XP'], [150, 'Thử thách · 150 XP']]} value={s.goal} onChange={v => setState(() => ({ goal: v }))} /></div>
        <div className="card p-5 sm:p-6">
          <h2 className="text-[20px]">Dữ liệu</h2>
          <p className="muted mt-1">Tiến độ chỉ lưu trên trình duyệt này. Đổi máy hoặc trình duyệt sẽ bắt đầu lại.</p>
          <button className="btn-ghost mt-3 !text-primary" onClick={() => { if (!arm) { setArm(true); setTimeout(() => setArm(false), 3000); return } try { localStorage.removeItem('kitsune-nihongo-v2'); localStorage.removeItem('hoc-tieng-nhat-v1') } catch (e) {} location.reload() }}>{arm ? 'Bấm lần nữa để xác nhận xóa' : 'Đặt lại toàn bộ tiến độ'}</button>
        </div>
        <div className="card p-5 sm:p-6"><h2 className="text-[20px]">Hướng dẫn bắt đầu</h2><p className="muted mt-1">Chọn lại trình độ, mục tiêu hoặc làm bài kiểm tra xếp lớp.</p><button className="btn-soft mt-3" onClick={() => setState(() => ({ onboarded: false }))}>Mở lại hướng dẫn</button></div>
        <p className="muted text-sm">Dữ liệu thứ tự nét: <a className="underline" href="https://kanjivg.tagaini.net">KanjiVG</a> (Ulrich Apel, CC BY-SA 3.0). Giọng AI: mô hình Kokoro.</p>
      </div>
    </div>
  )
}
