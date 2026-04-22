import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects as defaultProjects } from "../components/work/projectsData"
import { trackEvent } from '../services/api'
import { useSiteData } from '../context/SiteDataContext'

const PROJECT_ACCENTS = {
  'Full Stack': { primary: '#52aeff', glow: 'rgba(82,174,255,0.12)', soft: 'rgba(82,174,255,0.04)' },
  'Frontend': { primary: '#a78bfa', glow: 'rgba(167,139,250,0.12)', soft: 'rgba(167,139,250,0.04)' },
}

const getAccent = (category) =>
  PROJECT_ACCENTS[category] ?? PROJECT_ACCENTS['Full Stack']

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
})

function SectionLabel({ children }) {
  return (
    <p className="text-[0.6rem] tracking-[0.22em] uppercase font-bold mb-4"
      style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  )
}

// ── GitHub icon ───────────────────────────────────────────────────────────────
const GithubIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const ArrowIcon = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
)

export default function ProjectDetail() {
  const { projectId } = useParams()
  const { projects: apiProjects } = useSiteData()
  const projects = apiProjects?.length > 0 ? apiProjects : defaultProjects
  const project = projects.find((p) => p.id === projectId)
  console.log(project)
  const accent = project ? getAccent(project.category) : getAccent('Full Stack')

  useEffect(() => { window.scrollTo(0, 0) }, [projectId])
  useEffect(() => { try { trackEvent('project-detail', 'project_view', { projectId }) } catch {} }, [projectId])

  // ── 404 ──
  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: 'var(--bg-primary)' }}>
        <p className="text-[5rem] font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>404</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Project not found.</p>
        <Link to="/work"
          className="text-sm px-5 py-2.5 rounded-lg text-white no-underline"
          style={{ background: accent.primary }}>
          ← Back to Work
        </Link>
      </main>
    )
  }

  const currentIndex = projects.findIndex((p) => p.id === projectId)
  const prevProject = projects[currentIndex - 1] ?? null
  const nextProject = projects[currentIndex + 1] ?? null

  // Safe paragraph split — handles both \n\n and \\n\\n
  const paragraphs = (project.longDescription ?? project.description)
    .replace(/\\n\\n/g, '\n\n')   // converts any leftover \\n\\n → real newlines
    .split('\n\n')
    .filter(Boolean)

  // Screenshots — filter out empty strings/nulls
  const screenshots = (project.screenshots ?? []).filter(Boolean)

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          paddingTop: '80px',
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent.glow}, transparent 70%)`,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--border-color) 1px, transparent 1px),
                              linear-gradient(90deg, var(--border-color) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="max-w-[1100px] mx-auto px-5 md:px-10">

          {/* Back */}
          <motion.div {...fadeUp(0)} className="mb-8">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-[0.72rem] font-medium no-underline group transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = accent.primary}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="transition-transform duration-200 group-hover:-translate-x-0.5">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              All Projects
            </Link>
          </motion.div>

          {/* Meta row — category + year + role */}
          <motion.div {...fadeUp(0.05)} className="flex flex-wrap items-center gap-2.5 mb-5">
            <span
              className="text-[0.6rem] tracking-[0.16em] uppercase font-bold px-3 py-1.5 rounded-full"
              style={{
                background: `${accent.primary}14`,
                border: `1px solid ${accent.primary}28`,
                color: accent.primary,
              }}
            >
              {project.category}
            </span>
            <span className="text-[0.68rem] font-mono" style={{ color: 'var(--text-muted)' }}>
              {project.year}
            </span>
            <span style={{ color: 'var(--border-color)' }}>·</span>
            {/* Role — now prominent in the meta row */}
            <span
              className="text-[0.68rem] font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {project.role}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            {...fadeUp(0.1)}
            className="font-black tracking-tight leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', color: 'var(--text-primary)' }}
          >
            {project.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.div {...fadeUp(0.14)} className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2.5px] rounded-full flex-shrink-0" style={{ background: accent.primary }} />
            <p className="text-[0.88rem] font-medium tracking-wide" style={{ color: accent.primary }}>
              {project.subtitle}
            </p>
          </motion.div>

          {/* Short description — teaser before the full overview below */}
          <motion.p
            {...fadeUp(0.17)}
            className="text-[0.86rem] leading-[1.85] mb-8 max-w-[680px]"
            style={{ color: 'var(--text-muted)' }}
          >
            {project.description}
          </motion.p>

          {/* CTA row */}
          <motion.div {...fadeUp(0.2)} className="flex items-center gap-3 mb-10">
            <a
              href={project.projectUrl}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.78rem] font-bold text-white no-underline transition-all duration-200 hover:opacity-80 hover:-translate-y-px"
              style={{ background: accent.primary }}
            >
              View Live <ArrowIcon />
            </a>
            <a
              href={project.githubLink}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.78rem] font-medium no-underline transition-all duration-200 hover:-translate-y-px"
              style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = accent.primary
                e.currentTarget.style.color = accent.primary
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <GithubIcon /> GitHub
            </a>
          </motion.div>

          {/* Browser mockup */}
          <motion.div
            {...fadeUp(0.24)}
            className="relative rounded-t-xl overflow-hidden"
            style={{ border: `1px solid ${accent.primary}25`, borderBottom: 'none' }}
          >
            {/* Chrome bar */}
            <div
              className="flex items-center gap-2 px-4 h-9"
              style={{ background: 'var(--bg-secondary)', borderBottom: `1px solid ${accent.primary}18` }}
            >
              <div className="flex items-center gap-1.5">
                {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
              </div>
              <div
                className="flex-1 mx-3 h-5 rounded-md flex items-center px-3"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              >
                <span className="text-[0.58rem] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                  {project.projectUrl}
                </span>
              </div>
            </div>
            {/* 16:9 screenshot */}
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <img
                src={project.imageUrl}
                alt={`${project.title} screenshot`}
                className="absolute inset-0 w-full h-full object-cover object-top"
                onError={e => {
                  e.currentTarget.style.opacity = '0'
                  e.currentTarget.parentElement.style.background = 'var(--bg-secondary)'
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent 55%, var(--bg-primary) 100%)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">

          {/* ── LEFT ── */}
          <div>

            {/* Overview */}
            <motion.div {...fadeUp(0.28)} className="mb-14">
              <SectionLabel>About The Project</SectionLabel>
              <div className="flex flex-col gap-5">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-[0.88rem] leading-[1.95]" style={{ color: 'var(--text-muted)' }}>
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Key Features — numbered cards */}
            <motion.div {...fadeUp(0.32)} className="mb-14">
              <SectionLabel>Key Features</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(project.features ?? []).map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                    {/* Feature number */}
                    <span
                      className="text-[0.6rem] font-black tabular-nums mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${accent.primary}14`,
                        border: `1px solid ${accent.primary}28`,
                        color: accent.primary,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.8rem] leading-[1.65]" style={{ color: 'var(--text-muted)' }}>
                      {feat}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Screenshots gallery — only if screenshots[] has entries */}
            {screenshots.length > 0 && (
              <motion.div {...fadeUp(0.38)} className="mb-14">
                <SectionLabel>Screenshots</SectionLabel>
                <div className="flex flex-col gap-4">
                  {screenshots.map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                      className="relative rounded-xl overflow-hidden"
                      style={{ border: `1px solid ${accent.primary}20` }}
                    >
                      {/* Mini chrome bar */}
                      <div
                        className="flex items-center gap-1.5 px-3 h-7"
                        style={{ background: 'var(--bg-secondary)', borderBottom: `1px solid var(--border-color)` }}
                      >
                        {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
                          <div key={c} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.6 }} />
                        ))}
                        <span className="ml-2 text-[0.55rem] font-mono" style={{ color: 'var(--text-muted)' }}>
                          Screenshot {i + 1}
                        </span>
                      </div>
                      <img
                        src={src}
                        alt={`${project.title} screenshot ${i + 1}`}
                        className="w-full block object-cover object-top"
                        style={{ maxHeight: '420px' }}
                        onError={e => e.currentTarget.style.display = 'none'}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* ── RIGHT: sidebar ── */}
          <motion.aside {...fadeUp(0.3)} className="flex flex-col gap-4">

            {/* Tech Stack */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <SectionLabel>Tech Stack</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[0.66rem] font-medium tracking-wide"
                    style={{
                      background: i === 0 ? `${accent.primary}14` : 'var(--bg-secondary)',
                      border: `1px solid ${i === 0 ? accent.primary + '30' : 'var(--border-color)'}`,
                      color: i === 0 ? accent.primary : 'var(--text-muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Info — ALL fields */}
            <div
              className="rounded-xl p-5 flex flex-col gap-0"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <SectionLabel>Project Info</SectionLabel>
              {[
                { label: 'Category', value: project.category },
                { label: 'Year', value: project.year },
                { label: 'Role', value: project.role },
                // Conditionally show featured badge
                ...(project.featured ? [{ label: 'Status', value: '★ Featured Project' }] : []),
              ].map(({ label, value }, i, arr) => (
                <div key={label}>
                  <div className="flex flex-col gap-0.5 py-3">
                    <span
                      className="text-[0.58rem] tracking-[0.14em] uppercase block mb-0.5"
                      style={{ color: 'var(--text-muted)', opacity: 0.55 }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-[0.82rem] font-semibold"
                      style={{ color: label === 'Status' ? accent.primary : 'var(--text-primary)' }}
                    >
                      {value}
                    </span>
                  </div>
                  {/* Divider — skip after last */}
                  {i < arr.length - 1 && (
                    <div className="w-full h-px" style={{ background: 'var(--border-color)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Links */}
            <div
              className="rounded-xl p-5 flex flex-col gap-2.5"
              style={{
                background: `${accent.primary}06`,
                border: `1px solid ${accent.primary}18`,
              }}
            >
              <SectionLabel>Links</SectionLabel>
              <a
                href={project.projectUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[0.76rem] font-bold text-white no-underline transition-all duration-200 hover:opacity-80 hover:-translate-y-px"
                style={{ background: accent.primary }}
              >
                View Live <ArrowIcon />
              </a>
              <a
                href={project.githubLink}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[0.76rem] font-medium no-underline transition-all duration-200 hover:-translate-y-px"
                style={{
                  background: 'transparent',
                  border: `1px solid ${accent.primary}25`,
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = accent.primary
                  e.currentTarget.style.color = accent.primary
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${accent.primary}25`
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                <GithubIcon /> View on GitHub
              </a>
            </div>

            {/* All tags — complete list */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <SectionLabel>All Tags</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[0.63rem] tracking-wide"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </motion.aside>
        </div>

        {/* ── Prev / Next ── */}
        <motion.div
          {...fadeUp(0.45)}
          className="mt-20 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          {prevProject ? (
            <Link
              to={`/work/${prevProject.id}`}
              className="group flex flex-col gap-1.5 p-5 rounded-xl no-underline transition-all duration-200"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = accent.primary}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <span className="text-[0.6rem] tracking-[0.14em] uppercase flex items-center gap-1.5"
                style={{ color: 'var(--text-muted)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M5 12l7 7M5 12l7-7" />
                </svg>
                Previous
              </span>
              <span className="text-[0.88rem] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {prevProject.title}
              </span>
              <span className="text-[0.7rem]" style={{ color: 'var(--text-muted)' }}>
                {prevProject.subtitle}
              </span>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              to={`/work/${nextProject.id}`}
              className="group flex flex-col gap-1.5 p-5 rounded-xl no-underline transition-all duration-200 sm:items-end sm:text-right"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = accent.primary}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <span className="text-[0.6rem] tracking-[0.14em] uppercase flex items-center gap-1.5"
                style={{ color: 'var(--text-muted)' }}>
                Next
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M14 6l6 6-6 6" />
                </svg>
              </span>
              <span className="text-[0.88rem] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {nextProject.title}
              </span>
              <span className="text-[0.7rem]" style={{ color: 'var(--text-muted)' }}>
                {nextProject.subtitle}
              </span>
            </Link>
          ) : <div />}
        </motion.div>
      </div>
    </main>
  )
}