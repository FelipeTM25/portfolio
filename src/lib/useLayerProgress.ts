import { useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { LAYERS } from '../content/types'

/**
 * Tracks which layer (section) the reader is in and how far the "request"
 * has travelled. Progress is piecewise per section, so the packet on the rail
 * reaches marker N exactly when section N reaches the probe line — no matter
 * how tall each section is.
 */
export function useLayerProgress() {
  const [active, setActive] = useState(0)
  const raw = useMotionValue(0)
  const progress = useSpring(raw, { stiffness: 140, damping: 26, mass: 0.4 })

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const sections = LAYERS.map((id) => document.getElementById(id))
      if (sections.some((s) => !s)) return
      const tops = sections.map((s) => s!.getBoundingClientRect().top + window.scrollY)
      const probe = window.scrollY + window.innerHeight * 0.45
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      const last = LAYERS.length - 1

      let index = 0
      for (let i = 0; i < tops.length; i++) if (probe >= tops[i]) index = i

      let value: number
      if (atBottom || index === last) {
        index = last
        value = 1
      } else {
        const span = tops[index + 1] - tops[index]
        const frac = Math.min(Math.max((probe - tops[index]) / span, 0), 1)
        value = (index + frac) / last
      }

      raw.set(value)
      setActive((prev) => (prev === index ? prev : index))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [raw])

  return { active, progress }
}
