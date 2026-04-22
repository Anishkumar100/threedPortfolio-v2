// sections/contact/FAQAccordion.jsx
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useSiteData } from '../../context/SiteDataContext'

// ─── Theme config ──────────────────────────────────────────────────────────────
const THEME_CFG = {
  dark: {
    accent:       '#52aeff',
    accent2:      '#6d45ce',
    accentSoft:   'rgba(82,174,255,0.07)',
    accentBorder: 'rgba(82,174,255,0.25)',
    accentGlow:   'rgba(82,174,255,0.18)',
    gridColor:    'rgba(82,174,255,0.03)',
    tagLabel:     'Bat-channel — frequent questions',
  },
  light: {
    accent:       '#d4200c',
    accent2:      '#f5c518',
    accentSoft:   'rgba(212,32,12,0.07)',
    accentBorder: 'rgba(212,32,12,0.22)',
    accentGlow:   'rgba(212,32,12,0.14)',
    gridColor:    'rgba(212,32,12,0.025)',
    tagLabel:     'Metropolis dispatch — common questions',
  },
}

// ─── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    id: 'timeline',
    category: 'Process',
    q: "What's your typical project timeline?",
    a: "Most projects land between 4–8 weeks depending on scope and complexity. Simple landing pages or single-feature tools can be done in 1–2 weeks. Full-stack SaaS products with auth, dashboards, and APIs take longer. I'll give you a detailed breakdown after our first conversation — no vague estimates.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: 'remote',
    category: 'Logistics',
    q: 'Do you work remotely?',
    a: "100% remote and I've never been in the same timezone as most of my clients. I work async-first — detailed briefs, regular check-ins, and clear deliverable milestones mean you're never left wondering what's happening. I adapt to your timezone for calls.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
  {
    id: 'rate',
    category: 'Pricing',
    q: "What's your rate for freelance work?",
    a: "I don't publish fixed rates because scope varies wildly — a landing page and a full SaaS product shouldn't have the same price. I'm transparent and fair. Tell me what you're building, your timeline, and your budget range, and I'll tell you honestly if it works. No hard sell.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    id: 'design-dev',
    category: 'Scope',
    q: 'Do you handle design and development?',
    a: "Both. I can take a project from wireframes and design decisions all the way to a deployed, production-ready product. I'm not a Figma-first designer — I design in the browser, which means what you see in prototypes is exactly what gets built. No translation loss.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    id: 'fulltime',
    category: 'Roles',
    q: 'Are you open to full-time roles?',
    a: "Selectively, yes. I care about the problem more than the perks. If the team is small and moves fast, the product is something I'd use myself, and there's real ownership involved — I'm absolutely open to a conversation. Reach out with context and I'll be honest about my interest.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
      </svg>
    ),
  },
  {
    id: 'tech-stack',
    category: 'Technical',
    q: 'What stack do you typically use?',
    a: "React or Next.js on the frontend, Node.js + Express on the backend, MongoDB for data, and Vercel for deployment. For 3D work I use Three.js and React Three Fiber. For AI features I reach for Gemini API or HuggingFace. I pick tools for the problem — not the other way around.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    id: 'revisions',
    category: 'Process',
    q: 'How many revisions do you include?',
    a: "I don't work on a revision-count model — I think it creates the wrong incentives. Instead I front-load the process: detailed scope definition, early feedback checkpoints, and incremental delivery. By the time something is 'done', we've already iterated together. Final outputs rarely need major changes.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
      </svg>
    ),
  },
  {
    id: 'nda',
    category: 'Legal',
    q: 'Do you sign NDAs?',
    a: "Yes, without issue. If your project involves sensitive IP, proprietary tech, or confidential business logic, just include an NDA as part of the engagement. I treat all client work as confidential by default regardless — NDAs just make it formal.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
  },
]

// ─── Category badge ────────────────────────────────────────────────────────────
function CategoryBadge({ label, accent }) {
  return (
    <span
      className="text-[0.55rem] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border flex-shrink-0"
      style={{
        fontFamily:  '"Mona Sans", sans-serif',
        background:  `${accent}10`,
        borderColor: `${accent}28`,
        color:       accent,
      }}
    >
      {label}
    </span>
  )
}

// ─── Single FAQ item ────────────────────────────────────────────────────────────
function FAQItem({ faq, isOpen, onToggle, accent, accentSoft, accentBorder, index }) {
  const contentRef = useRef(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.055, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        borderColor: isOpen ? `${accent}40` : 'var(--border-color)',
        background:  isOpen ? `${accent}06` : 'var(--bg-card)',
        boxShadow:   isOpen ? `0 0 0 1px ${accent}12, 0 12px 36px ${accent}10` : 'none',
      }}
    >
      {/* ── Question row ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 px-5 py-5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        {/* Icon box */}
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border mt-0.5 transition-all duration-250"
          style={{
            background:  isOpen ? `${accent}20` : 'var(--bg-secondary)',
            borderColor: isOpen ? `${accent}40` : 'var(--border-color)',
            color:       isOpen ? accent : 'var(--text-muted)',
          }}
        >
          {faq.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <CategoryBadge label={faq.category} accent={accent} />
          </div>
          <p
            className="font-bold text-[0.88rem] leading-snug transition-colors duration-200"
            style={{
              fontFamily:    '"Mona Sans", sans-serif',
              color:         isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing: '-0.01em',
            }}
          >
            {faq.q}
          </p>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 mt-1 transition-colors duration-200"
          style={{ color: isOpen ? accent : 'var(--text-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </button>

      {/* ── Answer ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-5"
              style={{ borderTop: `1px solid ${accent}18` }}
            >
              {/* Answer text */}
              <p
                className="text-[0.82rem] leading-[1.85] pt-4"
                style={{
                  color:      'var(--text-muted)',
                  fontFamily: '"Mona Sans", sans-serif',
                  paddingLeft: '3.25rem', // aligns with question text
                }}
              >
                {faq.a}
              </p>

              {/* CTA row for specific FAQs */}
              {faq.id === 'rate' && (
                <div className="pl-[3.25rem] mt-3">
                  <a
                    href="#contact-form"
                    className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold no-underline transition-all duration-200"
                    style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Tell me about your project →
                  </a>
                </div>
              )}
              {faq.id === 'fulltime' && (
                <div className="pl-[3.25rem] mt-3">
                  <a
                    href={_faqLinkedin}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold no-underline transition-all duration-200"
                    style={{ color: accent, fontFamily: '"Mona Sans", sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    View my LinkedIn →
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Category filter tabs ──────────────────────────────────────────────────────
function CategoryTabs({ categories, active, onSelect, accent, accentSoft, accentBorder }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className="px-3.5 py-1.5 rounded-full border text-[0.68rem] font-bold transition-all duration-200"
        style={{
          fontFamily:  '"Mona Sans", sans-serif',
          background:  active === null ? `${accent}14` : 'transparent',
          borderColor: active === null ? `${accent}45` : 'var(--border-color)',
          color:       active === null ? accent : 'var(--text-muted)',
          letterSpacing: '0.02em',
        }}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat === active ? null : cat)}
          className="px-3.5 py-1.5 rounded-full border text-[0.68rem] font-bold transition-all duration-200"
          style={{
            fontFamily:  '"Mona Sans", sans-serif',
            background:  active === cat ? `${accent}14` : 'transparent',
            borderColor: active === cat ? `${accent}45` : 'var(--border-color)',
            color:       active === cat ? accent : 'var(--text-muted)',
            letterSpacing: '0.02em',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

// ─── Still have questions CTA block ───────────────────────────────────────────
function StillHavingQuestions({ accent, accentSoft, accentBorder }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-10 rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8"
      style={{
        background:  accentSoft,
        borderColor: accentBorder,
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border"
        style={{
          background:  `${accent}18`,
          borderColor: `${accent}35`,
          color:       accent,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4
          className="font-black text-[0.95rem] mb-1"
          style={{
            fontFamily:    '"Mona Sans", sans-serif',
            color:         'var(--text-primary)',
            letterSpacing: '-0.015em',
          }}
        >
          Still have questions?
        </h4>
        <p
          className="text-[0.78rem] leading-relaxed"
          style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
        >
          If your question isn't here, just send me a message directly. I read every one personally.
        </p>
      </div>

      {/* CTA */}
      <a
        href="#contact-form"
        className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[0.75rem] font-bold no-underline transition-all duration-200"
        style={{
          background:  accent,
          color:       '#fff',
          fontFamily:  '"Mona Sans", sans-serif',
          letterSpacing: '0.03em',
          boxShadow:   `0 0 20px ${accent}40`,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 32px ${accent}60` }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 20px ${accent}40` }}
      >
        Ask me directly
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </a>
    </motion.div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function FAQAccordion() {
  const { theme } = useTheme()
  const { profile: _faqProfile } = useSiteData()
  const _faqLinkedin = _faqProfile?.linkedin || 'https://linkedin.com'
  const isDark    = theme === 'dark'
  const cfg       = isDark ? THEME_CFG.dark : THEME_CFG.light
  const { accent, accentSoft, accentBorder, accentGlow, gridColor, tagLabel } = cfg

  const [activeId,  setActiveId]  = useState('timeline') // first open by default
  const [activeFilter, setActiveFilter] = useState(null)

  const categories = [...new Set(FAQS.map(f => f.category))]
  const filtered   = activeFilter
    ? FAQS.filter(f => f.category === activeFilter)
    : FAQS

  const toggle = (id) => setActiveId(prev => prev === id ? null : id)

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />

      <div className="relative max-w-[860px] mx-auto px-5 md:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-3">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accent }}
            />
            <span
              className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
            >
              {tagLabel}
            </span>
          </div>

          {/* Heading + meta */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2
                className="font-black tracking-tight mb-1.5"
                style={{
                  fontSize:      'clamp(1.7rem, 3.5vw, 2.4rem)',
                  color:         'var(--text-primary)',
                  fontFamily:    '"Mona Sans", sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                Common questions
              </h2>
              <p
                className="text-[0.82rem] leading-relaxed"
                style={{
                  color:      'var(--text-muted)',
                  fontFamily: '"Mona Sans", sans-serif',
                  maxWidth:   '380px',
                }}
              >
                Answers to the things people ask before reaching out. Click any question to expand.
              </p>
            </div>

            {/* Count badge */}
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border flex-shrink-0 w-fit"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <span
                className="font-black text-[1.1rem]"
                style={{ color: accent, fontFamily: '"Mona Sans", sans-serif', letterSpacing: '-0.02em' }}
              >
                {FAQS.length}
              </span>
              <span
                className="text-[0.62rem] font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
              >
                questions
              </span>
            </div>
          </div>

          {/* Category filter tabs */}
          <CategoryTabs
            categories={categories}
            active={activeFilter}
            onSelect={setActiveFilter}
            accent={accent}
            accentSoft={accentSoft}
            accentBorder={accentBorder}
          />
        </motion.div>

        {/* ── FAQ list ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter ?? 'all'}
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {filtered.map((faq, i) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={activeId === faq.id}
                onToggle={() => toggle(faq.id)}
                accent={accent}
                accentSoft={accentSoft}
                accentBorder={accentBorder}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Still have questions ── */}
        <StillHavingQuestions
          accent={accent}
          accentSoft={accentSoft}
          accentBorder={accentBorder}
        />

      </div>
    </section>
  )
}