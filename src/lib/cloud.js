import { useSyncExternalStore } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js'
import { getState, replaceState, subscribe, fresh } from './store.js'
import { mergeState } from './merge.js'

// Trong Claude (artifact) trang không được gọi ra máy chủ ngoài, nên tài khoản chỉ có trên website
export const inArtifact = typeof window !== 'undefined' && !!window.claude
export const cloudReady = !!(SUPABASE_URL && SUPABASE_KEY) && !inArtifact
export const sb = cloudReady ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } }) : null
const SITE = typeof location !== 'undefined' ? location.origin + location.pathname : ''

let A = { status: cloudReady ? 'loading' : 'off', user: null, sync: 'idle', at: 0, err: '', dialog: null, recovery: false }
const subs = new Set()
const setA = p => { A = { ...A, ...p }; subs.forEach(f => f()) }
export const useAuth = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f) }, () => A)
export const openAuth = (mode = 'login') => setA({ dialog: mode })
export const closeAuth = () => setA({ dialog: null, recovery: false })

// ---- Thông báo lỗi tiếng Việt ----
export function viErr(e) {
  const m = (e && (e.message || e.error_description || String(e))) || ''
  if (/invalid login credentials/i.test(m)) return 'Email hoặc mật khẩu không đúng.'
  if (/email not confirmed/i.test(m)) return 'Email chưa được xác nhận. Hãy mở thư xác nhận trong hộp thư của bạn.'
  if (/already registered|already been registered|user already exists/i.test(m)) return 'Email này đã có tài khoản. Hãy đăng nhập.'
  if (/password should be at least|weak password|password is too/i.test(m)) return 'Mật khẩu quá yếu: cần ít nhất 6 ký tự.'
  if (/rate limit|too many|security purposes/i.test(m)) return 'Bạn thao tác quá nhanh. Đợi một chút rồi thử lại.'
  if (/invalid.*email|unable to validate email/i.test(m)) return 'Email không hợp lệ.'
  if (/failed to fetch|network/i.test(m)) return 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.'
  if (/same password|different from the old/i.test(m)) return 'Mật khẩu mới phải khác mật khẩu cũ.'
  return m || 'Có lỗi xảy ra. Thử lại nhé.'
}

// ---- Đồng bộ ----
let pushTimer = null, applying = false, uid = null
async function push() {
  if (!sb || !uid) return
  setA({ sync: 'saving' })
  const { error } = await sb.from('progress').upsert({ user_id: uid, data: { ...getState(), owner: uid }, updated_at: new Date().toISOString() })
  setA(error ? { sync: 'error', err: viErr(error) } : { sync: 'saved', at: Date.now(), err: '' })
}
export const syncNow = () => { clearTimeout(pushTimer); return push() }
async function pull(user) {
  uid = user.id; setA({ sync: 'saving' })
  const { data, error } = await sb.from('progress').select('data').eq('user_id', uid).maybeSingle()
  if (error) { setA({ sync: 'error', err: viErr(error) }); return }
  const local = getState(), remote = data?.data || null
  // Máy đang giữ tiến độ của tài khoản khác thì bỏ, còn tiến độ khách thì gộp vào tài khoản
  const base = local.owner && local.owner !== uid ? fresh() : local
  applying = true
  replaceState({ ...mergeState(base, remote), owner: uid, name: remote?.name || local.name || user.user_metadata?.name || '' })
  applying = false
  await push()
}
if (sb) {
  subscribe(() => { if (applying || !uid || getState().owner !== uid) return; clearTimeout(pushTimer); setA({ sync: 'pending' }); pushTimer = setTimeout(push, 1500) })
  sb.auth.onAuthStateChange((ev, session) => {
    const user = session?.user || null
    if (ev === 'PASSWORD_RECOVERY') setA({ dialog: 'newpass', recovery: true })
    if (user && (ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION') && uid !== user.id) { setA({ status: 'in', user }); setTimeout(() => pull(user), 0) }
    else if (user) setA({ status: 'in', user })
    else { if (uid) { applying = true; replaceState({ ...fresh(), onboarded: true, settings: getState().settings }); applying = false } uid = null; setA({ status: 'out', user: null, sync: 'idle' }) }
  })
  addEventListener('beforeunload', () => { if (A.sync === 'pending') push() })
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && A.sync === 'pending') syncNow() })
}

// ---- Thao tác tài khoản ----
export const signUp = (email, password, name) => sb.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: SITE } })
export const signIn = (email, password) => sb.auth.signInWithPassword({ email, password })
export const resetPassword = email => sb.auth.resetPasswordForEmail(email, { redirectTo: SITE })
export const updatePassword = password => sb.auth.updateUser({ password })
export const signOut = async () => { await syncNow(); return sb.auth.signOut() }
