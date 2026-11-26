export const rnd = n => Math.floor(Math.random() * n)
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]] } return a }
export const dkey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
export const today = () => dkey(new Date())
export const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return dkey(d) }
export const cx = (...a) => a.filter(Boolean).join(' ')
export const RM = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const wait = ms => new Promise(r => setTimeout(r, ms))
