import { AnimatePresence, motion, type MotionValue } from 'motion/react'
import { LAYERS } from '../content/types'
import { useLang } from '../lib/i18n'
import { scrollToId } from '../lib/scroll'
import { useTheme } from '../lib/theme'

export function Nav({ active, progress }: { active: number; progress: MotionValue<number> }) {
  const { t, toggleLang } = useLang()
  const { theme, toggleTheme } = useTheme()
  const layer = LAYERS[active]
  const isResponse = layer === 'respuesta'

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6 lg:pl-28 lg:pr-10">
        <button
          type="button"
          onClick={() => scrollToId('cliente')}
          className="flex shrink-0 items-center gap-2 font-mono text-sm"
        >
          <span aria-hidden className="grid size-7 place-items-center rounded-md bg-ink text-[0.7rem] font-bold text-paper">
            FT
          </span>
          <span className="hidden sm:inline">felipe.torres</span>
        </button>

        {/* Live breadcrumb: where the request currently is */}
        <div className="label flex min-w-0 items-center gap-2 text-ink-3" aria-live="polite">
          <span aria-hidden className="hidden text-line sm:inline">/</span>
          <span className={isResponse ? 'text-ok' : 'text-signal'}>{String(active + 1).padStart(2, '0')}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={layer}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="truncate text-ink"
            >
              {t.layers[layer].name}
            </motion.span>
          </AnimatePresence>
        </div>

        <nav aria-label="Secciones" className="ml-auto hidden items-center gap-1 lg:flex">
          {LAYERS.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToId(id)}
              aria-current={i === active ? 'location' : undefined}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors hover:text-ink ${
                i === active ? 'text-ink' : 'text-ink-3'
              }`}
            >
              {t.ui.nav[id]}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t.ui.switchLang}
            title={t.ui.switchLang}
            className="grid h-9 min-w-9 place-items-center rounded-md border border-line px-2 font-mono text-xs transition-colors hover:border-ink/40"
          >
            {t.ui.langShort}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.ui.themeToLight : t.ui.themeToDark}
            title={theme === 'dark' ? t.ui.themeToLight : t.ui.themeToDark}
            className="grid size-9 place-items-center rounded-md border border-line transition-colors hover:border-ink/40"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet progress (the rail takes over on large screens) */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className={`h-0.5 origin-left lg:hidden ${isResponse ? 'bg-ok' : 'bg-signal'}`}
      />
    </header>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="10" cy="10" r="3.5" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M16.5 12.2A6.5 6.5 0 0 1 7.8 3.5a6.5 6.5 0 1 0 8.7 8.7Z" strokeLinejoin="round" />
    </svg>
  )
}
