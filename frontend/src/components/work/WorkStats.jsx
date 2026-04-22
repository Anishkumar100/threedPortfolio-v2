import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 11, label: 'Projects Shipped', suffix: '+' },
  { value: 15, label: 'Technologies Used', suffix: '+' },
  { value: 3,  label: 'Years Building',    suffix: '' },
]

// Lightweight CountUp — no external lib needed
function useCountUp(target, isVisible, duration = 1800) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return
    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out: progress^0.4 feels snappy but not instant
      setCount(Math.floor(Math.pow(progress, 0.4) * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isVisible, target, duration])

  return count
}

function StatItem({ stat, isVisible, index }) {
  const count = useCountUp(stat.value, isVisible)
  const isLast = index === STATS.length - 1

  return (
    <div
      style={{
        flex: 1,
        textAlign: 'center',
        padding: '2rem 1rem',
        borderRight: isLast ? 'none' : '1px solid var(--border-color)',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          color: 'var(--accent-primary)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          marginBottom: '0.5rem',
        }}
      >
        {count}{stat.suffix}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.04em' }}>
        {stat.label}
      </div>
    </div>
  )
}

export default function WorkStats() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  // Trigger CountUp when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {STATS.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} isVisible={isVisible} index={i} />
      ))}
    </div>
  )
}