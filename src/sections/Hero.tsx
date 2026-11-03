import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Panel, StatusDot } from '../components/ui'
import { useLang } from '../lib/i18n'
import { scrollToId } from '../lib/scroll'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const { t, lang } = useLang()

  const request: { k: string; v: string }[] = [
    { k: 'Origin', v: 'Medellín, CO' },
    { k: 'Accept', v: lang === 'es' ? 'software/bien-hecho' : 'software/well-built' },
    { k: 'X-Stack', v: 'angular, spring-boot, react' },
    { k: 'X-Scope', v: 'full-stack' },
  ]

  return (
    <section
      id="cliente"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-10"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="label mb-6 flex items-center gap-3 text-ink-2"
      >
        <span className="text-signal">01</span>
        <span>{t.hero.eyebrow}</span>
      </motion.p>

      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h1 className="font-display text-[clamp(3.6rem,13vw,9.75rem)] font-semibold leading-[0.86] tracking-[-0.045em]">
            {['Felipe', 'Torres'].map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
                >
                  {word}
                  {i === 1 && <span className="text-signal">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2 text-pretty md:mt-10 md:text-xl"
          >
            {t.hero.lead}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
          className="md:max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none lg:pb-2"
        >
          <Panel
            label="request.http"
            aside={
              <span className="label flex items-center gap-2 text-ink-2">
                <StatusDot />
                {t.hero.sending}
              </span>
            }
            bodyClassName="p-4 md:p-5"
          >
            <pre className="overflow-x-auto font-mono text-[0.8rem] leading-7 md:text-sm">
              <motion.code
                className="block"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.9 } } }}
              >
                <Line>
                  <span className="font-semibold text-signal">GET</span> /felipe{' '}
                  <span className="text-ink-3">HTTP/1.1</span>
                </Line>
                {request.map((h) => (
                  <Line key={h.k}>
                    <span className="text-ink-3">{h.k}:</span> {h.v}
                  </Line>
                ))}
                <Line>
                  <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-signal" />
                </Line>
              </motion.code>
            </pre>
          </Panel>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToId('controller')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="label group mt-16 flex items-center gap-3 self-start text-ink-3 transition-colors hover:text-ink md:mt-20"
      >
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute left-0 top-0 block h-3 w-px animate-[cue_1.8s_ease-in-out_infinite] bg-signal motion-reduce:animate-none" />
        </span>
        {t.hero.cue}
      </motion.button>
    </section>
  )
}

function Line({ children }: { children: ReactNode }) {
  return (
    <motion.span
      className="block whitespace-pre"
      variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  )
}
