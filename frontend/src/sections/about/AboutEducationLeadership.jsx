// sections/about/AboutEducationLeadership.jsx
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { education as defaultEducation, leadership as defaultLeadership } from '../../constants/about'
import { useSiteData } from '../../context/SiteDataContext'

const ease  = [0.16, 1, 0.3, 1]
const TINTS = ['#52aeff', '#a78bfa', '#34d399', '#f59e0b', '#fb7185']

const THEME_CFG = {
  dark:  { accent: '#52aeff', accentSoft: 'rgba(82,174,255,0.07)',  accentBorder: 'rgba(82,174,255,0.2)',  gridColor: 'rgba(82,174,255,0.03)'  },
  light: { accent: '#d4200c', accentSoft: 'rgba(212,32,12,0.06)',   accentBorder: 'rgba(212,32,12,0.18)',  gridColor: 'rgba(212,32,12,0.025)' },
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, headLine, accent, accentSoft, accentBorder, right, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease }}
      className="mb-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          {/* Eyebrow */}
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

          {/* Heading */}
          <h2
            className="font-black tracking-tight leading-[0.95]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            {headLine.map((part, i) => (
              <span
                key={i}
                style={{
                  color:    i === headLine.length - 1 ? accent : 'var(--text-primary)',
                  display:  'block',
                  transition: 'color 0.4s ease',
                }}
              >
                {part}
              </span>
            ))}
          </h2>
        </div>

        {/* Right slot */}
        {right}
      </div>
    </motion.div>
  )
}

// ─── Education card ────────────────────────────────────────────────────────────
function EduCard({ item, index, accent }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.14, duration: 0.6, ease }}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background:  'var(--bg-card)',
        border:      `1px solid ${hovered ? `${accent}50` : `${accent}20`}`,
        boxShadow:   hovered ? `0 20px 56px ${accent}14, 0 0 0 1px ${accent}18` : 'none',
        transform:   hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition:  'all 0.28s cubic-bezier(0.16,1,0.3,1)',
        minHeight:   '320px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar (full width, slides in on hover) */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(to right, ${accent}, ${accent}30)`,
          transform:  hovered ? 'scaleX(1)' : 'scaleX(0.35)',
          transformOrigin: 'left',
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[3px]"
        style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}18, transparent)` }}
      />

      {/* Grade badge */}
      <div
        className="absolute top-5 right-5 px-3 py-1.5 rounded-xl"
        style={{
          background:  `${accent}10`,
          border:      `1px solid ${accent}25`,
          transition:  'all 0.25s',
        }}
      >
        <span
          className="text-[0.62rem] font-black block"
          style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
        >
          {item.grade}
        </span>
      </div>

      {/* Watermark */}
      <span
        className="absolute -bottom-3 -right-2 font-black pointer-events-none select-none"
        style={{
          fontSize:   '6.5rem',
          color:      accent,
          opacity:    hovered ? 0.055 : 0.03,
          fontFamily: '"Mona Sans", sans-serif',
          lineHeight: 1,
          transition: 'opacity 0.3s',
        }}
      >
        {item.shortName?.[0] || item.institution?.[0]}
      </span>

      <div className="relative pl-7 pr-6 pt-6 pb-6 flex flex-col h-full">
        {/* Status pill + period */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className="text-[0.52rem] tracking-[0.18em] uppercase font-black px-2.5 py-1 rounded-full"
            style={{
              background: `${accent}0e`,
              border:     `1px solid ${accent}22`,
              color:      accent,
              fontFamily: '"Mona Sans", sans-serif',
            }}
          >
            {item.status}
          </span>
          <span className="text-[0.6rem] font-mono" style={{ color: 'var(--text-muted)' }}>
            {item.period}
          </span>
        </div>

        {/* Institution */}
        <p
          className="text-[0.64rem] font-black tracking-[0.16em] uppercase mb-1.5"
          style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
        >
          {item.shortName || item.institution}
        </p>
        <p className="text-[0.6rem] mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {item.location}
        </p>

        {/* Degree */}
        <h3
          className="font-black tracking-tight mb-5 pr-20"
          style={{
            fontSize:   'clamp(0.9rem, 2vw, 1.05rem)',
            color:      'var(--text-primary)',
            fontFamily: '"Mona Sans", sans-serif',
            lineHeight: 1.2,
          }}
        >
          {item.degree}
        </h3>

        {/* Divider */}
        <div className="w-8 h-px mb-5" style={{ background: `${accent}50` }} />

        {/* Highlights */}
        <ul className="flex flex-col gap-2.5 mt-auto">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 mt-[7px]"
                style={{ width: 3, height: 3, borderRadius: '50%', background: accent, display: 'block' }}
              />
              <span
                className="text-[0.72rem] leading-[1.8]"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
              >
                {h}
              </span>
            </li>
          ))}
        </ul>

        {/* Courses */}
        {item.courses?.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 mt-5 pt-4"
            style={{ borderTop: `1px solid ${accent}12` }}
          >
            {item.courses.slice(0, 4).map(c => (
              <span
                key={c}
                className="text-[0.56rem] px-2 py-0.5 rounded-md font-semibold"
                style={{
                  background: `${accent}08`,
                  border:     `1px solid ${accent}18`,
                  color:      accent,
                  fontFamily: '"Mona Sans", sans-serif',
                }}
              >
                {c}
              </span>
            ))}
            {item.courses.length > 4 && (
              <span
                className="text-[0.56rem] px-2 py-0.5 rounded-md"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
              >
                +{item.courses.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Leadership card ───────────────────────────────────────────────────────────
function LeaderCard({ item, index, featured = false }) {
  const tint = TINTS[index % TINTS.length]
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.55, ease }}
      className={`relative rounded-2xl overflow-hidden ${featured ? 'md:col-span-2' : ''}`}
      style={{
        background:  'var(--bg-card)',
        border:      `1px solid ${hovered ? `${tint}40` : 'var(--border-color)'}`,
        boxShadow:   hovered ? `0 20px 56px ${tint}10, 0 0 0 1px ${tint}14` : 'none',
        transform:   hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition:  'all 0.28s cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:      `linear-gradient(to right, ${tint}, ${tint}20, transparent)`,
          transform:        hovered ? 'scaleX(1)' : 'scaleX(0.4)',
          transformOrigin:  'left',
          transition:       'transform 0.4s ease',
        }}
      />

      {/* Watermark number */}
      <span
        className="absolute -bottom-3 -right-2 font-black pointer-events-none select-none"
        style={{
          fontSize:   featured ? '8rem' : '6rem',
          color:      tint,
          opacity:    hovered ? 0.065 : 0.04,
          fontFamily: '"Mona Sans", sans-serif',
          lineHeight: 1,
          transition: 'opacity 0.3s',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div
        className={`relative p-6 ${featured ? 'grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start' : ''}`}
      >
        <div>
          {/* Badge */}
          {item.badge && (
            <span
              className="inline-block text-[0.52rem] tracking-[0.16em] uppercase font-black px-2.5 py-1 rounded-full mb-3"
              style={{
                background: `${tint}0e`,
                border:     `1px solid ${tint}22`,
                color:      tint,
                fontFamily: '"Mona Sans", sans-serif',
              }}
            >
              {item.badge}
            </span>
          )}

          {/* Org */}
          <p
            className="text-[0.6rem] font-black tracking-[0.2em] uppercase mb-1.5"
            style={{ color: tint, fontFamily: '"Mona Sans", sans-serif' }}
          >
            {item.org}
          </p>

          {/* Title + period */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              className="font-black tracking-tight"
              style={{
                fontSize:   'clamp(0.88rem, 2vw, 0.98rem)',
                color:      'var(--text-primary)',
                fontFamily: '"Mona Sans", sans-serif',
                lineHeight: 1.2,
              }}
            >
              {item.title}
            </h3>
            <span
              className="text-[0.58rem] font-mono flex-shrink-0 px-2 py-1 rounded-lg"
              style={{
                color:      'var(--text-muted)',
                background: 'var(--bg-secondary)',
                border:     '1px solid var(--border-color)',
              }}
            >
              {item.period}
            </span>
          </div>

          {/* Summary */}
          <p
            className="text-[0.73rem] leading-[1.85] mb-4"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            {item.summary}
          </p>
        </div>

        {/* Highlights */}
        <ul className={`flex flex-col gap-2 ${featured ? '' : 'mb-4'}`}>
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 mt-[7px]"
                style={{ width: 3, height: 3, borderRadius: '50%', background: tint, display: 'block' }}
              />
              <span
                className="text-[0.7rem] leading-[1.75]"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
              >
                {h}
              </span>
            </li>
          ))}

          {item.url && (
            <li className="pt-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[0.64rem] font-black no-underline transition-all duration-200"
                style={{ color: tint, fontFamily: '"Mona Sans", sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Visit site
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function AboutEducationLeadership() {
  const { theme } = useTheme()
  const { education: apiEdu, leadership: apiLead } = useSiteData()
  const education = apiEdu?.length > 0 ? apiEdu : defaultEducation
  const leadership = apiLead?.length > 0 ? apiLead : defaultLeadership
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light
  const { accent, accentSoft, accentBorder, gridColor } = cfg

  const eduRef     = useRef(null)
  const leadRef    = useRef(null)
  const eduInView  = useInView(eduRef,  { once: true, margin: '-60px' })
  const leadInView = useInView(leadRef, { once: true, margin: '-60px' })

  return (
    <>
      {/* ══ EDUCATION ══════════════════════════════════════════════════════════ */}
      <section
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

        <div className="relative max-w-[1100px] mx-auto px-5 md:px-10">
          <SectionHeader
            eyebrow="Academic Background"
            headLine={['Where I', 'studied.']}
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
            inView={eduInView}
            right={
              <div className="hidden lg:flex items-center gap-4 pb-1">
                <div className="w-16 h-px" style={{ background: 'var(--border-color)' }} />
                <span className="text-[0.7rem] font-mono" style={{ color: 'var(--text-muted)' }}>
                  2018 — Present
                </span>
              </div>
            }
          />

          <motion.div
            ref={eduRef}
            initial="hidden"
            animate={eduInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {education.map((item, i) => (
              <EduCard key={item.id} item={item} index={i} accent={accent} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ LEADERSHIP ═════════════════════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          borderTop:       '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
        }}
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

        <div className="relative max-w-[1100px] mx-auto px-5 md:px-10">
          <SectionHeader
            eyebrow="Beyond Code"
            headLine={['Where I', 'led.']}
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
            inView={leadInView}
            right={
              <div className="flex items-center gap-3 pb-2">
                <span
                  className="font-black tabular-nums"
                  style={{
                    fontSize:      '3.5rem',
                    color:          accent,
                    fontFamily:    '"Mona Sans", sans-serif',
                    letterSpacing: '-0.05em',
                    opacity:       0.12,
                    lineHeight:    1,
                  }}
                >
                  {String(leadership.length).padStart(2, '0')}
                </span>
                <span
                  className="text-[0.6rem] tracking-[0.14em] uppercase"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
                >
                  Roles &<br />Initiatives
                </span>
              </div>
            }
          />

          <motion.div
            ref={leadRef}
            initial="hidden"
            animate={leadInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {leadership.map((item, i) => (
              <LeaderCard
                key={item.id}
                item={item}
                index={i}
                featured={i === 0}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}