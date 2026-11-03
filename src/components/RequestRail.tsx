import { motion, useTransform, type MotionValue } from 'motion/react'
import { LAYERS } from '../content/types'
import { useLang } from '../lib/i18n'
import { scrollToId } from '../lib/scroll'

/**
 * The spine of the page: a vertical wire on the left with one node per layer.
 * The orange packet travels down it as you scroll and turns green on 200 OK.
 */
export function RequestRail({ active, progress }: { active: number; progress: MotionValue<number> }) {
  const { t } = useLang()
  const top = useTransform(progress, (v) => `${v * 100}%`)
  const fill = useTransform(progress, (v) => v)
  const last = LAYERS.length - 1
  const done = active === last

  return (
    <aside aria-hidden className="pointer-events-none fixed bottom-0 left-0 top-14 z-30 hidden w-24 lg:block">
      <div className="absolute bottom-16 left-10 top-16 w-px">
        {/* wire */}
        <div className="absolute inset-0 bg-line" />
        <motion.div
          style={{ scaleY: fill }}
          className={`absolute inset-0 origin-top transition-colors duration-500 ${done ? 'bg-ok' : 'bg-signal'}`}
        />

        {/* layer nodes */}
        {LAYERS.map((id, i) => {
          const reached = i <= active
          return (
            <button
              key={id}
              type="button"
              tabIndex={-1}
              onClick={() => scrollToId(id)}
              style={{ top: `${(i / last) * 100}%` }}
              className="group pointer-events-auto absolute left-0 flex -translate-x-1/2 -translate-y-1/2 items-center"
            >
              <span
                className={`block size-2.5 rotate-45 border transition-colors duration-300 ${
                  reached ? (i === last ? 'border-ok bg-ok' : 'border-signal bg-signal') : 'border-ink-3 bg-paper'
                }`}
              />
              <span
                className={`label absolute left-5 whitespace-nowrap transition-colors duration-300 ${
                  i === active ? 'text-ink' : 'text-ink-3'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
                <span className="ml-2 opacity-0 transition-opacity group-hover:opacity-100">{t.layers[id].name}</span>
              </span>
            </button>
          )
        })}

        {/* the packet */}
        <motion.div style={{ top }} className="absolute left-0 -translate-x-1/2 -translate-y-1/2">
          <span
            className={`block size-3.5 rounded-full shadow-[0_0_0_4px_var(--paper),0_0_18px_2px_currentColor] transition-colors duration-500 ${
              done ? 'bg-ok text-ok' : 'bg-signal text-signal'
            }`}
          />
        </motion.div>
      </div>
    </aside>
  )
}
