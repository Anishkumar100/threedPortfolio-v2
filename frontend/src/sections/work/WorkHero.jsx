import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function WorkHero() {
  return (
    <section style={{
      padding: '7rem 2rem 5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex', gap: '0.4rem', alignItems: 'center',
          fontSize: '0.78rem', color: 'var(--text-muted)',
          marginBottom: '2.5rem',
          letterSpacing: '0.04em',
        }}
      >
        <Link
          to="/"
          style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          Home
        </Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: 'var(--text-primary)' }}>Work</span>
      </motion.div>

      {/* Eyebrow label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--accent-primary)',
          fontWeight: 600,
          marginBottom: '1rem',
        }}
      >
        Selected Work
      </motion.p>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          marginBottom: '1.5rem',
          maxWidth: '700px',
        }}
      >
        Things I've built
        <br />
        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
          that actually work.
        </span>
      </motion.h1>

      {/* Subtext + project count — same line, separated */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          maxWidth: '480px',
          margin: 0,
        }}>
          From AI-powered SaaS platforms to real-time dashboards —
          full-stack projects built with purpose and attention to detail.
        </p>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>11</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.2rem' }}>Projects</div>
        </div>
      </motion.div>
    </section>
  )
}