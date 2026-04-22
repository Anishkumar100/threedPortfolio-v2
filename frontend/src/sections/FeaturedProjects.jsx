import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { featuredProjects as defaultFeaturedProjects } from '../components/work/projectsData'
import { useSiteData } from '../context/SiteDataContext'

// ── Theme tokens — mirrors your existing THEME pattern ────────────────────────
const THEME = {
  dark: {
    bg:           '#030305',
    cardBg:       'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.7) 100%)',
    cardBorder:   'rgba(74,158,255,0.12)',
    label:        '#4a9eff',
    heading:      '#ffffff',
    subtext:      'rgba(255,255,255,0.45)',
    tagBg:        'rgba(74,158,255,0.08)',
    tagBorder:    'rgba(74,158,255,0.2)',
    tagColor:     '#4a9eff',
    divider:      'rgba(74,158,255,0.15)',
    btnBg:        '#4a9eff',
    btnText:      '#0a0a1a',
    mutedText:    'rgba(255,255,255,0.25)',
    imageFallback:'#0d1a2e',
  },
  light: {
    bg:           '#f0f4ff',
    cardBg:       'linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(220,228,255,0.8) 100%)',
    cardBorder:   'rgba(212,32,12,0.12)',
    label:        '#d4200c',
    heading:      '#0a0a1a',
    subtext:      'rgba(10,10,26,0.52)',
    tagBg:        'rgba(212,32,12,0.07)',
    tagBorder:    'rgba(212,32,12,0.2)',
    tagColor:     '#d4200c',
    divider:      'rgba(212,32,12,0.12)',
    btnBg:        '#d4200c',
    btnText:      '#ffffff',
    mutedText:    'rgba(10,10,26,0.25)',
    imageFallback:'#e8ecf8',
  },
}

// ── Single project card ────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, tokens, isDark }) => {
  const [imgError, setImgError] = useState(false)
  const [hovered,  setHovered]  = useState(false)

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: tokens.cardBg,
        border: `1px solid ${hovered ? tokens.label + '35' : tokens.cardBorder}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hovered
          ? `0 20px 60px ${tokens.label}18, 0 4px 20px rgba(0,0,0,0.2)`
          : '0 4px 24px rgba(0,0,0,0.1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.34,1.2,0.64,1)',
        // Staggered entrance animation via CSS animation-delay
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* ── Project Image ───────────────────────────────────────────────────── */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        position: 'relative',
        background: tokens.imageFallback,
      }}>
        {!imgError ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (
          // ── Fallback when image missing — shows title initials ─────────────
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${tokens.label}15, ${tokens.imageFallback})`,
          }}>
            <span style={{
              fontSize: '3rem', fontWeight: 900,
              color: tokens.label, opacity: 0.4,
              letterSpacing: '-0.05em',
            }}>
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Gradient overlay — bottom fade into card body */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '50%',
          background: isDark
            ? 'linear-gradient(to bottom, transparent, rgba(3,3,5,0.8))'
            : 'linear-gradient(to bottom, transparent, rgba(240,244,255,0.7))',
          pointerEvents: 'none',
        }} />

        {/* Live badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: isDark ? 'rgba(3,3,5,0.75)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${tokens.label}25`,
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#34d399',
            boxShadow: '0 0 6px #34d399',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(10,10,26,0.6)',
          }}>
            Live
          </span>
        </div>
      </div>

      {/* ── Card Content ────────────────────────────────────────────────────── */}
      <div style={{ padding: 'clamp(1.2rem, 2vw, 1.6rem)' }}>

        {/* Subtitle */}
        <p style={{
          fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.45em', textTransform: 'uppercase',
          color: tokens.label, margin: '0 0 0.5rem 0', opacity: 0.9,
        }}>
          {project.subtitle}
        </p>

        {/* Title */}
        <h3 style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
          fontWeight: 800, letterSpacing: '-0.02em',
          color: tokens.heading, margin: '0 0 0.65rem 0',
          lineHeight: 1.2,
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 'clamp(0.78rem, 1.1vw, 0.85rem)',
          color: tokens.subtext, lineHeight: 1.65,
          margin: '0 0 1rem 0',
          // Clamp to 3 lines
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '6px',
          marginBottom: '1.2rem',
        }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.04em',
              background: tokens.tagBg,
              border: `1px solid ${tokens.tagBorder}`,
              color: tokens.tagColor,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          width: '100%', height: '1px',
          background: tokens.divider,
          marginBottom: '1.1rem',
        }} />

        {/* CTA row */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: '6px',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem', fontWeight: 700,
              letterSpacing: '0.02em',
              background: tokens.btnBg,
              color: tokens.btnText,
              textDecoration: 'none',
              boxShadow: `0 0 16px ${tokens.label}30`,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = `0 4px 20px ${tokens.label}50`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 0 16px ${tokens.label}30`
            }}
          >
            {/* Arrow icon */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Live Demo
          </a>

          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px',
              borderRadius: '10px',
              border: `1px solid ${tokens.cardBorder}`,
              background: 'transparent',
              color: tokens.subtext,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = tokens.label + '40'
              e.currentTarget.style.color = tokens.label
              e.currentTarget.style.background = tokens.tagBg
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = tokens.cardBorder
              e.currentTarget.style.color = tokens.subtext
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {/* GitHub icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}


// ── Section ────────────────────────────────────────────────────────────────────
const FeaturedProjects = () => {
  const { theme } = useTheme()
  const { projects: apiProjects } = useSiteData()
  const featuredProjects = apiProjects?.length > 0 ? apiProjects.filter(p => p.featured) : defaultFeaturedProjects
  const isDark    = theme === 'dark'
  const tokens    = THEME[theme] ?? THEME.dark

  return (
    <section style={{
      width: '100%',
      background: tokens.bg,
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 3rem)',
      transition: 'background 0.35s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.5em', textTransform: 'uppercase',
            color: tokens.label, margin: '0 0 0.75rem 0', opacity: 0.9,
          }}>
            — Selected Work —
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 900, letterSpacing: '-0.03em',
              color: tokens.heading, margin: 0,
              lineHeight: 1.05,
            }}>
              Featured<br />
              <span style={{ color: tokens.label }}>Projects</span>
            </h2>

            {/* View all — top right */}
            <Link
              to="/work"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.85rem', fontWeight: 700,
                letterSpacing: '0.03em',
                color: tokens.label,
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: `1px solid ${tokens.label}30`,
                background: tokens.tagBg,
                transition: 'all 0.2s ease',
                alignSelf: 'flex-end',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = tokens.label + '18'
                e.currentTarget.style.borderColor = tokens.label + '50'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = tokens.tagBg
                e.currentTarget.style.borderColor = tokens.label + '30'
              }}
            >
              View All
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Divider */}
          <div style={{
            marginTop: '1.5rem', height: '1px',
            background: `linear-gradient(to right, ${tokens.label}40, transparent)`,
          }} />
        </div>

        {/* ── Project Cards Grid ──────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(1.25rem, 2.5vw, 2rem)',
        }}>
          {featuredProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              tokens={tokens}
              isDark={isDark}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default FeaturedProjects
