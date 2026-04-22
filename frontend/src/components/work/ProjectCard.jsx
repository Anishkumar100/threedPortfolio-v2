import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

function ProjectCard({ project }) {
  const {
    id, title, subtitle, description,
    imageUrl, projectUrl, githubLink,
    tags, year, featured, category
  } = project

  const navigate = useNavigate()

  // ── The outer wrapper is a div that navigates on click.
  //    This avoids the illegal <a> inside <a> nesting since
  //    projectUrl and githubLink are also <a> tags inside.
  return (
    <div
      role="article"
      onClick={() => navigate(`/work/${id}`)}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-primary)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-color)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >

      {/* ── Image ── */}
      <div className="relative overflow-hidden h-[200px] flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          width={600} height={340}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-105"
          onError={e => {
            e.currentTarget.style.opacity = '0'
            e.currentTarget.parentElement.style.background = 'var(--bg-secondary)'
          }}
        />

        {/* Bottom gradient — bleeds into card body */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 60%)' }}
        />

        {/* Top badge row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Category — frosted glass pill */}
          <span
            className="text-[0.58rem] tracking-[0.13em] uppercase font-bold px-2.5 py-[5px] rounded-full"
            style={{
              background: 'rgba(0,0,0,0.52)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {category}
          </span>

          {/* Featured badge */}
          {featured && (
            <span
              className="text-[0.58rem] tracking-[0.1em] uppercase font-bold px-2.5 py-[5px] rounded-full"
              style={{ background: 'var(--accent-primary)', color: '#fff' }}
            >
              ★ Featured
            </span>
          )}
        </div>

        {/* "View Details" overlay — slides up on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(3px)' }}
        >
          <span
            className="flex items-center gap-2 text-white text-[0.72rem] font-semibold px-4 py-2 rounded-full translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
            style={{
              background: 'rgba(0,0,0,0.65)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
            }}
          >
            View Details
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Year + role row */}
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="text-[0.6rem] font-mono tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            {year}
          </span>
          {/* First tag gets accent treatment as a "role" indicator */}
          {tags[0] && (
            <span
              className="text-[0.58rem] tracking-[0.1em] uppercase font-semibold px-2 py-[3px] rounded-md"
              style={{
                background: 'var(--accent-primary)14',
                border: '1px solid var(--accent-primary)28',
                color: 'var(--accent-primary)',
              }}
            >
              {tags[0]}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-[1rem] font-bold leading-snug tracking-tight mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>

        {/* Subtitle — accent color with leading rule */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3.5 h-[1.5px] rounded-full flex-shrink-0"
            style={{ background: 'var(--accent-primary)' }}
          />
          <p
            className="text-[0.7rem] font-medium tracking-wide"
            style={{ color: 'var(--accent-primary)' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Description — 2-line clamp */}
        <p
          className="text-[0.78rem] leading-relaxed line-clamp-2 flex-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {description}
        </p>

        {/* ── Footer ── */}
        <div
          className="mt-4 pt-4 flex items-center justify-between gap-2"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          {/* Remaining tags — skip first (shown above as accent pill) */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {tags.slice(1, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-[3px] rounded-md text-[0.6rem] tracking-wide truncate"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>
                +{tags.length - 3}
              </span>
            )}
          </div>

          {/* External link buttons — stopPropagation prevents card nav */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Live */}
            <a
              href={projectUrl}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.68rem] font-bold text-white no-underline transition-opacity duration-200 hover:opacity-75"
              style={{ background: 'var(--accent-primary)' }}
              title="View Live"
            >
              Live
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>

            {/* GitHub — icon only */}
            <a
              href={githubLink}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center w-[30px] h-[30px] rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
              }}
              title="View on GitHub"
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)'
                e.currentTarget.style.color = 'var(--accent-primary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProjectCard)