import { useEffect } from 'react'
import AboutHero from '../sections/about/AboutHero'
import AboutExperience from '../sections/about/AboutExperience'
import AboutEducationLeadership from '../sections/about/AboutEducationLeadership'
import AboutCTA from '../sections/about/AboutCTA'
import AboutHobbies from '../sections/about/AboutHobbies'
import { trackEvent } from '../services/api'

export default function About() {
  useEffect(() => { try { trackEvent('about', 'pageview', {}) } catch {} }, [])

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <AboutHero />
      <AboutExperience />
      <AboutEducationLeadership />
      <AboutHobbies />
      <AboutCTA />
    </main>
  )
}
