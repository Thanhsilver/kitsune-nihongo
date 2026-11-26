// Mascot cáo Kitsune: mood = wave | happy | think | cheer | sleep | sad
const INK = '#303345', FUR = '#F08A4B', CREAM = '#FFF3E6', PINK = '#FFB7C5', RED = '#E85D75'
const o = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }

export default function Mascot({ mood = 'wave', size = 120, className = '' }) {
  const happy = mood === 'happy' || mood === 'cheer'
  const closed = mood === 'sleep'
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden="true">
      {/* đuôi */}
      <path d="M128 170 C178 176 196 130 180 96 C172 80 156 80 160 98 C166 124 152 148 124 152Z" fill={FUR} {...o} />
      <path d="M180 96 C172 80 156 80 160 98 C163 108 172 110 180 96Z" fill={CREAM} {...o} />
      {/* thân */}
      <path d="M66 180 C60 146 74 128 100 128 C126 128 140 146 134 180Z" fill={FUR} {...o} />
      <path d="M84 180 C80 158 88 144 100 144 C112 144 120 158 116 180Z" fill={CREAM} />
      <ellipse cx="82" cy="182" rx="15" ry="7" fill={FUR} {...o} />
      <ellipse cx="118" cy="182" rx="15" ry="7" fill={FUR} {...o} />
      {/* tay */}
      {mood === 'cheer' ? (<>
        <path d="M72 146 C58 134 52 118 54 104" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
        <path d="M72 146 C58 134 52 118 54 104" fill="none" stroke={FUR} strokeWidth="11" strokeLinecap="round" />
        <path d="M128 146 C142 134 148 118 146 104" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
        <path d="M128 146 C142 134 148 118 146 104" fill="none" stroke={FUR} strokeWidth="11" strokeLinecap="round" />
      </>) : mood === 'wave' ? (<>
        <ellipse cx="72" cy="160" rx="9" ry="12" fill={FUR} {...o} />
        <path d="M130 148 C146 140 154 124 152 110" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
        <path d="M130 148 C146 140 154 124 152 110" fill="none" stroke={FUR} strokeWidth="11" strokeLinecap="round" />
        <path d="M164 100 l8 -6 M166 114 l10 0 M160 88 l4 -9" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      </>) : mood === 'think' ? (<>
        <ellipse cx="72" cy="160" rx="9" ry="12" fill={FUR} {...o} />
        <path d="M128 150 C120 140 116 132 114 128" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
        <path d="M128 150 C120 140 116 132 114 128" fill="none" stroke={FUR} strokeWidth="11" strokeLinecap="round" />
      </>) : (<>
        <ellipse cx="72" cy="160" rx="9" ry="12" fill={FUR} {...o} />
        <ellipse cx="128" cy="160" rx="9" ry="12" fill={FUR} {...o} />
      </>)}
      {/* khăn quàng */}
      <path d="M64 130 C84 143 116 143 136 130 L139 143 C116 157 84 157 61 143Z" fill={RED} {...o} />
      <path d="M116 148 L126 174 L108 168Z" fill={RED} {...o} />
      {/* tai */}
      <path d="M50 68 L42 12 L90 46Z" fill={FUR} {...o} />
      <path d="M150 68 L158 12 L110 46Z" fill={FUR} {...o} />
      <path d="M57 58 L51 27 L78 46Z" fill={PINK} />
      <path d="M143 58 L149 27 L122 46Z" fill={PINK} />
      {/* đầu */}
      <path d="M38 94 C38 54 68 40 100 40 C132 40 162 54 162 94 C162 124 134 140 100 140 C66 140 38 124 38 94Z" fill={FUR} {...o} />
      <path d="M56 106 C62 86 84 88 100 100 C116 88 138 86 144 106 C144 128 124 140 100 140 C76 140 56 128 56 106Z" fill={CREAM} />
      <path d="M38 94 C38 54 68 40 100 40 C132 40 162 54 162 94 C162 124 134 140 100 140 C66 140 38 124 38 94Z" fill="none" {...o} />
      {/* hoa anh đào trên tai */}
      <g transform="translate(140 40)">
        {[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="0" cy="-7" rx="5" ry="7" fill={PINK} stroke={INK} strokeWidth="1.8" transform={`rotate(${a})`} />)}
        <circle r="3" fill={RED} />
      </g>
      {/* mắt */}
      {happy || closed ? (<>
        <path d={closed ? 'M68 96 Q78 100 88 96' : 'M68 98 Q78 86 88 98'} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <path d={closed ? 'M112 96 Q122 100 132 96' : 'M112 98 Q122 86 132 98'} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </>) : (<>
        <ellipse cx="78" cy={mood === 'think' ? 90 : 94} rx="7.5" ry="9.5" fill={INK} />
        <ellipse cx="122" cy={mood === 'think' ? 90 : 94} rx="7.5" ry="9.5" fill={INK} />
        <circle cx="80.5" cy={mood === 'think' ? 86 : 90} r="2.8" fill="#fff" />
        <circle cx="124.5" cy={mood === 'think' ? 86 : 90} r="2.8" fill="#fff" />
        {mood === 'sad' && <path d="M68 80 L86 84 M132 80 L114 84" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
      </>)}
      <ellipse cx="64" cy="112" rx="8" ry="5" fill={PINK} opacity=".85" />
      <ellipse cx="136" cy="112" rx="8" ry="5" fill={PINK} opacity=".85" />
      <path d="M95 108 Q100 104 105 108 Q100 114 95 108Z" fill={INK} />
      {mood === 'sad'
        ? <path d="M92 122 Q100 116 108 122" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        : happy ? <path d="M90 116 Q100 130 110 116Z" fill={RED} {...o} strokeWidth="2.5" />
          : <path d="M92 116 Q96 121 100 116 Q104 121 108 116" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
      {mood === 'think' && <g><circle cx="176" cy="40" r="14" fill="#fff" {...o} /><text x="176" y="47" textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize="20" fill={RED}>?</text><circle cx="160" cy="62" r="4" fill="#fff" {...o} /></g>}
      {mood === 'sleep' && <text x="160" y="40" fontFamily="Nunito" fontWeight="800" fontSize="22" fill={INK}>z<tspan fontSize="16" dy="-10">z</tspan></text>}
    </svg>
  )
}
