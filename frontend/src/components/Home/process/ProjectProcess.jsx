import { Suspense, useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Environment, Line, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { processSteps } from './processSteps'
import ProcessStepCard from './ProcessStepCard'
import BatarangModel from './BatarangModel'
import { useTheme } from '../../../context/ThemeContext'

const THEME = {
  dark: {
    sectionBg:    '#030305',
    headingColor: '#ffffff',
    labelColor:   '#4a9eff',
    dividerColor: '#4a9eff',
    dividerGlow:  '#4a9eff60',
    headingShadow:'0 0 40px rgba(74,158,255,0.3), 0 2px 4px rgba(0,0,0,0.8)',
    wireBase:     '#0d2a4a',
    wireGlow:     '#4a9eff',
    pulseColor:   '#a78bfa',
  },
  light: {
    sectionBg:    '#f0f4ff',
    headingColor: '#0a0a1a',
    labelColor:   '#d4200c',
    dividerColor: '#d4200c',
    dividerGlow:  '#d4200c60',
    headingShadow:'0 0 40px rgba(212,32,12,0.15), 0 2px 4px rgba(0,0,0,0.1)',
    wireBase:     '#c8d4ee',
    wireGlow:     '#d4200c',
    pulseColor:   '#f5c518',
  },
}

// ─── GlowingWire ──────────────────────────────────────────────────────────────
const GlowingWire = ({ tokens }) => {
  const { viewport } = useThree()
  const scroll = useScroll()
  const pulseRef = useRef()

  const { points, curve } = useMemo(() => {
    const spread = viewport.width * 0.28
    const anchors = processSteps.map((s, i) => {
      const x = s.side === 'left' ? -spread : s.side === 'right' ? spread : 0
      const y = -(i * viewport.height)
      return new THREE.Vector3(x, y, -0.5)
    })
    const c = new THREE.CatmullRomCurve3(anchors, false, 'catmullrom', 0.3)
    return { points: c.getPoints(120), curve: c }
  }, [viewport.width, viewport.height])

  useFrame(() => {
    if (!pulseRef.current) return
    const p = Math.min(scroll.offset * 0.999, 0.999)
    const pos = curve.getPointAt(p)
    pulseRef.current.position.set(pos.x, pos.y, pos.z + 0.4)
  })

  return (
    <group>
      <Line points={points} color={tokens.wireBase} lineWidth={1}   transparent opacity={1}    />
      <Line points={points} color={tokens.wireGlow}  lineWidth={1.5} transparent opacity={0.55} />
      <Line points={points} color={tokens.wireGlow}  lineWidth={6}   transparent opacity={0.06} />
      {processSteps.map((step, i) => {
        const spread = viewport.width * 0.28
        const x = step.side === 'left' ? -spread : step.side === 'right' ? spread : 0
        const y = -(i * viewport.height)
        return (
          <group key={i} position={[x, y, -0.3]}>
            <mesh>
              <ringGeometry args={[0.12, 0.19, 32]} />
              <meshBasicMaterial color={step.color} transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.07, 32]} />
              <meshBasicMaterial color={step.color} transparent opacity={1} />
            </mesh>
          </group>
        )
      })}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={tokens.pulseColor} transparent opacity={0.95} />
      </mesh>
    </group>
  )
}

// ─── ScrollWatcher ────────────────────────────────────────────────────────────
const ScrollWatcher = ({ completeFnRef, onScrollerReady, resetKey, forceOffsetRef }) => {
  const scroll      = useScroll()
  const completed   = useRef(false)
  const isReversing = useRef(false)

  useEffect(() => {
    if (scroll.el && onScrollerReady) onScrollerReady(scroll.el)
  }, [scroll.el])

  useEffect(() => { completed.current = false }, [resetKey])

  useFrame(() => {
    if (forceOffsetRef?.current !== null) {
      const forced = forceOffsetRef.current
      forceOffsetRef.current = null
      if (scroll.el) {
        const max = scroll.el.scrollHeight - scroll.el.clientHeight
        scroll.el.scrollTop = Math.round(forced * max)
      }
      scroll.offset       = forced
      completed.current   = true
      isReversing.current = true
      return
    }
    if (isReversing.current) {
      if (scroll.offset < 0.95) { isReversing.current = false; completed.current = false }
      return
    }
    if (completed.current) return
    // Use 0.97 instead of 0.99 — ScrollControls damping on mobile/touch
    // means scroll.offset approaches but may never quite reach 1.0
    if (scroll.offset >= 0.97) {
      completed.current = true
      completeFnRef?.current?.()
    }
  })

  return null
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────
const postSectionsHide = (el) => {
  if (!el) return
  el.style.transition = 'none'; el.style.opacity = '0'
  el.style.height = '0'; el.style.overflow = 'hidden'; el.style.pointerEvents = 'none'
}
const postSectionsShow = (el) => {
  if (!el) return
  el.style.transition = 'opacity 0.8s ease'; el.style.opacity = '1'
  el.style.height = 'auto'; el.style.overflow = 'visible'; el.style.pointerEvents = 'auto'
}
const lockScroll   = () => { document.body.style.overflow = 'hidden' }
const unlockScroll = () => { document.body.style.overflow = '' }

// ─── useScrollHijack ─────────────────────────────────────────────────────────
const useScrollHijack = ({
  sectionRef, scrollerRef, topSentinelRef, postSectionsRef,
  completeFnRef, forceOffsetRef,
  onJourneyComplete, onJourneyReset,
}) => {
  const phase      = useRef('before')
  const touchStart = useRef(0)

  useEffect(() => {
    const section   = sectionRef.current
    const topSentin = topSentinelRef?.current
    if (!section) return

    const getSectionTop = () => {
      if (topSentin) return Math.round(topSentin.getBoundingClientRect().top + window.scrollY)
      let top = 0, el = section
      while (el) { top += el.offsetTop; el = el.offsetParent }
      return Math.round(top)
    }

    const toHijackedForward = () => {
      if (phase.current !== 'before') return
      phase.current = 'hijacked'
      postSectionsHide(postSectionsRef?.current)
      lockScroll()
      window.scrollTo({ top: getSectionTop(), behavior: 'instant' })
      const sc = scrollerRef.current
      if (sc) sc.scrollTop = 0
    }

    const toHijackedReverse = () => {
      if (phase.current !== 'complete') return
      phase.current = 'hijacked'
      postSectionsHide(postSectionsRef?.current)
      lockScroll()
      window.scrollTo({ top: getSectionTop(), behavior: 'instant' })
      const sc = scrollerRef.current
      if (sc) sc.scrollTop = sc.scrollHeight - sc.clientHeight
      if (forceOffsetRef) forceOffsetRef.current = 1.0
      onJourneyReset?.()
    }

    const toComplete = () => {
      if (phase.current !== 'hijacked') return
      phase.current = 'complete'
      postSectionsShow(postSectionsRef?.current)
      unlockScroll()
      window.scrollTo({ top: getSectionTop(), behavior: 'instant' })
      onJourneyComplete?.()
    }

    const toBefore = () => {
      if (phase.current !== 'hijacked') return
      phase.current = 'before'
      unlockScroll()
      window.scrollTo({ top: getSectionTop(), behavior: 'instant' })
    }

    if (completeFnRef) completeFnRef.current = toComplete

    const onScroll = () => {
      const top = getSectionTop(), y = window.scrollY
      if (phase.current === 'hijacked') {
        if (Math.abs(y - top) > 1) window.scrollTo({ top, behavior: 'instant' })
        return
      }
      if (phase.current === 'before'   && y >= top) { toHijackedForward(); return }
      if (phase.current === 'complete' && y <  top) { toHijackedReverse(); return }
    }

    const onWheel = (e) => {
      if (phase.current !== 'hijacked') return
      const sc = scrollerRef.current
      if (!sc) { e.preventDefault(); return }
      const top = sc.scrollTop, max = sc.scrollHeight - sc.clientHeight
      if (e.deltaY < 0 && top <= 2) { toBefore(); return }
      e.preventDefault()
      const newTop = Math.min(max, Math.max(0, top + e.deltaY))
      sc.scrollTop = newTop
      // Reached end — complete immediately without waiting for damping
      if (newTop >= max - 2) toComplete()
    }

    const BLOCKED = new Set(['ArrowUp','ArrowDown',' ','Space','PageUp','PageDown','Home','End'])
    const onKeyDown = (e) => {
      if (phase.current !== 'hijacked' || !BLOCKED.has(e.key)) return
      e.preventDefault()
      const sc = scrollerRef.current
      if (!sc) return
      const top = sc.scrollTop, max = sc.scrollHeight - sc.clientHeight
      let d = 0
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Space') d = 80
      if (e.key === 'ArrowUp')  d = -80
      if (e.key === 'PageDown') d = 400
      if (e.key === 'PageUp')   d = -400
      if (e.key === 'End')      d = max
      if (e.key === 'Home')     d = -max
      if (d < 0 && top <= 2) { toBefore(); return }
      const newTop = Math.min(max, Math.max(0, top + d))
      sc.scrollTop = newTop
      if (newTop >= max - 2) toComplete()
    }

    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientY }
    const onTouchMove  = (e) => {
      if (phase.current !== 'hijacked') return
      const sc = scrollerRef.current
      if (!sc) { e.preventDefault(); return }
      const top = sc.scrollTop, max = sc.scrollHeight - sc.clientHeight
      const d = touchStart.current - e.touches[0].clientY
      touchStart.current = e.touches[0].clientY
      if (d < 0 && top <= 2) { toBefore(); return }
      e.preventDefault()
      const newTop = Math.min(max, Math.max(0, top + d))
      sc.scrollTop = newTop
      // FIX: on mobile, ScrollControls damping means scroll.offset in
      // ScrollWatcher may never reach 0.97 via inertia alone. Trigger
      // completion directly when the user's finger brings us to the end.
      if (newTop >= max - 2) toComplete()
    }

    window.addEventListener('scroll',     onScroll,     { passive: true  })
    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('keydown',    onKeyDown,    { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      window.removeEventListener('scroll',     onScroll)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('keydown',    onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      unlockScroll()
      if (completeFnRef)  completeFnRef.current  = null
      if (forceOffsetRef) forceOffsetRef.current = null
    }
  }, [])
}

// ─── ProjectProcess ───────────────────────────────────────────────────────────
const ProjectProcess = ({ children }) => {
  const sectionRef      = useRef()
  const scrollerRef     = useRef(null)
  const topSentinelRef  = useRef()
  const postSectionsRef = useRef()
  const completeFnRef   = useRef(null)
  const forceOffsetRef  = useRef(null)

  const [processComplete, setProcessComplete] = useState(false)
  const [resetKey,        setResetKey]        = useState(0)

  const { theme } = useTheme()
  const tokens    = THEME[theme] ?? THEME.dark
  const isDark    = theme === 'dark'

  const handleJourneyComplete = useCallback(() => { setProcessComplete(true) }, [])
  const handleJourneyReset    = useCallback(() => {
    setProcessComplete(false)
    setResetKey(k => k + 1)
  }, [])

  useScrollHijack({
    sectionRef, scrollerRef, topSentinelRef, postSectionsRef,
    completeFnRef, forceOffsetRef,
    onJourneyComplete: handleJourneyComplete,
    onJourneyReset:    handleJourneyReset,
  })

  return (
    <>
      <div
        ref={topSentinelRef}
        aria-hidden="true"
        style={{ height: '1px', visibility: 'hidden', pointerEvents: 'none' }}
      />

      <section
        id="process"
        ref={sectionRef}
        style={{
          width:      '100%',
          height:     '100vh',
          position:   'sticky',
          top:        0,
          background: tokens.sectionBg,
          transition: 'background 0.35s ease',
          zIndex:     9999,
          overflow:   'hidden',
          willChange: 'transform',
        }}
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{
            pointerEvents: 'auto',
            background:    tokens.sectionBg,
            transition:    'background 0.35s ease',
          }}
        >
          <ambientLight intensity={0.08} />
          <directionalLight position={[3, 5, 4]}   intensity={1.2} color="#ffffff" />
          <directionalLight position={[5, -1, -5]}  intensity={1.6} color="#2255cc" />
          <directionalLight position={[-5, 2, 2]}   intensity={0.9} color="#88aaff" />
          <pointLight       position={[0, -4, 2]}   intensity={0.8} color="#3a0080" />
          <Environment preset="city" />

          <ScrollControls pages={processSteps.length} damping={0.15} distance={1}>
            <ScrollWatcher
              completeFnRef={completeFnRef}
              onScrollerReady={(el) => { scrollerRef.current = el }}
              resetKey={resetKey}
              forceOffsetRef={forceOffsetRef}
            />
            <BatarangModel isDark={isDark} />
            <Scroll>
              <Suspense fallback={null}>
                <GlowingWire tokens={tokens} />
              </Suspense>
            </Scroll>
            <Scroll html style={{ width: '100%' }}>
              <div style={{
                position: 'absolute', top: '2.5rem',
                width: '100%', textAlign: 'center', pointerEvents: 'none',
              }}>
                <p style={{
                  color: tokens.labelColor, fontSize: '10px',
                  letterSpacing: '0.55em', textTransform: 'uppercase',
                  marginBottom: '0.6rem', opacity: 0.8,
                }}>— How I Work —</p>
                <h2 style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 900,
                  color: tokens.headingColor, textTransform: 'uppercase',
                  letterSpacing: '0.18em', margin: 0,
                  textShadow: tokens.headingShadow, transition: 'color 0.35s ease',
                }}>The Process</h2>
                <div style={{
                  margin: '0.7rem auto 0', width: '60px', height: '1px',
                  background: `linear-gradient(to right, transparent, ${tokens.dividerColor}, transparent)`,
                  boxShadow: `0 0 8px ${tokens.dividerGlow}`,
                }} />
              </div>
              {processSteps.map((step) => (
                <div
                  key={step.id}
                  style={{
                    width: '100%', height: '100vh',
                    display: 'flex', alignItems: 'center',
                    justifyContent:
                      step.side === 'left'  ? 'flex-start' :
                      step.side === 'right' ? 'flex-end'   : 'center',
                    paddingLeft:  step.side === 'left'  ? 'clamp(1.5rem, 8vw, 120px)' : 0,
                    paddingRight: step.side === 'right' ? 'clamp(1.5rem, 8vw, 120px)' : 0,
                    boxSizing: 'border-box',
                  }}
                >
                  <ProcessStepCard step={step} isDark={isDark} />
                </div>
              ))}
            </Scroll>
          </ScrollControls>
        </Canvas>
      </section>

      <div
        ref={postSectionsRef}
        id="post-process-sections"
        style={{ opacity: 0, pointerEvents: 'none', transition: 'none', height: 0, overflow: 'hidden' }}
      >
        {children}
      </div>
    </>
  )
}

export default ProjectProcess