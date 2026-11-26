import { useMemo, useState } from 'react'
import { ITEMS } from '../data/items.js'
import { planQuiz } from '../lib/quiz.js'
import { setState, addXP } from '../lib/store.js'
import { REGIONS } from '../data/lessons.js'
import Quiz from './Quiz.jsx'
import { Celebrate } from './ui.jsx'
// Kiểm tra xếp lớp: qua 80% thì mở thẳng vùng tiếp theo
const POOL = { hira: () => ITEMS.filter(i => i.type === 'kana' && i.cat === 'h'), n5: () => ITEMS.filter(i => i.type === 'kana' && i.grp !== 'ext'), n4: () => ITEMS.filter(i => i.lv === 'n5') }
const NAME = { hira: 'phần Katakana của Làng Kana', n5: 'Rừng Tre N5', n4: 'Thị trấn N4' }
// Qua kiểm tra Hiragana: đánh dấu các trạm Hiragana là đã qua (không cộng XP rương)
const passHira = () => { const nm = REGIONS[0].nodes, end = nm.findIndex(n => n.id === 'hC'); setState(s => { const L = { ...s.lessons }, C = { ...s.chests }; for (const n of nm.slice(0, end + 1)) { if (n.kind === 'chest') C[n.id] = C[n.id] || 1; else L[n.id] = L[n.id] || { stars: 1, test: true, date: Date.now() } } return { lessons: L, chests: C } }) }
export default function Placement({ region, onExit, onPass }) {
  const qs = useMemo(() => planQuiz(POOL[region](), { n: 20, mix: false }), [region])
  const intro = { hira: 'Hiragana', n5: 'Hiragana & Katakana', n4: 'kanji và từ vựng N5' }[region]
  const [res, setRes] = useState(null)
  if (res) return <Celebrate open title={res.pass ? 'Bạn đã qua bài kiểm tra!' : 'Chưa đủ điểm mở khóa'} mood={res.pass ? 'cheer' : 'sad'}
    sub={`Đúng ${res.score}/${res.total} (${Math.round(res.score / res.total * 100)}%). ` + (res.pass ? `${NAME[region]} đã được mở.` : 'Cần 80%. Bạn có thể học theo lộ trình hoặc thử lại sau.')} xp={res.pass ? 50 : 0}
    actions={<button className="btn-primary" onClick={() => res.pass ? onPass?.() : onExit?.()}>{res.pass ? 'Bắt đầu học ' + NAME[region] : 'Quay lại'}</button>} />
  return <Quiz questions={qs} title={'Kiểm tra xếp lớp: ' + intro} retry={false} onExit={onExit}
    onFinish={r => { const pass = r.score / r.total >= .8; if (pass) { if (region === 'hira') passHira(); else setState(s => ({ unlocks: { ...s.unlocks, [region]: true, ...(region === 'n4' ? { n5: true } : {}) } })); addXP(50) } setRes({ ...r, pass }) }} />
}
