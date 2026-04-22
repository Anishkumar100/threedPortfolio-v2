import { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'

const Button = ({ text, className, id }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const btnRef = useRef(null)

  // ── Magnetic hover effect ──────────────────────────────────────────────────
  // On mouse move, the button subtly follows the cursor — feels alive and premium
  const handleMouseMove = (e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width  / 2
    const y = e.clientY - rect.top  - rect.height / 2
    // Limit magnetic pull to ±8px so it's subtle, not jarring
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`
  }

  const handleMouseLeave = () => {
    if (btnRef.current)
      btnRef.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <Link
      id={id}
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${className ?? ''} group relative inline-flex cursor-pointer select-none`}
      style={{ transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      {/* ── Outer glow ring — pulses on hover ─────────────────────────────── */}
      <span
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse, rgba(82,174,255,0.35) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(212,32,12,0.25) 0%, transparent 70%)',
          zIndex: -1,
        }}
      />

      {/* ── Main button shell ─────────────────────────────────────────────── */}
      <div
        className="relative flex items-center gap-5 pl-6 pr-2 py-2 rounded-2xl overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #e8edf7 0%, #dce4f5 50%, #c8d4ee 100%)',
          border: `1px solid ${isDark ? 'rgba(82,174,255,0.25)' : 'rgba(212,32,12,0.2)'}`,
          boxShadow: isDark
            ? '0 0 0 0 rgba(82,174,255,0), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 0 0 0 rgba(212,32,12,0), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        {/* ── Shimmer sweep on hover ──────────────────────────────────────── */}
        {/* A white diagonal light ray sweeps left→right on hover */}
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
            zIndex: 1,
          }}
        />

        {/* ── Text ───────────────────────────────────────────────────────── */}
        <span
          className="relative z-10 uppercase font-bold tracking-[0.2em] text-sm transition-all duration-300 group-hover:tracking-[0.25em]"
          style={{
            color: isDark ? '#d9ecff' : '#0a0a1a',
            textShadow: isDark ? '0 0 20px rgba(82,174,255,0.4)' : 'none',
          }}
        >
          {text}
        </span>

        {/* ── Arrow pill ─────────────────────────────────────────────────── */}
        {/* The pill has its own background that shifts on hover */}
        <span
          className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden transition-all duration-500 group-hover:w-12"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #52aeff, #6d45ce)'
              : 'linear-gradient(135deg, #d4200c, #f5c518)',
            boxShadow: isDark
              ? '0 4px 15px rgba(82,174,255,0.5)'
              : '0 4px 15px rgba(212,32,12,0.4)',
          }}
        >
          {/* Arrow rotates 90° on hover — points right by default */}
          <img
            src="/images/arrow-down.svg"
            alt="arrow"
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
            style={{
              transform: 'rotate(-90deg)',
              filter: 'brightness(0) invert(1)', // always white arrow on gradient bg
            }}
          />
        </span>
      </div>
    </Link>
  )
}

export default Button
