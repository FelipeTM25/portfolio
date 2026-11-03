import { useEffect, useRef } from 'react'

/** Must match `background-size` / `background-position` of the grid in index.css. */
const GRID = 32
const OFFSET = -1

const TRAIL = 56 // px of trail behind each packet
const TRAIL_STEPS = 8
const TURN_CHANCE = 0.18 // probability of turning at each intersection

interface Point {
  x: number
  y: number
}

interface Packet extends Point {
  dx: number
  dy: number
  speed: number
  traveled: number
  life: number
  sinceNode: number
  /** Start point and every corner, in order. Used to draw the trail around turns. */
  path: Point[]
}

interface Ping extends Point {
  t: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Runs the packet animation on `canvas` until the returned cleanup is called.
 * Lives outside React on purpose: it is an imperative render loop.
 */
function runPackets(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  let w = 0
  let h = 0
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  let color = '#ff5a1f'
  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue('--signal').trim() || color
  }
  readColor()
  const themeObserver = new MutationObserver(readColor)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  schemeQuery.addEventListener('change', readColor)

  const packets: Packet[] = []
  const pings: Ping[] = []

  // Packets live in document coordinates (y includes scroll) so they stay on the grid.
  const spawn = () => {
    const cols = Math.floor(w / GRID)
    const rows = Math.ceil(h / GRID)
    if (cols < 3 || rows < 3) return
    const col = 1 + Math.floor(Math.random() * (cols - 1))
    const row = Math.floor(window.scrollY / GRID) + 1 + Math.floor(Math.random() * (rows - 1))
    const horizontal = Math.random() < 0.5
    const sign = Math.random() < 0.5 ? -1 : 1
    const x = col * GRID + OFFSET
    const y = row * GRID + OFFSET
    packets.push({
      x,
      y,
      dx: horizontal ? sign : 0,
      dy: horizontal ? 0 : sign,
      speed: 55 + Math.random() * 65,
      traveled: 0,
      life: GRID * (6 + Math.floor(Math.random() * 14)),
      sinceNode: 0,
      path: [{ x, y }],
    })
  }

  /** Point `d` px behind the head, following the packet's corners. */
  const behind = (p: Packet, d: number): Point => {
    let hx = p.x
    let hy = p.y
    for (let i = p.path.length - 1; i >= 0; i--) {
      const c = p.path[i]
      const seg = Math.abs(hx - c.x) + Math.abs(hy - c.y)
      if (d <= seg) {
        const k = seg === 0 ? 0 : d / seg
        return { x: hx + (c.x - hx) * k, y: hy + (c.y - hy) * k }
      }
      d -= seg
      hx = c.x
      hy = c.y
    }
    return { x: hx, y: hy }
  }

  const step = (p: Packet, dist: number) => {
    while (dist > 0 && p.traveled < p.life) {
      const move = Math.min(dist, GRID - p.sinceNode)
      p.x += p.dx * move
      p.y += p.dy * move
      p.sinceNode += move
      p.traveled += move
      dist -= move
      if (p.sinceNode >= GRID) {
        p.sinceNode = 0
        if (Math.random() < TURN_CHANCE) {
          const s = Math.random() < 0.5 ? -1 : 1
          const turnedX = p.dy !== 0 ? s : 0
          const turnedY = p.dx !== 0 ? s : 0
          p.dx = turnedX
          p.dy = turnedY
          p.path.push({ x: p.x, y: p.y })
          if (p.path.length > 6) p.path.shift()
        }
      }
    }
  }

  const loop = { raf: 0, last: performance.now(), nextSpawn: 700 }

  const frame = (now: number) => {
    const dt = Math.min((now - loop.last) / 1000, 0.05)
    loop.last = now
    const sy = window.scrollY
    const max = w < 768 ? 3 : 6

    loop.nextSpawn -= dt * 1000
    if (loop.nextSpawn <= 0) {
      if (packets.length < max) spawn()
      loop.nextSpawn = 900 + Math.random() * 1700
    }

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineCap = 'round'

    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i]
      step(p, p.speed * dt)

      const fade = Math.min(1, p.traveled / 40) * Math.min(1, (p.life - p.traveled) / 90)
      const vy = p.y - sy
      if (vy > -TRAIL && vy < h + TRAIL) {
        // trail: short segments, fading away from the head
        ctx.lineWidth = 1.25
        let prev: Point = { x: p.x, y: p.y }
        const visibleTrail = Math.min(TRAIL, p.traveled)
        for (let s = 1; s <= TRAIL_STEPS; s++) {
          const pt = behind(p, (visibleTrail * s) / TRAIL_STEPS)
          ctx.globalAlpha = fade * 0.45 * (1 - (s - 1) / TRAIL_STEPS)
          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y - sy)
          ctx.lineTo(pt.x, pt.y - sy)
          ctx.stroke()
          prev = pt
        }
        // head + soft glow
        ctx.globalAlpha = fade * 0.12
        ctx.beginPath()
        ctx.arc(p.x, vy, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = fade * 0.85
        ctx.beginPath()
        ctx.arc(p.x, vy, 1.75, 0, Math.PI * 2)
        ctx.fill()
      }

      if (p.traveled >= p.life) {
        pings.push({ x: p.x, y: p.y, t: 0 })
        packets.splice(i, 1)
      }
    }

    // arrival pings
    ctx.lineWidth = 1
    for (let i = pings.length - 1; i >= 0; i--) {
      const g = pings[i]
      g.t += dt / 0.9
      if (g.t >= 1) {
        pings.splice(i, 1)
        continue
      }
      ctx.globalAlpha = (1 - g.t) * 0.35
      ctx.beginPath()
      ctx.arc(g.x, g.y - sy, 2 + g.t * 9, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    loop.raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (loop.raf) return
    loop.last = performance.now()
    loop.raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    cancelAnimationFrame(loop.raf)
    loop.raf = 0
  }
  const onVisibility = () => (document.hidden ? stop() : start())

  start()
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibility)
  return () => {
    stop()
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
    themeObserver.disconnect()
    schemeQuery.removeEventListener('change', readColor)
  }
}

/** Lights up the grid around the cursor. Returns a cleanup. */
function runSpotlight(el: HTMLDivElement): () => void {

  let mx = -1000
  let my = -1000
  let frame = 0
  const apply = () => {
    frame = 0
    el.style.setProperty('--mx', `${mx}px`)
    el.style.setProperty('--my', `${my}px`)
    el.style.backgroundPosition = `${OFFSET}px ${OFFSET - window.scrollY}px`
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(apply)
  }
  const onMove = (e: PointerEvent) => {
    mx = e.clientX
    my = e.clientY
    el.style.opacity = '1'
    schedule()
  }
  const onLeave = (e: MouseEvent) => {
    if (!e.relatedTarget) el.style.opacity = '0'
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('scroll', schedule, { passive: true })
  document.addEventListener('mouseout', onLeave)
  return () => {
    if (frame) cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('scroll', schedule)
    document.removeEventListener('mouseout', onLeave)
  }
}

/**
 * Ambient background: data packets travel along the blueprint grid lines,
 * occasionally turning at an intersection and pinging when they arrive.
 * On desktop the grid also lights up faintly around the cursor.
 * Everything is skipped when the user prefers reduced motion.
 */
export function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  // Packets on the grid
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return
    return runPackets(canvas)
  }, [])

  // Cursor spotlight on the grid (mouse/trackpad only)
  useEffect(() => {
    const el = spotRef.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    return runSpotlight(el)
  }, [])

  const mask = 'radial-gradient(circle 170px at var(--mx, -1000px) var(--my, -1000px), rgb(0 0 0 / 0.28), transparent 70%)'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        ref={spotRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          backgroundImage:
            'linear-gradient(var(--signal) 1px, transparent 1px), linear-gradient(90deg, var(--signal) 1px, transparent 1px)',
          backgroundSize: `${GRID}px ${GRID}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
