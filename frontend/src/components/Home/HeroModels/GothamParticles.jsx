import { useEffect } from 'react'
import gsap from 'gsap'

// ─── Single flake factory ───────────────────────────────────────────────────
const createFlake = (container, windRef) => {
  const rand = Math.random()
  const flake = document.createElement('div')

  // ── Type system: 3 layers of depth ──────────────────────────────────────
  let size, opacity, blur, color, duration

  if (rand < 0.55) {
    // Layer 1: far background — tiny, blurry, very faint, slow
    size     = Math.random() * 1.2 + 0.4
    opacity  = Math.random() * 0.2 + 0.04
    blur     = '2px'
    color    = `rgba(160, 200, 255, ${opacity})`
    duration = Math.random() * 12 + 12   // 12–24s
  } else if (rand < 0.85) {
    // Layer 2: midground — medium, slightly soft, moderate speed
    size     = Math.random() * 2 + 1.5
    opacity  = Math.random() * 0.35 + 0.15
    blur     = '0.8px'
    color    = `rgba(210, 228, 255, ${opacity})`
    duration = Math.random() * 6 + 6     // 6–12s
  } else {
    // Layer 3: foreground — large, crisp, fast, rare
    size     = Math.random() * 3.5 + 3
    opacity  = Math.random() * 0.25 + 0.08
    blur     = '0px'
    color    = `rgba(240, 248, 255, ${opacity})`
    duration = Math.random() * 4 + 3     // 3–7s
  }

  flake.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    top: -${size + 2}px;
    left: ${Math.random() * 102}%;
    pointer-events: none;
    z-index: 5;
    filter: blur(${blur});
    will-change: transform, opacity;
  `
  container.appendChild(flake)

  // ── Base horizontal drift + wind influence ───────────────────────────────
  // windRef.current is a value between -1 and 1 updated by wind gusts below
  const baseDrift = (Math.random() - 0.5) * 80
  const windInfluence = () => (windRef?.current ?? 0) * size * 30

  // ── GSAP timeline: fall + optional twinkle for foreground flakes ─────────
  const tl = gsap.timeline({
    onComplete: () => {
      flake.remove()
      createFlake(container, windRef)
    }
  })

  // Twinkle: foreground large flakes briefly pulse opacity mid-fall
  if (rand > 0.85) {
    tl.to(flake, {
      y: container.offsetHeight * 0.4,
      x: baseDrift * 0.4,
      duration: duration * 0.4,
      ease: 'none',
    })
    .to(flake, {
      opacity: opacity * 2.5,   // bright flash
      duration: 0.3,
      ease: 'power1.in',
      yoyo: true,
      repeat: 1,
    }, '<')                     // '<' = runs at same time as previous
    .to(flake, {
      y: container.offsetHeight + 20,
      x: baseDrift + windInfluence(),
      opacity: 0,
      duration: duration * 0.6,
      ease: 'none',
    })
  } else {
    // Normal fall — smooth, no twinkle
    tl.to(flake, {
      y: container.offsetHeight + 20,
      x: baseDrift + windInfluence(),
      opacity: 0,
      duration,
      ease: 'power1.in',  // slightly accelerates as it falls (gravity feel)
    })
  }
}

// ─── Wind gust system ───────────────────────────────────────────────────────
// Randomly shifts all new flakes left or right in waves
const startWind = (windRef) => {
  const gust = () => {
    const direction = Math.random() > 0.5 ? 1 : -1
    const strength  = Math.random() * 0.6  // 0 to 0.6

    // Gust blows in for 2–4s, then fades for 3–6s, then calm
    gsap.timeline()
      .to(windRef, {
        current: direction * strength,
        duration: Math.random() * 2 + 2,
        ease: 'power1.inOut'
      })
      .to(windRef, {
        current: 0,
        duration: Math.random() * 3 + 3,
        ease: 'power1.inOut',
        onComplete: () => {
          // Random calm period before next gust: 4–12s
          setTimeout(gust, Math.random() * 8000 + 4000)
        }
      })
  }

  // First gust starts after 3s
  setTimeout(gust, 3000)
}

// ─── Main component ─────────────────────────────────────────────────────────
const GothamParticles = ({ count = 90, containerRef }) => {
  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    // Shared wind state — a plain object (not React state) so it doesn't trigger re-renders
    const windRef = { current: 0 }
    startWind(windRef)

    const timeouts = []

    for (let i = 0; i < count; i++) {
      const isPreplaced = i < count * 0.55  // 55% start mid-screen (already snowing feel)
      const delay = isPreplaced ? 0 : Math.random() * 12000  // rest stagger over 12s

      const t = setTimeout(() => {
        const flake = document.createElement('div')
        const rand  = Math.random()

        const size    = rand < 0.55 ? Math.random() * 1.2 + 0.4
                      : rand < 0.85 ? Math.random() * 2 + 1.5
                      :               Math.random() * 3.5 + 3

        const opacity = rand < 0.55 ? Math.random() * 0.2 + 0.04
                      : rand < 0.85 ? Math.random() * 0.35 + 0.15
                      :               Math.random() * 0.25 + 0.08

        flake.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: rgba(210, 230, 255, ${opacity});
          border-radius: 50%;
          top: ${isPreplaced ? Math.random() * 100 + '%' : `-${size}px`};
          left: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 5;
          filter: blur(${rand < 0.55 ? '2px' : rand < 0.85 ? '0.8px' : '0px'});
          will-change: transform, opacity;
        `
        container.appendChild(flake)

        gsap.to(flake, {
          y: container.offsetHeight + 20,
          x: (Math.random() - 0.5) * 80 + (windRef.current * size * 30),
          opacity: 0,
          duration: rand < 0.55 ? Math.random() * 12 + 12
                  : rand < 0.85 ? Math.random() * 6 + 6
                  :               Math.random() * 4 + 3,
          ease: 'power1.in',
          onComplete: () => {
            flake.remove()
            createFlake(container, windRef)
          }
        })
      }, delay)

      timeouts.push(t)
    }

    return () => {
      timeouts.forEach(clearTimeout)
      gsap.killTweensOf('*')
    }
  }, [count, containerRef])

  return null
}

export default GothamParticles
