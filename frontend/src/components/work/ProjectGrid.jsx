import { AnimatePresence, motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

export default function ProjectGrid({ projects }) {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem' }}>

      {/* Section label + count */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <h2 style={{
          fontSize: '0.72rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          fontWeight: 600, margin: 0,
        }}>
          All Projects
        </h2>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </span>
      </div>

      {projects.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', color: 'var(--text-muted)',
            padding: '5rem 0', fontSize: '0.9rem',
          }}
        >
          No projects in this category.
        </motion.p>
      ) : (
        <>
          <style>{`
            .project-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1.5rem;
            }
            @media (max-width: 1024px) { .project-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 580px)  { .project-grid { grid-template-columns: 1fr; } }
          `}</style>

          <div className="project-grid">
            <AnimatePresence mode="popLayout">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    // Only first 6 stagger — rest appear instantly
                    delay: i < 6 ? i * 0.04 : 0,
                    ease: 'easeOut',
                  }}
                >
                  <ProjectCard project={project} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </section>
  )
}