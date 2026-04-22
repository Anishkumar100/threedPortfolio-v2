// components/contact/ContactInfo.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useSiteData } from '../../context/SiteDataContext'

// ─── Static data ──────────────────────────────────────────────────────────────
const DEFAULT_EMAIL = 'akcoder1102004@gmail.com'
const SOCIALS = [
  {
    label: 'GitHub',
    handle: '@Anishkumar100',
    href: 'https://github.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
                 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                 -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                 .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
                 -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004
                 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
                 .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
                 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017
                 C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'Anish Kumar',
    href: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136
                 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37
                 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063
                 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542
                 C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0
                 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    handle: '@anishkumar_dev',
    href: 'https://twitter.com/anishkumar_dev',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744
                 l7.735-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

const INFO_ITEMS = [
  {
    id: 'location',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label:   'Location',
    value:   'Chennai, India',
    sub:     'Working globally · GMT+5:30',
  },
  {
    id: 'response',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label:   'Response time',
    value:   'Within 24 hours',
    sub:     'Usually much faster',
  },
  {
    id: 'availability',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    label:   'Availability',
    value:   'Open now',
    sub:     'Freelance · Full-time · Contracts',
  },
]

const THEME_CFG = {
  dark: {
    accent:        '#52aeff',
    accentSoft:    'rgba(82,174,255,0.08)',
    accentBorder:  'rgba(82,174,255,0.25)',
    accentGlow:    'rgba(82,174,255,0.15)',
    copyColor:     'rgba(82,174,255,0.9)',
    ctaText:       '#000',
  },
  light: {
    accent:        '#d4200c',
    accentSoft:    'rgba(212,32,12,0.07)',
    accentBorder:  'rgba(212,32,12,0.22)',
    accentGlow:    'rgba(212,32,12,0.12)',
    copyColor:     'rgba(212,32,12,0.9)',
    ctaText:       '#fff',
  },
}

// ─── Animated copy button ─────────────────────────────────────────────────────
function CopyButton({ text, accent, accentSoft, accentBorder }) {
  const [state, setState] = useState('idle') // idle | copied

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setState('copied')
    setTimeout(() => setState('idle'), 2200)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[0.68rem] font-bold transition-all duration-200"
      style={{
        borderColor:  state === 'copied' ? '#22c55e40' : accentBorder,
        background:   state === 'copied' ? 'rgba(34,197,94,0.08)' : accentSoft,
        color:        state === 'copied' ? '#22c55e'  : accent,
        fontFamily:   '"Mona Sans", sans-serif',
        letterSpacing: '0.04em',
      }}
    >
      <AnimatePresence mode="wait">
        {state === 'copied' ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ item, accent, accentSoft, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.09, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-250"
      style={{
        background:  hovered ? accentSoft : 'transparent',
        borderColor: hovered ? `${accent}35` : 'var(--border-color)',
        transform:   hovered ? 'translateX(4px)' : 'translateX(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon box */}
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border mt-0.5 transition-all duration-250"
        style={{
          background:  hovered ? `${accent}18` : 'var(--bg-secondary)',
          borderColor: hovered ? `${accent}35` : 'var(--border-color)',
          color:       hovered ? accent : 'var(--text-muted)',
        }}
      >
        {item.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-[0.6rem] font-bold uppercase tracking-[0.18em] mb-0.5"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          {item.label}
        </p>
        <p
          className="font-bold text-[0.88rem] transition-colors duration-200"
          style={{
            color: hovered ? accent : 'var(--text-primary)',
            fontFamily: '"Mona Sans", sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          {item.value}
        </p>
        <p
          className="text-[0.65rem] mt-0.5"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          {item.sub}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Social card ──────────────────────────────────────────────────────────────
function SocialCard({ social, accent, accentSoft, accentBorder, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-220 no-underline"
      style={{
        background:  hovered ? accentSoft : 'var(--bg-card)',
        borderColor: hovered ? `${accent}45` : 'var(--border-color)',
        boxShadow:   hovered ? `0 8px 24px ${accent}14` : 'none',
        transform:   hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border transition-all duration-220"
        style={{
          background:  hovered ? `${accent}18` : 'var(--bg-secondary)',
          borderColor: hovered ? `${accent}40` : 'var(--border-color)',
          color:       hovered ? accent : 'var(--text-muted)',
        }}
      >
        {social.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-[0.78rem] transition-colors duration-200"
          style={{
            color: hovered ? accent : 'var(--text-primary)',
            fontFamily: '"Mona Sans", sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          {social.label}
        </p>
        <p
          className="text-[0.62rem]"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          {social.handle}
        </p>
      </div>

      {/* Arrow */}
      <div
        className="flex-shrink-0 transition-all duration-220"
        style={{
          color: hovered ? accent : 'var(--text-muted)',
          opacity: hovered ? 1 : 0.4,
          transform: hovered ? 'translate(2px, -2px)' : 'translate(0,0)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H7M17 7v10"/>
        </svg>
      </div>
    </motion.a>
  )
}

// ─── Email block ──────────────────────────────────────────────────────────────
function EmailBlock({ accent, accentSoft, accentBorder, accentGlow, ctaText, isDark }) {
  const [hovered, setHovered] = useState(false)
  const { profile: _ebProfile } = useSiteData()
  const EMAIL = _ebProfile?.email || DEFAULT_EMAIL

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: `${accent}30`,
        background: `${accent}06`,
        boxShadow: `0 0 0 1px ${accent}10`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(to right, ${accent}, ${accent}30)` }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Label */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center border"
            style={{
              background: `${accent}14`,
              borderColor: `${accent}30`,
              color: accent,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <span
            className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            Direct Email
          </span>
        </div>

        {/* Email address — fully visible, no blur */}
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`}
          target='_blank'
          className="font-black text-[1rem] md:text-[1.1rem] transition-colors duration-200 no-underline break-all"
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            color: hovered ? accent : 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {EMAIL}
        </a>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <CopyButton
            text={EMAIL}
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
          />
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.68rem] font-bold border transition-all duration-200"
            style={{
              background: accent,
              borderColor: accent,
              color: ctaText,
              fontFamily: '"Mona Sans", sans-serif',
              letterSpacing: '0.03em',
              boxShadow: `0 0 16px ${accent}35`,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 24px ${accent}55`; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 16px ${accent}35`; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Open mail app
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Availability timeline dot ────────────────────────────────────────────────
function StatusPulse({ accent }) {
  return (
    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full"
        style={{ background: '#22c55e' }}
        animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
    </span>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ContactInfo() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light
  const { accent, accentSoft, accentBorder, accentGlow, ctaText } = cfg

  return (
    <div className="flex flex-col gap-8 h-full">

      {/* ── Tagline block ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-[1.5px] rounded-full" style={{ background: accent }} />
          <span
            className="text-[0.62rem] font-bold uppercase tracking-[0.25em]"
            style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
          >
            Get in touch
          </span>
        </div>

        <h2
          className="font-black leading-[1.05] mb-3"
          style={{
            fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)',
            color: 'var(--text-primary)',
            fontFamily: '"Mona Sans", sans-serif',
            letterSpacing: '-0.03em',
          }}
        >
          Let's build something{' '}
          <span style={{ color: accent }}>
            {isDark ? 'cinematic.' : 'powerful.'}
          </span>
        </h2>

        <p
          className="text-[0.85rem] leading-relaxed"
          style={{
            color: 'var(--text-muted)',
            fontFamily: '"Mona Sans", sans-serif',
            maxWidth: '360px',
          }}
        >
          {isDark
            ? 'Whether it\'s a full-stack product, a 3D experience, or an AI integration — I ship it solo, fast, and to a high standard.'
            : 'From concept to deployed product — I work fast, communicate clearly, and deliver beyond the brief.'}
        </p>
      </motion.div>

      {/* ── Availability banner ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border"
        style={{
          background:  'rgba(34,197,94,0.06)',
          borderColor: 'rgba(34,197,94,0.2)',
        }}
      >
        <StatusPulse accent={accent} />
        <div>
          <p
            className="text-[0.72rem] font-bold"
            style={{ color: '#22c55e', fontFamily: '"Mona Sans", sans-serif' }}
          >
            Available for new projects
          </p>
          <p
            className="text-[0.62rem] mt-0.5"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            Freelance · Full-time · Open to contracts
          </p>
        </div>
      </motion.div>

      {/* ── Email block ── */}
      <EmailBlock
        accent={accent}
        accentSoft={accentSoft}
        accentBorder={accentBorder}
        accentGlow={accentGlow}
        ctaText={ctaText}
        isDark={isDark}
      />

      {/* ── Info rows ── */}
      <div className="flex flex-col gap-2">
        {INFO_ITEMS.map((item, i) => (
          <InfoRow
            key={item.id}
            item={item}
            accent={accent}
            accentSoft={accentSoft}
            index={i}
          />
        ))}
      </div>

      {/* ── Social cards ── */}
      <div>
        <p
          className="text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          Find me elsewhere
        </p>
        <div className="flex flex-col gap-2">
          {SOCIALS.map((social, i) => (
            <SocialCard
              key={social.label}
              social={social}
              accent={accent}
              accentSoft={accentSoft}
              accentBorder={accentBorder}
              index={i}
            />
          ))}
        </div>
      </div>

    </div>
  )
}