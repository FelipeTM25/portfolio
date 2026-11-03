import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { LayerHeader, Panel, Reveal, Section } from '../components/ui'
import type { StackLayer } from '../content/types'
import { useLang } from '../lib/i18n'

const FILTERS: (StackLayer | 'all')[] = ['all', 'frontend', 'backend', 'datos', 'infra']
const MAX_RELEVANCE = 5

const COLS = 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)_minmax(0,1.4fr)_7rem]'

function RelevanceBar({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`${value}/${MAX_RELEVANCE}`}>
      {Array.from({ length: MAX_RELEVANCE }, (_, i) => (
        <span
          key={i}
          className={`block h-2.5 w-2 rounded-[2px] ${i < value ? (value === MAX_RELEVANCE ? 'bg-signal' : 'bg-ink-2') : 'bg-line'}`}
        />
      ))}
    </span>
  )
}

export function Stack() {
  const { t } = useLang()
  const s = t.stack
  const [filter, setFilter] = useState<StackLayer | 'all'>('all')

  const rows = (filter === 'all' ? s.rows : s.rows.filter((r) => r.layers.includes(filter))).toSorted(
    (a, b) => b.relevance - a.relevance,
  )

  return (
    <Section id="persistencia">
      <LayerHeader layer="persistencia" title={s.title} intro={s.intro} />

      <Reveal>
        <div role="group" aria-label={s.colLayer} className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                filter === f ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink/40'
              }`}
            >
              {f === 'all' ? s.all : s.layerNames[f]}
            </button>
          ))}
        </div>

        <Panel label="psql · portfolio" bodyClassName="p-0">
          {/* The query rewrites itself as you filter */}
          <pre className="overflow-x-auto border-b border-line px-4 py-4 font-mono text-[0.78rem] leading-6 md:px-5 md:text-sm">
            <code>
              <span className="text-signal">SELECT</span> {s.colName}, {s.colLayer}, {s.colUsedIn}, {s.colRelevance}
              {'\n'}
              {'  '}
              <span className="text-signal">FROM</span> stack
              {filter !== 'all' && (
                <>
                  {'\n'}
                  {' '}
                  <span className="text-signal">WHERE</span>{' '}
                  <span className="text-ok">'{s.layerNames[filter]}'</span> = <span className="text-signal">ANY</span>(
                  {s.colLayer})
                </>
              )}
              {'\n'}
              {' '}
              <span className="text-signal">ORDER BY</span> {s.colRelevance} <span className="text-signal">DESC</span>;
            </code>
          </pre>

          <div role="table" aria-label="Stack" className="font-mono text-[0.8rem] md:text-sm">
            <div
              role="row"
              className={`label grid grid-cols-[1fr_auto] gap-4 border-b border-line px-4 py-2.5 text-ink-3 md:px-5 ${COLS}`}
            >
              <span role="columnheader">{s.colName}</span>
              <span role="columnheader" className="hidden md:block">
                {s.colLayer}
              </span>
              <span role="columnheader" className="hidden md:block">
                {s.colUsedIn}
              </span>
              <span role="columnheader">{s.colRelevance}</span>
            </div>
            <div>
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map((r) => {
                  const core = r.relevance === MAX_RELEVANCE
                  const layers = r.layers.map((l) => s.layerNames[l]).join(', ')
                  return (
                    <motion.div
                      layout
                      key={r.name}
                      role="row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-line/70 px-4 py-3 transition-colors hover:bg-signal-soft md:px-5 ${COLS} ${
                        core ? 'bg-signal-soft/50' : ''
                      }`}
                    >
                      <span role="cell" className="flex items-center gap-2 font-sans text-[0.95rem] font-semibold">
                        {core && <span aria-hidden className="size-1.5 shrink-0 rotate-45 bg-signal" />}
                        {r.name}
                      </span>
                      <span role="cell" className="hidden text-ink-2 md:block">
                        {layers}
                      </span>
                      <span role="cell" className={`hidden md:block ${core ? 'text-ink-2' : 'text-ink-3'}`}>
                        {r.usedIn}
                      </span>
                      <span role="cell" className="justify-self-end md:justify-self-start">
                        <RelevanceBar value={r.relevance} />
                      </span>
                      {/* compact second line on mobile */}
                      <span aria-hidden className="col-span-2 mt-1 text-ink-3 md:hidden">
                        <span className="text-ink-2">{layers}</span> · {r.usedIn}
                      </span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <p className="px-4 py-3 text-ink-3 md:px-5">{s.rowsLabel(rows.length)}</p>
          </div>
        </Panel>
      </Reveal>
    </Section>
  )
}
