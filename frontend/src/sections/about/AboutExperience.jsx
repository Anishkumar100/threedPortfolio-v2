// sections/about/AboutExperience.jsx
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { experience as defaultExperience, values as defaultValues } from '../../constants/about'
import { useSiteData } from '../../context/SiteDataContext'

const ease = [0.16, 1, 0.3, 1]

const THEME_CFG = {
  dark: {
    accent:       '#52aeff',
    accentSoft:   'rgba(82,174,255,0.07)',
    accentBorder: 'rgba(82,174,255,0.2)',
    accentGlow:   'rgba(82,174,255,0.12)',
    gridColor:    'rgba(82,174,255,0.03)',
  },
  light: {
    accent:       '#d4200c',
    accentSoft:   'rgba(212,32,12,0.06)',
    accentBorder: 'rgba(212,32,12,0.18)',
    accentGlow:   'rgba(212,32,12,0.1)',
    gridColor:    'rgba(212,32,12,0.025)',
  },
}

// ─── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, headLine, subtext, accent, inView }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-16">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: accent }}
          />
          <span
            className="text-[0.6rem] font-bold uppercase tracking-[0.26em]"
            style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          className="font-black tracking-tight leading-[0.95]"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          {headLine.map((part, i) => (
            <span
              key={i}
              style={{
                color:      i === headLine.length - 1 ? accent : 'var(--text-primary)',
                display:    'block',
                transition: 'color 0.4s ease',
              }}
            >
              {part}
            </span>
          ))}
        </h2>
      </motion.div>

      {subtext && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="text-[0.84rem] leading-[2] max-w-[380px]"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          {subtext}
        </motion.p>
      )}
    </div>
  )
}

// ─── Experience card (accordion) ───────────────────────────────────────────────
function ExpCard({ item, index, totalCount, globalAccent }) {
  const [open, setOpen] = useState(index === 0)
  const cardAccent = item.accent || globalAccent

  return (
    <div className="relative">
      {/* Connector line to next card */}
      {index < totalCount - 1 && (
        <div
          className="absolute left-[18px] top-full w-px z-0"
          style={{
            height:     open ? '28px' : '16px',
            background: `linear-gradient(to bottom, ${cardAccent}50, transparent)`,
            transition: 'height 0.3s ease',
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.12, duration: 0.6, ease }}
        className="relative z-10"
      >
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background:  'var(--bg-card)',
            border:      `1px solid ${open ? cardAccent + '38' : 'var(--border-color)'}`,
            boxShadow:   open ? `0 0 0 1px ${cardAccent}10, 0 12px 48px ${cardAccent}12` : 'none',
            transition:  'border-color 0.3s, box-shadow 0.3s',
          }}
        >
          {/* Animated top bar */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="bar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.4, ease }}
                className="absolute top-0 left-0 right-0 h-[3px] origin-left"
                style={{ background: `linear-gradient(to right, ${cardAccent}, ${cardAccent}30, transparent)` }}
              />
            )}
          </AnimatePresence>

          {/* Header button */}
          <button
            onClick={() => setOpen(p => !p)}
            className="w-full text-left p-5 flex items-start gap-4"
          >
            {/* Number badge */}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-[0.65rem] transition-all duration-250"
              style={{
                background: open ? cardAccent : `${cardAccent}12`,
                border:     `1px solid ${cardAccent}30`,
                color:      open ? '#000' : cardAccent,
                fontFamily: '"Mona Sans", sans-serif',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className="flex-1 min-w-0">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                {item.current && (
                  <span
                    className="inline-flex items-center gap-1.5 text-[0.54rem] tracking-[0.14em] uppercase font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(52,211,153,0.07)',
                      border:     '1px solid rgba(52,211,153,0.2)',
                      color:      '#34d399',
                      fontFamily: '"Mona Sans", sans-serif',
                    }}
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full block"
                      style={{ background: '#34d399' }}
                      animate={{ opacity: [1, 0.15, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    Current
                  </span>
                )}
                <span
                  className="text-[0.54rem] tracking-[0.12em] uppercase font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${cardAccent}0e`,
                    border:     `1px solid ${cardAccent}22`,
                    color:      cardAccent,
                    fontFamily: '"Mona Sans", sans-serif',
                  }}
                >
                  {item.type}
                </span>
                <span className="text-[0.62rem] font-mono" style={{ color: 'var(--text-muted)' }}>
                  {item.period} · {item.duration}
                </span>
              </div>

              {/* Role */}
              <h3
                className="font-black tracking-tight mb-1"
                style={{
                  fontSize:   'clamp(0.9rem, 2vw, 1.05rem)',
                  color:      'var(--text-primary)',
                  fontFamily: '"Mona Sans", sans-serif',
                }}
              >
                {item.role}
              </h3>

              {/* Company + location */}
              <p
                className="text-[0.76rem] font-bold"
                style={{ color: cardAccent, fontFamily: '"Mona Sans", sans-serif' }}
              >
                {item.company}
                <span className="font-normal text-[0.64rem] ml-2" style={{ color: 'var(--text-muted)' }}>
                  · {item.location}
                </span>
              </p>
            </div>

            {/* Chevron */}
            <motion.div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: `${cardAccent}0e`,
                border:     `1px solid ${cardAccent}1e`,
              }}
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.35, ease }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke={cardAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </motion.div>
          </button>

          {/* Expanded body */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  className="px-5 pb-6 pt-4"
                  style={{ borderTop: `1px solid ${cardAccent}10` }}
                >
                  {/* Impact callout */}
                  {item.impact && (
                    <div
                      className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl"
                      style={{
                        background: `${cardAccent}08`,
                        border:     `1px solid ${cardAccent}18`,
                      }}
                    >
                      <span className="text-[0.6rem] font-mono" style={{ color: cardAccent }}>⚡</span>
                      <span
                        className="text-[0.68rem] font-black"
                        style={{ color: cardAccent, fontFamily: '"Mona Sans", sans-serif' }}
                      >
                        {item.impact}
                      </span>
                    </div>
                  )}

                  {/* Summary */}
                  <p
                    className="text-[0.78rem] leading-[1.95] mb-5"
                    style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
                  >
                    {item.summary}
                  </p>

                  {/* Bullet points */}
                  <ul className="flex flex-col gap-2.5 mb-5">
                    {item.points.map((pt, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                        className="flex items-start gap-3"
                      >
                        <span
                          className="flex-shrink-0 mt-[9px]"
                          style={{
                            width:     3,
                            height:    3,
                            borderRadius: '50%',
                            background: cardAccent,
                            boxShadow:  `0 0 6px ${cardAccent}`,
                            display:   'block',
                          }}
                        />
                        <span
                          className="text-[0.76rem] leading-[1.85]"
                          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
                        >
                          {pt}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="text-[0.6rem] px-2.5 py-1 rounded-lg font-bold"
                        style={{
                          background: `${cardAccent}0c`,
                          border:     `1px solid ${cardAccent}1e`,
                          color:      cardAccent,
                          fontFamily: '"Mona Sans", sans-serif',
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {index < totalCount - 1 && <div className="h-3" />}
    </div>
  )
}

// ─── Value card ────────────────────────────────────────────────────────────────
function ValueCard({ item, index, accent, accentSoft, accentBorder, accentGlow }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.09, duration: 0.55, ease }}
      className="p-5 rounded-2xl relative overflow-hidden cursor-default"
      style={{
        background:  'var(--bg-card)',
        border:      `1px solid ${hovered ? accentBorder : 'var(--border-color)'}`,
        boxShadow:   hovered ? `0 16px 40px ${accentGlow}` : 'none',
        transform:   hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition:  'all 0.28s cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background:      `linear-gradient(to right, ${accent}, transparent)`,
          transform:        hovered ? 'scaleX(1)' : 'scaleX(0.4)',
          transformOrigin:  'left',
          transition:       'transform 0.35s ease',
        }}
      />

      {/* Bottom-right ambient glow */}
      <div
        className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none"
        style={{
          background: `radial-gradient(circle at bottom right, ${accentSoft}, transparent 70%)`,
          opacity:    hovered ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-[1.2rem] border transition-all duration-300"
          style={{
            background:  hovered ? `${accent}14` : accentSoft,
            borderColor: hovered ? accentBorder : 'transparent',
          }}
        >
          {item.icon}
        </div>

        <h3
          className="font-black mb-2 text-[0.84rem] tracking-tight"
          style={{
            color:      'var(--text-primary)',
            fontFamily: '"Mona Sans", sans-serif',
            transition: 'color 0.2s',
          }}
        >
          {item.title}
        </h3>
        <p
          className="text-[0.73rem] leading-[1.9]"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          {item.body}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function AboutExperience() {
  const { theme } = useTheme()
  const { experience: apiExp, config } = useSiteData()
  const experience = apiExp?.length > 0 ? apiExp : defaultExperience
  const values = config?.values?.length > 0 ? config.values : defaultValues
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light
  const { accent, accentSoft, accentBorder, accentGlow, gridColor } = cfg

  const expRef    = useRef(null)
  const valRef    = useRef(null)
  const expInView = useInView(expRef, { once: true, margin: '-60px' })
  const valInView = useInView(valRef, { once: true, margin: '-60px' })

  return (
    <>
      {/* ══ EXPERIENCE ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
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

        <div className="relative max-w-[1100px] mx-auto px-5 md:px-10">
          <SectionHeader
            eyebrow="Professional Journey"
            headLine={["Where I've", 'shipped.']}
            subtext="Three internships, each one pushing into harder territory — from pure HTML to MERN to AI-powered React Native mobile apps."
            accent={accent}
            inView={expInView}
          />

          <div ref={expRef} className="max-w-[700px]">
            {experience.map((item, i) => (
              <ExpCard
                key={item.id}
                item={item}
                index={i}
                totalCount={experience.length}
                globalAccent={accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ PHILOSOPHY ═══════════════════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          borderTop:       '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
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

        {/* Radial accent glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 50% 100%, ${accentGlow}, transparent 70%)`,
          }}
        />

        <div className="relative max-w-[1100px] mx-auto px-5 md:px-10">
          <SectionHeader
            eyebrow="Philosophy"
            headLine={['What', 'drives me.']}
            accent={accent}
            inView={valInView}
          />

          <motion.div
            ref={valRef}
            initial="hidden"
            animate={valInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {values.map((item, i) => (
              <ValueCard
                key={item.title}
                item={item}
                index={i}
                accent={accent}
                accentSoft={accentSoft}
                accentBorder={accentBorder}
                accentGlow={accentGlow}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}