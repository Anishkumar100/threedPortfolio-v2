import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navLinks = [
  { label: 'Work',     path: '/work'     },
  { label: 'Services', path: '/services' },
  { label: 'Skills',   path: '/skills'   },
  { label: 'About',    path: '/about'    },
]

// Uses Mona Sans (already loaded globally — variable font 200-900).
// No external font import needed — avoids FOUT and extra network requests.
const CSS = `
  /* Responsive Utility Classes */
  @media (max-width: 1023px) {
    .nb-desktop-only { display: none !important; }
  }
  @media (min-width: 1024px) {
    .nb-mobile-only { display: none !important; }
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    font-family: "Mona Sans", sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid transparent;
    white-space: nowrap;
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 3px; left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 50%; height: 1.5px;
    border-radius: 2px;
    background: var(--accent-primary);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .nav-link:hover::after, .nav-link.active::after { transform: translateX(-50%) scaleX(1); }
  .nav-link:hover  { color: var(--accent-primary) !important; background: var(--nb-hover-bg); }
  .nav-link.active { color: var(--accent-primary) !important; background: var(--nb-active-bg); border-color: var(--nb-active-border); }

  .nb-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.46rem 1.1rem;
    border-radius: 6px;
    font-family: "Mona Sans", sans-serif;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    background: var(--accent-primary);
    color: var(--nb-cta-text);
    border: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .nb-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--accent-glow);
  }

  .nb-hbar {
    display: block;
    height: 1.5px;
    border-radius: 2px;
    background: var(--text-primary);
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nb-pill {
    position: relative;
    width: 48px; height: 26px;
    border-radius: 13px;
    border: 1px solid var(--nb-toggle-border);
    background: var(--nb-toggle-track);
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
  }
  .nb-thumb {
    position: absolute;
    top: 2px;
    width: 20px; height: 20px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    transition: left 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nb-prog {
    position: absolute;
    bottom: 0; left: 0;
    height: 2px;
    background: var(--accent-primary);
    box-shadow: 0 0 8px var(--accent-glow);
    transition: width 0.08s linear;
    pointer-events: none;
  }

  .nb-logo-mark {
    width: 30px; height: 30px;
    border-radius: 7px;
    background: var(--accent-primary);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 14px var(--accent-glow);
  }
  .nb-logo-mark span {
    font-family: "Mona Sans", sans-serif;
    font-weight: 900;
    font-size: 0.82rem;
    color: var(--nb-cta-text);
    line-height: 1;
  }

  .nb-logo-text {
    font-family: "Mona Sans", sans-serif;
    font-weight: 800;
    font-size: 1.05rem;
    letter-spacing: 0.01em;
    line-height: 1;
    color: var(--text-primary);
    user-select: none;
  }
  .nb-logo-text em {
    font-style: normal;
    font-weight: 300;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  .nb-m-link {
    font-family: "Mona Sans", sans-serif;
    font-weight: 800;
    font-size: clamp(2.4rem, 9vw, 4rem);
    letter-spacing: -0.02em;
    text-decoration: none;
    display: block;
    text-align: center;
    padding: 0.25rem 2rem;
    border-radius: 10px;
    transition: color 0.15s ease, background 0.15s ease;
  }
  .nb-m-link:hover { color: var(--accent-primary) !important; background: var(--nb-hover-bg); }

  @keyframes nb-slide-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nb-m-enter { animation: nb-slide-up 0.38s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @keyframes nb-fade-up {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nb-header { animation: nb-fade-up 0.45s ease both; }

  /* Kill ALL transitions for 2 frames on theme swap. */
  .nb-freeze *, .nb-freeze *::before, .nb-freeze *::after {
    transition: none !important;
    animation-play-state: paused !important;
  }
`

function applyThemeVars(isDark) {
  const r = document.documentElement
  if (isDark) {
    r.style.setProperty('--nb-hover-bg',      'rgba(82,174,255,0.07)')
    r.style.setProperty('--nb-active-bg',     'rgba(82,174,255,0.1)')
    r.style.setProperty('--nb-active-border', 'rgba(82,174,255,0.2)')
    r.style.setProperty('--nb-toggle-track',  'rgba(255,255,255,0.06)')
    r.style.setProperty('--nb-toggle-border', 'rgba(255,255,255,0.1)')
    r.style.setProperty('--nb-cta-text',      '#000000')
  } else {
    r.style.setProperty('--nb-hover-bg',      'rgba(212,32,12,0.05)')
    r.style.setProperty('--nb-active-bg',     'rgba(212,32,12,0.07)')
    r.style.setProperty('--nb-active-border', 'rgba(212,32,12,0.15)')
    r.style.setProperty('--nb-toggle-track',  'rgba(0,0,0,0.05)')
    r.style.setProperty('--nb-toggle-border', 'rgba(0,0,0,0.1)')
    r.style.setProperty('--nb-cta-text',      '#ffffff')
  }
}

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [scrollPct,  setScrollPct]  = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted,    setMounted]    = useState(false)
  const { theme, toggleTheme }      = useTheme()
  const location                    = useLocation()
  const isDark                      = theme === 'dark'

  useEffect(() => {
    if (document.getElementById('nb-css')) return
    const s = document.createElement('style')
    s.id = 'nb-css'
    s.textContent = CSS
    document.head.appendChild(s)
  }, [])

  useEffect(() => { applyThemeVars(isDark) }, [isDark])
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 24)
      setScrollPct(max > 0 ? (y / max) * 100 : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const isActive = useCallback((p) => location.pathname === p, [location.pathname])

  const handleThemeToggle = useCallback(() => {
    document.body.classList.add('nb-freeze')
    toggleTheme()
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.body.classList.remove('nb-freeze')
      )
    )
  }, [toggleTheme])

  if (!mounted) return null

  const headerBg = scrolled
    ? isDark ? 'rgba(0,0,0,0.92)' : 'rgba(240,244,255,0.92)'
    : 'transparent'

  return (
    <>
      <header
        className="nb-header"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 100, height: '62px',
          display: 'flex', alignItems: 'center',
          background: headerBg,
          backdropFilter:       scrolled ? 'blur(20px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          borderBottom: `1px solid ${scrolled ? (isDark ? 'rgba(82,174,255,0.1)' : 'rgba(212,32,12,0.1)') : 'transparent'}`,
          boxShadow:    scrolled ? `0 1px 24px rgba(0,0,0,${isDark ? 0.3 : 0.06})` : 'none',
          transition:   'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div className="nb-prog" style={{ width: `${scrollPct}%` }} />

        <div style={{
          width: '100%', maxWidth: '1300px', margin: '0 auto',
          padding: '0 clamp(1rem, 4vw, 2.5rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        }}>

          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none', flexShrink: 0 }}>
            <div className="nb-logo-mark">
              <span>AK</span>
            </div>
            <span className="nb-logo-text">ANISH <em>KUMAR</em></span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="nb-desktop-only">
            <ul style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', listStyle: 'none', margin: 0, padding: 0 }}>
              {navLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`nav-link${isActive(path) ? ' active' : ''}`}
                    style={{ color: isActive(path) ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT SIDE CONTROLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>

            {/* THEME TOGGLE */}
            <button onClick={handleThemeToggle} aria-label="Toggle theme" className="nb-pill">
              <span style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', opacity: isDark ? 0.5 : 0, transition: 'opacity 0.2s ease' }}>🌙</span>
              <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', opacity: isDark ? 0 : 0.5, transition: 'opacity 0.2s ease' }}>☀️</span>
              <span className="nb-thumb" style={{
                left:       isDark ? '2px' : 'calc(100% - 22px)',
                background: isDark ? 'var(--accent-primary)' : '#f59e0b',
                boxShadow:  isDark ? '0 0 10px rgba(82,174,255,0.6)' : '0 0 10px rgba(245,158,11,0.6)',
              }}>
                {isDark ? '🌙' : '☀️'}
              </span>
            </button>

            {/* DESKTOP CTA */}
            <Link to="/contact" className="nb-cta nb-desktop-only">
              Hire Me
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* MOBILE HAMBURGER MENU BUTTON */}
            <div className="nb-mobile-only">
              <button
                onClick={() => setMobileOpen(p => !p)}
                aria-label="Toggle menu"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  gap: '5px', width: '36px', height: '36px', padding: '8px',
                  borderRadius: '7px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  background: 'transparent', cursor: 'pointer', zIndex: 110, position: 'relative',
                }}
              >
                <span className="nb-hbar" style={{ width: '100%', transform: mobileOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
                <span className="nb-hbar" style={{ width: '60%', opacity: mobileOpen ? 0 : 1, transform: mobileOpen ? 'scaleX(0)' : 'none' }} />
                <span className="nb-hbar" style={{ width: '100%', transform: mobileOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        className="nb-mobile-only"
        style={{
          position: 'fixed', inset: 0, zIndex: 90,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.1rem',
          background:           isDark ? 'rgba(0,0,0,0.97)' : 'rgba(240,244,255,0.97)',
          backdropFilter:       'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          opacity:        mobileOpen ? 1 : 0,
          transform:      mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents:  mobileOpen ? 'auto' : 'none',
          transition:     'opacity 0.28s ease, transform 0.28s ease',
        }}
      >
        <div style={{
          position: 'absolute', top: '62px', left: '8%', right: '8%',
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--accent-primary) 40%, var(--accent-primary) 60%, transparent)',
          opacity: 0.25,
        }} />

        {[...navLinks, { label: 'Contact', path: '/contact' }].map(({ label, path }, i) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={`nb-m-link${mobileOpen ? ' nb-m-enter' : ''}`}
            style={{
              color:             isActive(path) ? 'var(--accent-primary)' : 'var(--text-primary)',
              animationDelay:    `${i * 0.055 + 0.04}s`,
              animationFillMode: 'both',
            }}
          >
            {label}
          </Link>
        ))}

        <div style={{
          position: 'absolute', bottom: '2rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          opacity: mobileOpen ? 1 : 0,
          transition: 'opacity 0.25s ease 0.28s',
        }}>
          <span style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button onClick={handleThemeToggle} style={{
            fontFamily: '"Mona Sans", sans-serif',
            padding: '0.32rem 0.85rem', borderRadius: '6px',
            border: '1px solid var(--nb-active-border)',
            background: 'var(--nb-active-bg)',
            color: 'var(--accent-primary)',
            fontSize: '0.7rem', fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Switch →
          </button>
        </div>
      </div>
    </>
  )
}