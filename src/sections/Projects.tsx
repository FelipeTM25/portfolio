import { ArrowUpRight, Chip, LayerHeader, Panel, Reveal, Section } from '../components/ui'
import type { CaseStudy } from '../content/types'
import { FitallyDiagram } from '../diagrams/FitallyDiagram'
import { FuelixDiagram } from '../diagrams/FuelixDiagram'
import { useLang } from '../lib/i18n'

export function Projects() {
  const { t } = useLang()
  const p = t.projects

  return (
    <Section id="dominio">
      <LayerHeader layer="dominio" title={p.title} intro={p.intro} />

      <div className="space-y-28 md:space-y-40">
        {p.cases.map((c, i) => (
          <Case key={c.id} study={c} index={i} />
        ))}
      </div>

      <div className="mt-28 md:mt-40">
        <Reveal className="mb-10 flex flex-col gap-3 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-ink-3">
              <code className="normal-case tracking-normal">aggregates[]</code>
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{p.othersTitle}</h3>
          </div>
          <p className="max-w-sm text-ink-2">{p.othersIntro}</p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.others.map((o, i) => (
            <Reveal key={o.name} delay={(i % 3) * 0.06} className="h-full">
              <Panel className="flex h-full flex-col" bodyClassName="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-lg font-semibold tracking-tight">{o.name}</h4>
                  {o.href ? (
                    <a
                      href={o.href}
                      target="_blank"
                      rel="noreferrer"
                      className="label flex shrink-0 items-center gap-1 text-ink-3 transition-colors hover:text-signal"
                    >
                      {p.viewCode}
                      <ArrowUpRight />
                    </a>
                  ) : (
                    <span className="label shrink-0 text-ink-3">{p.privateRepo}</span>
                  )}
                </div>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-2">{o.summary}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {o.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Case({ study: c, index }: { study: CaseStudy; index: number }) {
  const { t } = useLang()
  const p = t.projects

  return (
    <article aria-labelledby={`case-${c.id}`}>
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <code className="font-mono text-xs text-ink-3">
            <span className="text-ink-2">{String(index + 1).padStart(2, '0')}</span> · {c.context}
          </code>
          <Chip tone="signal">
            <span aria-hidden className="size-1.5 rounded-full bg-signal" />
            {c.status}
          </Chip>
        </div>
        <h3
          id={`case-${c.id}`}
          className="mt-5 font-display text-[clamp(3.5rem,10vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
        >
          {c.name}
        </h3>
        <p className="mt-5 max-w-3xl font-display text-2xl leading-snug tracking-tight text-balance md:text-3xl">
          {c.tagline}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 md:grid-cols-12">
        <Reveal className="space-y-8 md:col-span-7" delay={0.05}>
          <div>
            <p className="label text-ink-3">{c.problemTitle}</p>
            <p className="mt-3 text-lg leading-relaxed text-pretty">{c.problem}</p>
          </div>
          <div>
            <p className="label text-ink-3">{c.approachTitle}</p>
            <p className="mt-3 text-lg leading-relaxed text-pretty">{c.approach}</p>
          </div>
          <div>
            <p className="label text-ink-3">{p.roleLabel}</p>
            <p className="mt-3 leading-relaxed text-ink-2">{c.role}</p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.12}>
          <dl className="divide-y divide-line border-y border-line">
            {c.highlights.map((h) => (
              <div key={h.value} className="grid grid-cols-[minmax(0,9rem)_1fr] items-baseline gap-4 py-4">
                <dt className="font-display text-2xl font-semibold tracking-tight text-signal">{h.value}</dt>
                <dd className="text-[0.95rem] leading-snug text-ink-2">{h.label}</dd>
              </div>
            ))}
          </dl>
          <p className="label mt-8 text-ink-3">{p.stackLabel}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {c.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-12" delay={0.1}>
        {c.id === 'fuelix' ? <FuelixDiagram /> : <FitallyDiagram />}
      </Reveal>
    </article>
  )
}
