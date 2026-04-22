import { motion } from 'framer-motion'
import { FILTER_CATEGORIES as defaultCategories, projects as defaultProjects } from './projectsData'

export default function FilterBar({ activeFilter, onFilterChange, projects: propProjects }) {
  const projects = propProjects?.length > 0 ? propProjects : defaultProjects
  const FILTER_CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]
  return (
    <div
      style={{
        position: 'sticky',
        top: '72px',       // sits just below Navbar
        zIndex: 50,
        background: 'var(--bg-primary)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 2rem',
      }}
    >
      <div
        role="tablist"
        aria-label="Filter projects"
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',         // Firefox
          msOverflowStyle: 'none',        // IE
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '2px',           // prevent clipping the glow
        }}
      >
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat
          // Show total count badge only on "All"
          const count = cat === 'All' ? projects.length : null

          return (
            <motion.button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(cat)}
              style={{
                position: 'relative',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: isActive
                  ? '1px solid transparent'
                  : '1px solid var(--border-color)',
                background: 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'color 0.2s',
                zIndex: 1,
                outline: 'none',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* The sliding filled background — same layoutId means Framer Motion
                  animates it smoothly between whichever pill is active */}
              {isActive && (
                <motion.span
                  layoutId="activePill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: 'var(--accent-primary)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                />
              )}

              {cat}

              {/* Count badge on "All" pill */}
              {count !== null && (
                <span
                  style={{
                    marginLeft: '0.4rem',
                    background: isActive
                      ? 'rgba(255,255,255,0.25)'
                      : 'var(--bg-secondary)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '999px',
                    lineHeight: 1.4,
                  }}
                >
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}