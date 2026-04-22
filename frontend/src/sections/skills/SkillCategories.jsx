// src/sections/skills/SkillCategories.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { skillCategories as defaultSkillCategories } from '../../constants/skills'
import { useSiteData } from '../../context/SiteDataContext'

const ease = [0.16, 1, 0.3, 1]
const LEVEL_LABEL = ['', 'Beginner', 'Learning', 'Proficient', 'Advanced', 'Expert']

// ─── Prof dots (5 segments, styled like the featured project progress bar) ────
function ProfSegments({ level, accent }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const isActive = i < level;
        return (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: isActive ? '16px' : '6px',
              height: '4px',
              background: isActive ? accent : 'var(--border-color)',
              boxShadow: isActive ? `0 0 8px ${accent}90, 0 0 2px ${accent}` : 'none',
              opacity: isActive ? 1 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Skill flip card ──────────────────────────────────────────────────────────
function SkillCard({ skill, accent, index }) {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1200px', height: '230px' }}
      className="cursor-pointer group"
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, mass: 1 }}
        style={{
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* ══ FRONT ══ */}
        <div
          className="absolute inset-0 rounded-[1.25rem] border overflow-hidden flex flex-col transition-all duration-300"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--bg-card)',
            borderColor: isHovered ? `${accent}50` : 'var(--border-color)',
            boxShadow: isHovered 
              ? `0 12px 30px -10px ${accent}25, inset 0 0 0 1px ${accent}10` 
              : `0 4px 12px -5px rgba(0,0,0,0.1)`,
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          }}
        >
          {/* Ambient Background Glow */}
          <div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500"
            style={{ 
              background: accent,
              opacity: isHovered ? 0.4 : 0.15 
            }}
          />

          {/* Accent top bar */}
          <div
            className="h-[3px] w-full flex-shrink-0"
            style={{ background: `linear-gradient(to right, ${accent}, ${accent}20)` }}
          />

          <div className="flex flex-col justify-between flex-1 relative z-10">
            {/* Top section: Title & Flip Icon */}
            <div className="p-5 pb-0 flex items-start justify-between gap-3">
              <h4
                className="font-black leading-snug flex-1 min-w-0"
                style={{
                  fontFamily: '"Mona Sans", sans-serif',
                  fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {skill.name}
              </h4>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-transform duration-300"
                style={{
                  background: `${accent}10`,
                  borderColor: `${accent}20`,
                  color: accent,
                  transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v6h6"></path>
                  <path d="M21 12a9 9 0 1 0-9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                </svg>
              </div>
            </div>

            {/* Middle section: Level Pill */}
            <div className="px-5 pt-3 flex-1">
              <span
                className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full"
                style={{
                  fontFamily: '"Mona Sans", sans-serif',
                  background: `${accent}15`,
                  color: accent,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
                />
                {LEVEL_LABEL[skill.level]}
              </span>
            </div>

            {/* Giant Watermark (Pushed further back) */}
            <span
              className="absolute bottom-12 right-2 font-black select-none pointer-events-none leading-none tracking-tighter"
              style={{
                fontSize: '6rem',
                color: `${accent}05`,
                fontFamily: '"Mona Sans", sans-serif',
                transform: 'rotate(-5deg)',
              }}
            >
              {skill.level}
            </span>

            {/* Bottom Footer Section */}
            <div 
              className="px-5 py-4 border-t flex items-center justify-between gap-2"
              style={{ 
                borderColor: 'var(--border-color)',
                background: 'rgba(0,0,0,0.02)' // Gives a subtle differentiation to the footer
              }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[0.6rem] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Experience
                </span>
                <span className="text-[0.7rem] font-mono" style={{ color: 'var(--text-primary)' }}>
                  Since {skill.since}
                </span>
              </div>
              <ProfSegments level={skill.level} accent={accent} />
            </div>
          </div>
        </div>

        {/* ══ BACK ══ */}
        <div
          className="absolute inset-0 rounded-[1.25rem] border overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(145deg, ${accent}0f, ${accent}05)`,
            borderColor: `${accent}40`,
            boxShadow: `inset 0 0 0 1px ${accent}20, 0 16px 40px -10px ${accent}30`,
          }}
        >
          {/* Top thick bar */}
          <div className="h-1 w-full flex-shrink-0" style={{ background: accent }} />

          <div className="flex flex-col justify-between flex-1 p-5 relative z-10">
            {/* Back header */}
            <div className="flex items-center justify-between gap-2 border-b pb-3 mb-3" style={{ borderColor: `${accent}20` }}>
              <span
                className="font-black text-[0.9rem] flex-1 min-w-0 truncate"
                style={{ fontFamily: '"Mona Sans", sans-serif', color: accent }}
              >
                {skill.name} Details
              </span>
              <span
                className="text-[0.55rem] font-bold tracking-widest uppercase opacity-60"
                style={{ color: accent }}
              >
                Close ✕
              </span>
            </div>

            {/* Description — Scrollable if too long */}
            <p
              className="text-[0.75rem] leading-relaxed flex-1 overflow-y-auto pr-2 custom-scrollbar"
              style={{
                fontFamily: '"Mona Sans", sans-serif',
                color: 'var(--text-primary)',
              }}
            >
              {skill.desc}
            </p>

            {/* Back footer */}
            <div className="pt-3 mt-2 border-t flex items-center justify-between" style={{ borderColor: `${accent}20` }}>
              <span className="text-[0.65rem] font-black uppercase tracking-wider" style={{ color: accent }}>
                Proficiency
              </span>
              <ProfSegments level={skill.level} accent={accent} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Category block ────────────────────────────────────────────────────────────
function CategoryBlock({ category, catIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: catIndex * 0.04, duration: 0.5, ease }}
    >
      {/* Category header — clean card style */}
      <div
        className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 px-4 md:px-5 py-4 md:py-5 rounded-2xl border"
        style={{
          background: `${category.accent}08`,
          borderColor: `${category.accent}28`,
          boxShadow: `0 0 0 1px ${category.accent}0c`,
        }}
      >
        <div
          className="w-[3px] h-10 rounded-full flex-shrink-0 hidden sm:block"
          style={{
            background: `linear-gradient(to bottom, ${category.accent}, ${category.accent}25)`,
            boxShadow: `0 0 12px ${category.accent}60`,
          }}
        />
        <div
          className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-xl border"
          style={{
            background: `${category.accent}14`,
            borderColor: `${category.accent}30`,
            color: category.accent,
          }}
        >
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h3
              className="font-black text-[1rem] md:text-[1.05rem]"
              style={{
                fontFamily: '"Mona Sans", sans-serif',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {category.label}
            </h3>
            <span
              className="text-[0.6rem] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0"
              style={{
                fontFamily: '"Mona Sans", sans-serif',
                background: `${category.accent}12`,
                borderColor: `${category.accent}30`,
                color: category.accent,
              }}
            >
              {category.skills.length} skills
            </span>
          </div>
          <p
            className="text-[0.72rem] leading-relaxed"
            style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
          >
            {category.summary}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {category.skills.map((skill, i) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            accent={category.accent}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────
export default function SkillCategories() {
  const { theme } = useTheme()
  const { skills: apiSkills } = useSiteData()
  const skillCategories = apiSkills?.length > 0 ? apiSkills : defaultSkillCategories
  const isDark    = theme === 'dark'
  const accent    = isDark ? '#52aeff' : '#d4200c'
  const total     = skillCategories.reduce((a, c) => a + c.skills.length, 0)

  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-2.5 mb-3">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accent }}
            />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
            >
              Capabilities
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2
                className="font-black tracking-tight mb-1.5"
                style={{
                  fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
                  color: 'var(--text-primary)',
                  fontFamily: '"Mona Sans", sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                What I work with
              </h2>
              <p
                className="text-[0.85rem] leading-relaxed"
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: '"Mona Sans", sans-serif',
                  maxWidth: '400px',
                }}
              >
                {total} skills across {skillCategories.length} domains — every one used on a shipped project.{' '}
                <span style={{ color: accent }}>Tap any card</span> to flip it and read the real story.
              </p>
            </div>

            {/* Legend — matches tag pill style */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border w-fit flex-shrink-0"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: `0 0 0 1px ${accent}10`,
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0"
                style={{
                  background: `${accent}10`,
                  borderColor: `${accent}25`,
                  color: accent,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                }}
              >
                ↺
              </div>
              <div>
                <p
                  className="text-[0.65rem] font-bold mb-0.5"
                  style={{ color: 'var(--text-primary)', fontFamily: '"Mona Sans", sans-serif' }}
                >
                  Interactive cards
                </p>
                <p
                  className="text-[0.6rem]"
                  style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
                >
                  Front: level · Back: my story
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category blocks */}
        <div className="flex flex-col gap-14 md:gap-20">
          {skillCategories.map((cat, i) => (
            <CategoryBlock key={cat.id} category={cat} catIndex={i} />
          ))}
        </div>

      </div>
    </section>
  )
}