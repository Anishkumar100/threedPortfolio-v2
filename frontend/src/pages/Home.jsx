import Hero             from '../sections/Hero'
import StatsBar         from '../sections/StatsBar'
import FeaturedProjects from '../sections/FeaturedProjects'
import TechStack        from '../sections/TechStack'
import ProjectProcess   from '../components/Home/process/ProjectProcess'
import AboutSnapshot    from '../sections/AboutSnapshot'
import Testimonials     from '../sections/Testimonials'
import ContactCTA       from '../sections/ContactCTA'
import { useEffect } from 'react'
import { trackEvent } from '../services/api'

// isolation: isolate confines each section's internal stacking context.
// Without it, sections using transform/opacity/filter create child stacking
// contexts that can escape to the root and paint above the sticky process
// section's z-index:9999 — causing bleed-through.
const Isolated = ({ children }) => (
  <div style={{ position: 'relative', isolation: 'isolate' }}>
    {children}
  </div>
)

export default function Home() {
  useEffect(() => { try { trackEvent('home', 'pageview', {}) } catch {} }, [])

  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProjects />
      <Isolated><TechStack /></Isolated>

      <ProjectProcess>
        <Isolated><AboutSnapshot /></Isolated>
        <Isolated><Testimonials /></Isolated>
        <Isolated><ContactCTA /></Isolated>
      </ProjectProcess>
    </>
  )
}