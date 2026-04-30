import React, { useRef } from 'react'
import { words as defaultWords } from '../constants/index'
import Button from '../components/Button'
import { useSiteData } from '../context/SiteDataContext'
import HeroExperience from '../components/Home/HeroModels/HeroExperience'
import GothamParticles from '../components/Home/HeroModels/GothamParticles'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Hero = () => {
  const heroRef = useRef()
  const { theme } = useTheme()
  const { config } = useSiteData()
  const words = config?.words?.length > 0 ? config.words : defaultWords
  const navigate = useNavigate()

  return (
    <section
      id="hero"
      ref={heroRef}
      className='relative overflow-hidden min-h-screen'
      // Section background uses CSS variable — swaps instantly on toggle
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >

      {/* Background image — only show in dark mode (Gotham city bg) */}
      {/* In light mode it would clash with the bright Metropolis palette */}
      {theme === 'dark' && (
        <div className='absolute top-0 left-0 z-10'>
          <img src="/images/bg.png" alt="background" />
        </div>
      )}

      {/* Particles — GothamParticles already uses canvas so it renders fine in both themes */}
      {/* Pass theme so it can swap particle color: blue in dark, gold in light */}
      <GothamParticles count={100} containerRef={heroRef} theme={theme} />

      <div className='relative z-10 flex flex-col xl:flex-row items-center justify-center
                      xl:items-center w-full min-h-screen xl:px-20 px-5 pt-32 xl:pt-20 gap-10 xl:gap-0'>

        <header className='flex flex-col justify-center xl:w-1/2 w-full'>
          <div className='flex flex-col gap-7'>

            {/* ── Hero Text ─────────────────────────────────────────────── */}
            <div className='hero-text' style={{ color: 'var(--text-primary)' }}>
              <h1>Shaping
                <span className='slide'>
                  <span className='wrapper'>
                    {words.map((word, index) => (
                      <span key={index} className='flex items-center md:gap-3 gap-1 pb-2'>
                        <img
                          src={word.imgPath}
                          alt={word.text}
                          className='xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full'
                          // Badge bg swaps: dark = white-tinted, light = accent-tinted
                          style={{ backgroundColor: 'var(--bg-card-hover)' }}
                        />
                        <span style={{ color: 'var(--text-primary)' }}>
                          {word.text}
                        </span>
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <h1>into Real Projects</h1>
              <h1>that Deliver Results</h1>
            </div>

            {/* ── Subtext ───────────────────────────────────────────────── */}
            <p className='md:text-xl relative z-10 pointer-events-none'
              style={{ color: 'var(--text-muted)' }}>
              Hi, I'm Anish, A Developer based In India, with a passion
              for code and real time solutions
            </p>

            {/* ── CTA Button ────────────────────────────────────────────── */}
            {/* Added relative, a higher z-index, and pointer-events-auto */}
            {/* We keep the Link, add the z-index fix here, and make it inline so it wraps tightly */}
            
              <Button
                id="button"
                // We add the z-index and pointer-events directly to the button's classes
                className="relative z-[100] pointer-events-auto md:w-80 md:h-16 w-60 h-12"
                text="See My Work"
                // We use the navigate hook to change the page when clicked
                onClick={() => navigate('/work')}
              />
            
          </div>
        </header>

        {/* ── 3D Model Canvas ───────────────────────────────────────────── */}
        <figure className='xl:w-1/2 w-full xl:h-screen h-[50vh] relative'>
          <HeroExperience />
        </figure>

      </div>
    </section>
  )
}

export default Hero
