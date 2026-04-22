import { useRef, useState, useEffect } from 'react'
import {
  motion, useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { profile as defaultProfile, aboutStats as defaultAboutStats } from '../../constants/about'
import { useSiteData } from '../../context/SiteDataContext'

const ease = [0.16, 1, 0.3, 1]

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC
// ─────────────────────────────────────────────────────────────────────────────
function Magnetic({ children, strength = 0.28 }) {
  const ref = useRef(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 160, damping: 18 })
  const sy  = useSpring(y, { stiffness: 160, damping: 18 })
  const onMove  = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width  / 2)) * strength)
    y.set((e.clientY - (r.top  + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MASK REVEAL
// ─────────────────────────────────────────────────────────────────────────────
function MaskReveal({ text, color, delay = 0, size }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.span
        style={{
          display: 'block', color, fontSize: size,
          fontFamily: '"Mona Sans", sans-serif',
          fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 0.88,
        }}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ delay, duration: 0.78, ease }}
      >
        {text}
      </motion.span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNT UP — pure rAF, no framer dep
// ─────────────────────────────────────────────────────────────────────────────
function CountUp({ raw, delay = 0 }) {
  const num     = parseFloat(raw)
  const isFloat = raw.includes('.')
  const suffix  = raw.replace(/[\d.]/g, '')
  const [val, setVal]   = useState(0)
  const started = useRef(false)
  const ref     = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        setTimeout(() => {
          const start    = performance.now()
          const duration = 1200
          const tick = (now) => {
            const p  = Math.min((now - start) / duration, 1)
            const ep = 1 - Math.pow(1 - p, 3)
            setVal(ep * num)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }, delay * 1000)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [num, delay])

  return (
    <span ref={ref}>
      {isFloat ? val.toFixed(2) : Math.floor(val)}{suffix}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO FRAME — React-controlled fallback so accent updates on theme change
// ─────────────────────────────────────────────────────────────────────────────
function PhotoFrame({ accent, isDark }) {
  const [imgFailed, setImgFailed] = useState(false)
  const { profile: _pfApiProfile } = useSiteData()
  const _pfProfile = _pfApiProfile?.name ? _pfApiProfile : defaultProfile

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-5"
      style={{ aspectRatio: '4/3' }}>

      {imgFailed ? (
        // Pure JSX fallback — always reads the current accent prop
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #0d1117, #161b22)'
              : 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
          }}
        >
          <span style={{
            fontFamily:    '"Mona Sans", sans-serif',
            fontWeight:    900,
            fontSize:      '5rem',
            color:         accent,
            letterSpacing: '-0.06em',
            transition:    'color 0.4s ease',
          }}>
            AK
          </span>
        </div>
      ) : (
        <img
          src={_pfProfile.avatar}
          alt="Anish Kumar"
          className="w-full h-full object-cover object-top"
          style={{ filter: 'grayscale(5%) contrast(1.04)' }}
          onError={() => setImgFailed(true)}
        />
      )}

      {/* Cinematic vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.32) 100%)' }} />

      {/* Bottom fade into card */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--bg-card), transparent)' }} />

      {/* Role overlay — bottom left */}
      <div className="absolute bottom-3 left-4">
        <p className="text-[0.5rem] tracking-[0.22em] uppercase font-black mb-0.5"
          style={{ color: accent, fontFamily: '"Mona Sans",sans-serif', opacity: 0.9, transition: 'color 0.4s' }}>
          Full Stack Developer
        </p>
        <p className="text-[0.46rem] font-mono tracking-wider"
          style={{ color: 'rgba(255,255,255,0.38)' }}>
          BSACIST · Chennai, IN
        </p>
      </div>

      {/* Availability pill — top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
        style={{
          background:     'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(12px)',
          border:         '1px solid rgba(52,211,153,0.25)',
        }}>
        <motion.span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 block"
          style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }}
          animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[0.46rem] font-black tracking-[0.12em] uppercase"
          style={{ color: '#34d399', fontFamily: '"Mona Sans",sans-serif' }}>
          Available
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RIGHT PANEL
// ─────────────────────────────────────────────────────────────────────────────
function RightPanel({ accent, isDark, stats }) {
  const cardRef = useRef(null)
  const { profile: _rpApiProfile } = useSiteData()
  const _rpProfile = _rpApiProfile?.name ? _rpApiProfile : defaultProfile
  const rx  = useMotionValue(0)
  const ry  = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 22 })
  const sry = useSpring(ry, { stiffness: 120, damping: 22 })

  const onMove = (e) => {
    if (!cardRef.current) return
    const r  = cardRef.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width  - 0.5) * 8)
    rx.set(-((e.clientY - r.top)  / r.height - 0.5) * 8)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx, rotateY: sry,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.85, ease }}
      className="relative w-full rounded-3xl overflow-hidden"
    >
      {/* Card base */}
      <div className="absolute inset-0 rounded-3xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />

      {/* Hover glow ring */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ boxShadow: `0 0 0 1px ${accent}30, 0 32px 80px ${accent}14`, borderRadius: 24 }}
      />

      {/* Top colour band */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(to right, transparent 5%, ${accent}, #a78bfa80, transparent 90%)`,
          transition: 'background 0.4s',
        }} />

      {/* Ambient corner glow */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${accent}12, transparent 65%)`,
          transition: 'background 0.4s',
        }} />

      <div className="relative z-10 p-5 flex flex-col">

        {/* Photo */}
        <PhotoFrame accent={accent} isDark={isDark} />

        {/* Stats 2×2 */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease }}
              className="relative flex flex-col justify-between p-3 rounded-xl overflow-hidden cursor-default"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                minHeight: 64,
              }}
              whileHover={{ borderColor: `${accent}50`, y: -2 }}
            >
              {/* Corner glow */}
              <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at bottom right, ${accent}14, transparent 70%)`,
                  transition: 'background 0.4s',
                }} />
              {/* Top micro bar */}
              <motion.div
                className="absolute top-0 left-0 h-[1.5px] rounded-t-xl"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ delay: 0.6 + i * 0.07, duration: 0.5, ease }}
                style={{
                  background: `linear-gradient(to right, ${accent}, transparent)`,
                  transition: 'background 0.4s',
                }}
              />
              <span className="text-[0.5rem] tracking-[0.16em] uppercase font-semibold relative z-10"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}>
                {label}
              </span>
              <span
                className="font-black tabular-nums relative z-10"
                style={{
                  fontSize: 'clamp(1.3rem,2.5vw,1.55rem)',
                  color: accent,
                  fontFamily: '"Mona Sans",sans-serif',
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  transition: 'color 0.4s',
                }}
              >
                <CountUp raw={value} delay={0.6 + i * 0.08} />
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <span className="flex items-center gap-1.5 text-[0.56rem] font-mono"
            style={{ color: 'var(--text-muted)' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke={accent} strokeWidth="2.5" style={{ flexShrink: 0, transition: 'stroke 0.4s' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Chennai, India
          </span>
          <a
            href={`mailto:${_rpProfile.email}`}
            className="text-[0.55rem] font-mono no-underline"
            style={{ color: 'var(--text-muted)', transition: 'color 0.25s' }}
            onMouseEnter={e => e.currentTarget.style.color = accent}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {_rpProfile.email}
          </a>
        </motion.div>

      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutHero() {
  const { theme } = useTheme()
  const { config, profile: apiProfile } = useSiteData()
  const profile = apiProfile || defaultProfile
  const aboutStats = config?.aboutStats?.length > 0 ? config.aboutStats : defaultAboutStats
  const isDark    = theme === 'dark'
  const accent    = isDark ? '#52aeff' : '#d4200c'

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const nameY     = useTransform(scrollYProgress, [0, 1], [0, -55])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const rightY    = useTransform(scrollYProgress, [0, 1], [0, -24])

  const bioParagraphs = profile.bio.split('\n\n').filter(Boolean)

  // ── CSS vars scoped to this section — updates synchronously on theme change
  const sectionStyle = {
    '--accent-color':  accent,
    '--accent-glow':   isDark ? 'rgba(82,174,255,0.13)' : 'rgba(212,32,12,0.11)',
    '--accent-subtle': isDark ? 'rgba(82,174,255,0.07)' : 'rgba(212,32,12,0.055)',
    '--accent-border': isDark ? 'rgba(82,174,255,0.20)' : 'rgba(212,32,12,0.20)',
    paddingTop:        '62px',
    borderBottom:      '1px solid var(--border-color)',
    minHeight:         '96vh',
  }

  return (
    <section ref={heroRef} className="relative overflow-hidden" style={sectionStyle}>

      {/* BG: ambient radial glow — fades on scroll */}
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -10%, var(--accent-subtle), transparent 65%)', transition: 'background 0.5s' }} />
      </motion.div>

      {/* BG: dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
          backgroundSize:  '28px 28px',
        }} />

      {/* BG: diagonal accent stripes — top right */}
      {[72, 116, 162].map((x, i) => (
        <div key={i} className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '1px', height: '72%',
            background: `linear-gradient(to bottom, ${accent}${['28','14','08'][i]}, transparent)`,
            transform: `translateX(-${x}px) rotate(16deg)`,
            transformOrigin: 'top',
            transition: 'background 0.5s',
          }} />
      ))}

      {/* BG: left vertical rail */}
      <div className="absolute top-0 left-0 bottom-0 w-px pointer-events-none hidden xl:block"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accent}18 20%, ${accent}18 80%, transparent)`,
          transition: 'background 0.5s',
        }} />

      {/* ── CONTENT ── */}
      <div className="relative max-w-[1100px] mx-auto px-5 md:px-10 pt-14 pb-28">

        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-wrap items-center gap-2.5 mb-14"
        >
          <Magnetic>
            <span
              className="text-[0.52rem] tracking-[0.28em] uppercase font-bold px-3.5 py-1.5 rounded-full cursor-default"
              style={{
                background: 'var(--accent-subtle)',
                border:     '1px solid var(--accent-border)',
                color:      'var(--accent-color)',
                fontFamily: '"Mona Sans",sans-serif',
                transition: 'all 0.4s',
              }}
            >
              About Me
            </span>
          </Magnetic>

          <Magnetic>
            <span
              className="flex items-center gap-2 text-[0.52rem] font-bold tracking-[0.18em] uppercase px-3.5 py-1.5 rounded-full cursor-default"
              style={{
                background: 'rgba(52,211,153,0.07)',
                border:     '1px solid rgba(52,211,153,0.2)',
                color:      '#34d399',
                fontFamily: '"Mona Sans",sans-serif',
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full block flex-shrink-0"
                style={{ background: '#34d399', boxShadow: '0 0 7px #34d399' }}
                animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              Open to Work
            </span>
          </Magnetic>

          <span
            className="text-[0.52rem] tracking-[0.16em] uppercase font-mono px-3.5 py-1.5 rounded-full"
            style={{
              background: 'var(--bg-card)',
              border:     '1px solid var(--border-color)',
              color:      'var(--text-muted)',
            }}
          >
            Chennai · India · IST
          </span>

          <span className="ml-auto text-[0.5rem] tracking-[0.12em] font-mono"
            style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
            © 2022 — Present
          </span>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 xl:gap-16 items-start">

          {/* ════ LEFT ════ */}
          <div>
            {/* Name */}
            <motion.div style={{ y: nameY }} className="mb-9">
              <h1 style={{ margin: 0, padding: 0 }}>
                <MaskReveal
                  text="Anish"
                  color="var(--text-primary)"
                  delay={0.04}
                  size="clamp(4.2rem,10.5vw,8rem)"
                />
                <MaskReveal
                  text="Kumar"
                  color="var(--accent-color)"
                  delay={0.13}
                  size="clamp(4.2rem,10.5vw,8rem)"
                />
              </h1>
            </motion.div>

            {/* Role strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.6, ease }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 pb-10"
              style={{ borderBottom: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="h-px flex-shrink-0"
                  style={{ background: accent, transition: 'background 0.4s' }}
                  initial={{ width: 0 }} animate={{ width: 28 }}
                  transition={{ delay: 0.48, duration: 0.6, ease }}
                />
                <span className="text-[0.72rem] font-black tracking-[0.16em] uppercase"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}>
                  Full Stack Developer
                </span>
              </div>
              <span className="w-px h-4 flex-shrink-0" style={{ background: 'var(--border-color)' }} />
              <span className="text-[0.68rem] font-mono" style={{ color: 'var(--text-muted)' }}>
                BSACIST · B.Tech IT
              </span>
              <span className="w-px h-4 flex-shrink-0" style={{ background: 'var(--border-color)' }} />
              <span className="text-[0.68rem] font-black"
                style={{ color: accent, fontFamily: '"Mona Sans",sans-serif', transition: 'color 0.4s' }}>
                9.02 CGPA
              </span>
            </motion.div>

            {/* Bio */}
            <div className="flex flex-col gap-5 mb-12" style={{ maxWidth: 540 }}>
              {bioParagraphs.slice(0, 2).map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 + i * 0.1, duration: 0.6, ease }}
                  className="text-[0.88rem] leading-[2.05]"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans",sans-serif' }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.55, ease }}
              className="flex flex-wrap gap-3"
            >
              <Magnetic strength={0.18}>
                <motion.a
                  href={`mailto:${profile.email}`}
                  className="relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[0.76rem] font-black no-underline overflow-hidden"
                  style={{
                    background: accent,
                    color:      isDark ? '#000' : '#fff',
                    fontFamily: '"Mona Sans",sans-serif',
                    transition: 'background 0.4s',
                  }}
                  whileHover={{ y: -3, boxShadow: '0 18px 44px var(--accent-glow)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: '-100%' }}
                    animate={{ x: '210%' }}
                    transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.8 }}
                    style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.32)'}, transparent)` }}
                  />
                  <span className="relative z-10">Email Me</span>
                  <motion.svg
                    className="relative z-10 flex-shrink-0" width="11" height="11"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </motion.svg>
                </motion.a>
              </Magnetic>

              {[
                { label: 'LinkedIn', href: profile.linkedin, icon: '↗' },
                { label: 'GitHub',   href: profile.github,   icon: '↗' },
                { label: 'Resume',   href: '/finalAk-2.pdf', icon: '↓', download: true },
              ].map(({ label, href, icon, download }) => (
                <Magnetic key={label} strength={0.18}>
                  <motion.a
                    href={href}
                    target={download ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    download={download || undefined}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[0.76rem] font-semibold no-underline"
                    style={{
                      border:     '1px solid var(--border-color)',
                      color:      'var(--text-muted)',
                      fontFamily: '"Mona Sans",sans-serif',
                      transition: 'all 0.22s',
                    }}
                    whileHover={{ y: -3, borderColor: accent, color: accent, boxShadow: '0 8px 26px var(--accent-glow)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {label} <span style={{ opacity: 0.5, fontSize: '0.88em' }}>{icon}</span>
                  </motion.a>
                </Magnetic>
              ))}
            </motion.div>
          </div>
          {/* ════ END LEFT ════ */}

          {/* ════ RIGHT ════ */}
          <motion.div style={{ y: rightY }}>
            <RightPanel accent={accent} isDark={isDark} stats={aboutStats} />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
