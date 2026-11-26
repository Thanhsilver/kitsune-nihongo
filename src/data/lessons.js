import { KANA, KJ, V } from './core.js'
import { DAK, YOON, EXT, GUIDES } from './kana2.js'
import { G_BY } from './grammar.js'
// Lộ trình dạng bản đồ: mỗi vùng (region) có các trạm: lesson (bài học), station (thử thách), chest (rương thưởng)
const kanaIds = (pref, rs) => rs.map(r => pref + ':' + r)
const ROWS = [['a', 'i', 'u', 'e', 'o'], ['ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so'], ['ta', 'chi', 'tsu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no'], ['ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo'], ['ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n']]
const RN = ['Hàng あ', 'Hàng か・さ', 'Hàng た・な', 'Hàng は・ま', 'Hàng や・ら・わ・ん']
const RNK = ['Hàng ア', 'Hàng カ・サ', 'Hàng タ・ナ', 'Hàng ハ・マ', 'Hàng ヤ・ラ・ワ・ン']
const K = s => [...s].map(c => 'K' + c)
const W = (...ws) => ws.map(w => { const v = V.find(x => x.w === w); if (!v) throw new Error('missing ' + w); return v.id })

const L = (id, title, items, icon) => ({ id, kind: 'lesson', title, items, icon })
const S = (id, title) => ({ id, kind: 'station', title })
const C = id => ({ id, kind: 'chest', title: 'Rương thưởng' })
const GR = (...ids) => ids.map(g => ({ id: 'gr_' + g, kind: 'grammar', gid: g, title: 'Ngữ pháp: ' + G_BY[g].short, sub: G_BY[g].title, items: ['G:' + g], icon: 'grammar' }))
const G = id => ({ id, kind: 'guide', title: GUIDES[id].title, rules: GUIDES[id].rules, icon: 'guide' })
const DK1 = DAK.slice(0, 15).map(x => x[0]), DK2 = DAK.slice(15).map(x => x[0]), YN1 = YOON.slice(0, 15).map(x => x[0]), YN2 = YOON.slice(15).map(x => x[0])

export const REGIONS = [
  { id: 'nm', name: 'Làng Kana', sub: 'Nhập môn', color: '#FFB7C5', nodes: [
    G('g0'),
    ...ROWS.map((r, i) => L('h' + (i + 1), 'Hiragana: ' + RN[i], kanaIds('h', r), 'あ')), S('hS1', 'Thử thách: 46 chữ Hiragana'), C('hC1'),
    G('g1'), L('h6', 'Hiragana biến âm が・ざ・だ', kanaIds('h', DK1), 'が'), L('h7', 'Hiragana biến âm ば・ぱ', kanaIds('h', DK2), 'ぱ'),
    L('h8', 'Âm ghép きゃ・しゃ・ちゃ…', kanaIds('h', YN1), 'きゃ'), L('h9', 'Âm ghép みゃ・りゃ・ぎゃ…', kanaIds('h', YN2), 'りゃ'),
    G('g2'), S('hS', 'Thi thử Hiragana'), C('hC'),
    ...ROWS.map((r, i) => L('k' + (i + 1), 'Katakana: ' + RNK[i], kanaIds('k', r), 'ア')), S('kS1', 'Thử thách: 46 chữ Katakana'), C('kC1'),
    L('k6', 'Katakana biến âm ガ・ザ・ダ', kanaIds('k', DK1), 'ガ'), L('k7', 'Katakana biến âm バ・パ', kanaIds('k', DK2), 'パ'),
    L('k8', 'Âm ghép キャ・シャ・チャ…', kanaIds('k', YN1), 'キャ'), L('k9', 'Âm ghép ミャ・リャ・ギャ…', kanaIds('k', YN2), 'リャ'),
    L('k10', 'Katakana mở rộng ファ・ティ…', EXT.map(x => 'k:x' + x[0]), 'ファ'), G('g3'), S('kS', 'Thi thử Katakana'), C('kC'),
  ] },
  { id: 'n5', name: 'Rừng Tre N5', sub: 'Sơ cấp 1', color: '#BFE3D0', nodes: [
    L('n5a', 'Chào hỏi', W('こんにちは', 'ありがとう', 'すみません', 'おはよう', 'さようなら', 'はい', 'いいえ'), 'wave'),
    ...GR('g01', 'g02', 'g03', 'g04'),
    L('n5b', 'Số đếm 1–10', K('一二三四五六七八九十'), '一'),
    L('n5c', 'Số lớn & tiền', K('百千万円'), '円'), S('n5S1', 'Thử thách: Câu cơ bản & số'), C('n5C1'),
    L('n5d', 'Các ngày trong tuần', K('日月火水木金土'), '日'),
    L('n5e', 'Cơ thể', K('人口目手足'), '手'),
    L('n5f', 'Vị trí & kích thước', K('大小中上下左右'), '上'),
    ...GR('g05', 'g06', 'g07'), S('n5S2', 'Thử thách: Kanji & chỉ định'), C('n5C2'),
    L('n5g', 'Người & gia đình', W('私', '人', '先生', '学生', '友達', '家族', '母', '父', '名前'), 'family'),
    L('n5h', 'Kanji: trường & đời sống', K('男女子学生先年時本食'), '学'),
    L('n5i', 'Thiên nhiên', [...K('山川'), ...W('山', '川', '木', '天気', '雨', '月', '犬', '猫')], 'mountain'),
    L('n5j', 'Đồ ăn & nơi chốn', W('水', '魚', '肉', 'お茶', '店', '駅', '電車', '学校', '本'), 'tea'),
    ...GR('g08', 'g09', 'g10'), S('n5S3', 'Thử thách: Từ vựng & động từ'), C('n5C3'),
    L('n5k', 'Động từ 1', W('食べる', '飲む', '行く', '来る', '見る'), 'eat'),
    ...GR('g11', 'g12', 'g13'),
    L('n5l', 'Động từ 2', W('聞く', '話す', '読む', '書く', '買う'), 'write'),
    ...GR('g14', 'g15', 'g16'), S('n5S5', 'Thử thách: Trợ từ & rủ rê'), C('n5C5'),
    L('n5m', 'Tính từ', W('大きい', '小さい', '新しい', '古い', '高い', '安い'), 'big'),
    ...GR('g17', 'g18', 'g19', 'g20', 'g21'),
    L('n5n', 'Thời gian', W('今日', '明日', '昨日', '毎日', '時間'), 'clock'),
    ...GR('g22', 'g23', 'g24', 'g25', 'g26'), S('n5S4', 'Thi thử N5'), C('n5C4'),
  ] },
  { id: 'n4', name: 'Thị trấn N4', sub: 'Sơ cấp 2', color: '#FFE3B3', nodes: [
    L('n4a', 'Công việc', [...K('会社員仕事'), ...W('会社', '仕事', '会社員')], 'briefcase'),
    L('n4b', 'Nhà & phố', [...K('家町村駅道'), ...W('道', '町', '村', '近所')], 'town'), S('n4S1', 'Thử thách: Nơi chốn'), C('n4C1'),
    L('n4c', 'Thời gian trong ngày', [...K('朝昼夜'), ...W('朝', '昼', '夜', '今夜')], 'sunrise'),
    L('n4d', 'Bốn mùa', [...K('春夏秋冬'), ...W('春', '夏', '秋', '冬')], 'spring'), S('n4S2', 'Thử thách: Thời gian'), C('n4C2'),
    L('n4e', 'Di chuyển', [...K('走歩近遠'), ...W('走る', '歩く', '近い', '遠い', '散歩')], 'run'),
    L('n4f', 'Suy nghĩ & làm', [...K('思知作使'), ...W('思う', '知る', '作る', '使う', '気持ち', '思い出')], 'idea'),
    L('n4g', 'Mượn & cầm', [...K('借貸持待'), ...W('借りる', '貸す', '持つ', '待つ')], 'bag'),
    L('n4h', 'Bệnh viện', [...K('病院医'), ...W('病院', '医者')], 'hospital'),
    L('n4i', 'Giao tiếp', W('便利', '大切', '簡単', 'お願いします', 'いらっしゃいませ'), 'please'), S('n4S3', 'Thi thử N4'), C('n4C3'),
  ] },
  { id: 'n3', name: 'Lâu đài N3', sub: 'Trung cấp', soon: true, nodes: [] },
  { id: 'n2', name: 'Núi Phú Sĩ N2', sub: 'Trung cao cấp', soon: true, nodes: [] },
  { id: 'n1', name: 'Đỉnh mây N1', sub: 'Cao cấp', soon: true, nodes: [] },
]
// items của trạm thử thách = gộp các bài trước nó (từ thử thách trước đó)
for (const r of REGIONS) { let acc = [], all = []; for (const n of r.nodes) { if (n.kind === 'lesson' || n.kind === 'grammar') { acc.push(...n.items); all.push(...n.items) } if (n.kind === 'station') { n.final = n.title.startsWith('Thi thử'); n.items = n.final ? all.slice() : acc; if (!n.final) acc = [] } if (n.kind === 'station' && n.final) { acc = []; all = n.id === 'hS' ? [] : all } } }
// Điều kiện mở vùng: hoàn thành bài thi cuối của vùng trước (hoặc qua bài kiểm tra xếp lớp)
export const REQUIRE = { n5: { node: 'kS', label: 'Thi thử Katakana (Làng Kana)' }, n4: { node: 'n5S4', label: 'Thi thử N5' } }
export const NODE = Object.fromEntries(REGIONS.flatMap(r => r.nodes.map((n, i) => [n.id, { ...n, region: r.id, idx: i }])))
