import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { trackEvent } from '../services/api'
import { useSiteData } from '../context/SiteDataContext'

const THEME = {
  dark: {
    bg:          '#030305',
    heading:     '#ffffff',
    subtext:     'rgba(255,255,255,0.42)',
    micro:       'rgba(255,255,255,0.2)',
    accent:      '#4a9eff',
    btnText:     '#0a0a1a',
    ghostColor:  'rgba(255,255,255,0.75)',
    ghostBorder: 'rgba(255,255,255,0.15)',
    ghostHoverBg:'rgba(74,158,255,0.1)',
    ruleOpacity: '40',
    glowOpacity: '0d',
  },
  light: {
    bg:          '#f0f4ff',
    heading:     '#0a0a1a',
    subtext:     'rgba(10,10,26,0.52)',
    micro:       'rgba(10,10,26,0.28)',
    accent:      '#d4200c',
    btnText:     '#ffffff',
    ghostColor:  'rgba(10,10,26,0.65)',
    ghostBorder: 'rgba(10,10,26,0.15)',
    ghostHoverBg:'rgba(212,32,12,0.06)',
    ruleOpacity: '30',
    glowOpacity: '08',
  },
}

const ContactCTA = () => {
  const { theme } = useTheme()
  const { profile: _ctaP } = useSiteData()
  const _ctaEmail = _ctaP?.email || 'akcoder1102004@gmail.com'
  const t         = THEME[theme] ?? THEME.dark

  return (
    <section style={{
      width:      '100%',
      background: t.bg,
      padding:    'clamp(5rem, 10vw, 9rem) clamp(1.25rem, 5vw, 3rem)',
      position:   'relative',
      overflow:   'hidden',
      transition: 'background 0.35s ease',
    }}>

      {/* Radial glow */}
      <div style={{
        position:      'absolute',
        top: '50%', left: '50%',
        transform:     'translate(-50%, -50%)',
        width:         '640px', height: '640px',
        borderRadius:  '50%',
        background:    `radial-gradient(circle, ${t.accent}${t.glowOpacity} 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Top rule */}
      <div style={{
        position:   'absolute',
        top: 0, left: '10%', right: '10%',
        height:     '1px',
        background: `linear-gradient(to right, transparent, ${t.accent}${t.ruleOpacity}, transparent)`,
      }} />

      {/* Content */}
      <div style={{
        maxWidth:       '860px',
        margin:         '0 auto',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        textAlign:      'center',
        gap:            '2rem',
        position:       'relative',
        zIndex:         1,
      }}>

        {/* Label */}
        <p style={{
          fontSize:      '10px',
          fontWeight:    700,
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color:         t.accent,
          margin:        0,
          opacity:       0.9,
          fontFamily:    '"Mona Sans", sans-serif',
        }}>
          — Let's Build —
        </p>

        {/* Heading */}
        <h2 style={{
          fontSize:      'clamp(2.2rem, 6vw, 4.5rem)',
          fontWeight:    900,
          letterSpacing: '-0.04em',
          color:         t.heading,
          margin:        0,
          lineHeight:    1.05,
          fontFamily:    '"Mona Sans", sans-serif',
          transition:    'color 0.35s ease',
        }}>
          Have a Mission?<br />
          <span style={{ color: t.accent }}>Let's Execute It.</span>
        </h2>

        {/* Subtext */}
        <p style={{
          fontSize:   'clamp(0.9rem, 1.5vw, 1.1rem)',
          color:      t.subtext,
          lineHeight: 1.7,
          margin:     0,
          maxWidth:   '520px',
          fontFamily: '"Mona Sans", sans-serif',
          transition: 'color 0.35s ease',
        }}>
          Whether it's a product idea, a freelance project, or just a conversation —
          I'm ready. Drop a message and let's make something great.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Primary CTA */}
          <Link
            to="/contact"
            onClick={() => { try { trackEvent('contact-cta', 'cta_click', { action: 'start_project' }) } catch {} }}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              padding:        '0.8rem 2rem',
              borderRadius:   '14px',
              fontSize:       '0.92rem',
              fontWeight:     700,
              letterSpacing:  '0.02em',
              color:          t.btnText,
              background:     t.accent,
              textDecoration: 'none',
              boxShadow:      `0 0 30px ${t.accent}40`,
              transition:     'transform 0.25s ease, box-shadow 0.25s ease',
              fontFamily:     '"Mona Sans", sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform  = 'translateY(-2px)'
              e.currentTarget.style.boxShadow  = `0 8px 32px ${t.accent}60`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform  = 'translateY(0)'
              e.currentTarget.style.boxShadow  = `0 0 30px ${t.accent}40`
            }}
          >
            Start a Project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Ghost / Email CTA */}
          <a
            href={`mailto:${_ctaEmail}`}
            onClick={() => { try { trackEvent('contact-cta', 'contact_submit', { action: 'send_email' }) } catch {} }}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              padding:        '0.8rem 2rem',
              borderRadius:   '14px',
              fontSize:       '0.92rem',
              fontWeight:     700,
              letterSpacing:  '0.02em',
              color:          t.ghostColor,
              background:     'transparent',
              textDecoration: 'none',
              border:         `1px solid ${t.ghostBorder}`,
              transition:     'all 0.25s ease',
              fontFamily:     '"Mona Sans", sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = t.accent + '50'
              e.currentTarget.style.color       = t.heading
              e.currentTarget.style.background  = t.ghostHoverBg
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = t.ghostBorder
              e.currentTarget.style.color       = t.ghostColor
              e.currentTarget.style.background  = 'transparent'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Send Email
          </a>
        </div>

        {/* Micro-text */}
        <p style={{
          fontSize:      '11px',
          color:         t.micro,
          margin:        0,
          letterSpacing: '0.05em',
          fontFamily:    '"Mona Sans", sans-serif',
          transition:    'color 0.35s ease',
        }}>
          Usually responds within 24 hours · Based in India · Available worldwide
        </p>

      </div>
    </section>
  )
}

export default ContactCTA