import { useInView } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Chip, Panel, StatusDot } from '../components/ui'
import { useLang } from '../lib/i18n'
import { useMediaQuery } from '../lib/useMediaQuery'
import { Icons } from './icons'
import { Node, Wire } from './parts'

const SALE_EVERY_MS = 1700
const HOP_MS = 650
const DRAIN_EVERY_MS = 200

/**
 * Live model of Fuelix's offline-first edge: sales keep flowing from the
 * dispenser to the station server; when the internet drops they queue
 * locally and drain to the cloud once the link is back.
 */
export function FuelixDiagram() {
  const { t } = useLang()
  const d = t.projects.fuelixDiagram
  const wide = useMediaQuery('(min-width: 768px)')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-10% 0px' })

  const [online, setOnline] = useState(true)
  const [sales, setSales] = useState(0)
  const [queued, setQueued] = useState(0)
  const [synced, setSynced] = useState(0)
  const onlineRef = useRef(online)
  useEffect(() => {
    onlineRef.current = online
  }, [online])

  // Sales happen on the forecourt regardless of connectivity.
  useEffect(() => {
    if (!inView) return
    const timers = new Set<number>()
    const sell = () => {
      setSales((n) => n + 1)
      // The event reaches the station server after two hops.
      const id = window.setTimeout(() => {
        timers.delete(id)
        if (onlineRef.current) setSynced((n) => n + 1)
        else setQueued((n) => n + 1)
      }, HOP_MS * 2)
      timers.add(id)
    }
    const first = window.setTimeout(sell, 400)
    const interval = window.setInterval(sell, SALE_EVERY_MS)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(interval)
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [inView])

  // Back online: drain the local queue to the cloud.
  const draining = online && queued > 0
  useEffect(() => {
    if (!draining) return
    const id = window.setInterval(() => {
      setQueued((n) => Math.max(0, n - 1))
      setSynced((n) => n + 1)
    }, DRAIN_EVERY_MS)
    return () => window.clearInterval(id)
  }, [draining])

  const vertical = !wide
  const nodeWidth = 'md:w-40 lg:w-52'

  const nodes = [
    <Node key="d" title={d.dispenser} sub={d.dispenserSub} icon={Icons.pump} className={nodeWidth} />,
    <Node key="g" title={d.gateway} sub={d.gatewaySub} icon={Icons.chip} className={nodeWidth} />,
    <Node
      key="s"
      title={d.station}
      sub={d.stationSub}
      icon={Icons.server}
      highlight={!online || queued > 0}
      className={nodeWidth}
      badge={queued > 0 ? <Chip tone="signal">{queued} {d.queued}</Chip> : undefined}
    />,
    <Node key="c" title={d.cloud} sub={d.cloudSub} icon={Icons.cloud} dim={!online} className={nodeWidth} />,
  ]

  const wires = [
    <Wire key="w1" vertical={vertical} state="flow" pulseKey={sales} />,
    <Wire key="w2" vertical={vertical} state="flow" pulseKey={sales} delay={HOP_MS / 1000} />,
    <Wire key="w3" vertical={vertical} state={online ? 'flow' : 'broken'} pulseKey={synced} />,
  ]

  return (
    <Panel
      label={d.title}
      aside={
        <span className="label hidden items-center gap-2 text-ink-2 sm:flex" aria-live="polite">
          <StatusDot tone={online ? 'ok' : 'fail'} />
          {online ? d.online : d.offline}
        </span>
      }
      bodyClassName="p-4 md:p-8"
    >
      <div ref={ref} className="flex flex-col md:flex-row md:items-center">
        {nodes.map((node, i) => (
          <Fragment key={i}>
            {node}
            {wires[i]}
          </Fragment>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <dl className="flex gap-6 font-mono text-sm">
          <Stat label={d.sales} value={sales} />
          <Stat label={d.queued} value={queued} accent={queued > 0} />
          <Stat label={d.synced} value={synced} />
        </dl>
        <p className="label flex items-center gap-2 text-ink-2 sm:hidden" aria-live="polite">
          <StatusDot tone={online ? 'ok' : 'fail'} />
          {online ? d.online : d.offline}
        </p>
        <button
          type="button"
          onClick={() => setOnline((v) => !v)}
          aria-pressed={!online}
          className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            online ? 'bg-ink text-paper hover:bg-ink/85' : 'bg-ok text-[#0b1f14] hover:bg-ok/85'
          }`}
        >
          {online ? d.goOffline : d.goOnline}
        </button>
      </div>
    </Panel>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <dt className="label text-ink-3">{label}</dt>
      <dd className={`mt-1 text-xl tabular-nums ${accent ? 'text-signal' : ''}`}>{value}</dd>
    </div>
  )
}
