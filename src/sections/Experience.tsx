import { Chip, LayerHeader, Panel, Reveal, Section } from '../components/ui'
import { useLang } from '../lib/i18n'

function Mapping({ path }: { path: string }) {
  return (
    <span className="normal-case tracking-normal">
      <span className="text-signal">@GetMapping</span>
      <span className="text-ink-3">(</span>
      <span className="text-ink-2">"{path}"</span>
      <span className="text-ink-3">)</span>
    </span>
  )
}

export function Experience() {
  const { t, lang } = useLang()
  const e = t.experience
  const paths = lang === 'es' ? ['/experiencia', '/formacion', '/principios'] : ['/experience', '/education', '/principles']

  return (
    <Section id="controller">
      <LayerHeader layer="controller" title={e.title} intro={e.intro} />

      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Panel label={<Mapping path={paths[0]} />} aside={<Chip tone="ok">{e.period}</Chip>} className="h-full">
            <p className="label text-ink-3">{e.program}</p>
            <h3 className="mt-3 font-display text-5xl font-semibold tracking-[-0.03em] md:text-6xl">{e.company}</h3>
            <p className="mt-2 text-xl text-ink-2">{e.jobTitle}</p>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-2 text-pretty">{e.jobSummary}</p>
            <ul className="mt-6 space-y-3">
              {e.jobPoints.map((point) => (
                <li key={point} className="flex gap-3 leading-relaxed">
                  <span aria-hidden className="mt-[0.15em] font-mono text-sm text-signal">
                    →
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {e.jobTags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </Panel>
        </Reveal>

        <div className="grid gap-6 lg:col-span-5">
          <Reveal delay={0.08}>
            <Panel label={<Mapping path={paths[1]} />}>
              <p className="label text-ink-3">{e.educationTitle}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{e.school}</h3>
              <p className="mt-1 text-ink-2">{e.degree}</p>
            </Panel>
          </Reveal>

          <Reveal delay={0.16}>
            <Panel label={<Mapping path={paths[2]} />}>
              <p className="label text-ink-3">{e.principlesTitle}</p>
              <ol className="mt-4 divide-y divide-line">
                {e.principles.map((p, i) => (
                  <li key={p.name} className="grid grid-cols-[2rem_1fr] gap-x-2 py-4 first:pt-0 last:pb-0">
                    <span className="font-mono text-sm text-signal">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
