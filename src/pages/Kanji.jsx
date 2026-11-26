import { useState } from 'react'
import { ITEMS } from '../data/items.js'
import { useStore, setSetting, statusOf, markViewed } from '../lib/store.js'
import { speak } from '../lib/audio.js'
import { cx } from '../lib/util.js'
import { PageHead, Chips } from '../components/ui.jsx'
import CharDetail from '../components/CharDetail.jsx'

export default function Kanji() {
  const s = useStore(), lv = s.settings.lv === 'n4' ? 'n4' : 'n5'
  const list = ITEMS.filter(i => i.type === 'kanji' && i.lv === lv)
  const [sel, setSel] = useState(null)
  const c = list.find(x => x.id === sel) || list[0]
  return (
    <div>
      <PageHead title="Kanji" sub={`${list.length} chữ ${lv.toUpperCase()} với âm Hán Việt, thứ tự nét và mẹo nhớ bằng hình.`} mood="think" />
      <Chips items={[['n5', 'N5'], ['n4', 'N4']]} value={lv} onChange={v => { setSetting('lv', v); setSel(null) }} className="mb-5" />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
        <div className="card p-3 sm:p-5 order-2 lg:order-1">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] gap-2 sm:gap-3">
            {list.map(it => (
              <button key={it.id} type="button" onClick={() => { setSel(it.id); speak(it.say); markViewed([it.id]) }}
                className={cx('relative aspect-square rounded-2xl sm:rounded-3xl border-2 border-b-4 flex flex-col items-center justify-center transition hover:-translate-y-0.5', c.id === it.id ? 'border-primary bg-sakura-50 dark:bg-primary/15' : 'border-ink/10 dark:border-night-line bg-white dark:bg-night')}>
                <span className="jp text-[32px] leading-none">{it.w}</span><span className="text-xs muted mt-1">{it.k.hv}</span>
                {statusOf(s, it.id) !== 'new' && <span className={'absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ' + ({ mastered: 'bg-matcha-600', learning: 'bg-sakura', viewed: 'bg-ink/20' })[statusOf(s, it.id)]} />}
              </button>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:sticky lg:top-6"><CharDetail c={c} /></div>
      </div>
    </div>
  )
}
