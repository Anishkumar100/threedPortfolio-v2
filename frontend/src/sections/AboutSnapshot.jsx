import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const THEME = {
  dark:  { bg: '#07070f', heading: '#ffffff', subtext: 'rgba(255,255,255,0.45)', label: '#4a9eff', cardBg: 'rgba(255,255,255,0.03)', cardBorder: 'rgba(74,158,255,0.1)', pillBg: 'rgba(74,158,255,0.08)', pillBorder: 'rgba(74,158,255,0.2)', btnBg: '#4a9eff', btnText: '#0a0a1a', imgBorder: 'rgba(74,158,255,0.25)' },
  light: { bg: '#e8edf8', heading: '#0a0a1a', subtext: 'rgba(10,10,26,0.52)', label: '#d4200c', cardBg: 'rgba(255,255,255,0.7)', cardBorder: 'rgba(212,32,12,0.1)', pillBg: 'rgba(212,32,12,0.07)', pillBorder: 'rgba(212,32,12,0.2)', btnBg: '#d4200c', btnText: '#ffffff', imgBorder: 'rgba(212,32,12,0.25)' },
}

const highlights = [
  { value: '2+',  label: 'Years\nExperience' },
  { value: '11+', label: 'Projects\nShipped'  },
  { value: '∞',   label: 'Problems\nSolved'   },
]

const AboutSnapshot = () => {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const tokens    = THEME[theme] ?? THEME.dark

  return (
    <section style={{
      width: '100%',
      background: tokens.bg,
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 3rem)',
      transition: 'background 0.35s ease',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
        gap: 'clamp(2.5rem, 6vw, 5rem)',
        alignItems: 'center',
      }}>

        {/* ── Left — Photo ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 'clamp(240px, 35vw, 340px)' }}>

            {/* Glow behind image */}
            <div style={{
              position: 'absolute', inset: '-20px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${tokens.label}18 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Photo */}
            <img
              src="/images/anish.jpg"
              alt="Anish Kumar"
              style={{
                width: '100%',
                aspectRatio: '3/4',
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: '24px',
                border: `2px solid ${tokens.imgBorder}`,
                boxShadow: `0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px ${tokens.label}10`,
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />

            {/* Floating status badge */}
            <div style={{
              position: 'absolute',
              bottom: '20px', left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: isDark ? 'rgba(3,3,5,0.85)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${tokens.cardBorder}`,
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 8px #34d399',
                animation: 'pulse 2s infinite',
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: '11px', fontWeight: 700,
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(10,10,26,0.7)',
                letterSpacing: '0.05em',
              }}>
                Open to Opportunities
              </span>
            </div>
          </div>
        </div>

        {/* ── Right — Text ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div>
            <p style={{
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              color: tokens.label, margin: '0 0 0.75rem 0',
            }}>
              — About Me —
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 900, letterSpacing: '-0.03em',
              color: tokens.heading, margin: 0, lineHeight: 1.1,
            }}>
              Crafting Digital<br />
              <span style={{ color: tokens.label }}>Experiences</span>
            </h2>
          </div>

          <p style={{
            fontSize: 'clamp(0.88rem, 1.3vw, 1rem)',
            color: tokens.subtext, lineHeight: 1.75,
            margin: 0, maxWidth: '480px',
          }}>
            I'm Anish, a full-stack developer from India who builds fast, 
            scalable, and visually compelling web applications. I turn ideas 
            into real products — from concept to deployment.
          </p>

          {/* Highlight pills */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {highlights.map(h => (
              <div key={h.label} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem 1.25rem',
                borderRadius: '14px',
                background: tokens.pillBg,
                border: `1px solid ${tokens.pillBorder}`,
                minWidth: '80px',
              }}>
                <span style={{
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
                  fontWeight: 900, color: tokens.label,
                  lineHeight: 1,
                }}>
                  {h.value}
                </span>
                <span style={{
                  fontSize: '9px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: tokens.subtext, marginTop: '4px',
                  textAlign: 'center', whiteSpace: 'pre-line',
                }}>
                  {h.label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: `linear-gradient(to right, ${tokens.label}30, transparent)`,
          }} />

          {/* CTA */}
          <Link
            to="/about"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              alignSelf: 'flex-start',
              padding: '0.65rem 1.4rem',
              borderRadius: '12px',
              fontSize: '0.88rem', fontWeight: 700,
              letterSpacing: '0.02em',
              color: tokens.btnText,
              background: tokens.btnBg,
              textDecoration: 'none',
              boxShadow: `0 0 20px ${tokens.label}35`,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 6px 28px ${tokens.label}55`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 0 20px ${tokens.label}35`
            }}
          >
            More About Me
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}

export default AboutSnapshot
