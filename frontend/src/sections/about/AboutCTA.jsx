// sections/about/AboutCTA.jsx
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { profile as defaultProfile } from '../../constants/about'
import { useSiteData } from '../../context/SiteDataContext'

const ease = [0.16, 1, 0.3, 1]

// ─── Theme config ──────────────────────────────────────────────────────────────
const THEME_CFG = {
  dark: {
    accent:       '#52aeff',
    accent2:      '#a78bfa',
    accentSoft:   'rgba(82,174,255,0.08)',
    accentBorder: 'rgba(82,174,255,0.25)',
    accentGlow:   'rgba(82,174,255,0.12)',
    ctaText:      '#000',
    gridColor:    'rgba(82,174,255,0.03)',
    label:        'Open to Opportunities',
    tagline:      'Bat-Signal is active.',
  },
  light: {
    accent:       '#d4200c',
    accent2:      '#f5c518',
    accentSoft:   'rgba(212,32,12,0.07)',
    accentBorder: 'rgba(212,32,12,0.22)',
    accentGlow:   'rgba(212,32,12,0.10)',
    ctaText:      '#fff',
    gridColor:    'rgba(212,32,12,0.025)',
    label:        'Open to Opportunities',
    tagline:      'Ready to fly into Metropolis.',
  },
}

// ─── Animated status pill ──────────────────────────────────────────────────────
function StatusPill({ accent, label }) {
  return (
    <div className="flex items-center gap-2.5 w-fit">
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
        style={{
          background:  `${accent}0e`,
          borderColor: `${accent}28`,
        }}
      >
        <span className="relative flex h-2 w-2">
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full"
            style={{ background: accent }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
        </span>
        <span
          className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

// ─── Download button with progress animation ───────────────────────────────────
function CVDownloadButton({ accent, accentSoft, accentBorder, isDark }) {
  const [state, setState] = useState('idle') // idle | downloading | done

  const handleClick = () => {
    setState('downloading')
    setTimeout(() => {
      setState('done')
      setTimeout(() => setState('idle'), 2200)
    }, 1200)
  }

  return (
    <a
      href="/finalAk.pdf"
      download="Anish_Kumar_CV.pdf"
      onClick={handleClick}
      className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border no-underline group transition-all duration-250"
      style={{
        background:   state === 'done' ? 'rgba(34,197,94,0.08)' : accentSoft,
        borderColor:  state === 'done' ? 'rgba(34,197,94,0.3)'  : accentBorder,
        transition:   'all 0.25s ease',
      }}
      onMouseEnter={e => {
        if (state === 'idle') {
          e.currentTarget.style.transform   = 'translateX(4px)'
          e.currentTarget.style.boxShadow   = `0 8px 24px ${accent}14`
          e.currentTarget.style.borderColor = `${accent}50`
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateX(0)'
        e.currentTarget.style.boxShadow = 'none'
        if (state === 'idle') e.currentTarget.style.borderColor = accentBorder
      }}
    >
      <div>
        <p
          className="text-[0.76rem] font-black leading-none mb-1"
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            color: state === 'done' ? '#22c55e' : 'var(--text-primary)',
            transition: 'color 0.25s',
          }}
        >
          {state === 'done' ? 'Downloaded!' : 'Download CV'}
        </p>
        <p
          className="text-[0.62rem] font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          {state === 'done' ? 'finalAk.pdf saved' : 'PDF · Latest version'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === 'downloading' ? (
          <motion.div
            key="spin"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            style={{ color: accent }}
          >
            <motion.svg
              width="16" height="16" viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
            >
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="10" />
            </motion.svg>
          </motion.div>
        ) : state === 'done' ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="rgba(34,197,94,0.15)" />
              <path d="M4 8l3 3 5-5" stroke="#22c55e" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="arrow"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            style={{ color: accent, opacity: 0.7 }}
            className="group-hover:opacity-100 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12M8 11l4 4 4-4"/>
              <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  )
}

// ─── CTA action row ────────────────────────────────────────────────────────────
function CTAActions({ accent, accentSoft, accentBorder, accentGlow, ctaText, isDark, inView }) {
  const { profile: _ctaApiProfile } = useSiteData()
  const _ctaProfile = _ctaApiProfile?.name ? _ctaApiProfile : defaultProfile
  const actions = [
    {
      key:     'contact',
      label:   'Get In Touch',
      sub:     'Start a conversation',
      primary: true,
      isLink:  true,
      to:      '/contact',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H7M17 7v10"/>
        </svg>
      ),
    },
    {
      key:     'email',
      label:   'Send an Email',
      sub:     _ctaProfile.email,
      primary: false,
      isLink:  false,
      href:    `mailto:${_ctaProfile.email}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      {actions.map(({ key, label, sub, primary, isLink, to, href, icon }, i) => {
        const inner = (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.55, ease }}
            className="flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer transition-all duration-220"
            style={{
              background:  primary ? accent : 'var(--bg-secondary)',
              border:      primary ? 'none' : '1px solid var(--border-color)',
              color:       primary ? ctaText : 'var(--text-muted)',
              boxShadow:   primary ? `0 0 24px ${accentGlow}` : 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(4px)'
              e.currentTarget.style.boxShadow = primary
                ? `0 8px 32px ${accent}50`
                : `0 4px 16px ${accent}0a`
              if (!primary) e.currentTarget.style.borderColor = `${accent}35`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.boxShadow = primary ? `0 0 24px ${accentGlow}` : 'none'
              if (!primary) e.currentTarget.style.borderColor = 'var(--border-color)'
            }}
          >
            <div>
              <p className="text-[0.76rem] font-black leading-none mb-1"
                style={{ fontFamily: '"Mona Sans", sans-serif', color: 'inherit' }}>
                {label}
              </p>
              <p className="text-[0.62rem] font-mono"
                style={{ color: primary ? (isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)') : 'var(--text-muted)' }}>
                {sub}
              </p>
            </div>
            <span style={{ color: 'inherit', opacity: 0.75 }}>{icon}</span>
          </motion.div>
        )

        return isLink ? (
          <Link key={key} to={to} className="no-underline block">{inner}</Link>
        ) : (
          <a key={key} href={href} className="no-underline block">{inner}</a>
        )
      })}

      {/* CV download — separate animated component */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.52, duration: 0.55, ease }}
      >
        <CVDownloadButton
          accent={accent}
          accentSoft={accentSoft}
          accentBorder={accentBorder}
          isDark={isDark}
        />
      </motion.div>
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function AboutCTA() {
  const { theme }  = useTheme()
  const { profile: apiProfile } = useSiteData()
  const profile = apiProfile || defaultProfile
  const isDark     = theme === 'dark'
  const cfg        = isDark ? THEME_CFG.dark : THEME_CFG.light
  const {
    accent, accent2, accentSoft, accentBorder, accentGlow,
    ctaText, gridColor, label, tagline,
  } = cfg

  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end end'] })
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ borderTop: '1px solid var(--border-color)' }}
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

      {/* Scroll-driven bottom glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${accentGlow}, transparent 70%)`,
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:  'var(--bg-card)',
            border:      '1px solid var(--border-color)',
            boxShadow:   `0 0 0 1px ${accent}0c`,
          }}
        >
          {/* Top gradient bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background: `linear-gradient(to right, transparent 5%, ${accent}, ${accent2}, transparent 95%)`,
              transition: 'background 0.4s',
            }}
          />

          {/* Ambient glows inside the card */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 55% 70% at 15% 50%, ${accent}07, transparent 65%)` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 40% 60% at 85% 50%, ${accent2}06, transparent 65%)` }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Diagonal decorative lines */}
          {[72, 116, 160].map((x, i) => (
            <div
              key={i}
              className="absolute top-0 right-0 bottom-0 pointer-events-none"
              style={{
                width: '1px',
                background: `linear-gradient(to bottom, ${accent}${['22', '10', '07'][i]}, transparent 55%)`,
                transform: `translateX(-${x}px) rotate(12deg)`,
                transformOrigin: 'top',
                transition: 'background 0.4s',
              }}
            />
          ))}

          {/* Watermark */}
          <span
            className="absolute -bottom-4 right-4 font-black select-none pointer-events-none leading-none"
            style={{
              fontSize:   '10rem',
              color:      `${accent}05`,
              fontFamily: '"Mona Sans", sans-serif',
            }}
          >
            AK
          </span>

          {/* Layout grid */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_380px]">

            {/* ── LEFT — headline ── */}
            <div
              className="p-10 md:p-14 lg:border-r flex flex-col justify-between gap-8"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div>
                {/* Status pill */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1, duration: 0.5, ease }}
                  className="mb-6"
                >
                  <StatusPill accent={accent} label={label} />
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.18, duration: 0.65, ease }}
                  className="font-black tracking-tight mb-6"
                  style={{
                    fontSize:      'clamp(2.2rem, 5.5vw, 4rem)',
                    fontFamily:    '"Mona Sans", sans-serif',
                    lineHeight:    0.95,
                    letterSpacing: '-0.04em',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', display: 'block' }}>Let's build</span>
                  <span style={{ color: 'var(--text-primary)', display: 'block' }}>something</span>
                  <span style={{ color: accent, display: 'block', transition: 'color 0.4s ease' }}>worth</span>
                  <span style={{ color: accent, display: 'block', transition: 'color 0.4s ease' }}>shipping.</span>
                </motion.h2>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.28, duration: 0.55, ease }}
                  className="text-[0.85rem] leading-[2]"
                  style={{
                    color:      'var(--text-muted)',
                    fontFamily: '"Mona Sans", sans-serif',
                    maxWidth:   420,
                  }}
                >
                  Looking for full-stack or frontend roles. I ship fast, learn faster,
                  and treat every codebase like something worth being proud of.
                </motion.p>
              </div>

              {/* Bottom tag — theme-specific */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div
                  className="w-4 h-[1.5px] rounded-full"
                  style={{ background: accent }}
                />
                <span
                  className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
                >
                  {tagline}
                </span>
              </motion.div>
            </div>

            {/* ── RIGHT — actions ── */}
            <div className="flex flex-col justify-center gap-3 p-8 md:p-10">

              {/* Section label */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.22, duration: 0.4, ease }}
                className="text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-1"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
              >
                Pick your channel
              </motion.p>

              <CTAActions
                accent={accent}
                accentSoft={accentSoft}
                accentBorder={accentBorder}
                accentGlow={accentGlow}
                ctaText={ctaText}
                isDark={isDark}
                inView={inView}
              />

              {/* Availability note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="flex items-center gap-2 pt-2"
              >
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full bg-green-400"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
                <span
                  className="text-[0.6rem] font-medium"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
                >
                  Available now · Responds within 24 hours
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}