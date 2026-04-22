import { useState, useEffect } from 'react'

import WorkHero       from '../sections/work/WorkHero'
import FilterBar      from '../components/work/FilterBar'
import FeaturedProject from '../components/work/FeaturedProject'
import ProjectGrid    from '../components/work/ProjectGrid'
import { projects as defaultProjects } from '../components/work/projectsData'
import { trackEvent } from '../services/api'
import { useSiteData } from '../context/SiteDataContext'

export default function Work() {
  const [activeFilter, setActiveFilter] = useState('All')
  const { projects: apiProjects } = useSiteData()
  const projects = apiProjects?.length > 0 ? apiProjects : defaultProjects

  useEffect(() => { try { trackEvent('work', 'pageview', {}) } catch {} }, [])

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <WorkHero />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} projects={projects} />

      {/* Only show featured spotlight when on "All" — not inside a filtered view */}
      {activeFilter === 'All' && (
        <FeaturedProject />
      )}

      <ProjectGrid projects={filteredProjects} />
    </main>
  )
}