import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Backdrop } from './components/Backdrop'
import { Nav } from './components/Nav'
import { RequestRail } from './components/RequestRail'
import { useLang } from './lib/i18n'
import { initSmoothScroll } from './lib/scroll'
import { useLayerProgress } from './lib/useLayerProgress'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Stack } from './sections/Stack'

export default function App() {
  const { t } = useLang()
  const { active, progress } = useLayerProgress()

  useEffect(() => initSmoothScroll(), [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-md bg-ink px-3 py-2 text-sm text-paper focus:translate-y-0"
      >
        {t.ui.skip}
      </a>
      <Backdrop />
      <Nav active={active} progress={progress} />
      <RequestRail active={active} progress={progress} />
      <main id="main" className="relative z-10 lg:pl-24">
        <Hero />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>
    </MotionConfig>
  )
}
