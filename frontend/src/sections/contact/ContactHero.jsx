// sections/contact/ContactHero.jsx
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useSiteData } from '../../context/SiteDataContext'

// ─── Config ───────────────────────────────────────────────────────────────────
const HEADLINE   = "Let's Connect"
const SUBLINE    = 'Crafted work. Real conversations. No spam.'
const STATS      = [
  { value: '24h',  label: 'Response time'  },
  { value: '100%', label: 'Remote-ready'   },
  { value: '11+',  label: 'Projects shipped'},
]

// Dark: Gotham / Batman identity · Light: Metropolis / Superman identity
const THEME_CFG = {
  dark: {
    heroLabel:    'Bat-Signal Active',
    heroLabelDot: '#52aeff',
    accent:       '#52aeff',
    accentSoft:   'rgba(82,174,255,0.12)',
    accentGlow:   'rgba(82,174,255,0.25)',
    accentBorder: 'rgba(82,174,255,0.3)',
    gridColor:    'rgba(82,174,255,0.04)',
    radial:       'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(82,174,255,0.12) 0%, transparent 65%)',
    scanline:     'rgba(82,174,255,0.03)',
    tagBg:        'rgba(82,174,255,0.08)',
    tagBorder:    'rgba(82,174,255,0.2)',
    statusText:   'Open for Gotham missions',
    marqueeItems: ['React', '·', 'Three.js', '·', 'Node.js', '·', 'GSAP', '·', 'Next.js', '·', 'MongoDB', '·', 'R3F', '·'],
    decorChar:    '⬡',
  },
  light: {
    heroLabel:    'Signal Received',
    heroLabelDot: '#d4200c',
    accent:       '#d4200c',
    accentSoft:   'rgba(212,32,12,0.09)',
    accentGlow:   'rgba(212,32,12,0.2)',
    accentBorder: 'rgba(212,32,12,0.25)',
    gridColor:    'rgba(212,32,12,0.03)',
    radial:       'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,32,12,0.08) 0%, transparent 65%)',
    scanline:     'rgba(212,32,12,0.025)',
    tagBg:        'rgba(212,32,12,0.07)',
    tagBorder:    'rgba(212,32,12,0.18)',
    statusText:   'Flying into Metropolis',
    marqueeItems: ['React', '·', 'Three.js', '·', 'Node.js', '·', 'GSAP', '·', 'Next.js', '·', 'MongoDB', '·', 'R3F', '·'],
    decorChar:    '⬢',
  },
}

// ─── Marquee strip ─────────────────────────────────────────────────────────────
function MarqueeStrip({ items, accent, accentBorder }) {
  const duped = [...items, ...items, ...items]
  return (
    <div
      className="relative overflow-hidden py-3 border-y"
      style={{ borderColor: accentBorder }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee-ltr 28s linear infinite' }}
      >
        {duped.map((item, i) => (
          <span
            key={i}
            className="mx-4 text-[0.62rem] font-bold uppercase tracking-[0.22em]"
            style={{
              color: item === '·' ? accentBorder : accent,
              opacity: item === '·' ? 0.5 : 0.7,
              fontFamily: '"Mona Sans", sans-serif',
            }}
          >
            {item}
          </span>
        ))}
      </div>
      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-20 pointer-events-none"
        style={{ background: `linear-gradient(to right, var(--bg-primary), transparent)` }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20 pointer-events-none"
        style={{ background: `linear-gradient(to left, var(--bg-primary), transparent)` }}
      />
    </div>
  )
}

// ─── Floating decor orb ────────────────────────────────────────────────────────
function FloatOrb({ x, y, size, delay, accent, opacity = 0.06 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top:  `${y}%`,
        width:  size,
        height: size,
        background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        opacity,
      }}
      animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, accent }) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const num = parseFloat(target)
    const suffix = target.replace(/[0-9.]/g, '')
    const steps = 40
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = num * eased

      setDisplay(
        (Number.isInteger(num) ? Math.floor(current) : current.toFixed(0)) + suffix
      )

      if (step >= steps) {
        clearInterval(timer)
        // Set exactly to target at the end to prevent off-by-one rounding errors
        setDisplay(target) 
      }
    }, 30)

    // Cleanup clears the interval if the component unmounts or target changes
    return () => clearInterval(timer)
  }, [target])

  return (
    <span
      className="font-black tabular-nums"
      style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        color: accent,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        fontFamily: '"Mona Sans", sans-serif',
      }}
    >
      {display}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ stat, accent, accentSoft, accentBorder, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1 px-6 py-5 rounded-2xl border transition-all duration-300 cursor-default"
      style={{
        background:   hovered ? accentSoft : 'var(--bg-card)',
        borderColor:  hovered ? accent : 'var(--border-color)',
        boxShadow:    hovered ? `0 0 0 1px ${accent}20, 0 12px 32px ${accent}12` : 'none',
        transform:    hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Counter target={stat.value} accent={accent} />
      <span
        className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-center"
        style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
      >
        {stat.label}
      </span>
    </motion.div>
  )
}

// ─── Letter-by-letter heading ─────────────────────────────────────────────────
function AnimatedHeading({ text, accent }) {
  const words = text.split(' ')
  let charIndex = 0

  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
      {words.map((word, wi) => (
        <span key={wi} className="flex overflow-hidden">
          {word.split('').map((char, ci) => {
            const idx = charIndex++
            const isLast = wi === words.length - 1
            return (
              <motion.span
                key={ci}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  delay: 0.15 + idx * 0.038,
                  type: 'spring',
                  stiffness: 220,
                  damping: 22,
                }}
                className="inline-block font-black"
                style={{
                  fontFamily: '"Mona Sans", sans-serif',
                  letterSpacing: '-0.035em',
                  fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                  lineHeight: 0.95,
                  color: isLast ? accent : 'var(--text-primary)',
                }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </div>
  )
}

// ─── Mouse-tracking spotlight ─────────────────────────────────────────────────
function Spotlight({ accent }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 })
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 })

  const bgX = useTransform(smoothX, v => `${v}px`)
  const bgY = useTransform(smoothY, v => `${v}px`)

  useEffect(() => {
    const handler = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(600px circle at ${bgX} ${bgY}, ${accent}07, transparent 50%)`,
      }}
    />
  )
}

// ─── Scroll indicator ─────────────────────────────────────────────────────────
function ScrollCue({ accent }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <span
        className="text-[0.55rem] font-bold tracking-[0.3em] uppercase"
        style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
      >
        Scroll
      </span>
      <div
        className="w-[1px] overflow-hidden"
        style={{ height: '40px', background: 'var(--border-color)' }}
      >
        <motion.div
          className="w-full h-full"
          style={{ background: accent }}
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

// ─── Hero section ─────────────────────────────────────────────────────────────
export default function ContactHero() {
  const { theme } = useTheme()
  const { profile: _chProfile } = useSiteData()
  const _chEmail = _chProfile?.email || 'akcoder1102004@gmail.com'
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light

  const {
    accent, accentSoft, accentGlow, accentBorder,
    gridColor, radial, tagBg, tagBorder,
    heroLabel, heroLabelDot, statusText, marqueeItems, decorChar,
  } = cfg

  return (
    <section
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', paddingTop: '62px' }}
    >
      {/* ── Layer 0: mouse spotlight ── */}
      <Spotlight accent={accent} />

      {/* ── Layer 1: radial gradient halo ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: radial }} />

      {/* ── Layer 2: grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />

      {/* ── Layer 3: floating orbs ── */}
      <FloatOrb x={8}  y={15} size="320px" delay={0}   accent={accent} opacity={0.055} />
      <FloatOrb x={80} y={60} size="260px" delay={1.5} accent={accent} opacity={0.04}  />
      <FloatOrb x={55} y={5}  size="180px" delay={0.8} accent={accent} opacity={0.035} />

      {/* ── Layer 4: decorative corner geometry ── */}
      <div
        className="absolute top-24 right-8 md:right-16 text-[7rem] md:text-[10rem] pointer-events-none select-none font-black leading-none"
        style={{
          color: `${accent}08`,
          fontFamily: '"Mona Sans", sans-serif',
          transform: 'rotate(18deg)',
        }}
      >
        {decorChar}
      </div>
      <div
        className="absolute bottom-32 left-6 md:left-12 text-[5rem] md:text-[8rem] pointer-events-none select-none font-black leading-none"
        style={{
          color: `${accent}06`,
          fontFamily: '"Mona Sans", sans-serif',
          transform: 'rotate(-12deg)',
        }}
      >
        {decorChar}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-5 md:px-10 py-20 gap-8 md:gap-10 text-center">

        {/* Status badge — top of hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border"
          style={{
            background: tagBg,
            borderColor: tagBorder,
          }}
        >
          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full"
              style={{ background: heroLabelDot }}
              animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: heroLabelDot }}
            />
          </span>
          <span
            className="text-[0.6rem] font-bold uppercase tracking-[0.22em]"
            style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
          >
            {heroLabel}
          </span>
          <span
            className="hidden sm:block text-[0.6rem] font-medium uppercase tracking-[0.12em]"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            · {statusText}
          </span>
        </motion.div>

        {/* Animated heading */}
        <AnimatedHeading text={HEADLINE} accent={accent} />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg max-w-md"
          style={{
            color: 'var(--text-muted)',
            fontFamily: '"Mona Sans", sans-serif',
            lineHeight: 1.75,
          }}
        >
          {SUBLINE}
        </motion.p>

        {/* CTA row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Primary CTA */}
          <a
            href="#contact-form"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: accent,
              color: isDark ? '#000' : '#fff',
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '0.02em',
              boxShadow: `0 0 24px ${accentGlow}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 36px ${accentGlow}` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 24px ${accentGlow}` }}
          >
            Send a message
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>

          {/* Secondary CTA */}
          <a
            href={`mailto:${_chEmail}`}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all duration-200"
            style={{
              background: 'transparent',
              borderColor: accentBorder,
              color: accent,
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = accentSoft; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {_chEmail}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 md:gap-4 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              accent={accent}
              accentSoft={accentSoft}
              accentBorder={accentBorder}
              index={i}
            />
          ))}
        </motion.div>

        {/* Scroll cue */}
        <div className="mt-6">
          <ScrollCue accent={accent} />
        </div>
      </div>

      {/* ── Bottom marquee strip ── */}
      <div className="relative z-10 mt-auto">
        <MarqueeStrip items={marqueeItems} accent={accent} accentBorder={accentBorder} />
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  )
}