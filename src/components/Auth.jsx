import { useEffect, useRef, useState } from 'react'
import { useAuth, openAuth, closeAuth, cloudReady, inArtifact, signIn, signUp, resetPassword, updatePassword, signOut, syncNow, viErr } from '../lib/cloud.js'
import { useStore } from '../lib/store.js'
import { cx } from '../lib/util.js'
import Mascot from './Mascot.jsx'
import Icon from './Icons.jsx'

const SITE_URL = 'https://thanhsilver.github.io/kitsune-nihongo/'
const Field = ({ id, label, type = 'text', value, onChange, auto, hint, right }) => (
  <label htmlFor={id} className="block">
    <span className="font-head font-bold text-[15px]">{label}</span>
    <span className="relative block mt-1.5">
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} autoComplete={auto} required
        className="w-full min-h-[52px] rounded-2xl border-2 border-sakura-200 dark:border-night-line bg-white dark:bg-night px-4 pr-12 text-[16px] outline-none focus:border-primary" />
      {right}
    </span>
    {hint && <span className="muted text-xs mt-1 block">{hint}</span>}
  </label>
)
function Password({ id, label, value, onChange, auto, hint }) {
  const [show, setShow] = useState(false)
  return <Field id={id} label={label} type={show ? 'text' : 'password'} value={value} onChange={onChange} auto={auto} hint={hint}
    right={<button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 min-h-[40px] text-sm font-head font-bold text-primary" aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{show ? 'Ẩn' : 'Hiện'}</button>} />
}

export function AuthDialog() {
  const a = useAuth(), mode = a.dialog
  const [email, setEmail] = useState(''), [pw, setPw] = useState(''), [pw2, setPw2] = useState(''), [name, setName] = useState('')
  const [busy, setBusy] = useState(false), [err, setErr] = useState(''), [info, setInfo] = useState('')
  const box = useRef(null)
  useEffect(() => { setErr(''); setInfo(''); setPw(''); setPw2('') }, [mode])
  useEffect(() => { if (!mode) return; const k = e => { if (e.key === 'Escape' && !a.recovery) closeAuth() }; addEventListener('keydown', k); setTimeout(() => box.current?.querySelector('input')?.focus(), 50); return () => removeEventListener('keydown', k) }, [mode])
  useEffect(() => { if (a.status === 'in' && (mode === 'login' || mode === 'register')) closeAuth() }, [a.status])
  if (!mode) return null
  const go = m => { openAuth(m) }
  const run = async (fn, ok) => { setBusy(true); setErr(''); try { const r = await fn(); if (r?.error) throw r.error; ok?.(r) } catch (e) { setErr(viErr(e)) } setBusy(false) }
  const submit = e => {
    e.preventDefault(); if (busy) return
    if (mode === 'login') run(() => signIn(email.trim(), pw))
    if (mode === 'register') { if (pw.length < 6) return setErr('Mật khẩu cần ít nhất 6 ký tự.'); if (pw !== pw2) return setErr('Hai mật khẩu chưa khớp nhau.'); run(() => signUp(email.trim(), pw, name.trim()), r => { if (!r.data?.session) setInfo('confirm') }) }
    if (mode === 'forgot') run(() => resetPassword(email.trim()), () => setInfo('sent'))
    if (mode === 'newpass') { if (pw.length < 6) return setErr('Mật khẩu cần ít nhất 6 ký tự.'); if (pw !== pw2) return setErr('Hai mật khẩu chưa khớp nhau.'); run(() => updatePassword(pw), () => setInfo('changed')) }
  }
  const title = { login: 'Đăng nhập', register: 'Tạo tài khoản', forgot: 'Quên mật khẩu', newpass: 'Đặt mật khẩu mới' }[mode]
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4 bg-ink/45 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={e => { if (e.target === e.currentTarget && !a.recovery) closeAuth() }}>
      <div ref={box} className="card w-full max-w-[420px] p-6 sm:p-8 animate-pop relative max-h-[92vh] overflow-y-auto">
        {!a.recovery && <button className="absolute right-3 top-3 w-11 h-11 grid place-items-center rounded-xl hover:bg-ink/5" onClick={closeAuth} aria-label="Đóng"><Icon name="close" size={22} /></button>}
        <div className="text-center"><Mascot mood={info ? 'cheer' : mode === 'forgot' || mode === 'newpass' ? 'think' : 'wave'} size={92} className="mx-auto" /><h2 id="auth-title" className="text-[26px] mt-1">{title}</h2></div>

        {!cloudReady ? (
          <div className="mt-4 text-center space-y-3">
            <p className="muted">{inArtifact ? 'Trong Claude, tiến độ được lưu sẵn trên trình duyệt này. Muốn có tài khoản và đồng bộ giữa các thiết bị, hãy học trên website.' : 'Tính năng tài khoản đang được cài đặt. Tiến độ của bạn vẫn được lưu trên trình duyệt này.'}</p>
            {inArtifact && <a className="btn-primary w-full" href={SITE_URL} target="_blank" rel="noreferrer">Mở website Kitsune Nihongo</a>}
            <button className="btn-ghost w-full" onClick={closeAuth}>Đóng</button>
          </div>
        ) : info ? (
          <div className="mt-4 text-center space-y-4">
            <p>{info === 'confirm' ? <>Kitsune đã gửi thư xác nhận tới <b>{email}</b>. Mở thư và bấm vào link để kích hoạt tài khoản, rồi quay lại đăng nhập. Nhớ xem cả mục Spam.</> : info === 'sent' ? <>Nếu <b>{email}</b> đã có tài khoản, bạn sẽ nhận được thư có link đặt lại mật khẩu trong vài phút.</> : 'Đã đổi mật khẩu. Bạn đang đăng nhập.'}</p>
            <button className="btn-primary w-full" onClick={() => info === 'changed' ? closeAuth() : go('login')}>{info === 'changed' ? 'Tiếp tục học' : 'Về trang đăng nhập'}</button>
          </div>
        ) : (
          <>
            {(mode === 'login' || mode === 'register') && (
              <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-ink/5 dark:bg-white/5 mt-4" role="tablist">
                {[['login', 'Đăng nhập'], ['register', 'Đăng ký']].map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => go(k)} className={cx('min-h-[44px] rounded-xl font-head font-bold', mode === k ? 'bg-white dark:bg-night-card shadow-pop text-primary' : 'muted')}>{l}</button>)}
              </div>
            )}
            <form onSubmit={submit} className="space-y-4 mt-5" noValidate>
              {mode === 'register' && <Field id="au-name" label="Tên hiển thị" value={name} onChange={setName} auto="nickname" hint="Kitsune sẽ gọi bạn bằng tên này." />}
              {mode !== 'newpass' && <Field id="au-email" label="Email" type="email" value={email} onChange={setEmail} auto="email" />}
              {mode !== 'forgot' && <Password id="au-pw" label={mode === 'newpass' ? 'Mật khẩu mới' : 'Mật khẩu'} value={pw} onChange={setPw} auto={mode === 'login' ? 'current-password' : 'new-password'} hint={mode !== 'login' ? 'Ít nhất 6 ký tự.' : ''} />}
              {(mode === 'register' || mode === 'newpass') && <Password id="au-pw2" label="Nhập lại mật khẩu" value={pw2} onChange={setPw2} auto="new-password" />}
              {mode === 'login' && <div className="text-right -mt-2"><button type="button" className="text-sm text-primary underline" onClick={() => go('forgot')}>Quên mật khẩu?</button></div>}
              {mode === 'forgot' && <p className="muted text-sm">Nhập email đã đăng ký, Kitsune sẽ gửi link để bạn đặt mật khẩu mới.</p>}
              {err && <p className="rounded-2xl bg-sakura-50 dark:bg-primary/15 text-primary px-4 py-3 text-[15px]" role="alert">{err}</p>}
              <button className="btn-primary w-full" disabled={busy || (mode !== 'newpass' && !email.trim()) || (mode !== 'forgot' && !pw)}>
                {busy ? 'Đang xử lý…' : { login: 'Đăng nhập', register: 'Tạo tài khoản', forgot: 'Gửi link đặt lại', newpass: 'Lưu mật khẩu mới' }[mode]}
              </button>
              {mode === 'forgot' && <button type="button" className="btn-ghost w-full" onClick={() => go('login')}>Quay lại đăng nhập</button>}
            </form>
            {mode === 'register' && <p className="muted text-xs mt-4 text-center">Tiến độ bạn đang học trên máy này sẽ được gộp vào tài khoản mới.</p>}
            {mode === 'login' && <p className="muted text-xs mt-4 text-center">Đăng nhập để lưu tiến độ lên mây và học tiếp trên mọi thiết bị.</p>}
          </>
        )}
      </div>
    </div>
  )
}

const ago = t => { if (!t) return ''; const s = Math.round((Date.now() - t) / 1000); return s < 60 ? 'vừa xong' : s < 3600 ? Math.round(s / 60) + ' phút trước' : new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
export function SyncLine() {
  const a = useAuth()
  const [, tick] = useState(0); useEffect(() => { const h = setInterval(() => tick(x => x + 1), 30000); return () => clearInterval(h) }, [])
  if (a.status !== 'in') return null
  return <span className={cx('text-xs', a.sync === 'error' ? 'text-primary' : 'muted')}>{a.sync === 'saving' || a.sync === 'pending' ? 'Đang lưu lên mây…' : a.sync === 'error' ? 'Chưa lưu được: ' + a.err : a.at ? 'Đã lưu ' + ago(a.at) : 'Đã đồng bộ'}</span>
}

// Nút tài khoản trên sidebar / thanh trên điện thoại
export function AccountButton({ compact }) {
  const a = useAuth(), name = useStore(s => s.name)
  const [menu, setMenu] = useState(false)
  if (a.status === 'loading') return <div className={compact ? 'w-11 h-11' : 'h-[60px]'} />
  if (a.status !== 'in') return compact
    ? <button className="w-11 h-11 grid place-items-center rounded-xl bg-sakura-100 dark:bg-primary/20 text-primary-700 dark:text-sakura" onClick={() => openAuth('login')} aria-label="Đăng nhập"><Icon name="user" size={24} /></button>
    : <button className="btn-soft w-full" onClick={() => openAuth('login')}><Icon name="user" size={22} />Đăng nhập / Đăng ký</button>
  const label = name || a.user?.user_metadata?.name || a.user?.email?.split('@')[0] || 'Bạn'
  return (
    <div className="relative">
      <button onClick={() => setMenu(!menu)} aria-expanded={menu} className={compact ? 'w-11 h-11 rounded-full bg-primary text-white font-head font-extrabold text-lg grid place-items-center' : 'w-full flex items-center gap-3 rounded-2xl px-3 min-h-[60px] hover:bg-ink/5 dark:hover:bg-white/5 text-left'}>
        {compact ? label[0].toUpperCase() : <>
          <span className="w-10 h-10 rounded-full bg-primary text-white font-head font-extrabold grid place-items-center shrink-0">{label[0].toUpperCase()}</span>
          <span className="min-w-0 flex-1"><b className="font-head block truncate">{label}</b><SyncLine /></span>
        </>}
      </button>
      {menu && <>
        <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
        <div className={cx('absolute z-50 card p-2 w-64 animate-pop', compact ? 'right-0 top-12' : 'left-0 bottom-[66px]')}>
          <div className="px-3 py-2"><b className="font-head block truncate">{label}</b><span className="muted text-sm block truncate">{a.user.email}</span>{compact && <SyncLine />}</div>
          <button className="w-full text-left rounded-xl px-3 min-h-[44px] hover:bg-ink/5 dark:hover:bg-white/5 flex items-center gap-2" onClick={() => { syncNow(); setMenu(false) }}><Icon name="reset" size={20} />Đồng bộ ngay</button>
          <button className="w-full text-left rounded-xl px-3 min-h-[44px] hover:bg-ink/5 dark:hover:bg-white/5 flex items-center gap-2" onClick={() => { openAuth('newpass'); setMenu(false) }}><Icon name="lock" size={20} />Đổi mật khẩu</button>
          <button className="w-full text-left rounded-xl px-3 min-h-[44px] hover:bg-sakura-50 dark:hover:bg-primary/15 text-primary flex items-center gap-2" onClick={() => { setMenu(false); signOut() }}><Icon name="back" size={20} />Đăng xuất</button>
        </div>
      </>}
    </div>
  )
}

// Lời mời đăng nhập cho khách (trang chủ)
export function GuestBanner() {
  const a = useAuth(), xp = useStore(s => s.xp)
  const [hide, setHide] = useState(() => { try { return sessionStorage.getItem('kn-hide-guest') === '1' } catch (e) { return false } })
  if (a.status !== 'out' || hide || xp < 1) return null
  return (
    <div className="card p-4 sm:p-5 flex flex-wrap items-center gap-4 border-2 !border-sakura-200">
      <Icon name="user" size={40} />
      <div className="flex-1 min-w-[200px]"><b className="font-head text-lg block">Lưu tiến độ lên mây</b><span className="muted text-sm">Bạn đã có {xp} XP. Đăng nhập để không mất tiến độ và học tiếp trên điện thoại hay máy tính khác.</span></div>
      <div className="flex gap-2"><button className="btn-ghost" onClick={() => { setHide(true); try { sessionStorage.setItem('kn-hide-guest', '1') } catch (e) {} }}>Để sau</button><button className="btn-primary" onClick={() => openAuth('register')}>Tạo tài khoản</button></div>
    </div>
  )
}
