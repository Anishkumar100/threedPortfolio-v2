import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { SiteDataProvider } from './context/SiteDataContext'

import PageTransition from './components/shared/PageTransition'
import MaintenanceMode from './components/shared/MaintenanceMode'
import useMaintenanceCheck from './hooks/useMaintenanceCheck'
import Navbar from './components/shared/Navbar'
import Home from './pages/Home'
import Work from './pages/Work'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import Footer from './components/shared/Footer'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Services from './pages/Services'

// Admin
import AdminLayout from './admin/AdminLayout'
import AdminGuard from './admin/components/AdminGuard'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import { AdminProjects, AdminServices, AdminExperience, AdminEducation, AdminLeadership, AdminTestimonials, AdminMessages, AdminInquiries } from './admin/pages/AdminEntities'
import AdminSkillsPage from './admin/pages/AdminSkillsPage'
import AdminProfile from './admin/pages/AdminProfile'
import AdminSiteConfig from './admin/pages/AdminSiteConfig'
import AdminMaintenance from './admin/pages/AdminMaintenance'
import AdminAnalytics from './admin/pages/AdminAnalytics'


function MaintenanceModeWrapper({ children }) {
  const { isMaintenanceMode, maintenanceMessage, estimatedEnd, loading } = useMaintenanceCheck()
  if (loading) return children
  if (isMaintenanceMode) {
    return <MaintenanceMode message={maintenanceMessage} estimatedEnd={estimatedEnd} />
  }
  return children
}

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/work" element={<PageTransition><Work /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/skills" element={<PageTransition><Skills /></PageTransition>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/work/:projectId" element={<ProjectDetail />} />
      </Routes>
    </AnimatePresence>
  )
}

function PublicSite() {
  return (
    <SiteDataProvider>
      <MaintenanceModeWrapper>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </MaintenanceModeWrapper>
    </SiteDataProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin routes — outside MaintenanceModeWrapper, no Navbar/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminGuard><AdminRoutes /></AdminGuard>} />

            {/* Public routes — with Navbar, Footer, MaintenanceWrapper */}
            <Route path="/*" element={<PublicSite />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  )
}

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="education" element={<AdminEducation />} />
        <Route path="leadership" element={<AdminLeadership />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="config" element={<AdminSiteConfig />} />
        <Route path="maintenance" element={<AdminMaintenance />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  )
}
