import Lenis from 'lenis'

let lenis: Lenis | null = null

const NAV_OFFSET = -64

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Starts smooth scrolling unless the user asked for reduced motion. Returns a cleanup. */
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({ autoRaf: true, lerp: 0.11 })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = id === 'cliente' ? 0 : NAV_OFFSET
  if (lenis) {
    lenis.scrollTo(el, { offset })
    return
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
