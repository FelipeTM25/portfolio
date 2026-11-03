import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export type WireState = 'flow' | 'idle' | 'broken'

/**
 * A connection between two nodes. `pulseKey` changes fire a packet along it.
 */
export function Wire({
  vertical,
  state,
  pulseKey,
  delay = 0,
  className = '',
}: {
  vertical: boolean
  state: WireState
  pulseKey?: number
  delay?: number
  className?: string
}) {
  const stroke = state === 'flow' ? 'var(--signal)' : state === 'broken' ? 'var(--fail)' : 'var(--line)'
  const line = vertical
    ? { x1: '50%', y1: '0', x2: '50%', y2: '100%' }
    : { x1: '0', y1: '50%', x2: '100%', y2: '50%' }

  return (
    <div
      className={`relative shrink-0 ${vertical ? 'mx-auto h-9 w-3' : 'h-3 min-w-6 flex-1 self-center'} ${className}`}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <line
          {...line}
          stroke={stroke}
          strokeWidth={1.5}
          strokeDasharray={state === 'broken' ? '3 5' : undefined}
          className={state === 'flow' ? 'wire-flow' : undefined}
          style={{ transition: 'stroke 300ms' }}
        />
      </svg>
      {state === 'broken' && (
        <span className="absolute left-1/2 top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-fail bg-paper font-mono text-[0.65rem] text-fail">
          ✕
        </span>
      )}
      {pulseKey !== undefined && pulseKey > 0 && state !== 'broken' && (
        <motion.span
          key={pulseKey}
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_10px_2px_var(--signal)]"
          initial={vertical ? { top: '0%', left: '50%', opacity: 0 } : { left: '0%', top: '50%', opacity: 0 }}
          animate={vertical ? { top: '100%', opacity: [0, 1, 1, 0] } : { left: '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.6, delay, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

export function Node({
  title,
  sub,
  icon,
  highlight = false,
  dim = false,
  badge,
  className = '',
}: {
  title: string
  sub?: string
  icon?: ReactNode
  highlight?: boolean
  dim?: boolean
  badge?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative rounded-lg border bg-paper px-3.5 py-3 transition-[border-color,opacity,box-shadow] duration-300 ${
        highlight ? 'border-signal shadow-[0_0_0_3px_var(--signal-soft)]' : 'border-line'
      } ${dim ? 'opacity-45' : ''} ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {icon && <span className={`shrink-0 ${highlight ? 'text-signal' : 'text-ink-2'}`}>{icon}</span>}
        <div className="min-w-0">
          <p className="text-[0.95rem] font-semibold leading-tight">{title}</p>
          {sub && <p className="mt-1 font-mono text-[0.66rem] leading-snug text-ink-3">{sub}</p>}
        </div>
      </div>
      {badge && <div className="absolute -right-2 -top-2.5">{badge}</div>}
    </div>
  )
}
