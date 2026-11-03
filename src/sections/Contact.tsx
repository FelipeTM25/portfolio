import { ArrowUpRight, LayerHeader, Panel, Reveal, Section, StatusDot } from '../components/ui'
import { LINKS } from '../content/links'
import { useLang } from '../lib/i18n'
import { scrollToId } from '../lib/scroll'

const YEAR = new Date().getFullYear()

export function Contact() {
  const { t, lang } = useLang()
  const c = t.contact
  const es = lang === 'es'

  const body: [string, string][] = [
    [es ? 'nombre' : 'name', 'Felipe Torres'],
    [es ? 'rol' : 'role', 'Full Stack Developer'],
    [es ? 'ubicacion' : 'location', 'Medellín, CO'],
    ['linkedin', 'in/fetorr'],
    ['github', 'FelipeTM25'],
  ]

  return (
    <Section id="respuesta" className="pb-12 md:pb-16">
      <LayerHeader layer="respuesta" title={c.title} intro={c.lead} />

      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-7">
          <Panel
            label="response.json"
            aside={
              <span className="label flex items-center gap-2 text-ok">
                <StatusDot tone="ok" pulse={false} />
                200 OK
              </span>
            }
            bodyClassName="p-4 md:p-5"
          >
            <pre className="overflow-x-auto font-mono text-[0.78rem] leading-7 md:text-sm">
              <code>
                <span className="text-ink-3">HTTP/1.1</span> <span className="font-semibold text-ok">200 OK</span>
                {'\n'}
                <span className="text-ink-3">Content-Type:</span> application/json
                {'\n'}
                <span className="text-ink-3">X-Open-To:</span> {es ? 'conversaciones' : 'conversations'}
                {'\n\n'}
                {'{'}
                {body.map(([k, v], i) => (
                  <span key={k}>
                    {'\n  '}
                    <span className="text-signal">"{k}"</span>: <span className="text-ok">"{v}"</span>
                    {i < body.length - 1 ? ',' : ''}
                  </span>
                ))}
                {'\n}'}
              </code>
            </pre>
          </Panel>
        </Reveal>

        <Reveal className="flex flex-col gap-3 lg:col-span-5" delay={0.1}>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-lg bg-signal px-5 py-4 text-lg font-semibold text-[#141416] transition-transform hover:-translate-y-0.5"
          >
            {c.linkedin}
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-lg border border-ink/25 px-5 py-4 text-lg font-semibold transition-colors hover:border-ink"
          >
            {c.github}
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {LINKS.email && (
            <a
              href={`mailto:${LINKS.email}`}
              className="group flex items-center justify-between rounded-lg border border-ink/25 px-5 py-4 font-mono text-base transition-colors hover:border-ink"
            >
              {LINKS.email}
              <ArrowUpRight className="size-5" />
            </a>
          )}
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {c.facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5">
                <dt className="label pt-0.5 text-ink-3">{f.label}</dt>
                <dd className="text-[0.95rem] text-ink-2">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <footer className="mt-28 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-3 md:mt-36 md:flex-row md:items-center md:justify-between">
        <p>
          {c.footer} · {YEAR}
        </p>
        <button
          type="button"
          onClick={() => scrollToId('cliente')}
          className="label flex items-center gap-2 self-start transition-colors hover:text-signal md:self-auto"
        >
          <span aria-hidden>↑</span>
          {c.backToTop}
        </button>
      </footer>
    </Section>
  )
}
