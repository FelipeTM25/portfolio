import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Panel } from '../components/ui'
import type { FitallyDiagramText } from '../content/types'
import { useLang } from '../lib/i18n'
import { useMediaQuery } from '../lib/useMediaQuery'
import { Icons } from './icons'
import { Node, Wire } from './parts'

type ActionId = FitallyDiagramText['actions'][number]['id']
type ServiceId = 'db' | 'ai' | 'food' | 'exercises'

const ROUTES: Record<ActionId, { service: ServiceId; persists: boolean; ms: number }> = {
  food: { service: 'food', persists: true, ms: 184 },
  ai: { service: 'ai', persists: true, ms: 1260 },
  exercise: { service: 'exercises', persists: false, ms: 212 },
}

interface LogLine {
  id: number
  text: string
  tone: 'out' | 'in'
}

/**
 * Fitally's backend-for-frontend: the PWA only talks to the Express API,
 * which is the only place that holds keys for OpenAI, FatSecret and ExerciseDB.
 */
export function FitallyDiagram() {
  const { t } = useLang()
  const d = t.projects.fitallyDiagram
  const wide = useMediaQuery('(min-width: 768px)')
  const vertical = !wide

  const [run, setRun] = useState(0)
  const [action, setAction] = useState<ActionId | null>(null)
  const [phase, setPhase] = useState(0)
  const [log, setLog] = useState<LogLine[]>([])
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  const fire = (id: ActionId) => {
    timers.current.forEach((tid) => window.clearTimeout(tid))
    timers.current = []
    const next = run + 1
    const route = ROUTES[id]
    const label = d.actions.find((a) => a.id === id)!.log
    setRun(next)
    setAction(id)
    setPhase(1)
    setLog((l) => [...l, { id: next * 2, text: `→ ${label}`, tone: 'out' as const }].slice(-4))
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    at(650, () => setPhase(2))
    at(1300, () => setPhase(route.persists ? 3 : 4))
    if (route.persists) at(1900, () => setPhase(4))
    at(route.persists ? 2300 : 1700, () => {
      setPhase(0)
      setLog((l) =>
        [...l, { id: next * 2 + 1, text: `← 200 OK · ${route.ms + ((next * 37) % 60)} ms`, tone: 'in' as const }].slice(-4),
      )
    })
  }

  const route = action ? ROUTES[action] : null
  const lit = (s: ServiceId) =>
    route !== null && ((phase >= 2 && route.service === s) || (phase >= 3 && route.persists && s === 'db'))

  const services: { id: ServiceId; title: string; icon: ReactNode }[] = [
    { id: 'db', title: d.db, icon: Icons.db },
    { id: 'ai', title: d.ai, icon: Icons.spark },
    { id: 'food', title: d.food, icon: Icons.food },
    { id: 'exercises', title: d.exercises, icon: Icons.dumbbell },
  ]

  return (
    <Panel label={d.title} bodyClassName="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center">
        <Node title={d.client} sub={d.clientSub} icon={Icons.phone} highlight={phase === 1} className="md:w-40 lg:w-44" />
        <Wire vertical={vertical} state={phase >= 1 ? 'flow' : 'idle'} pulseKey={run} className="md:max-w-28" />

        {/* Server boundary: keys never cross this line */}
        <div className="relative flex flex-1 flex-col rounded-xl border border-dashed border-ink-3/60 p-4 pt-8 md:flex-row md:items-center md:p-6 md:pt-9">
          <span className="label absolute left-4 top-2.5 flex items-center gap-1.5 text-ink-3 md:left-6">
            {Icons.lock}
            {d.boundary}
          </span>
          <Node title={d.api} sub={d.apiSub} icon={Icons.api} highlight={phase >= 1 && phase < 4} className="md:w-36 lg:w-40" />
          <Wire vertical={vertical} state={phase >= 2 ? 'flow' : 'idle'} pulseKey={phase >= 2 ? run : 0} />
          <div className="grid grid-cols-2 gap-2 md:w-48 md:grid-cols-1 md:border-l md:border-line md:py-1 md:pl-4 lg:w-52">
            {services.map((s) => (
              <Node key={s.id} title={s.title} icon={s.icon} highlight={lit(s.id)} className="py-2.5" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-line pt-5 md:grid-cols-[auto_1fr] md:items-start md:gap-8">
        <div className="flex flex-wrap gap-2">
          {d.actions.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => fire(a.id)}
              className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                action === a.id && phase > 0
                  ? 'border-signal bg-signal-soft'
                  : 'border-line hover:border-ink/40'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div
          className="min-h-[6.5rem] rounded-md bg-paper-2/70 p-3 font-mono text-[0.72rem] leading-6 md:text-xs"
          aria-live="polite"
        >
          {log.length === 0 ? (
            <p className="text-ink-3">{d.idle}</p>
          ) : (
            log.map((line) => (
              <p key={line.id} className={`truncate ${line.tone === 'in' ? 'text-ok' : 'text-ink-2'}`}>
                {line.text}
              </p>
            ))
          )}
        </div>
      </div>
    </Panel>
  )
}
