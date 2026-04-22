import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { featuredProjects as defaultFeaturedProjects } from '../work/projectsData'
import { useSiteData } from '../../context/SiteDataContext'

const PROJECT_ACCENTS = [
  { primary: '#52aeff', glow: 'rgba(82, 174, 255, 0.08)', soft: 'rgba(82, 174, 255, 0.04)'  },
  { primary: '#a78bfa', glow: 'rgba(167, 139, 250, 0.08)', soft: 'rgba(167, 139, 250, 0.04)' },
  { primary: '#34d399', glow: 'rgba(52, 211, 153, 0.08)', soft: 'rgba(52, 211, 153, 0.04)'  },
]

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
}

// ── Project image panel ───────────────────────────────────────────────────────
function ProjectImage({ src, alt, accent, projectId }) {
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    // ── Entire image panel is a Link to the detail page ──
    <Link
      to={`/work/${projectId}`}
      className="relative overflow-hidden h-[260px] md:h-full block no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!loaded && (
        <div className="absolute inset-0" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent.primary}12, transparent)`,
              animation: 'fp-shimmer 1.8s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes fp-shimmer {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

      <img
        src={src} alt={alt}
        width={700} height={400}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={e => { setLoaded(true); e.currentTarget.style.opacity = '0' }}
        className="w-full h-full object-cover block"
        style={{
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          opacity: loaded ? 1 : 0,
          transition: 'transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease',
        }}
      />

      {/* Right-side gradient bleed */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: `linear-gradient(to right, transparent 55%, var(--bg-card) 100%)` }}
      />
      {/* Bottom gradient bleed (mobile) */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `linear-gradient(to top, var(--bg-card) 0%, transparent 60%)` }}
      />
      {/* Accent hover tint */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accent.glow}, transparent 60%)` }}
      />

      {/* "View Details" hint — slides up on hover */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.22 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.22)' }}
      >
        <span
          className="flex items-center gap-2 text-white text-[0.72rem] font-semibold px-4 py-2 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.55)',
            border: `1px solid ${accent.primary}50`,
            backdropFilter: 'blur(8px)',
          }}
        >
          View Details
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </span>
      </motion.div>
    </Link>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FeaturedProject() {
  const [index, setIndex]         = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef(null)
  const { projects: apiProjects } = useSiteData()
  const featuredProjects = apiProjects?.length > 0 ? apiProjects.filter(p => p.featured) : defaultFeaturedProjects

  const total   = featuredProjects.length
  const project = featuredProjects[index]
  const accent  = PROJECT_ACCENTS[index] ?? PROJECT_ACCENTS[0]

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!isHovered) {
        setDirection(1)
        setIndex(i => (i + 1) % total)
      }
    }, 6000)
  }, [isHovered, total])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  const goTo = useCallback((next) => {
    setDirection(next > index ? 1 : -1)
    setIndex(next)
    resetTimer()
  }, [index, resetTimer])

  const prev = useCallback(() => goTo((index - 1 + total) % total), [goTo, index, total])
  const next = useCallback(() => goTo((index + 1) % total),         [goTo, index, total])

  return (
    <section
      className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Header row ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[6px] h-[6px] rounded-full flex-shrink-0"
            style={{ background: accent.primary, transition: 'background 0.5s' }}
          />
          <span
            className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            Featured Work
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.7rem] font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="flex gap-1.5">
            {[{ fn: prev, icon: '←' }, { fn: next, icon: '→' }].map(({ fn, icon }) => (
              <button
                key={icon}
                onClick={fn}
                aria-label={icon === '←' ? 'Previous' : 'Next'}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer transition-all duration-200"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = accent.primary
                  e.currentTarget.style.color = accent.primary
                  e.currentTarget.style.background = `${accent.primary}10`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.background = 'var(--bg-card)'
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Card ── */}
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: `0 0 0 1px ${accent.primary}12, 0 24px 64px ${accent.glow}`,
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-20" style={{ background: 'var(--border-color)' }}>
          <motion.div
            key={`bar-${index}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 0 : 1 }}
            transition={{ duration: isHovered ? 0 : 6, ease: 'linear' }}
            className="h-full origin-left"
            style={{ background: accent.primary, transition: 'background 0.5s' }}
          />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={project.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] min-h-[460px]"
          >
            {/* Image — now navigates on click */}
            <ProjectImage
              src={project.imageUrl}
              alt={project.title}
              accent={accent}
              projectId={project.id}
            />

            {/* ── RIGHT SIDE ── */}
            <div className="relative flex flex-col justify-between p-8 md:p-10 overflow-hidden">

              {/* Watermark number */}
              <span
                className="absolute bottom-6 right-7 text-[6rem] font-black leading-none select-none pointer-events-none tabular-nums"
                style={{ color: `${accent.primary}08`, transition: 'color 0.5s', lineHeight: 1 }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* TOP: category + dots */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: `${accent.primary}10`, border: `1px solid ${accent.primary}25` }}
                >
                  <div className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: accent.primary }} />
                  <span className="text-[0.6rem] tracking-[0.16em] uppercase font-bold" style={{ color: accent.primary }}>
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center gap-[5px]">
                  {featuredProjects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Project ${i + 1}`}
                      className="h-[3px] rounded-full border-none cursor-pointer p-0 transition-all duration-300"
                      style={{
                        width: i === index ? '18px' : '4px',
                        background: i === index ? accent.primary : 'var(--border-color)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* MIDDLE: text */}
              <div className="flex-1 flex flex-col justify-center py-6">
                <h2
                  className="font-black tracking-tight leading-[1.1] mb-2"
                  style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)', color: 'var(--text-primary)' }}
                >
                  {project.title}
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-5 h-[2px] rounded-full flex-shrink-0 transition-all duration-500" style={{ background: accent.primary }} />
                  <p className="text-[0.74rem] font-medium tracking-wide transition-colors duration-500" style={{ color: accent.primary }}>
                    {project.subtitle}
                  </p>
                </div>
                <p className="text-[0.82rem] leading-[1.85] line-clamp-4 mb-6" style={{ color: 'var(--text-muted)' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, i) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[0.62rem] tracking-wide font-medium transition-all duration-500"
                      style={{
                        background: i === 0 ? `${accent.primary}14` : 'transparent',
                        border: `1px solid ${i === 0 ? accent.primary + '35' : 'var(--border-color)'}`,
                        color: i === 0 ? accent.primary : 'var(--text-muted)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* BOTTOM: CTAs */}
              <div>
                <div className="w-full h-px mb-5" style={{ background: 'var(--border-color)' }} />
                <div className="flex items-center gap-2">

                  {/* Details — navigates to project page */}
                  <Link
                    to={`/work/${project.id}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[0.75rem] font-bold no-underline transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: accent.primary,
                      color: '#fff',
                    }}
                  >
                    Details
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </Link>

                  {/* View Live */}
                  <a
                    href={project.projectUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[0.75rem] font-medium no-underline transition-all duration-200 hover:-translate-y-0.5 flex-1 justify-center"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = accent.primary
                      e.currentTarget.style.color = accent.primary
                      e.currentTarget.style.background = `${accent.primary}08`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)'
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Live ↗
                  </a>

                  {/* GitHub — icon only */}
                  <a
                    href={project.githubLink}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-[38px] h-[38px] rounded-lg transition-all duration-200 flex-shrink-0"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                    title="View on GitHub"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = accent.primary
                      e.currentTarget.style.color = accent.primary
                      e.currentTarget.style.background = `${accent.primary}08`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)'
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  </a>

                  {/* Year */}
                  <span
                    className="text-[0.62rem] font-mono tabular-nums ml-auto pl-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {project.year}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}