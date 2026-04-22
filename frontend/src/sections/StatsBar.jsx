import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { counterItems as defaultCounterItems } from '../constants/index'
import { useTheme } from '../context/ThemeContext'
import { useSiteData } from '../context/SiteDataContext'

gsap.registerPlugin(ScrollTrigger)

const StatsBar = () => {
  const sectionRef  = useRef()
  const countersRef = useRef([])
  const { theme }   = useTheme()
  const { config }  = useSiteData()
  const counterItems = config?.counterItems?.length > 0 ? config.counterItems : defaultCounterItems
  const isDark      = theme === 'dark'

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Fade + slide up entire bar on scroll into view
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        }
      })

      // Count up each number
      countersRef.current.forEach((el, i) => {
        if (!el) return
        const item = counterItems[i]
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: item.value,
            duration: 2,
            ease: 'power2.out',
            delay: i * 0.15,
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
            },
            onUpdate: function () {
              el.innerText = Math.floor(this.targets()[0].innerText) + item.suffix
            }
          }
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, []) // ← intentionally empty — counters should only fire once on scroll

  return (
    <section
      ref={sectionRef}
      className='w-full py-16 px-5 xl:px-20 relative'
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >

      {/* ── Top glow line — accent color per theme ─────────────────────── */}
      <div
        className='w-full h-px mb-16 opacity-50'
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent, #52aeff, transparent)'
            : 'linear-gradient(90deg, transparent, #d4200c, transparent)',
        }}
      />

      <div className='grid grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-0'>
        {counterItems.map((item, i) => (
          <div
            key={i}
            className='flex flex-col items-center xl:items-start gap-2 xl:px-10 relative group'
          >

            {/* ── Vertical separator between desktop items ─────────────── */}
            {i !== 0 && (
              <div
                className='hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px opacity-20'
                style={{
                  background: isDark
                    ? 'linear-gradient(180deg, transparent, #d9ecff, transparent)'
                    : 'linear-gradient(180deg, transparent, #1a1a3e, transparent)',
                }}
              />
            )}

            {/* ── Number — glows on hover ───────────────────────────────── */}
            <span
              ref={el => countersRef.current[i] = el}
              className='text-5xl xl:text-6xl font-bold transition-all duration-300'
              style={{
                color: 'var(--text-primary)',
                // Subtle accent glow appears on hover via inline style on parent
                textShadow: isDark
                  ? '0 0 30px rgba(82,174,255,0)'
                  : '0 0 30px rgba(212,32,12,0)',
              }}
            >
              0{item.suffix}
            </span>

            {/* ── Label ────────────────────────────────────────────────── */}
            <p
              className='text-sm xl:text-base tracking-widest uppercase text-center xl:text-left'
              style={{ color: 'var(--text-muted)' }}
            >
              {item.label}
            </p>

            {/* ── Accent dot indicator under each stat ─────────────────── */}
            <span
              className='w-6 h-0.5 rounded-full mt-1 transition-all duration-500 group-hover:w-10'
              style={{ backgroundColor: 'var(--accent-primary)' }}
            />

          </div>
        ))}
      </div>

      {/* ── Bottom glow line ─────────────────────────────────────────────── */}
      <div
        className='w-full h-px mt-16 opacity-50'
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent, #52aeff, transparent)'
            : 'linear-gradient(90deg, transparent, #d4200c, transparent)',
        }}
      />

    </section>
  )
}

export default StatsBar
