// Bộ hình minh họa cartoon cho từ vựng (viewBox 0 0 100 100). Nét viền mực, màu trong bảng màu chủ đạo.
const I = '#303345', SK = '#FFD9B8', SAK = '#FFB7C5', PR = '#E85D75', MA = '#BFE3D0', MA2 = '#7CC4A0', CR = '#FFF8EF', BL = '#9CC9F5', BL2 = '#4F95E0', YE = '#FFD36B', OR = '#F08A4B', BR = '#B9825A', GR = '#C9CBD8'
const O = `stroke="${I}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`
const P = (d, f = 'none') => `<path d="${d}" fill="${f}" ${O}/>`
const C = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${O}/>`
const E = (x, y, rx, ry, f) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${O}/>`
const R = (x, y, w, h, r, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${O}/>`
const L = (d, c = I, w = 2.6) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
const T = (x, y, t, s = 16, c = I) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Noto Sans JP,sans-serif" font-weight="700" font-size="${s}" fill="${c}">${t}</text>`
const f = n => +n.toFixed(1)
// một nhân vật tròn trịa: x,y = tâm đầu, s = tỉ lệ
const person = (x, y, s = 1, shirt = SAK, hair = '#5B4636', opt = {}) => {
  const k = v => f(v * s)
  let g = ''
  if (opt.long) g += P(`M${f(x - k(11))} ${f(y + k(12))} Q${f(x - k(13))} ${f(y - k(4))} ${x} ${f(y - k(11))} Q${f(x + k(13))} ${f(y - k(4))} ${f(x + k(11))} ${f(y + k(12))}Z`, hair)
  g += P(`M${f(x - k(13))} ${f(y + k(36))} Q${f(x - k(14))} ${f(y + k(12))} ${x} ${f(y + k(11))} Q${f(x + k(14))} ${f(y + k(12))} ${f(x + k(13))} ${f(y + k(36))}Z`, shirt)
  if (opt.tie) g += P(`M${x} ${f(y + k(12))} l${k(-3)} ${k(8)} l${k(3)} ${k(10)} l${k(3)} ${k(-10)}Z`, PR)
  g += C(x, y, k(10), SK)
  g += P(`M${f(x - k(10))} ${f(y - k(1))} A${k(10)} ${k(10)} 0 0 1 ${f(x + k(10))} ${f(y - k(1))} Q${x} ${f(y - k(5))} ${f(x - k(10))} ${f(y - k(1))}Z`, hair)
  g += `<circle cx="${f(x - k(3.5))}" cy="${f(y + k(2))}" r="${k(1.4)}" fill="${I}"/><circle cx="${f(x + k(3.5))}" cy="${f(y + k(2))}" r="${k(1.4)}" fill="${I}"/>`
  g += L(`M${f(x - k(2.5))} ${f(y + k(5.5))} Q${x} ${f(y + k(7.5))} ${f(x + k(2.5))} ${f(y + k(5.5))}`, I, 1.8)
  return g
}
const cal = (mark, arrow) => R(18, 22, 64, 62, 10, '#fff') + `<path d="M18 40 V32 a10 10 0 0 1 10 -10 h44 a10 10 0 0 1 10 10 V40Z" fill="${PR}" ${O}/>` + L('M34 16 V28 M66 16 V28') + mark + (arrow || '')
const bldg = (x, y, w, h, fill) => R(x, y, w, h, 4, fill)
const win = (x0, y0, nx, ny, dx, dy) => { let s = ''; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) s += `<rect x="${x0 + i * dx}" y="${y0 + j * dy}" width="7" height="7" rx="1.5" fill="${BL}" stroke="${I}" stroke-width="1.6"/>`; return s }
const house = (x, y, s, roof, wall) => P(`M${x - 14 * s} ${y} L${x} ${y - 13 * s} L${x + 14 * s} ${y}Z`, roof) + R(x - 11 * s, y, 22 * s, 16 * s, 2, wall) + R(x - 3 * s, y + 7 * s, 6 * s, 9 * s, 1, BR)
const petal = (cx, cy, r) => [0, 72, 144, 216, 288].map(a => `<ellipse cx="${cx}" cy="${cy - r}" rx="${r * .62}" ry="${r}" fill="${SAK}" stroke="${I}" stroke-width="2.2" transform="rotate(${a} ${cx} ${cy})"/>`).join('') + `<circle cx="${cx}" cy="${cy}" r="${r * .35}" fill="${PR}"/>`
const sun = (x, y, r) => { let s = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += L(`M${f(x + Math.cos(a) * (r + 5))} ${f(y + Math.sin(a) * (r + 5))} L${f(x + Math.cos(a) * (r + 11))} ${f(y + Math.sin(a) * (r + 11))}`, '#F2A20C', 3.2) } return s + C(x, y, r, YE) }
const cloud = (x, y, s, fill = '#fff') => P(`M${x - 22 * s} ${y + 8 * s} Q${x - 26 * s} ${y - 6 * s} ${x - 12 * s} ${y - 6 * s} Q${x - 8 * s} ${y - 18 * s} ${x + 4 * s} ${y - 14 * s} Q${x + 16 * s} ${y - 20 * s} ${x + 20 * s} ${y - 4 * s} Q${x + 30 * s} ${y - 2 * s} ${x + 24 * s} ${y + 8 * s}Z`, fill)
const pin = (x, y, c) => P(`M${x} ${y + 14} C${x - 12} ${y} ${x - 10} ${y - 12} ${x} ${y - 12} C${x + 10} ${y - 12} ${x + 12} ${y} ${x} ${y + 14}Z`, c) + `<circle cx="${x}" cy="${y - 2}" r="3.5" fill="#fff"/>`
const book = (x, y, c) => R(x, y, 34, 44, 4, c) + L(`M${x + 7} ${y} V${y + 44}`) + R(x + 12, y + 10, 16, 8, 2, '#fff')

export const ILL = {
  wave: person(44, 40, 1.3, SAK) + L('M62 62 L76 34', OR, 7) + C(77, 31, 5, SK) + L('M84 20 l5 -4 M88 32 l7 0', PR),
  gift: R(22, 44, 56, 40, 6, SAK) + R(18, 32, 64, 14, 5, '#FF8FA6') + `<rect x="45" y="32" width="10" height="52" fill="${PR}" ${O}/>` + P('M50 32 C38 16 26 26 40 32Z', PR) + P('M50 32 C62 16 74 26 60 32Z', PR),
  bow: `<g transform="rotate(22 50 70)">${person(50, 36, 1.3, MA)}</g>` + L('M70 26 q6 -4 10 0 M74 18 q6 -4 10 0', MA2),
  sunrise: sun(50, 66, 18) + `<rect x="8" y="66" width="84" height="22" fill="${MA}" ${O}/>` + L('M8 66 H92'),
  check: C(50, 50, 32, MA) + L('M34 51 L46 63 L67 38', MA2, 7),
  cross: C(50, 50, 32, SAK) + L('M37 37 L63 63 M63 37 L37 63', PR, 7),
  me: person(46, 34, 1.4, SAK) + L('M78 58 L60 58', PR, 4) + L('M66 51 L59 58 L66 65', PR, 4),
  person: person(50, 32, 1.6, MA),
  water: P('M28 22 L72 22 L66 86 L34 86Z', '#fff') + P('M31 44 Q40 40 50 44 Q60 48 69 44 L66 86 L34 86Z', BL) + E(44, 62, 3, 5, '#fff'),
  mountain: P('M6 84 L40 26 L52 44 L60 34 L94 84Z', '#8FA3D6') + P('M40 26 L31 42 L37 40 L42 45 L47 39Z', '#fff') + E(76, 24, 9, 9, YE),
  river: P('M6 30 Q30 20 50 30 Q70 40 94 30 V70 Q70 80 50 70 Q30 60 6 70Z', BL) + L('M18 48 q8 -4 16 0 M54 52 q8 -4 16 0', '#fff', 3) + `<path d="M6 30 Q30 20 50 30 Q70 40 94 30 V14 H6Z M6 70 Q30 60 50 70 Q70 80 94 70 V88 H6Z" fill="${MA}" ${O}/>`,
  tree: L('M44 92 L34 98 M56 92 L66 98', BR, 4) + P('M44 54 L42 94 L58 94 L56 54Z', BR) + C(50, 40, 26, MA2) + C(38, 34, 5, '#a6dcbf') + C(60, 46, 4, '#a6dcbf'),
  book: book(33, 26, PR),
  school: bldg(16, 38, 68, 48, CR) + P('M10 40 L50 16 L90 40Z', PR) + C(50, 30, 6, '#fff') + L('M50 27 V30 L52 32', I, 2) + win(24, 48, 2, 2, 12, 14) + win(62, 48, 2, 2, 12, 14) + R(44, 64, 12, 22, 2, BR),
  teacher: R(8, 18, 46, 32, 4, '#3E6B57') + L('M16 28 h20 M16 36 h14', '#fff', 2.5) + person(70, 42, 1.25, '#9CC9F5') + L('M56 62 L36 40', BR, 3),
  student: R(56, 52, 22, 26, 6, PR) + person(46, 34, 1.4, '#9CC9F5'),
  friends: person(32, 38, 1.2, SAK) + person(68, 38, 1.2, MA, '#2f2a2a'),
  family: person(28, 32, 1.05, '#9CC9F5') + person(72, 32, 1.05, SAK, '#5B4636', { long: true }) + person(42, 56, .75, YE) + person(58, 56, .75, MA),
  mother: person(50, 34, 1.5, SAK, '#5B4636', { long: true }),
  father: person(50, 32, 1.5, '#9CC9F5', '#3a2e2a', { tie: true }),
  train: R(20, 18, 60, 62, 18, '#fff') + `<path d="M20 50 H80" stroke="${BL2}" stroke-width="6"/>` + R(30, 26, 40, 18, 6, BL) + C(34, 64, 4, YE) + C(66, 64, 4, YE) + L('M30 80 L22 92 M70 80 L78 92 M16 92 H84'),
  station: bldg(14, 40, 72, 44, CR) + P('M8 42 L50 22 L92 42Z', MA2) + R(36, 46, 28, 16, 3, '#fff') + T(50, 59, '駅', 13) + R(40, 66, 20, 18, 2, BL),
  shop: bldg(16, 40, 68, 46, '#fff') + `<path d="M12 28 H88 L84 44 H16Z" fill="${SAK}" ${O}/>` + L('M28 28 L26 44 M44 28 L43 44 M58 28 L58 44 M72 28 L74 44', PR, 2.6) + R(24, 54, 24, 18, 2, BL) + R(56, 54, 18, 32, 2, BR),
  fish: P('M16 50 C30 28 62 28 74 50 C62 72 30 72 16 50Z', BL) + P('M74 50 L92 34 L88 50 L92 66Z', BL2) + C(30, 46, 3.5, '#fff') + L('M44 40 q6 10 0 20', I, 2.2),
  meat: P('M30 70 C14 56 22 24 50 22 C76 20 84 50 66 64 C56 72 40 76 30 70Z', '#E8775F') + E(48, 44, 10, 7, '#F7A58F') + L('M30 70 L18 84', '#fff', 7) + C(15, 84, 5, '#fff') + C(20, 90, 5, '#fff'),
  tea: P('M22 40 H70 L66 74 Q46 88 26 74Z', MA2) + P('M70 46 Q86 48 82 60 Q78 70 68 66', 'none') + E(46, 40, 24, 5, '#9ED7B8') + L('M36 30 q-4 -6 0 -12 M48 30 q-4 -6 0 -12 M60 30 q-4 -6 0 -12', GR, 2.6),
  weather: sun(36, 38, 15) + cloud(60, 64, 1.1),
  rain: cloud(50, 40, 1.4, '#E3E7F5') + L('M32 66 l-4 10 M50 66 l-4 10 M68 66 l-4 10 M41 80 l-4 10 M59 80 l-4 10', BL2, 3.2),
  dog: P('M24 34 C14 34 12 60 22 62 L30 46Z', BR) + P('M76 34 C86 34 88 60 78 62 L70 46Z', BR) + C(50, 54, 28, '#F2D3A8') + E(50, 66, 12, 9, '#fff') + E(50, 61, 5, 3.5, I) + `<circle cx="40" cy="50" r="3" fill="${I}"/><circle cx="60" cy="50" r="3" fill="${I}"/>` + L('M46 70 Q50 74 54 70', I, 2),
  cat: P('M26 40 L28 14 L46 30Z', '#C9CBD8') + P('M74 40 L72 14 L54 30Z', '#C9CBD8') + C(50, 54, 28, '#E4E6EF') + `<path d="M31 24 L32 34 L39 30Z M69 24 L68 34 L61 30Z" fill="${SAK}"/>` + E(40, 52, 3, 4.5, I) + E(60, 52, 3, 4.5, I) + P('M47 60 L53 60 L50 64Z', SAK) + L('M50 64 Q46 70 42 66 M50 64 Q54 70 58 66 M22 58 L36 60 M22 66 L36 64 M78 58 L64 60 M78 66 L64 64', I, 2),
  nametag: R(14, 28, 72, 48, 10, '#fff') + `<path d="M14 46 V38 a10 10 0 0 1 10 -10 h52 a10 10 0 0 1 10 10 V46Z" fill="${PR}" ${O}/>` + T(50, 70, '名前', 18) + C(50, 20, 4, YE),
  eat: P('M16 50 H84 Q80 82 50 84 Q20 82 16 50Z', PR) + E(50, 50, 34, 6, '#fff') + C(42, 44, 5, '#fff') + C(54, 42, 5, '#fff') + L('M60 46 L86 14 M66 48 L92 18', BR, 3.2),
  drink: P('M28 30 H72 L66 86 H34Z', '#fff') + P('M30 48 H70 L66 86 H34Z', '#C98A5A') + L('M56 30 L64 8 L74 8', PR, 4),
  go: person(36, 34, 1.3, MA) + L('M62 60 H90 M80 50 L90 60 L80 70', PR, 5),
  come: R(56, 16, 32, 70, 3, BR) + C(64, 54, 2.5, YE) + L('M10 52 H46 M36 42 L46 52 L36 62', PR, 5),
  see: P('M8 50 Q50 10 92 50 Q50 90 8 50Z', '#fff') + C(50, 50, 16, BL2) + C(50, 50, 7, I) + `<circle cx="55" cy="45" r="3.5" fill="#fff"/>`,
  listen: P('M44 20 C70 18 78 46 64 60 C56 68 58 80 46 82 C38 84 34 76 38 70', SK) + L('M48 36 C58 34 62 48 52 54', I, 2.6) + T(78, 34, '♪', 22, PR) + T(84, 64, '♫', 20, MA2),
  talk: P('M10 22 H56 a8 8 0 0 1 8 8 V50 a8 8 0 0 1 -8 8 H30 L18 70 L20 58 H10 a8 8 0 0 1 -8 -8 V30 a8 8 0 0 1 8 -8Z', SAK) + P('M44 46 H86 a8 8 0 0 1 8 8 V72 a8 8 0 0 1 -8 8 H80 L82 92 L70 80 H44 a8 8 0 0 1 -8 -8 V54 a8 8 0 0 1 8 -8Z', MA) + T(33, 46, 'あ', 18) + T(66, 70, 'に', 16),
  read: P('M50 30 C38 22 20 22 10 28 V80 C20 74 38 74 50 82Z', '#fff') + P('M50 30 C62 22 80 22 90 28 V80 C80 74 62 74 50 82Z', '#fff') + L('M18 40 h22 M18 50 h22 M18 60 h18 M60 40 h22 M60 50 h22 M60 60 h18', GR, 2.4),
  write: R(16, 14, 50, 70, 5, '#fff') + L('M24 30 h32 M24 42 h32 M24 54 h20', GR, 2.4) + `<g transform="rotate(40 66 60)">${R(60, 20, 12, 56, 3, YE)}${P('M60 76 L66 90 L72 76Z', SK)}${R(60, 14, 12, 8, 2, PR)}</g>`,
  buy: P('M20 36 H80 L74 88 H26Z', SAK) + L('M36 44 V28 a14 14 0 0 1 28 0 V44', I, 3) + petal(50, 64, 7),
  big: C(40, 52, 30, PR) + C(82, 70, 9, SAK),
  small: C(30, 52, 30, '#FFE3EA') + C(76, 66, 11, PR) + L('M76 40 V50 M70 44 L76 50 L82 44', PR, 3),
  new: R(24, 34, 52, 46, 6, MA) + L('M24 50 H76 M50 34 V80', '#fff', 5) + P('M78 12 L82 22 L92 24 L82 28 L78 38 L74 28 L64 24 L74 22Z', YE) + P('M20 14 L22 20 L28 22 L22 24 L20 30 L18 24 L12 22 L18 20Z', YE),
  old: P('M14 50 L50 20 L86 50Z', '#B39B85') + R(22, 50, 56, 36, 2, '#E3D5C3') + R(42, 62, 16, 24, 2, BR) + L('M28 58 l6 8 l-4 6 M66 56 l-5 7 l5 5', I, 2) + L('M58 28 l4 6 l-3 5', I, 2),
  tall: P('M50 8 L60 90 H40Z', PR) + L('M44 40 H56 M42 60 H58 M40 80 H60', '#fff', 3) + R(28, 88, 44, 6, 3, GR),
  cheap: P('M18 36 L52 36 L84 64 L60 88 L18 54Z', YE) + C(32, 48, 5, '#fff') + T(54, 70, '¥', 22, PR) + L('M82 14 V34 M74 26 L82 34 L90 26', MA2, 4),
  today: cal(C(50, 62, 12, SAK) + T(50, 68, '今', 16)),
  tomorrow: cal(T(42, 70, '明', 18), L('M60 64 H80 M72 56 L80 64 L72 72', PR, 4)),
  yesterday: cal(T(58, 70, '昨', 18), L('M44 64 H24 M32 56 L24 64 L32 72', PR, 4)),
  everyday: cal(L('M28 52 l4 4 l7 -8 M48 52 l4 4 l7 -8 M68 52 l4 4 l7 -8 M28 70 l4 4 l7 -8 M48 70 l4 4 l7 -8', MA2, 3)),
  clock: C(50, 52, 34, '#fff') + L('M50 52 V30 M50 52 L64 60', I, 4) + C(50, 52, 3, PR) + R(42, 10, 16, 8, 3, PR),
  moon: P('M62 14 A36 36 0 1 0 62 86 A28 28 0 1 1 62 14Z', YE) + T(76, 38, '✦', 16, YE) + T(82, 66, '✦', 12, YE),
  office: bldg(28, 12, 44, 80, '#DDE6F7') + win(34, 20, 3, 6, 11, 11) + R(44, 80, 12, 12, 2, BR) + bldg(8, 50, 20, 42, MA) + bldg(72, 40, 20, 52, SAK),
  briefcase: R(14, 34, 72, 48, 8, BR) + L('M38 34 V24 a4 4 0 0 1 4 -4 H58 a4 4 0 0 1 4 4 V34', I, 3) + L('M14 54 H86', I, 2.6) + R(44, 50, 12, 10, 2, YE),
  worker: person(42, 32, 1.35, '#5A6C9A', '#2f2a2a', { tie: true }) + R(62, 64, 26, 20, 4, BR),
  hospital: bldg(16, 32, 68, 56, '#fff') + R(38, 14, 24, 24, 4, '#fff') + L('M50 18 V34 M42 26 H58', PR, 5) + win(24, 46, 2, 2, 12, 14) + win(62, 46, 2, 2, 12, 14) + R(44, 66, 12, 22, 2, BL),
  doctor: person(50, 30, 1.45, '#fff') + L('M40 52 Q42 70 54 68 Q62 66 60 56', I, 2.4) + C(60, 54, 3, GR) + L('M50 62 V74 M44 68 H56', PR, 3),
  road: P('M38 12 H62 L92 92 H8Z', '#9AA0B5') + L('M50 20 V30 M50 42 V54 M50 66 V84', '#fff', 4) + `<path d="M8 92 L38 12 H6 V92Z M92 92 L62 12 H94 V92Z" fill="${MA}" ${O}/>`,
  town: house(24, 56, 1.1, PR, CR) + house(52, 50, 1.3, MA2, '#fff') + house(80, 58, 1, '#F2A20C', CR) + L('M4 76 H96'),
  village: house(30, 58, 1.3, '#C98A5A', CR) + house(66, 62, 1.1, '#C98A5A', CR) + C(86, 46, 9, MA2) + L('M86 55 V76', BR, 3) + C(12, 50, 8, MA2) + L('M12 58 V78', BR, 3) + L('M2 78 H98'),
  heart: P('M50 86 C10 60 8 30 30 22 C42 18 50 28 50 34 C50 28 58 18 70 22 C92 30 90 60 50 86Z', PR) + E(36, 38, 6, 4, '#FF9FB2'),
  photo: `<g transform="rotate(-6 50 50)">${R(16, 16, 68, 74, 4, '#fff')}${R(24, 24, 52, 44, 2, BL)}${P('M24 68 L42 46 L54 58 L62 50 L76 68Z', MA2)}${C(64, 34, 5, YE)}</g>`,
  walk: person(40, 30, 1.25, MA) + L('M62 70 l6 4 M74 82 l6 4 M60 88 l6 4', BR, 4),
  noon: sun(50, 46, 20) + L('M10 88 H90', MA2, 4),
  night: C(50, 50, 40, '#3B3F66') + P('M58 26 A24 24 0 1 0 58 74 A18 18 0 1 1 58 26Z', YE) + T(72, 42, '✦', 12, '#fff') + T(30, 34, '✦', 9, '#fff'),
  spring: petal(50, 46, 16) + petal(22, 76, 8) + petal(80, 78, 9),
  summer: P('M10 46 A40 40 0 0 0 90 46Z', '#7CC4A0') + P('M16 46 A34 34 0 0 0 84 46Z', '#FF8A8A') + `<circle cx="36" cy="58" r="2.5" fill="${I}"/><circle cx="50" cy="66" r="2.5" fill="${I}"/><circle cx="64" cy="58" r="2.5" fill="${I}"/>` + sun(78, 20, 8),
  autumn: P('M50 10 L56 30 L72 22 L66 40 L86 40 L70 54 L80 66 L60 62 L56 78 L50 66 L44 78 L40 62 L20 66 L30 54 L14 40 L34 40 L28 22 L44 30Z', OR) + L('M50 40 V92', BR, 3),
  winter: L('M50 12 V88 M17 31 L83 69 M17 69 L83 31', BL2, 5) + L('M42 18 L50 26 L58 18 M42 82 L50 74 L58 82', BL2, 4) + C(50, 50, 8, '#fff'),
  run: person(46, 28, 1.25, PR) + L('M8 50 H24 M6 62 H20 M10 74 H26', GR, 3.5),
  think: C(56, 38, 26, '#fff') + C(28, 72, 7, '#fff') + C(16, 86, 4, '#fff') + T(56, 46, '？', 24, PR),
  idea: P('M50 12 C30 12 22 28 26 42 C30 54 38 56 38 68 H62 C62 56 70 54 74 42 C78 28 70 12 50 12Z', YE) + R(38, 70, 24, 12, 4, GR) + L('M44 88 H56') + L('M12 30 l-6 -4 M88 30 l6 -4 M50 2 v4', '#F2A20C', 3),
  cake: R(20, 50, 60, 34, 6, '#FFE3EA') + P('M20 58 Q30 64 40 58 Q50 64 60 58 Q70 64 80 58 V54 a4 4 0 0 0 -4 -4 H24 a4 4 0 0 0 -4 4Z', '#fff') + C(50, 42, 7, PR) + L('M50 35 V28', MA2, 3) + R(14, 84, 72, 6, 3, GR),
  laptop: R(22, 22, 56, 40, 4, '#DDE6F7') + R(28, 28, 44, 28, 2, BL) + P('M10 64 H90 L84 76 H16Z', GR),
  borrow: book(12, 28, MA2) + L('M52 50 H86 M76 40 L86 50 L76 60', PR, 5),
  umbrella: P('M10 52 C14 22 86 22 90 52 Q80 46 70 52 Q60 46 50 52 Q40 46 30 52 Q20 46 10 52Z', PR) + L('M50 52 V82 Q50 90 42 88', I, 3.4) + L('M50 22 V14', I, 3),
  bag: P('M22 40 H78 L72 86 H28Z', PR) + L('M36 40 V30 a14 14 0 0 1 28 0 V40', I, 3.4) + R(42, 56, 16, 10, 3, YE),
  hourglass: R(24, 12, 52, 8, 3, BR) + R(24, 80, 52, 8, 3, BR) + P('M30 20 H70 C70 38 54 44 54 50 C54 56 70 62 70 80 H30 C30 62 46 56 46 50 C46 44 30 38 30 20Z', '#fff') + P('M38 32 H62 C60 40 52 44 50 48 C48 44 40 40 38 32Z', YE) + P('M36 78 C40 68 46 66 50 64 C54 66 60 68 64 78Z', YE),
  near: pin(38, 46, PR) + pin(62, 50, MA2) + L('M30 82 H70', GR, 3),
  far: pin(16, 40, PR) + pin(84, 40, MA2) + L('M22 72 H78', GR, 3) + `<path d="M22 72 H78" stroke="${I}" stroke-width="2.6" stroke-dasharray="4 5"/>`,
  phone: R(30, 10, 40, 80, 9, '#3B3F66') + R(35, 18, 30, 58, 3, BL) + C(50, 83, 3, '#fff') + C(44, 30, 4, YE) + R(40, 42, 20, 6, 3, '#fff'),
  treasure: R(16, 46, 68, 38, 6, '#C98A5A') + P('M16 46 C16 26 84 26 84 46Z', '#E3A86B') + L('M16 58 H84', I, 2.6) + R(44, 52, 12, 14, 3, YE) + P('M70 10 L74 20 L84 22 L74 26 L70 36 L66 26 L56 22 L66 20Z', YE),
  please: P('M48 88 L42 40 C40 28 52 26 54 38 L56 60Z', SK) + P('M52 88 L58 40 C60 28 48 26 46 38 L44 60Z', SK) + L('M20 30 l6 4 M14 48 h7 M80 30 l-6 4 M86 48 h-7', PR, 3),
}

export default function Illus({ id, size = 96, className = '' }) {
  const s = ILL[id]; if (!s) return null
  return <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: s }} />
}
