import { REGIONS, REQUIRE } from '../data/lessons.js'
import { ITEMS } from '../data/items.js'
import { seen, dueList, mastered1 } from './store.js'
export const nodeDone = (s, n) => n.kind === 'chest' ? !!s.chests[n.id] : !!s.lessons[n.id]
export const regionOpen = (s, r) => !r.soon && (!REQUIRE[r.id] || !!s.lessons[REQUIRE[r.id].node] || !!s.unlocks[r.id])
export const unlocked = (s, r, i) => regionOpen(s, r) && (i === 0 || nodeDone(s, r.nodes[i - 1]))
export const nextNode = s => {
  const order = ['nm', 'n5', 'n4'], pref = s.settings.lv || 'nm'
  const rs = [pref, ...order.filter(x => x !== pref)].map(id => REGIONS.find(r => r.id === id)).filter(r => r && regionOpen(s, r))
  for (const r of rs) { const i = r.nodes.findIndex((n, k) => !nodeDone(s, n) && unlocked(s, r, k)); if (i >= 0) return { region: r, node: r.nodes[i] } }
  return null
}
export const regionProgress = (s, r) => ({ done: r.nodes.filter(x => nodeDone(s, x)).length, n: r.nodes.length })
// Bài đã thành thạo: mọi mục trong bài đều đã nhớ chắc
export const nodeMastered = (s, n) => n.kind === 'lesson' && nodeDone(s, n) && n.items.every(id => mastered1(s, id))
export const dueItems = s => dueList(s)
export const mastered = (s, list) => list.filter(i => mastered1(s, i.id)).length
export const viewedCount = (s, list) => list.filter(i => s.viewed[i.id] || seen(s, i.id)).length
export { seen }
