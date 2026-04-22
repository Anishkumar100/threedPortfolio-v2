import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { hobbies as defaultHobbies, hobbyTagColors } from '../../constants/about'
import { useSiteData } from '../../context/SiteDataContext'

const ease     = [0.16, 1, 0.3, 1]
const easeSoft = [0.25, 0.46, 0.45, 0.94]

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC BUTTON — cursor pulls the element toward it
// ─────────────────────────────────────────────────────────────────────────────
function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 200, damping: 18 })
  const sy  = useSpring(y, { stiffness: 200, damping: 18 })

  const handleMove = (e) => {
    if (!ref.current) return
    const rect   = ref.current.getBoundingClientRect()
    const cx     = rect.left + rect.width  / 2
    const cy     = rect.top  + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR-TRACKED GLOW inside each card
// ─────────────────────────────────────────────────────────────────────────────
function CardGlow({ color }) {
  const ref = useRef(null)
  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 150, damping: 20 })
  const smy = useSpring(my, { stiffness: 150, damping: 20 })

  const handleMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      onMouseMove={handleMove}
      style={{ pointerEvents: 'none' }}>
      <motion.div
        className="absolute w-40 h-40 rounded-full pointer-events-none"
        style={{
          background:   `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          x:            useTransform(smx, v => v - 80),
          y:            useTransform(smy, v => v - 80),
          filter:       'blur(2px)',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER TAB — magnetic + animated underline indicator
// ─────────────────────────────────────────────────────────────────────────────
function FilterTab({ label, active, color, count, onClick }) {
  return (
    <Magnetic strength={0.3}>
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.93 }}
        className="relative flex items-center gap-2 text-[0.6rem] tracking-[0.16em] uppercase font-bold px-4 py-2.5 rounded-xl overflow-hidden"
        style={{
          background: active ? `${color}12` : 'var(--bg-card)',
          border:     active ? `1px solid ${color}40` : '1px solid var(--border-color)',
          color:      active ? color : 'var(--text-muted)',
          fontFamily: '"Mona Sans",sans-serif',
          transition: 'color 0.25s, border-color 0.25s, background 0.25s',
        }}
        layout
      >
        {/* Active shimmer sweep */}
        {active && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.5 }}
            style={{ background: `linear-gradient(90deg, transparent, ${color}25, transparent)`, zIndex: 0 }}
          />
        )}
        <span className="relative z-10">{label}</span>
        <motion.span
          layout
          className="relative z-10 text-[0.48rem] font-mono min-w-[1.2rem] text-center px-1.5 py-0.5 rounded-md"
          style={{
            background: active ? `${color}20` : 'var(--bg-secondary)',
            color:      active ? color : 'var(--text-muted)',
          }}
          animate={{ scale: active ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {count}
        </motion.span>
        {/* Bottom active indicator */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease }}
              className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
              style={{ background: `linear-gradient(to right, ${color}, ${color}40)` }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </Magnetic>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOBBY CARD — cursor-tracked glow + 3D tilt on hover
// ─────────────────────────────────────────────────────────────────────────────
function HobbyCard({ item, index }) {
  const tint    = hobbyTagColors[item.tag]
  const cardRef = useRef(null)
  const rx      = useMotionValue(0)
  const ry      = useMotionValue(0)
  const srx     = useSpring(rx, { stiffness: 180, damping: 22 })
  const sry     = useSpring(ry, { stiffness: 180, damping: 22 })

  const handleMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px   = (e.clientX - rect.left) / rect.width  - 0.5  // -0.5 → 0.5
    const py   = (e.clientY - rect.top)  / rect.height - 0.5
    ry.set(px * 10)   // tilt X-axis by cursor left/right
    rx.set(-py * 10)  // tilt Y-axis by cursor up/down
  }
  const handleLeave = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.94 }}
      transition={{ delay: index * 0.055, duration: 0.5, ease }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      whileHover={{ y: -6, zIndex: 10 }}
      className="relative rounded-2xl overflow-hidden flex flex-col cursor-default"
      // Wrap in a div to apply static styles, motion handles transform
    >
      {/* Glass card body */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'var(--bg-card)',
          border:     '1px solid var(--border-color)',
          transition: 'border-color 0.3s',
        }}
      />
      {/* Border glow on hover — handled by parent whileHover shadow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ boxShadow: `0 0 0 1px ${tint.color}40, 0 24px 56px ${tint.color}18`, borderRadius: 16 }}
      />

      {/* Cursor-tracked inner glow */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none" style={{ zIndex: 1 }}>
        <CardGlowInner color={tint.color} />
      </div>

      {/* Top bar — animates in on viewport */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] z-10 rounded-t-2xl"
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.055 + 0.15, duration: 0.7, ease }}
        style={{ background: `linear-gradient(to right, ${tint.color}, ${tint.color}30, transparent)` }}
      />

      {/* Corner glow */}
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none z-0"
        style={{ background: `radial-gradient(circle at bottom right, ${tint.color}18, transparent 68%)` }} />

      {/* Tag pill */}
      <span className="absolute top-4 right-4 z-20 text-[0.48rem] tracking-[0.18em] uppercase font-black px-2.5 py-1 rounded-full"
        style={{ background: tint.bg, border: `1px solid ${tint.border}`, color: tint.color, fontFamily: '"Mona Sans",sans-serif' }}>
        {item.tag}
      </span>

      {/* Content — lifted on Z so it clears the glow layer */}
      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Animated icon */}
        <motion.div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.3rem] mb-5 flex-shrink-0"
          style={{ background: tint.bg, border: `1px solid ${tint.border}` }}
          whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.08 }}
          transition={{ duration: 0.45 }}
        >
          {item.icon}
        </motion.div>

        <h3 className="font-black text-[0.86rem] mb-2 tracking-tight pr-14 leading-snug"
          style={{ color: 'var(--text-primary)', fontFamily: '"Mona Sans",sans-serif' }}>
          {item.title}
        </h3>
        <p className="text-[0.73rem] leading-[1.88] mt-auto"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}>
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

// Inner glow helper used inside HobbyCard (needs separate ref scope)
function CardGlowInner({ color }) {
  const ref = useRef(null)
  const mx  = useMotionValue(-999)
  const my  = useMotionValue(-999)
  const smx = useSpring(mx, { stiffness: 120, damping: 18 })
  const smy = useSpring(my, { stiffness: 120, damping: 18 })

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div
        className="absolute w-36 h-36 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          x: useTransform(smx, v => v - 72),
          y: useTransform(smy, v => v - 72),
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED CARD — wide, editorial, with animated reveal lines
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedHobbyCard({ item }) {
  const tint    = hobbyTagColors[item.tag]
  const cardRef = useRef(null)
  const rx      = useMotionValue(0)
  const ry      = useMotionValue(0)
  const srx     = useSpring(rx, { stiffness: 180, damping: 22 })
  const sry     = useSpring(ry, { stiffness: 180, damping: 22 })

  const handleMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px   = (e.clientX - rect.left) / rect.width  - 0.5
    const py   = (e.clientY - rect.top)  / rect.height - 0.5
    ry.set(px * 6)
    rx.set(-py * 6)
  }
  const handleLeave = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className="relative rounded-2xl overflow-hidden col-span-1 sm:col-span-2 cursor-default"
    >
      {/* Card bg */}
      <div className="absolute inset-0 rounded-2xl"
        style={{ background: 'var(--bg-card)', border: `1px solid ${tint.border}` }} />
      {/* Hover border glow */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
        style={{ boxShadow: `0 0 0 1px ${tint.color}50, 0 28px 72px ${tint.color}18`, borderRadius: 16 }} />

      {/* Moving top-bar — tint → purple */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{ background: `linear-gradient(to right, transparent 5%, ${tint.color}, #a78bfa80, transparent 90%)` }} />

      {/* Animated diagonal line decorations */}
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="absolute top-0 right-0 pointer-events-none"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease }}
          style={{
            width: '1px', height: '100%',
            background: `linear-gradient(to bottom, ${tint.color}${i === 0 ? '22' : i === 1 ? '12' : '08'}, transparent 60%)`,
            transform: `translateX(-${50 + i * 38}px) rotate(12deg)`,
            transformOrigin: 'top',
          }}
        />
      ))}

      {/* Giant watermark */}
      <motion.span
        className="absolute -bottom-4 -right-2 font-black pointer-events-none select-none"
        style={{ fontSize: '9rem', color: tint.color, opacity: 0.04, fontFamily: '"Mona Sans",sans-serif', lineHeight: 1 }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {item.icon}
      </motion.span>

      {/* Inner cursor glow */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
        <CardGlowInner color={tint.color} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-start">
          {/* Animated icon box */}
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-[1.9rem] flex-shrink-0"
            style={{ background: tint.bg, border: `1px solid ${tint.border}` }}
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {item.icon}
          </motion.div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[0.5rem] tracking-[0.18em] uppercase font-black px-2.5 py-1 rounded-full"
                style={{ background: tint.bg, border: `1px solid ${tint.border}`, color: tint.color, fontFamily: '"Mona Sans",sans-serif' }}>
                {item.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[0.52rem] tracking-[0.14em] uppercase font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}>
                <motion.span className="w-1 h-1 rounded-full block"
                  style={{ background: tint.color }}
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                Featured Interest
              </span>
            </div>
            <h3 className="font-black tracking-tight mb-3"
              style={{ fontSize: 'clamp(1rem,2.5vw,1.35rem)', color: 'var(--text-primary)', fontFamily: '"Mona Sans",sans-serif' }}>
              {item.title}
            </h3>
            <p className="text-[0.82rem] leading-[2]"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif', maxWidth: 520 }}>
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLLING TICKER — ambient background element
// ─────────────────────────────────────────────────────────────────────────────
function HobbyTicker({ items }) {
  const repeated = [...items, ...items, ...items]
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none h-8 flex items-center opacity-[0.035]"
      style={{ borderTop: '1px solid var(--border-color)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <motion.div
        className="flex gap-8 flex-nowrap whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="text-[0.56rem] tracking-[0.22em] uppercase font-black flex items-center gap-2"
            style={{ color: 'var(--text-primary)', fontFamily: '"Mona Sans",sans-serif' }}>
            {item.icon} {item.title}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER — split-reveal animation, character by character
// ─────────────────────────────────────────────────────────────────────────────
function SplitText({ text, accent, delay = 0 }) {
  const words = text.split(' ')
  return (
    <span>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
          <motion.span
            style={{ display: 'inline-block', color: accent }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: delay + wi * 0.07, duration: 0.55, ease }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutHobbies() {
  const { theme }  = useTheme()
  const { config } = useSiteData()
  const hobbies = config?.hobbies?.length > 0 ? config.hobbies : defaultHobbies
  const isDark     = theme === 'dark'
  const accent     = isDark ? '#52aeff' : '#d4200c'
  const accentGlow = isDark ? 'rgba(82,174,255,0.07)' : 'rgba(212,32,12,0.055)'

  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const headerView = useInView(headerRef, { once: true, margin: '-60px' })

  const [active, setActive] = useState('all')

  const FILTERS = [
    { key: 'all',          label: 'All',          color: accent                         },
    { key: 'creative',     label: 'Creative',     color: hobbyTagColors.creative.color     },
    { key: 'technical',    label: 'Technical',    color: hobbyTagColors.technical.color    },
    { key: 'intellectual', label: 'Intellectual', color: hobbyTagColors.intellectual.color },
    { key: 'physical',     label: 'Physical',     color: hobbyTagColors.physical.color     },
  ]

  const filtered            = active === 'all' ? hobbies : hobbies.filter(h => h.tag === active)
  const [featured, ...rest] = filtered

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ borderTop: '1px solid var(--border-color)', paddingBottom: '6rem' }}
    >
      {/* ── BG LAYERS ── */}

      {/* Main ambient glow — top center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 75% 55% at 50% -5%, ${accentGlow}, transparent 65%)`, transition: 'background 0.5s ease' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: 'linear-gradient(var(--border-color) 1px,transparent 1px),linear-gradient(90deg,var(--border-color) 1px,transparent 1px)',
          backgroundSize:  '52px 52px',
        }}
      />

      {/* Left vertical accent line */}
      <div className="absolute top-0 left-0 bottom-0 w-px pointer-events-none hidden xl:block"
        style={{ background: `linear-gradient(to bottom, transparent, ${accent}20 20%, ${accent}20 80%, transparent)`, transition: 'background 0.5s' }} />

      {/* Scrolling ticker at bottom */}
      <HobbyTicker items={hobbies} />

      {/* ── MAIN CONTENT ── */}
      <div className="relative max-w-[1100px] mx-auto px-5 md:px-10 pt-20">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-16">

          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={headerView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease }}
              className="flex items-center gap-3 mb-5"
            >
              <motion.div className="h-px"
                initial={{ width: 0 }}
                animate={headerView ? { width: 24 } : {}}
                transition={{ delay: 0.1, duration: 0.5, ease }}
                style={{ background: accent, transition: 'background 0.4s' }}
              />
              <p className="text-[0.54rem] tracking-[0.3em] uppercase font-black"
                style={{ color: accent, fontFamily: '"Mona Sans",sans-serif', transition: 'color 0.4s' }}>
                Outside the IDE
              </p>
            </motion.div>

            {/* Main headline — split word reveal */}
            <div className="font-black tracking-tight overflow-hidden"
              style={{ fontSize: 'clamp(2.5rem,6.5vw,5rem)', fontFamily: '"Mona Sans",sans-serif', lineHeight: 0.92, letterSpacing: '-0.04em' }}>
              {headerView && (
                <>
                  {/* Line 1 */}
                  <div style={{ overflow: 'hidden' }}>
                    <motion.span
                      style={{ color: 'var(--text-primary)', display: 'block' }}
                      initial={{ y: '105%' }} animate={{ y: '0%' }}
                      transition={{ duration: 0.65, ease }}
                    >
                      When I'm not
                    </motion.span>
                  </div>
                  {/* Line 2 — accent, with a trailing cursor blink */}
                  <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'baseline', gap: '0.15em' }}>
                    <motion.span
                      style={{ color: accent, display: 'block', transition: 'color 0.4s ease' }}
                      initial={{ y: '105%' }} animate={{ y: '0%' }}
                      transition={{ delay: 0.08, duration: 0.65, ease }}
                    >
                      coding
                    </motion.span>
                    {/* Blinking cursor */}
                    <motion.span
                      style={{ color: accent, display: 'inline-block', transition: 'color 0.4s' }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
                    >
                      _
                    </motion.span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right — description + count stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.22, duration: 0.6, ease }}
            className="flex flex-col gap-5 max-w-[320px] lg:max-w-[260px] pb-2"
          >
            <p className="text-[0.82rem] leading-[2]"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}>
              The things I do when the terminal is closed — hobbies that quietly
              feed back into the work in ways I didn't expect.
            </p>

            {/* Mini stat strip */}
            <div className="flex items-center gap-4 pt-3"
              style={{ borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span className="font-black block tabular-nums"
                  style={{ fontSize: '1.8rem', color: accent, fontFamily: '"Mona Sans",sans-serif', letterSpacing: '-0.05em', lineHeight: 1, transition: 'color 0.4s' }}>
                  {hobbies.length}
                </span>
                <span className="text-[0.52rem] tracking-[0.16em] uppercase"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}>
                  Interests
                </span>
              </div>
              <div className="w-px h-8" style={{ background: 'var(--border-color)' }} />
              <div>
                <span className="font-black block tabular-nums"
                  style={{ fontSize: '1.8rem', color: accent, fontFamily: '"Mona Sans",sans-serif', letterSpacing: '-0.05em', lineHeight: 1, transition: 'color 0.4s' }}>
                  {FILTERS.length - 1}
                </span>
                <span className="text-[0.52rem] tracking-[0.16em] uppercase"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}>
                  Categories
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── FILTER TABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className="flex flex-wrap items-center gap-2 mb-10"
        >
          {FILTERS.map(f => (
            <FilterTab
              key={f.key}
              label={f.label}
              active={active === f.key}
              color={f.color}
              count={f.key === 'all' ? hobbies.length : hobbies.filter(h => h.tag === f.key).length}
              onClick={() => setActive(f.key)}
            />
          ))}

          {/* Animated live count badge */}
          <motion.span
            key={filtered.length}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease }}
            className="ml-auto text-[0.6rem] font-mono px-3 py-2 rounded-xl flex items-center gap-1.5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
          >
            <motion.span
              key={filtered.length}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{ color: accent, fontWeight: 900, transition: 'color 0.4s' }}
            >
              {filtered.length}
            </motion.span>
            <span>/ {hobbies.length}</span>
          </motion.span>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence mode="popLayout">
            {featured && (
              <FeaturedHobbyCard key={`featured-${featured.id}`} item={featured} />
            )}
            {rest.map((item, i) => (
              <HobbyCard key={item.id} item={item} index={i + 1} />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}
