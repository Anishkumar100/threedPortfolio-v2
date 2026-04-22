// src/sections/skills/SoftSkills.jsx
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const ease = [0.16, 1, 0.3, 1]

const SOFT_SKILLS = [
  {
    id: 's1',
    num: '01',
    title: 'Solo shipping',
    description: 'Every project here was planned, designed, built, and deployed alone — from auth to production.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    id: 's2',
    num: '02',
    title: 'Working within constraints',
    description: 'Rate limits, cold starts, free-tier ceilings. I design around real API constraints rather than ignoring them.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    id: 's3',
    title: 'Client communication',
    num: '03',
    description: 'Shipped a real client project. Handled shifting requirements mid-build without breaking existing work.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 's4',
    num: '04',
    title: 'Problem-first thinking',
    description: 'I build things because they solve something real — not to stack technologies.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    id: 's5',
    num: '05',
    title: 'Latency & UX trade-offs',
    description: 'Optimised perceived latency in AniVoice AI with token streaming and AniCrypto with a client-side cache.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 's6',
    num: '06',
    title: 'Fast iteration',
    description: 'I rebuild rather than patch when the foundation is wrong — Aniflix V1→V2 is the clearest example.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
  },
]

function SoftCard({ item, accent, index, visible }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      className="group relative rounded-2xl p-5 border transition-all duration-300 overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accent}35`
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 12px 32px ${accent}14`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-color)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Watermark number */}
      <span
        className="absolute bottom-3 right-4 font-black select-none pointer-events-none leading-none"
        style={{
          fontSize: '4.5rem',
          color: `${accent}06`,
          fontFamily: '"Mona Sans", sans-serif',
        }}
      >
        {item.num}
      </span>

      {/* Icon box */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 border transition-all duration-300"
        style={{
          background: `${accent}10`,
          borderColor: `${accent}25`,
          color: accent,
        }}
      >
        {item.icon}
      </div>

      {/* Number label */}
      <p
        className="text-[0.58rem] font-bold tracking-[0.2em] uppercase mb-1.5"
        style={{ color: accent, fontFamily: '"Mona Sans", sans-serif', opacity: 0.7 }}
      >
        {item.num}
      </p>

      <h3
        className="font-bold text-[0.9rem] mb-2 leading-tight"
        style={{
          color: 'var(--text-primary)',
          fontFamily: '"Mona Sans", sans-serif',
          letterSpacing: '-0.01em',
        }}
      >
        {item.title}
      </h3>

      <p
        className="text-[0.76rem] leading-relaxed"
        style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
      >
        {item.description}
      </p>
    </motion.div>
  )
}

export default function SoftSkills() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const accent    = isDark ? '#52aeff' : '#d4200c'
  const ref       = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-16 md:py-20"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-[22px] h-[1.5px] rounded-full" style={{ background: accent }} />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
            >
              Ways of working
            </span>
          </div>
          <h2
            className="font-black tracking-tight mb-2"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: 'var(--text-primary)',
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '-0.025em',
            }}
          >
            Beyond the stack
          </h2>
          <p
            className="text-[0.85rem] leading-relaxed max-w-md"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            The habits and instincts that don't show up on a tech list but define every project.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOFT_SKILLS.map((item, i) => (
            <SoftCard
              key={item.id}
              item={item}
              accent={accent}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}