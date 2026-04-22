// sections/home/TechStack.jsx
// Editorial layout — sticky category nav + 200×200 flip cards
// Tailwind CSS + Framer Motion | Theme-aware | Performance-optimized

import { useRef, useState, useEffect, memo, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { skillCategories as defaultSkillCategories } from '../constants/skills'
import { useSiteData } from '../context/SiteDataContext'
import { Link } from 'react-router-dom'

const ease = [0.16, 1, 0.3, 1]
const CARDS_INITIAL = 10

// ─── Theme config ──────────────────────────────────────────────────────────────
const THEME_CFG = {
  dark: {
    accent:       '#a78bfa',       // violet-400
    accentSoft:   'rgba(167,139,250,0.08)',
    accentBorder: 'rgba(167,139,250,0.22)',
    accentGlow:   'rgba(167,139,250,0.18)',
    gridColor:    'rgba(167,139,250,0.035)',
    ctaText:      '#0f0a1e',
  },
  light: {
    accent:       '#7c3aed',       // violet-700
    accentSoft:   'rgba(124,58,237,0.07)',
    accentBorder: 'rgba(124,58,237,0.2)',
    accentGlow:   'rgba(124,58,237,0.14)',
    gridColor:    'rgba(124,58,237,0.025)',
    ctaText:      '#fff',
  },
}

const LEVEL_LABEL = ['', 'Beginner', 'Learning', 'Proficient', 'Advanced', 'Expert']

// ─── Circular arc level ring ───────────────────────────────────────────────────
const ArcRing = memo(function ArcRing({ level, accent, animate: shouldAnim, size = 48 }) {
  const r      = (size - 6) / 2
  const cx     = size / 2
  const cy     = size / 2
  const gap    = 28
  const start  = 90 + gap / 2
  const sweep  = 360 - gap
  const full   = (sweep / 360) * 2 * Math.PI * r
  const filled = shouldAnim ? (level / 5) * full : 0

  const toRad  = (deg) => (deg * Math.PI) / 180
  const polarX = (deg) => cx + r * Math.cos(toRad(deg))
  const polarY = (deg) => cy + r * Math.sin(toRad(deg))

  const endDeg = start + sweep
  const arcPath = [
    `M ${polarX(start)} ${polarY(start)}`,
    `A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${polarX(endDeg)} ${polarY(endDeg)}`,
  ].join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="flex-shrink-0 overflow-visible"
    >
      <path
        d={arcPath}
        fill="none"
        stroke="var(--border-color)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />
      <motion.path
        d={arcPath}
        fill="none"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${full} ${full}`}
        initial={{ strokeDashoffset: full }}
        animate={{ strokeDashoffset: full - filled }}
        transition={{ duration: 0.9, delay: 0.3, ease }}
        style={{ filter: `drop-shadow(0 0 4px ${accent}80)` }}
      />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={accent}
        fontSize="12"
        fontWeight="700"
        fontFamily='"Mona Sans", sans-serif'
      >
        {level}
      </text>
    </svg>
  )
})

// ─── Ticker marquee ────────────────────────────────────────────────────────────
const TickerText = memo(function TickerText({ text, accent }) {
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="flex gap-6 whitespace-nowrap"
        style={{
          color:         `${accent}55`,
          fontSize:      '0.5rem',
          fontFamily:    '"Mona Sans", sans-serif',
          fontWeight:    700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        {Array(8).fill(text).map((t, i) => <span key={i}>{t}</span>)}
      </motion.div>
    </div>
  )
})

// ─── 200×200 Flip card ─────────────────────────────────────────────────────────
const SkillCard = memo(function SkillCard({ skill, index, isActive, inView, isNew }) {
  const [flipped, setFlipped] = useState(false)
  const [pressed, setPressed] = useState(false)

  const accent     = skill.catAccent
  const levelLabel = LEVEL_LABEL[skill.level]
  const nameLong   = skill.name.length > 10

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.82, y: 24 }}
      animate={{
        opacity: isActive ? 1 : 0.18,
        scale:   !isActive ? 0.94 : pressed ? 0.96 : 1,
        y:       0,
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale:   { duration: 0.22 },
        y:       { delay: isNew ? (index % 5) * 0.06 : index * 0.03, duration: 0.55, ease },
        layout:  { duration: 0.4, ease },
      }}
      className="flex-shrink-0"
      style={{
        width:         '200px',
        height:        '200px',
        perspective:   '900px',
        cursor:        isActive ? 'pointer' : 'default',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      onClick={() => isActive && setFlipped(f => !f)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >

        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-[20px] overflow-hidden flex flex-col items-center justify-center gap-2 p-4 box-border"
          style={{
            backfaceVisibility:       'hidden',
            WebkitBackfaceVisibility: 'hidden',
            border:                   '1px solid var(--border-color)',
            background:               'var(--bg-card)',
            transition:               'border-color 0.25s, box-shadow 0.25s',
          }}
        >
          {/* Accent dot */}
          <div
            className="absolute top-3 left-3 w-[5px] h-[5px] rounded-full opacity-80"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
          />

          {/* Year badge */}
          <div
            className="absolute top-2 right-2 rounded-[5px] px-[6px] py-[2px]"
            style={{
              fontSize:      '0.5rem',
              fontFamily:    '"Mona Sans", sans-serif',
              fontWeight:    700,
              color:         `${accent}90`,
              background:    `${accent}12`,
              border:        `1px solid ${accent}22`,
              letterSpacing: '0.08em',
            }}
          >
            {skill.since}
          </div>

          <ArcRing level={skill.level} accent={accent} animate={inView} size={52} />

          {/* Skill name */}
          <div
            className="text-center leading-tight max-w-[160px]"
            style={{
              fontFamily:    '"Mona Sans", sans-serif',
              fontWeight:    900,
              fontSize:      nameLong ? '0.78rem' : '0.9rem',
              color:         'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight:    1.1,
            }}
          >
            {skill.name}
          </div>

          {/* Category chip */}
          <div
            className="rounded-[5px] px-[7px] py-[2px]"
            style={{
              fontSize:      '0.5rem',
              fontFamily:    '"Mona Sans", sans-serif',
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color:         accent,
              background:    `${accent}12`,
              border:        `1px solid ${accent}25`,
            }}
          >
            {skill.catLabel}
          </div>

          {/* Flip hint dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 1.4, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
                className="w-[3px] h-[3px] rounded-full"
                style={{ background: `${accent}70` }}
              />
            ))}
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-[20px] overflow-hidden flex flex-col box-border"
          style={{
            backfaceVisibility:       'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform:                'rotateY(180deg)',
            border:                   `1px solid ${accent}45`,
            background:               'var(--bg-card)',
            boxShadow:                `0 0 0 1px ${accent}15, inset 0 0 28px ${accent}08`,
          }}
        >
          {/* Header strip */}
          <div
            className="flex-shrink-0 px-4 pt-3 pb-2"
            style={{
              background:   `linear-gradient(135deg, ${accent}18, ${accent}08)`,
              borderBottom: `1px solid ${accent}25`,
            }}
          >
            <div
              style={{
                fontFamily:    '"Mona Sans", sans-serif',
                fontWeight:    900,
                fontSize:      nameLong ? '0.7rem' : '0.82rem',
                color:         accent,
                letterSpacing: '-0.02em',
                lineHeight:    1.1,
              }}
            >
              {skill.name}
            </div>
            <div
              style={{
                fontFamily:    '"Mona Sans", sans-serif',
                fontSize:      '0.52rem',
                color:         `${accent}90`,
                marginTop:     '2px',
                fontWeight:    600,
                letterSpacing: '0.04em',
              }}
            >
              {skill.catLabel}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 px-4 py-3 flex flex-col gap-3">
            {/* Level row */}
            <div className="flex justify-between items-center">
              <span
                style={{
                  fontSize:      '0.5rem',
                  color:         'var(--text-muted)',
                  fontFamily:    '"Mona Sans", sans-serif',
                  fontWeight:    600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Level
              </span>
              <span
                style={{
                  fontSize:      '0.6rem',
                  color:         accent,
                  fontFamily:    '"Mona Sans", sans-serif',
                  fontWeight:    800,
                  letterSpacing: '-0.01em',
                }}
              >
                {levelLabel}
              </span>
            </div>

            {/* Segmented bar */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={flipped ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3, ease }}
                  className="flex-1 h-[3px] rounded-sm"
                  style={{
                    background:      i < skill.level ? accent : 'var(--border-color)',
                    opacity:         i < skill.level ? 1 : 0.2,
                    transformOrigin: 'left',
                    boxShadow:       i < skill.level ? `0 0 6px ${accent}` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Since row */}
            <div className="flex justify-between items-center">
              <span
                style={{
                  fontSize:      '0.5rem',
                  color:         'var(--text-muted)',
                  fontFamily:    '"Mona Sans", sans-serif',
                  fontWeight:    600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Since
              </span>
              <span
                style={{
                  fontSize:   '0.6rem',
                  color:      'var(--text-secondary)',
                  fontFamily: '"Mona Sans", monospace',
                  fontWeight: 700,
                }}
              >
                {skill.since}
              </span>
            </div>

            {/* Sparkle dots */}
            <div className="flex gap-1 mt-auto">
              {Array.from({ length: skill.level }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={flipped ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, type: 'spring', stiffness: 400, damping: 14 }}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: accent,
                    boxShadow:  `0 0 6px ${accent}`,
                    opacity:    0.7 + i * 0.06,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Ticker */}
          <div className="pb-2 flex-shrink-0">
            <TickerText text={skill.name} accent={accent} />
          </div>
        </div>

      </motion.div>
    </motion.div>
  )
})

// ─── Category nav item ─────────────────────────────────────────────────────────
const CatNavItem = memo(function CatNavItem({ category, isActive, onClick, index, inView }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.065, duration: 0.45, ease }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left cursor-pointer border"
      style={{
        background:  isActive ? `${category.accent}0d` : 'transparent',
        borderColor: isActive ? `${category.accent}40` : 'transparent',
        boxShadow:   isActive ? `0 0 20px ${category.glow}` : 'none',
        transition:  'all 0.22s ease',
      }}
    >
      {/* Active bar */}
      <div
        className="flex-shrink-0 w-[3px] h-7 rounded-sm"
        style={{
          background: isActive ? category.accent : 'var(--border-color)',
          boxShadow:  isActive ? `0 0 10px ${category.accent}` : 'none',
          transition: 'all 0.25s ease',
        }}
      />

      {/* Icon box */}
      <div
        className="w-8 h-8 rounded-[9px] flex-shrink-0 flex items-center justify-center text-sm"
        style={{
          background: isActive ? `${category.accent}18` : 'var(--bg-secondary)',
          border:     `1px solid ${isActive ? `${category.accent}30` : 'var(--border-color)'}`,
          color:      isActive ? category.accent : 'var(--text-muted)',
          transition: 'all 0.22s ease',
        }}
      >
        {category.icon}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate mb-[1px]"
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            fontWeight: 700,
            fontSize:   '0.75rem',
            color:      isActive ? category.accent : 'var(--text-primary)',
            transition: 'color 0.2s',
          }}
        >
          {category.label}
        </p>
        <p
          style={{
            fontFamily: '"Mona Sans", sans-serif',
            fontSize:   '0.56rem',
            color:      'var(--text-muted)',
          }}
        >
          {category.skills.length} skills
        </p>
      </div>

      {isActive && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 rounded-full px-2 py-[2px]"
          style={{
            fontSize:   '0.52rem',
            fontWeight: 900,
            fontFamily: '"Mona Sans", sans-serif',
            color:      category.accent,
            background: `${category.accent}16`,
            border:     `1px solid ${category.accent}28`,
          }}
        >
          {category.skills.length}
        </motion.span>
      )}
    </motion.button>
  )
})

// ─── Expand button ─────────────────────────────────────────────────────────────
function ExpandButton({ remaining, accent, accentGlow, onExpand, inView }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col items-center gap-3 py-2"
    >
      <div
        className="w-full h-px mb-1"
        style={{ background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }}
      />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
  
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl border cursor-pointer"
        style={{
          border:      `1px solid ${hovered ? `${accent}60` : `${accent}25`}`,
          background:  hovered ? `${accent}0e` : 'var(--bg-card)',
          color:       accent,
          fontFamily:  '"Mona Sans", sans-serif',
          fontWeight:  800,
          fontSize:    '0.78rem',
          letterSpacing: '-0.01em',
          boxShadow:   hovered ? `0 8px 28px ${accentGlow}` : 'none',
          transform:   hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition:  'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="flex flex-col gap-[2px]">
          {[0, 1].map(i => (
            <motion.svg
              key={i}
              width="10" height="6" viewBox="0 0 10 6" fill="none"
              animate={{ y: hovered ? [0, 2, 0] : 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, repeat: hovered ? Infinity : 0, ease: 'easeInOut' }}
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          ))}
        </div>

<Link to="/skills">
        <span>Reveal {remaining} more skills</span>
</Link>

        <span
          className="rounded-full px-2 py-[2px]"
          style={{
            background: `${accent}18`,
            border:     `1px solid ${accent}28`,
            fontSize:   '0.6rem',
            fontWeight: 900,
          }}
        >
          +{remaining}
        </span>
      </motion.button>

      <p
        className="uppercase tracking-widest"
        style={{
          fontSize:   '0.58rem',
          color:      'var(--text-muted)',
          fontFamily: '"Mona Sans", sans-serif',
        }}
      >
        Tap a card to flip it
      </p>
    </motion.div>
  )
}

// ─── Explore CTA ───────────────────────────────────────────────────────────────
const ExploreBtn = memo(function ExploreBtn({ accent, accentGlow, ctaText, inView }) {
  const [hovered, setHovered] = useState(false)
  const { skills: _eApiSkills } = useSiteData()
  const _eCats = _eApiSkills?.length > 0 ? _eApiSkills : defaultSkillCategories
  const total = _eCats.reduce((a, c) => a + c.skills.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.7, duration: 0.5, ease }}
    >
      <Link to="/skills" className="no-underline block">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative flex items-center justify-between gap-4 px-5 py-4 rounded-[18px] overflow-hidden"
          style={{
            border:     `1px solid ${hovered ? `${accent}50` : 'var(--border-color)'}`,
            background: hovered ? `${accent}0d` : 'var(--bg-card)',
            boxShadow:  hovered ? `0 16px 48px ${accentGlow}` : 'none',
            transform:  hovered ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:      `linear-gradient(to right, ${accent}, ${accent}30)`,
              transform:       hovered ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
              transition:      'transform 0.4s ease',
            }}
          />

          <div>
            <p
              className="uppercase mb-1"
              style={{
                fontSize:      '0.52rem',
                fontWeight:    700,
                fontFamily:    '"Mona Sans", sans-serif',
                color:         accent,
                letterSpacing: '0.2em',
              }}
            >
              Skills Page
            </p>
            <p
              className="leading-tight mb-1"
              style={{
                fontFamily:    '"Mona Sans", sans-serif',
                fontWeight:    900,
                fontSize:      'clamp(0.85rem, 2vw, 1rem)',
                color:         'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Explore all {total}+ skills →
            </p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}>
              Each card flips to reveal experience
            </p>
          </div>

          {/* Arrow */}
          <div
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
            style={{
              border:     `1px solid ${hovered ? accent : `${accent}28`}`,
              background: hovered ? accent : `${accent}12`,
              color:      hovered ? ctaText : accent,
              transform:  hovered ? 'translateX(3px)' : 'translateX(0)',
              transition: 'all 0.28s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
})

// ─── Running tally ─────────────────────────────────────────────────────────────
const RunningTally = memo(function RunningTally({ categories, activeId, accent, inView }) {
  const total   = categories.reduce((a, c) => a + c.skills.length, 0)
  const active  = categories.find(c => c.id === activeId)
  const showing = active ? active.skills.length : total

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border"
      style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
    >
      <span
        style={{
          fontFamily:    '"Mona Sans", sans-serif',
          fontWeight:    900,
          fontSize:      '1.5rem',
          color:         accent,
          letterSpacing: '-0.04em',
          lineHeight:    1,
        }}
      >
        {showing}
      </span>
      <span
        className="leading-snug uppercase"
        style={{
          fontSize:      '0.52rem',
          fontWeight:    600,
          fontFamily:    '"Mona Sans", sans-serif',
          color:         'var(--text-muted)',
          letterSpacing: '0.08em',
        }}
      >
        skills<br />shown
      </span>

      {activeId !== null && (
        <>
          <div className="w-px h-5 mx-1" style={{ background: 'var(--border-color)' }} />
          <span
            className="uppercase"
            style={{
              fontSize:      '0.52rem',
              fontWeight:    600,
              fontFamily:    '"Mona Sans", sans-serif',
              color:         'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            {total} total
          </span>
        </>
      )}
    </motion.div>
  )
})

// ─── Skill card grid ───────────────────────────────────────────────────────────
function SkillGrid({ activeId, accent, accentGlow, ctaText, inView }) {
  const [expanded, setExpanded] = useState(false)
  const expandRef = useRef(null)
  const { skills: _gApiSkills } = useSiteData()
  const _gCats = _gApiSkills?.length > 0 ? _gApiSkills : defaultSkillCategories

  const allSkills = _gCats.flatMap(cat =>
    cat.skills.map(sk => ({
      ...sk,
      catId:     cat.id,
      catLabel:  cat.label.split(' & ')[0],
      catAccent: cat.accent,
      catIcon:   cat.icon,
    }))
  )

  const filtered  = allSkills.filter(s => activeId === null || s.catId === activeId)
  const visible   = expanded ? filtered : filtered.slice(0, CARDS_INITIAL)
  const remaining = filtered.length - CARDS_INITIAL
  const hasMore   = !expanded && remaining > 0

  useEffect(() => { setExpanded(false) }, [activeId])

  const handleCollapse = useCallback(() => {
    setExpanded(false)
    setTimeout(() => expandRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [])

  return (
    <div ref={expandRef}>
      {/* Active filter context bar — no Clear button */}
      <AnimatePresence mode="wait">
        {activeId !== null && (() => {
          const cat = _gCats.find(c => c.id === activeId)
          return cat ? (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl"
              style={{
                border:     `1px solid ${cat.accent}30`,
                background: `${cat.accent}0c`,
              }}
            >
              <span className="text-base" style={{ color: cat.accent }}>{cat.icon}</span>
              <div className="flex-1">
                <p
                  style={{
                    fontFamily: '"Mona Sans", sans-serif',
                    fontWeight: 700,
                    fontSize:   '0.75rem',
                    color:      'var(--text-primary)',
                  }}
                >
                  {cat.label}
                </p>
                <p style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                  {cat.summary}
                </p>
              </div>
            </motion.div>
          ) : null
        })()}
      </AnimatePresence>

      {/* Card grid */}
      <motion.div layout className="flex flex-wrap gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((skill, i) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              index={i}
              isActive={activeId === null || skill.catId === activeId}
              inView={inView}
              isNew={i >= CARDS_INITIAL}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Expand / Collapse */}
      <div className="mt-5">
        {hasMore && (
          <ExpandButton
            remaining={remaining}
            accent={accent}
            accentGlow={accentGlow}
            onExpand={() => setExpanded(true)}
            inView={inView}
          />
        )}
        {expanded && filtered.length > CARDS_INITIAL && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCollapse}
              className="flex items-center gap-2 px-5 py-2 rounded-xl border cursor-pointer"
              style={{
                border:     '1px solid var(--border-color)',
                background: 'transparent',
                color:      'var(--text-muted)',
                fontFamily: '"Mona Sans", sans-serif',
                fontWeight: 600,
                fontSize:   '0.68rem',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M9 5L5 1L1 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Show less
            </motion.button>
          </motion.div>
        )}
        {!hasMore && !expanded && filtered.length <= CARDS_INITIAL && (
          <p
            className="text-center uppercase tracking-widest py-2"
            style={{
              fontSize:   '0.58rem',
              color:      'var(--text-muted)',
              fontFamily: '"Mona Sans", sans-serif',
            }}
          >
            Tap any card to flip it
          </p>
        )}
      </div>

      {/* Mobile CTA */}
      <div className="mt-6 lg:hidden">
        <ExploreBtn accent={accent} accentGlow={accentGlow} ctaText={ctaText} inView={inView} />
      </div>
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function TechStack() {
  const { theme } = useTheme()
  const { skills: apiSkills } = useSiteData()
  const skillCategories = apiSkills?.length > 0 ? apiSkills : defaultSkillCategories
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light
  const { accent, accentSoft, accentBorder, accentGlow, gridColor, ctaText } = cfg

  const [activeId, setActiveId]   = useState(null)
  const sectionRef                = useRef(null)
  const inView                    = useInView(sectionRef, { once: true, margin: '-80px' })

  const toggleCat = useCallback((id) => setActiveId(prev => prev === id ? null : id), [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t"
      style={{
        padding:         'clamp(60px, 8vw, 112px) 0',
        backgroundColor: 'var(--bg-primary)',
        borderColor:     'var(--border-color)',
      }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height:     '40%',
          background: `radial-gradient(ellipse 60% 60% at 50% 100%, ${accentGlow}, transparent 70%)`,
        }}
      />

      {/* Decorative hex */}
      <div
        aria-hidden
        className="absolute top-20 pointer-events-none select-none font-black leading-none"
        style={{
          right:      'clamp(24px, 5vw, 56px)',
          fontSize:   'clamp(7rem, 14vw, 14rem)',
          color:      `${accent}04`,
          fontFamily: '"Mona Sans", sans-serif',
          transform:  'rotate(12deg)',
        }}
      >
        ⬡
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto"
        style={{
          maxWidth: '1280px',
          padding:  '0 clamp(20px, 5vw, 40px)',
        }}
      >
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="mb-14"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: accent }}
            />
            <span
              className="uppercase tracking-[0.24em]"
              style={{
                fontSize:   '0.6rem',
                fontWeight: 700,
                fontFamily: '"Mona Sans", sans-serif',
                color:      'var(--text-muted)',
              }}
            >
              Tech Stack
            </span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2
              className="m-0"
              style={{
                fontFamily:    '"Mona Sans", sans-serif',
                fontWeight:    900,
                fontSize:      'clamp(2.2rem, 5vw, 4rem)',
                letterSpacing: '-0.04em',
                lineHeight:    0.95,
                color:         'var(--text-primary)',
              }}
            >
              Built with the<br />
              <span style={{ color: accent }}>right tools.</span>
            </h2>

            <p
              className="m-0"
              style={{
                fontFamily: '"Mona Sans", sans-serif',
                fontSize:   '0.82rem',
                lineHeight: 1.85,
                color:      'var(--text-muted)',
                maxWidth:   '320px',
              }}
            >
              Every skill earned on a real shipped project.<br />
              Flip cards to see the story behind each one.
            </p>
          </div>
        </motion.div>

        {/* Editorial split: sidebar + grid */}
        <div
          className="grid gap-[clamp(28px,5vw,48px)] items-start lg:grid-cols-[240px_1fr]"
        >
          {/* Left: sticky category nav */}
          <div className="flex flex-col gap-1.5 lg:sticky lg:top-24">
            {/* All categories */}
            <motion.button
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.45, ease }}
              onClick={() => setActiveId(null)}
              className="w-full flex items-center gap-3 px-4 py-[10px] rounded-xl border text-left cursor-pointer"
              style={{
                borderColor: activeId === null ? accentBorder : 'transparent',
                background:  activeId === null ? accentSoft : 'transparent',
                transition:  'all 0.2s ease',
              }}
            >
              <div
                className="flex-shrink-0 w-[3px] h-7 rounded-sm"
                style={{
                  background: activeId === null ? accent : 'var(--border-color)',
                  boxShadow:  activeId === null ? `0 0 10px ${accent}` : 'none',
                  transition: 'all 0.25s ease',
                }}
              />
              <div
                className="w-8 h-8 rounded-[9px] flex-shrink-0 flex items-center justify-center text-sm"
                style={{
                  background: activeId === null ? `${accent}18` : 'var(--bg-secondary)',
                  border:     `1px solid ${activeId === null ? accentBorder : 'var(--border-color)'}`,
                  color:      activeId === null ? accent : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                ◉
              </div>
              <div>
                <p
                  className="mb-[1px]"
                  style={{
                    fontFamily: '"Mona Sans", sans-serif',
                    fontWeight: 700,
                    fontSize:   '0.75rem',
                    color:      activeId === null ? accent : 'var(--text-primary)',
                    transition: 'color 0.2s',
                  }}
                >
                  All categories
                </p>
                <p style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '0.56rem', color: 'var(--text-muted)' }}>
                  {skillCategories.reduce((a, c) => a + c.skills.length, 0)} skills total
                </p>
              </div>
            </motion.button>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2 px-4 py-1"
            >
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
              <span
                className="uppercase tracking-[0.2em]"
                style={{
                  fontSize:   '0.5rem',
                  fontWeight: 700,
                  fontFamily: '"Mona Sans", sans-serif',
                  color:      'var(--text-muted)',
                }}
              >
                or filter
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            </motion.div>

            {/* Category items */}
            {skillCategories.map((cat, i) => (
              <CatNavItem
                key={cat.id}
                category={cat}
                isActive={activeId === cat.id}
                onClick={() => toggleCat(cat.id)}
                index={i}
                inView={inView}
              />
            ))}

            {/* Tally */}
            <div className="mt-1">
              <RunningTally
                categories={skillCategories}
                activeId={activeId}
                accent={accent}
                inView={inView}
              />
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block mt-2">
              <ExploreBtn accent={accent} accentGlow={accentGlow} ctaText={ctaText} inView={inView} />
            </div>
          </div>

          {/* Right: card grid */}
          <SkillGrid
            activeId={activeId}
            accent={accent}
            accentGlow={accentGlow}
            ctaText={ctaText}
            inView={inView}
          />
        </div>
      </div>
    </section>
  )
}
