import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { LayerId } from '../content/types'
import { LAYERS } from '../content/types'
import { useLang } from '../lib/i18n'

/** Bordered surface with blueprint crop marks in the corners. */
export function Panel({
  children,
  label,
  aside,
  className = '',
  bodyClassName = 'p-5 md:p-6',
}: {
  children: ReactNode
  label?: ReactNode
  aside?: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div className={`relative border border-line bg-surface/80 ${className}`}>
      <span aria-hidden className="pointer-events-none absolute -left-1 -top-1 size-3 border-l border-t border-ink/60" />
      <span aria-hidden className="pointer-events-none absolute -right-1 -top-1 size-3 border-r border-t border-ink/60" />
      <span aria-hidden className="pointer-events-none absolute -bottom-1 -left-1 size-3 border-b border-l border-ink/60" />
      <span aria-hidden className="pointer-events-none absolute -bottom-1 -right-1 size-3 border-b border-r border-ink/60" />
      {label !== undefined && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 md:px-5">
          <span className="label truncate text-ink-3">{label}</span>
          {aside}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

export function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'signal' | 'ok' }) {
  const tones = {
    default: 'border-line text-ink-2',
    signal: 'border-signal/40 bg-signal-soft text-ink',
    ok: 'border-ok/40 bg-ok-soft text-ink',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.7rem] leading-none ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function StatusDot({ tone = 'signal', pulse = true }: { tone?: 'signal' | 'ok' | 'fail'; pulse?: boolean }) {
  const bg = { signal: 'bg-signal', ok: 'bg-ok', fail: 'bg-fail' }[tone]
  return (
    <span className="relative inline-flex size-2">
      {pulse && <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${bg}`} />}
      <span className={`relative inline-flex size-2 rounded-full ${bg}`} />
    </span>
  )
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Section heading that names the architectural layer this section represents. */
export function LayerHeader({ layer, title, intro }: { layer: LayerId; title: string; intro?: string }) {
  const { t } = useLang()
  const index = LAYERS.indexOf(layer) + 1
  const isResponse = layer === 'respuesta'
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="label mb-6 flex items-center gap-3 text-ink-3">
        <span className={isResponse ? 'text-ok' : 'text-signal'}>{String(index).padStart(2, '0')}</span>
        <span className="text-ink">{t.layers[layer].name}</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
        <code className="normal-case tracking-normal">{t.layers[layer].code}</code>
      </div>
      <h2 className="max-w-4xl font-display text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-balance">
        {title}
      </h2>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 text-pretty">{intro}</p>}
    </Reveal>
  )
}

export function Section({ id, children, className = '' }: { id: LayerId; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6 md:py-32 lg:px-10 ${className}`}>
      {children}
    </section>
  )
}

export function ArrowUpRight({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
