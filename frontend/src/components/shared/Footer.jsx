import { useRef, useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { socialImgs as defaultSocialImgs } from '../../constants/index'
import { useSiteData } from '../../context/SiteDataContext'

const CSS = `
  @keyframes ft-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ft-pulse {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(2.4); opacity: 0; }
  }

  .ft-in { opacity: 0; }
  .ft-in.ft-show { animation: ft-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .ft-in:nth-child(1).ft-show { animation-delay: 0.04s; }
  .ft-in:nth-child(2).ft-show { animation-delay: 0.14s; }
  .ft-in:nth-child(3).ft-show { animation-delay: 0.24s; }

  .ft-link {
    font-family: "Mona Sans", sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    text-decoration: none;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    transition: color 0.18s ease;
    white-space: nowrap;
  }
  .ft-link:hover { color: var(--text-primary) !important; }
  .ft-link.ft-active { color: var(--accent-primary) !important; }

  .ft-soc {
    width: 34px; height: 34px;
    border-radius: 50%;
    border: 1px solid var(--ft-border);
    display: flex; align-items: center; justify-content: center;
    text-decoration: none;
    transition: border-color 0.2s ease, transform 0.2s ease;
    flex-shrink: 0;
  }
  .ft-soc:hover { border-color: var(--accent-primary); transform: translateY(-2px); }
  .ft-soc img {
    width: 14px; height: 14px;
    object-fit: contain; opacity: 0.5;
    transition: opacity 0.2s ease;
  }
  .ft-soc:hover img { opacity: 0.9; }

  .ft-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
    position: relative;
  }
  .ft-dot::after {
    content: '';
    position: absolute; inset: 0;
    border-radius: 50%;
    background: #22c55e;
    animation: ft-pulse 2s ease-out infinite;
  }

  .ft-up-btn {
    width: 34px; height: 34px;
    border-radius: 8px;
    border: 1px solid var(--ft-border);
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
    flex-shrink: 0;
  }
  .ft-up-btn:hover {
    border-color: var(--accent-primary);
    background: var(--ft-hover-bg);
    transform: translateY(-2px);
  }

  .ft-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border-color) 30%, var(--border-color) 70%, transparent);
    opacity: 0.5;
  }
`

function applyVars(isDark) {
  const r = document.documentElement
  r.style.setProperty('--ft-border',   isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)')
  r.style.setProperty('--ft-hover-bg', isDark ? 'rgba(82,174,255,0.07)'  : 'rgba(212,32,12,0.05)')
}

const pages = [
  { name: 'Home',    href: '/'        },
  { name: 'Work',    href: '/work'    },
  { name: 'Skills',  href: '/skills'  },
  { name: 'About',   href: '/about'   },
  { name: 'Contact', href: '/contact' },
]

// Scroll to top instantly — called before React Router changes the route,
// so the new page always mounts at y=0 with no visible scroll position bleed.
const goTop = () => window.scrollTo({ top: 0, behavior: 'instant' })

const BatMark = () => (
  <svg width="20" height="13" viewBox="0 0 64 40" style={{ fill: 'var(--accent-primary)', display: 'block' }}>
    <path d="M32 20 C28 10 16 0 0 4 C8 8 12 14 10 20 C6 18 2 20 2 24 C6 22 10 24 12 28
             C16 24 20 22 24 24 C26 28 28 32 32 36 C36 32 38 28 40 24 C44 22 48 24 52 28
             C54 24 58 22 62 24 C62 20 58 18 54 20 C52 14 56 8 64 4 C48 0 36 10 32 20Z"/>
  </svg>
)

const ShieldMark = () => (
  <svg width="14" height="17" viewBox="0 0 40 48" style={{ display: 'block' }}>
    <path d="M20 2 L38 10 L38 28 Q38 40 20 46 Q2 40 2 28 L2 10 Z"
      fill="var(--accent-primary)" stroke="var(--accent-secondary)" strokeWidth="2"/>
    <path d="M26 14 Q26 11 22 11 L16 11 Q12 11 12 15 Q12 18 16 19 L24 21 Q28 22 28 26 Q28 31 22 31 L16 31 Q12 31 12 28"
      fill="none" stroke="var(--accent-secondary)" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

export default function Footer() {
  const ref              = useRef(null)
  const [show, setShow]  = useState(false)
  const { theme }        = useTheme()
  const { config, profile: _ftProfile } = useSiteData()
  const socialImgs       = config?.socialLinks?.length > 0 ? config.socialLinks : defaultSocialImgs
  const _ftEmail         = _ftProfile?.email || 'akcoder1102004@gmail.com'
  const location         = useLocation()
  const isDark           = theme === 'dark'
  const accentHex        = isDark ? '#52aeff' : '#d4200c'
  const year             = new Date().getFullYear()

  useEffect(() => {
    if (document.getElementById('ft-css')) return
    const s = document.createElement('style')
    s.id = 'ft-css'; s.textContent = CSS
    document.head.appendChild(s)
  }, [])

  useEffect(() => { applyVars(isDark) }, [isDark])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShow(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const scrollTop = useCallback(() =>
    window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <footer ref={ref} style={{ position: 'relative', backgroundColor: 'var(--bg-primary)' }}>

      {/* Gradient top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: isDark
          ? 'linear-gradient(90deg, transparent, #52aeff 35%, #6d45ce 65%, transparent)'
          : 'linear-gradient(90deg, transparent, #d4200c 35%, #f5c518 65%, transparent)',
        opacity: 0.7,
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2rem 2rem', position: 'relative' }}>

        {/* ── TOP ROW ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'flex-start',
          gap: '2.5rem', marginBottom: '3rem',
        }}>

          {/* Brand */}
          <div className={`ft-in${show ? ' ft-show' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}>

            <Link to="/" onClick={goTop} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              textDecoration: 'none', width: 'fit-content',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '7px',
                background: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: '"Mona Sans", sans-serif', fontWeight: 900,
                  fontSize: '0.75rem', color: isDark ? '#000' : '#fff', lineHeight: 1,
                }}>AK</span>
              </div>
              <span style={{
                fontFamily: '"Mona Sans", sans-serif', fontWeight: 800,
                fontSize: '0.95rem', letterSpacing: '0.02em', color: 'var(--text-primary)',
              }}>
                ANISH{' '}
                <span style={{ fontWeight: 300, color: 'var(--text-muted)' }}>KUMAR</span>
              </span>
            </Link>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.25rem 0.6rem', borderRadius: '20px', width: 'fit-content',
              border: '1px solid rgba(34,197,94,0.18)', background: 'rgba(34,197,94,0.05)',
            }}>
              <span className="ft-dot" />
              <span style={{
                fontFamily: '"Mona Sans", sans-serif', fontSize: '0.63rem',
                fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#22c55e',
              }}>Available for work</span>
            </div>

            <p style={{
              fontFamily: '"Mona Sans", sans-serif', fontSize: '0.78rem',
              lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: '240px', margin: 0,
            }}>
              {isDark
                ? 'Cinematic web experiences, crafted from the shadows.'
                : 'Fast, purposeful web experiences built for the light.'}
            </p>
          </div>

          {/* Pages */}
          <div className={`ft-in${show ? ' ft-show' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            <p style={{
              fontFamily: '"Mona Sans", sans-serif', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--accent-primary)', margin: '0 0 0.15rem',
            }}>Pages</p>

            {pages.map(p => (
              <Link
                key={p.href}
                to={p.href}
                onClick={goTop}  /* ← scrolls to top before route renders */
                className={`ft-link${location.pathname === p.href ? ' ft-active' : ''}`}
              >
                {p.name}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className={`ft-in${show ? ' ft-show' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            <p style={{
              fontFamily: '"Mona Sans", sans-serif', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--accent-primary)', margin: '0 0 0.15rem',
            }}>
              {isDark ? 'Signal' : 'Contact'}
            </p>

            <a href={`mailto:${_ftEmail}`} style={{
              fontFamily: '"Mona Sans", sans-serif', fontSize: '0.8rem', fontWeight: 500,
              color: 'var(--text-muted)', textDecoration: 'none',
              letterSpacing: '0.01em', transition: 'color 0.18s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {_ftEmail}
            </a>

            <p style={{
              fontFamily: '"Mona Sans", sans-serif', fontSize: '0.77rem',
              color: 'var(--text-muted)', margin: 0, letterSpacing: '0.01em',
            }}>
              Chennai, India
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
              {socialImgs.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="ft-soc" aria-label={s.name || `Social ${i + 1}`}>
                  <img src={s.imgPath} alt={s.name || 'social'}
                    style={!isDark ? { filter: 'invert(0.5) sepia(1) saturate(2) hue-rotate(330deg)' } : {}} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="ft-divider" style={{ marginBottom: '1.25rem' }} />

        {/* ── BOTTOM BAR ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            {isDark ? <BatMark /> : <ShieldMark />}
            <span style={{
              fontFamily: '"Mona Sans", sans-serif', fontSize: '0.66rem',
              fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text-muted)', opacity: 0.5,
            }}>
              © {year} Anish Kumar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{
              padding: '0.15rem 0.45rem', borderRadius: '4px',
              fontSize: '0.58rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: `${accentHex}12`, color: accentHex,
              border: `1px solid ${accentHex}20`,
              fontFamily: '"Mona Sans", sans-serif',
            }}>
              {isDark ? 'Gotham' : 'Metropolis'}
            </span>
            <span style={{
              fontFamily: 'monospace', fontSize: '0.63rem',
              color: 'var(--text-muted)', opacity: 0.4,
            }}>
              13.0827° N, 80.2707° E
            </span>
          </div>

          <button onClick={scrollTop} className="ft-up-btn" aria-label="Back to top">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 8.5V2.5M2.5 5.5L5.5 2.5L8.5 5.5"
                stroke="var(--text-muted)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}