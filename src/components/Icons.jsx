// Icon cartoon đồng bộ: viền tròn, có mảng màu nhạt
const S = { stroke: '#303345', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' }
const SC = { stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' }
const A = '#FFB7C5', M = '#BFE3D0', Y = '#FFD36B'
const ICONS = {
  home: <><path d="M4 11 12 4l8 7v8a2 2 0 0 1-2 2h-3v-6H9v6H6a2 2 0 0 1-2-2z" fill={A} {...S} /></>,
  map: <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill={M} {...S} /><path d="M9 4v14M15 6v14" {...S} /></>,
  kana: <><rect x="3" y="3" width="18" height="18" rx="5" fill={A} {...S} /><text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#303345" fontFamily="Noto Sans JP">あ</text></>,
  kanji: <><rect x="3" y="3" width="18" height="18" rx="5" fill={M} {...S} /><text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#303345" fontFamily="Noto Sans JP">字</text></>,
  cards: <><rect x="7" y="3" width="13" height="16" rx="3" fill={M} {...S} transform="rotate(8 13 11)" /><rect x="4" y="5" width="13" height="16" rx="3" fill={A} {...S} /><path d="M8 12h5M8 15h3" {...S} /></>,
  brush: <><path d="M14 4l6 6-8 8-6-6z" fill={Y} {...S} /><path d="M6 12l-2 6 2 2 6-2" fill={A} {...S} /></>,
  game: <><path d="M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6h-4A4 4 0 0 1 3 13v-1a4 4 0 0 1 4-4z" fill={M} {...S} /><path d="M7 11v3M5.5 12.5h3" {...S} /><circle cx="16" cy="11.5" r="1" fill="#303345" /><circle cx="18" cy="13.5" r="1" fill="#303345" /></>,
  trophy: <><path d="M7 4h10v5a5 5 0 0 1-10 0z" fill={Y} {...S} /><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v3M8 20h8M9 17h6v3H9z" {...SC} /></>,
  gear: <><circle cx="12" cy="12" r="7.5" fill={M} {...S} /><circle cx="12" cy="12" r="2.8" fill="#fff" {...S} /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" {...SC} /></>,
  review: <><path d="M20 12a8 8 0 1 1-2.4-5.7" fill="none" {...SC} /><path d="M20 4v4h-4" {...SC} /><circle cx="12" cy="12" r="3.5" fill={A} {...S} /></>,
  sun: <><circle cx="12" cy="12" r="4.5" fill={Y} {...S} /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...SC} /></>,
  moon: <><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill={Y} {...S} /></>,
  flame: <><path d="M12 22c-4 0-7-3-7-7 0-4 4-6 4-10 3 2 4 4 4 6 1-1 1.5-2 1.5-3 2.5 2 4.5 4.5 4.5 7 0 4-3 7-7 7z" fill="#FF9A5C" {...S} /><path d="M12 22c-2 0-3-1.5-3-3 0-2 2-3 2-5 2 1 4 3 4 5 0 1.5-1 3-3 3z" fill={Y} /></>,
  star: <><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill={Y} {...S} /></>,
  sound: <><path d="M4 9v6h4l5 4V5L8 9z" fill={A} {...S} /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" {...SC} /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" {...SC} strokeWidth="2.4" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" {...SC} strokeWidth="2.4" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="3" fill={Y} {...S} /><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" {...SC} /></>,
  check: <><path d="M5 12.5l4.5 4.5L19 7" fill="none" {...SC} strokeWidth="2.8" /></>,
  chest: <><rect x="3" y="10" width="18" height="10" rx="2" fill="#E3A86B" {...S} /><path d="M3 10c0-4 3-6 9-6s9 2 9 6z" fill={Y} {...S} /><rect x="10" y="11" width="4" height="4" rx="1" fill="#fff" {...S} /></>,
  flag: <><path d="M5 21V4M5 4h11l-2 4 2 4H5" fill={A} {...SC} /></>,
  back: <><path d="M15 5l-7 7 7 7" fill="none" {...SC} strokeWidth="2.6" /></>,
  next: <><path d="M9 5l7 7-7 7" fill="none" {...SC} strokeWidth="2.6" /></>,
  play: <><circle cx="12" cy="12" r="9" fill={A} {...S} /><path d="M10 8.5v7l6-3.5z" fill="#303345" /></>,
  reset: <><path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" {...SC} /><path d="M4 4v4h4" {...SC} /></>,
  target: <><circle cx="12" cy="12" r="9" fill={A} {...S} /><circle cx="12" cy="12" r="5" fill="#fff" {...S} /><circle cx="12" cy="12" r="1.8" fill="#303345" /></>,
  bolt: <><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill={Y} {...S} /></>,
  ear: <><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5 2" fill={A} {...S} /><path d="M10 9a2 2 0 0 1 4 0" {...S} /></>,
  puzzle: <><path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4H4z" fill={M} {...S} /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="3" fill="#fff" {...S} /><path d="M3 17l5-5 4 4 3-3 6 6" fill={M} {...S} /><circle cx="16" cy="9" r="1.8" fill={Y} {...S} /></>,
  keyboard: <><rect x="2.5" y="6" width="19" height="12" rx="3" fill={A} {...S} /><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M7 14h10" {...S} strokeWidth="2.4" /></>,
  sort: <><rect x="3" y="4" width="8" height="6" rx="2" fill={A} {...S} /><rect x="13" y="4" width="8" height="6" rx="2" fill={M} {...S} /><rect x="6" y="14" width="12" height="6" rx="2" fill={Y} {...S} /><path d="M12 10v3" {...SC} /></>,
  mic: <><rect x="8.5" y="3" width="7" height="11" rx="3.5" fill={A} {...S} /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" fill="none" {...SC} /></>,
  micw: <><rect x="8.5" y="3" width="7" height="11" rx="3.5" fill="#fff" stroke="#fff" strokeWidth="2" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></>,
  stop: <><rect x="7" y="7" width="10" height="10" rx="2.5" fill="#fff" /></>,
  guide: <><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" fill={M} {...S} /><path d="M4 21V5M8 7h6M8 10h4" {...S} /></>,
  crown: <><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill={Y} {...S} /><circle cx="12" cy="14.5" r="1.6" fill="#E85D75" /></>,
  grammar: <><rect x="3" y="4" width="18" height="16" rx="4" fill={Y} {...S} /><text x="12" y="15.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#303345" fontFamily="Noto Sans JP">は を</text></>,
  user: <><circle cx="12" cy="8.5" r="4.5" fill={A} {...S} /><path d="M3.5 21c1-4.5 4.5-7 8.5-7s7.5 2.5 8.5 7z" fill={M} {...S} /></>,
  quiz: <><rect x="4" y="3" width="16" height="18" rx="3" fill={Y} {...S} /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7M12 17h.01" {...S} /></>,
}
export default function Icon({ name, size = 24, className = '' }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">{ICONS[name]}</svg>
}
