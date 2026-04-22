import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useSiteData } from '../context/SiteDataContext'

const THEME = {
  dark:  { bg: '#030305', heading: '#ffffff', subtext: 'rgba(255,255,255,0.4)', label: '#4a9eff', cardBg: 'rgba(255,255,255,0.03)', cardBorder: 'rgba(255,255,255,0.07)', nameColor: '#ffffff', roleColor: 'rgba(255,255,255,0.4)', quoteColor: 'rgba(255,255,255,0.65)', starColor: '#f59e0b' },
  light: { bg: '#f0f4ff', heading: '#0a0a1a', subtext: 'rgba(10,10,26,0.45)', label: '#d4200c', cardBg: 'rgba(255,255,255,0.85)', cardBorder: 'rgba(0,0,0,0.07)', nameColor: '#0a0a1a', roleColor: 'rgba(10,10,26,0.45)', quoteColor: 'rgba(10,10,26,0.7)', starColor: '#f59e0b' },
}

const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Product Manager',
    company: 'TechFlow Inc.',
    avatar: '/images/client1.png',
    quote: 'Anish delivered our platform ahead of schedule with exceptional quality. His attention to detail and proactive communication made the entire process seamless.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Raj Patel',
    role: 'Startup Founder',
    company: 'LaunchPad',
    avatar: '/images/client2.png',
    quote: 'Working with Anish was a game-changer for our startup. He understood our vision immediately and built exactly what we needed — fast, clean, and scalable.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Lead Designer',
    company: 'PixelCraft Studio',
    avatar: '/images/client3.png',
    quote: 'Rarely do you find a developer who can bridge design and engineering so well. Anish brought our Figma designs to life with pixel-perfect precision.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Okafor',
    role: 'CTO',
    company: 'DataStream',
    avatar: '/images/client4.png',
    quote: 'The codebase Anish wrote is clean, well-documented, and easy to extend. He thinks like a senior engineer — great architecture decisions throughout.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Priya Sharma',
    role: 'Faculty',
    company: 'Engineering College',
    avatar: '/images/client5.png',
    quote: 'Anish built our college notes platform with an AI-powered backend that exceeded all expectations. Students love it and the admin dashboard is flawless.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Marco Rivera',
    role: 'E-commerce Director',
    company: 'TemplateZone',
    avatar: '/images/client6.png',
    quote: 'TemplateZone went from concept to launch in record time. Anish handled everything — auth, payments, media delivery — without a single missed requirement.',
    rating: 5,
  },
]

const StarRating = ({ rating, color }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < rating ? color : 'none'} stroke={color} strokeWidth="1.5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ))}
  </div>
)

const Testimonials = () => {
  const { theme } = useTheme()
  const { testimonials: apiTestimonials } = useSiteData()
  const testimonials = apiTestimonials?.length > 0 ? apiTestimonials : defaultTestimonials
  const isDark    = theme === 'dark'
  const tokens    = THEME[theme] ?? THEME.dark

  // Show 3 at a time on desktop — paginate via active index
  const [page, setPage] = useState(0)
  const perPage   = 3
  const totalPages = Math.ceil(testimonials.length / perPage)
  const visible   = testimonials.slice(page * perPage, page * perPage + perPage)

  return (
    <section style={{
      width: '100%',
      background: tokens.bg,
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 3rem)',
      transition: 'background 0.35s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.5em', textTransform: 'uppercase',
            color: tokens.label, margin: '0 0 0.75rem 0',
          }}>
            — Client Words —
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 900, letterSpacing: '-0.03em',
            color: tokens.heading, margin: '0 0 1rem 0',
          }}>
            What People <span style={{ color: tokens.label }}>Say</span>
          </h2>
          <div style={{
            margin: '0 auto',
            width: '60px', height: '1px',
            background: `linear-gradient(to right, transparent, ${tokens.label}, transparent)`,
          }} />
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          marginBottom: '2.5rem',
        }}>
          {visible.map((t, i) => (
            <div
              key={t.id}
              style={{
                padding: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                borderRadius: '20px',
                background: tokens.cardBg,
                border: `1px solid ${tokens.cardBorder}`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                transition: 'border-color 0.25s ease, transform 0.25s ease',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = tokens.label + '30'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = tokens.cardBorder
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Subtle corner quote mark */}
              <span style={{
                position: 'absolute', top: '12px', right: '18px',
                fontSize: '4rem', lineHeight: 1,
                color: tokens.label, opacity: 0.06,
                fontFamily: 'Georgia, serif', pointerEvents: 'none',
                userSelect: 'none',
              }}>
                "
              </span>

              {/* Stars */}
              <StarRating rating={t.rating} color={tokens.starColor} />

              {/* Quote */}
              <p style={{
                fontSize: 'clamp(0.82rem, 1.2vw, 0.9rem)',
                color: tokens.quoteColor,
                lineHeight: 1.7, margin: 0, flex: 1,
                fontStyle: 'italic',
              }}>
                "{t.quote}"
              </p>

              {/* Divider */}
              <div style={{
                height: '1px',
                background: `linear-gradient(to right, ${tokens.label}20, transparent)`,
              }} />

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: '42px', height: '42px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${tokens.label}30`,
                    flexShrink: 0,
                  }}
                  onError={e => { e.target.src = '/images/person.png' }}
                />
                <div>
                  <p style={{
                    fontSize: '0.88rem', fontWeight: 700,
                    color: tokens.nameColor, margin: 0,
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    fontSize: '11px', color: tokens.roleColor,
                    margin: 0, marginTop: '1px',
                  }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: i === page ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: i === page ? tokens.label : tokens.label + '30',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                boxShadow: i === page ? `0 0 8px ${tokens.label}60` : 'none',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials
