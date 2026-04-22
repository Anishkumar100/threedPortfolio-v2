// src/pages/Skills.jsx
import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Preload } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import ComputerModel from '../components/skills/ComputerModel'
import SkillCategories from '../sections/skills/SkillCategories'
import SoftSkills from '../sections/skills/SoftSkills'
import { heroStats as defaultHeroStats } from '../constants/skills'
import { useTheme } from '../context/ThemeContext'
import { useSiteData } from '../context/SiteDataContext'
import { trackEvent } from '../services/api'

const ease = [0.16, 1, 0.3, 1]
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
})

// ─── 3D Canvas ─────────────────────────────────────────────────────────────────
function SkillsCanvas({ isHovered, setIsHovered, themeAccent }) {
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height: 'clamp(300px, 42vw, 500px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 75% 65% at 50% 55%, ${themeAccent}0c, transparent 70%)` }}
      />
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[-3, 4, 2]} intensity={1.8} color="#7eb8ff" castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[3, 1, -3]} intensity={0.8} color="#a78bfa" />
          <pointLight position={[0, -2, 1]} intensity={0.3} color="#1a1a2e" />
          <ComputerModel isHovered={isHovered} />
          <ContactShadows position={[0, -0.68, 0]} opacity={0.35} scale={5} blur={2.5} far={1} color={themeAccent} />
          <Environment preset="night" />
          <OrbitControls
            enableZoom={false} enablePan={false}
            minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.05}
            minAzimuthAngle={-Math.PI / 6} maxAzimuthAngle={Math.PI / 6}
            dampingFactor={0.06} enableDamping
          />
          <Preload all />
        </Suspense>
      </Canvas>
      <p
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[0.54rem] tracking-[0.18em] uppercase pointer-events-none whitespace-nowrap"
        style={{ color: 'var(--text-muted)', opacity: 0.4, fontFamily: '"Mona Sans", sans-serif' }}
      >
        drag to rotate
      </p>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Skills() {
  const { theme }                     = useTheme()
  const { config }                    = useSiteData()
  const heroStats = config?.heroStats?.length > 0 ? config.heroStats : defaultHeroStats
  const isDark                        = theme === 'dark'
  const themeAccent                   = isDark ? '#52aeff' : '#d4200c'
  const [isHovered, setIsHovered]     = useState(false)

  useEffect(() => { try { trackEvent('skills', 'pageview', {}) } catch {} }, [])

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: '62px', borderBottom: '1px solid var(--border-color)' }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--border-color) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-color) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial accent glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 55% 55% at 70% 55%, ${themeAccent}09, transparent 68%)` }}
        />

        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* LEFT — text */}
            <div className="pt-12 pb-10 lg:pb-14">
              <motion.div {...fadeUp(0)} className="mb-5">
                <span
                  className="text-[0.6rem] tracking-[0.22em] uppercase font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: `${themeAccent}10`,
                    border: `1px solid ${themeAccent}30`,
                    color: themeAccent,
                    fontFamily: '"Mona Sans", sans-serif',
                  }}
                >
                  Tech Arsenal
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.07)}
                className="font-black leading-[1.05] mb-4"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                  color: 'var(--text-primary)',
                  fontFamily: '"Mona Sans", sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                Built with the<br />
                <span style={{ color: themeAccent }}>right tools.</span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.12)}
                className="text-[0.88rem] leading-[1.85] mb-8 max-w-[420px]"
                style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
              >
                Every skill here was earned on a real shipped project — not a tutorial.
                Full-stack, AI-powered, and increasingly 3D.
              </motion.p>

              {/* Stats */}
              <motion.div {...fadeUp(0.17)} className="flex flex-wrap gap-8">
                {heroStats.map(({ value, label }) => (
                  <div key={label}>
                    <p
                      className="font-black leading-none mb-1"
                      style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        letterSpacing: '-0.02em',
                        color: themeAccent,
                        fontFamily: '"Mona Sans", sans-serif',
                      }}
                    >
                      {value}
                    </p>
                    <p
                      className="text-[0.62rem] tracking-[0.14em] uppercase"
                      style={{ color: 'var(--text-muted)', fontFamily: '"Mona Sans", sans-serif' }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — 3D */}
            <motion.div {...fadeUp(0.1)}>
              <SkillsCanvas
                isHovered={isHovered}
                setIsHovered={setIsHovered}
                themeAccent={themeAccent}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ SKILL CATEGORIES ══════════════════════════════════════════════════ */}
      <SkillCategories />

      {/* ══ SOFT SKILLS ═══════════════════════════════════════════════════════ */}
      <SoftSkills />

    </main>
  )
}