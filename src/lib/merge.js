// Gộp tiến độ của khách (trên máy) với tiến độ trên tài khoản: giữ phần tốt hơn, không cộng dồn hai lần
const maxMap = (a = {}, b = {}) => { const o = { ...a }; for (const k in b) o[k] = Math.max(o[k] ?? -Infinity, b[k]); return o }
const union = (a = {}, b = {}) => ({ ...a, ...b })
function mergeSRS(boxA = {}, dueA = {}, boxB = {}, dueB = {}) {
  const box = {}, due = {}
  for (const id of new Set([...Object.keys(boxA), ...Object.keys(boxB)])) {
    const ba = boxA[id], bb = boxB[id]
    if (bb === undefined || (ba !== undefined && ba > bb)) { box[id] = ba; due[id] = dueA[id] }
    else if (ba === undefined || bb > ba) { box[id] = bb; due[id] = dueB[id] }
    else { box[id] = ba; due[id] = Math.min(dueA[id] ?? Infinity, dueB[id] ?? Infinity) }
  }
  return { box, due }
}
const mergeSk = (a = {}, b = {}) => { const o = {}; for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[id], y = b[id]; o[id] = !x ? y : !y ? x : x[0] > y[0] ? x : y[0] > x[0] ? y : [x[0], Math.min(x[1], y[1])] } return o }
export function mergeState(local, remote) {
  if (!remote) return local
  const { box, due } = mergeSRS(local.box, local.due, remote.box, remote.due)
  const sk = {}; for (const k of new Set([...Object.keys(local.sk || {}), ...Object.keys(remote.sk || {})])) sk[k] = mergeSk(local.sk?.[k], remote.sk?.[k])
  const lessons = { ...local.lessons }; for (const id in remote.lessons || {}) { const r = remote.lessons[id], l = lessons[id]; lessons[id] = !l || (r.stars || 0) > (l.stars || 0) ? r : l }
  const ls = local.stats || {}, rs = remote.stats || {}
  const stats = maxMap(ls, rs); const mb = [ls.matchBest, rs.matchBest].filter(x => x > 0); stats.matchBest = mb.length ? Math.min(...mb) : 0
  return {
    ...local, ...remote,
    box, due, sk, lessons, stats,
    viewed: union(local.viewed, remote.viewed), unlocks: union(local.unlocks, remote.unlocks), badges: union(local.badges, remote.badges), chests: union(local.chests, remote.chests),
    write: maxMap(local.write, remote.write), best: maxMap(local.best, remote.best), xpDays: maxMap(local.xpDays, remote.xpDays),
    xp: Math.max(local.xp || 0, remote.xp || 0), days: [...new Set([...(local.days || []), ...(remote.days || [])])].sort().slice(-400),
    onboarded: !!(local.onboarded || remote.onboarded),
  }
}
