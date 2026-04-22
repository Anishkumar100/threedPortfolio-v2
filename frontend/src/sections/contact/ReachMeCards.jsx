// sections/contact/ReachMeCards.jsx
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useSiteData } from '../../context/SiteDataContext'

// ─── Theme config ──────────────────────────────────────────────────────────────
const THEME_CFG = {
  dark: {
    accent:       '#52aeff',
    accent2:      '#6d45ce',
    accentSoft:   'rgba(82,174,255,0.08)',
    accentBorder: 'rgba(82,174,255,0.28)',
    accentGlow:   'rgba(82,174,255,0.2)',
    ctaText:      '#000',
    gridColor:    'rgba(82,174,255,0.03)',
  },
  light: {
    accent:       '#d4200c',
    accent2:      '#f5c518',
    accentSoft:   'rgba(212,32,12,0.07)',
    accentBorder: 'rgba(212,32,12,0.22)',
    accentGlow:   'rgba(212,32,12,0.15)',
    ctaText:      '#fff',
    gridColor:    'rgba(212,32,12,0.025)',
  },
}

// ─── Animated copy button ──────────────────────────────────────────────────────
function CopyButton({ text, accent, accentSoft, accentBorder }) {
  const [state, setState] = useState('idle')

  const copy = () => {
    navigator.clipboard.writeText(text)
    setState('copied')
    setTimeout(() => setState('idle'), 2400)
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[0.68rem] font-bold transition-all duration-200"
      style={{
        background:   state === 'copied' ? 'rgba(34,197,94,0.1)' : accentSoft,
        borderColor:  state === 'copied' ? 'rgba(34,197,94,0.35)' : accentBorder,
        color:        state === 'copied' ? '#22c55e' : accent,
        fontFamily:   '"Mona Sans", sans-serif',
        letterSpacing: '0.04em',
      }}
    >
      <AnimatePresence mode="wait">
        {state === 'copied' ? (
          <motion.span
            key="done"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─── 3D tilt card wrapper ──────────────────────────────────────────────────────
function TiltCard({ children, accent, accentBorder, accentGlow, className = '', style = {} }) {
  const cardRef  = useRef(null)
  const rotateX  = useMotionValue(0)
  const rotateY  = useMotionValue(0)
  const springX  = useSpring(rotateX, { stiffness: 180, damping: 22 })
  const springY  = useSpring(rotateY, { stiffness: 180, damping: 22 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width  / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    rotateY.set(dx * 6)
    rotateX.set(-dy * 6)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        perspective: '900px',
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        border:      `1px solid ${hovered ? `${accent}45` : 'var(--border-color)'}`,
        boxShadow:   hovered
          ? `0 0 0 1px ${accent}15, 0 20px 48px ${accentGlow}`
          : '0 0 0 1px transparent',
        background:  hovered ? `${accent}07` : 'var(--bg-card)',
        transition:  'border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${accent}08 0%, transparent 50%, ${accent}04 100%)`
            : 'none',
          transition: 'background 0.3s ease',
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  )
}

// ─── Email card ────────────────────────────────────────────────────────────────
function EmailCard({ accent, accentSoft, accentBorder, accentGlow, ctaText, index }) {
  const { profile: _emProfile } = useSiteData()
  const EMAIL = _emProfile?.email || 'akcoder1102004@gmail.com'

  return (
    <TiltCard accent={accent} accentBorder={accentBorder} accentGlow={accentGlow}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-5 p-6"
      >
        {/* Card top bar */}
        <div
          className="h-[3px] w-full rounded-full -mt-6 mx-0 mb-2"
          style={{
            background: `linear-gradient(to right, ${accent}, ${accent}30)`,
            marginLeft: '-1.5rem',
            width: 'calc(100% + 3rem)',
          }}
        />

        {/* Icon + label */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0"
            style={{
              background: `${accent}14`,
              borderColor: `${accent}30`,
              color: accent,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
              Direct email
            </p>
            <p className="text-[0.8rem] font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.01em' }}>
              Always open
            </p>
          </div>
        </div>

        {/* Email address — fully visible */}
        <a
          href={`mailto:${EMAIL}`}
          className="font-black text-[0.95rem] md:text-[1rem] break-all no-underline transition-colors duration-200"
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            color: accent,
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {EMAIL}
        </a>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <CopyButton text={EMAIL} accent={accent} accentSoft={accentSoft} accentBorder={accentBorder} />
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.68rem] font-bold transition-all duration-200 no-underline"
            style={{
              background: accent,
              color: ctaText,
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '0.04em',
              boxShadow: `0 0 18px ${accent}40`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 0 28px ${accent}60` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 18px ${accent}40` }}
          >
            Open mail app
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        </div>

        {/* Response time badge */}
        <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-green-400"
              animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          <span className="text-[0.6rem] font-medium"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
            Typically responds within 24 hours
          </span>
        </div>
      </motion.div>
    </TiltCard>
  )
}

// ─── Schedule card ─────────────────────────────────────────────────────────────
function ScheduleCard({ accent, accentSoft, accentBorder, accentGlow, ctaText, index }) {
  const [hoverBtn, setHoverBtn] = useState(false)

  // Animated clock hands
  const HOURS   = new Date().getHours() % 12
  const MINUTES = new Date().getMinutes()
  const hourDeg   = HOURS * 30 + MINUTES * 0.5
  const minuteDeg = MINUTES * 6

  return (
    <TiltCard accent={accent} accentBorder={accentBorder} accentGlow={accentGlow}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-5 p-6"
      >
        <div
          className="h-[3px] w-full rounded-full -mt-6 mb-2"
          style={{
            background: `linear-gradient(to right, ${accent}60, ${accent}20)`,
            marginLeft: '-1.5rem',
            width: 'calc(100% + 3rem)',
          }}
        />

        {/* Icon + label */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0"
            style={{ background: `${accent}14`, borderColor: `${accent}30`, color: accent }}
          >
            {/* SVG clock */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={accent} strokeWidth="1.8" />
              {/* Hour hand */}
              <motion.line
                x1="12" y1="12"
                x2={12 + 4 * Math.sin((hourDeg * Math.PI) / 180)}
                y2={12 - 4 * Math.cos((hourDeg * Math.PI) / 180)}
                stroke={accent} strokeWidth="2.2" strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 43200, repeat: Infinity, ease: 'linear' }}
              />
              {/* Minute hand */}
              <motion.line
                x1="12" y1="12"
                x2={12 + 5.5 * Math.sin((minuteDeg * Math.PI) / 180)}
                y2={12 - 5.5 * Math.cos((minuteDeg * Math.PI) / 180)}
                stroke={accent} strokeWidth="1.6" strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 3600, repeat: Infinity, ease: 'linear' }}
              />
              <circle cx="12" cy="12" r="1" fill={accent} />
            </svg>
          </div>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
              Book a call
            </p>
            <p className="text-[0.8rem] font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.01em' }}>
              30 min intro
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[0.78rem] leading-relaxed"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
          Let's talk about your project, scope, and timeline before committing to anything.
        </p>

        {/* CTA */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[0.75rem] font-bold no-underline border transition-all duration-200"
          style={{
            borderColor: `${accent}40`,
            color: accent,
            fontFamily: '"Mona Sans", sans-serif',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}18` }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          Schedule on Calendly
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </a>

        {/* Timezone note */}
        <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <span className="text-[0.6rem] font-medium"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
            GMT+5:30 · Chennai, India · I adapt to your timezone
          </span>
        </div>
      </motion.div>
    </TiltCard>
  )
}

// ─── LinkedIn card ─────────────────────────────────────────────────────────────
function LinkedInCard({ accent, accentSoft, accentBorder, accentGlow, index }) {
  const { profile: _liProfile } = useSiteData()
  const linkedinUrl = _liProfile?.linkedin || 'https://linkedin.com'
  return (
    <TiltCard accent={accent} accentBorder={accentBorder} accentGlow={accentGlow}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-5 p-6"
      >
        <div
          className="h-[3px] w-full rounded-full -mt-6 mb-2"
          style={{
            background: `linear-gradient(to right, ${accent}40, ${accent}10)`,
            marginLeft: '-1.5rem',
            width: 'calc(100% + 3rem)',
          }}
        />

        {/* Icon + label */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0"
            style={{ background: `${accent}14`, borderColor: `${accent}30`, color: accent }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136
                       1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85
                       3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065
                       2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225
                       0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451
                       C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
              LinkedIn
            </p>
            <p className="text-[0.8rem] font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.01em' }}>
              Anish Kumar
            </p>
          </div>
        </div>

        {/* Handle */}
        <p className="text-[0.78rem] font-mono"
          style={{ color: accent, fontFamily: 'monospace' }}>
          {linkedinUrl.replace('https://', '').replace('http://', '')}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Connections', value: '500+' },
            { label: 'Posts', value: 'Active' },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex flex-col items-center py-2.5 rounded-xl border"
              style={{ background: `${accent}07`, borderColor: `${accent}20` }}
            >
              <span
                className="font-black text-[1rem]"
                style={{ color: accent, fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </span>
              <span className="text-[0.58rem] font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[0.75rem] font-bold no-underline border transition-all duration-200"
          style={{
            borderColor: `${accent}40`,
            color: accent,
            fontFamily: '"Mona Sans", sans-serif',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}18` }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          View profile
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </a>
      </motion.div>
    </TiltCard>
  )
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-10"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: accent }}
        />
        <span
          className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          Other channels
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2
            className="font-black tracking-tight mb-1"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: 'var(--text-primary)',
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '-0.025em',
            }}
          >
            Or find me here
          </h2>
          <p
            className="text-[0.82rem] leading-relaxed"
            style={{
              color: 'var(--text-muted)',
              fontFamily: '"Mona Sans", sans-serif',
              maxWidth: '360px',
            }}
          >
            Three ways to reach out — pick whichever suits you.
          </p>
        </div>

        {/* Tilt hint */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border w-fit flex-shrink-0"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l7-5 7 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V9z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span
            className="text-[0.6rem] font-semibold"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            Hover cards to interact
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function ReachMeCards() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light
  const { accent, accentSoft, accentBorder, accentGlow, ctaText, gridColor } = cfg

  return (
    <section
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />

      {/* Radial accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${accent}06, transparent 70%)`,
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8">
        <SectionHeader accent={accent} />

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <EmailCard
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
            accentGlow={accentGlow}
            ctaText={ctaText}
            index={0}
          />
          <ScheduleCard
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
            accentGlow={accentGlow}
            ctaText={ctaText}
            index={1}
          />
          <LinkedInCard
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
            accentGlow={accentGlow}
            index={2}
          />
        </div>
      </div>
    </section>
  )
}