import React from 'react'

const ProcessStepCard = ({ step, isDark }) => {
  return (
    <div
      className='relative w-full'
      style={{
        maxWidth: 'clamp(280px, 30vw, 400px)',
        filter: `drop-shadow(0 8px 32px ${step.color}22) drop-shadow(0 2px 8px rgba(0,0,0,0.4))`,
        transition: 'filter 0.3s ease',
      }}
    >
      {/* ── TOP ACCENT BAR — thicker, double-layered glow ── */}
      <div style={{ position: 'relative', width: '100%', height: '4px' }}>
        {/* Base glow bloom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to right, transparent, ${step.color}, transparent)`,
          filter: `blur(4px)`,
          opacity: 0.6,
        }} />
        {/* Sharp top line */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to right, transparent 5%, ${step.color} 40%, ${step.color} 60%, transparent 95%)`,
          borderRadius: '2px 2px 0 0',
        }} />
      </div>

      {/* ── CARD BODY ── */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.72) 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(210,220,255,0.85) 100%)',
          border: `1px solid ${isDark ? step.color + '20' : step.color + '35'}`,
          borderTop: 'none',
          borderRadius: '0 0 20px 20px',
          padding: 'clamp(1.4rem, 2.5vw, 2.2rem)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >

        {/* ── BACKGROUND CORNER GLOW — subtle depth ── */}
        <div style={{
          position: 'absolute',
          top: '-40px', right: '-40px',
          width: '140px', height: '140px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${step.color}14 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* ── PHASE LABEL + STAT ROW ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <p style={{
            fontSize: '9px',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: step.color,
            margin: 0,
            opacity: 0.95,
          }}>
            {step.phase}
          </p>

          {/* Stat pill — top right corner */}
          <div style={{
            padding: '3px 10px',
            borderRadius: '20px',
            background: `${step.color}15`,
            border: `1px solid ${step.color}30`,
          }}>
            <span style={{
              fontSize: '8.5px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: step.color,
              textTransform: 'uppercase',
            }}>
              {step.stat}
            </span>
          </div>
        </div>

        {/* ── TITLE ── */}
        <h3 style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
          fontWeight: 800,
          color: isDark ? '#ffffff' : '#08081a',
          lineHeight: 1.25,
          margin: '0 0 0.75rem 0',
          letterSpacing: '-0.01em',
        }}>
          {step.title}
        </h3>

        {/* ── ACCENT DIVIDER — animated gradient ── */}
        <div style={{
          width: '100%',
          height: '1px',
          background: isDark
            ? `linear-gradient(to right, ${step.color}60, ${step.color}10, transparent)`
            : `linear-gradient(to right, ${step.color}80, ${step.color}20, transparent)`,
          marginBottom: '0.9rem',
        }} />

        {/* ── DESCRIPTION ── */}
        <p style={{
          color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(8,8,26,0.58)',
          fontSize: 'clamp(0.75rem, 1.1vw, 0.84rem)',
          lineHeight: 1.7,
          margin: 0,
          fontWeight: 400,
        }}>
          {step.description}
        </p>

        {/* ── BOTTOM ROW — step indicator dots ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          marginTop: '1.2rem',
        }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{
              width: i === step.id - 1 ? '18px' : '5px',
              height: '4px',
              borderRadius: '2px',
              background: i === step.id - 1
                ? step.color
                : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
              transition: 'width 0.3s ease',
              boxShadow: i === step.id - 1 ? `0 0 6px ${step.color}` : 'none',
            }} />
          ))}
        </div>

        {/* ── MISSION COMPLETE BADGE — last card only ── */}
        {step.isLast && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.2rem',
            padding: '0.45rem 1rem',
            borderRadius: '12px',
            border: `1px solid ${step.color}50`,
            background: `${step.color}15`,
            boxShadow: `0 0 16px ${step.color}20`,
          }}>
            <div style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: step.color,
              boxShadow: `0 0 10px ${step.color}, 0 0 4px ${step.color}`,
              animation: 'pulse 2s infinite',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: step.color,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Mission Complete
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProcessStepCard
