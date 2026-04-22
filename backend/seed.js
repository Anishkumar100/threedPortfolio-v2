import 'dotenv/config';
import mongoose from 'mongoose';
import Service from './models/Service.js';
import Project from './models/Project.js';
import SkillCategory from './models/SkillCategory.js';
import Experience from './models/Experience.js';
import Education from './models/Education.js';
import Leadership from './models/Leadership.js';
import Testimonial from './models/Testimonial.js';
import Profile from './models/Profile.js';
import SiteConfig from './models/SiteConfig.js';

// ─── Placeholder helper ─────────────────────────────────────────────────────
// All image URLs are remote placeholders. Admin replaces them with Cloudinary
// links from the admin panel. ZERO local /images/ paths.
const ph = (w, h, label) => `https://placehold.co/${w}x${h}/1a1a2e/52aeff?text=${encodeURIComponent(label)}`;

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════════════
const services = [
  {
    title: 'Full Stack Web App Development', description: 'End-to-end web application development — from database design and API architecture to polished frontend interfaces.', shortDescription: 'Complete web applications from database to deployment, built for scale.', category: 'Web Development', hourlyRate: 45, currency: 'USD', minHours: 40, maxHours: 400,
    deliverables: ['Production-ready web application', 'REST or GraphQL API', 'Database schema & migrations', 'CI/CD pipeline configuration', 'Technical documentation'],
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'Docker'], isActive: true, isFeatured: true, estimatedTimeline: '6-12 weeks', icon: 'layers', order: 1, tags: ['full-stack', 'web-app', 'saas', 'mvp', 'startup'],
  },
  {
    title: 'Frontend React / Next.js Development', description: 'Pixel-perfect, responsive frontend development with React and Next.js.', shortDescription: 'Blazing-fast, beautifully crafted React & Next.js interfaces.', category: 'Web Development', hourlyRate: 35, currency: 'USD', minHours: 20, maxHours: 200,
    deliverables: ['Responsive React/Next.js application', 'Component library with Storybook', 'Performance optimization report', 'Accessibility audit (WCAG 2.1)'],
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP'], isActive: true, isFeatured: true, estimatedTimeline: '3-8 weeks', icon: 'monitor', order: 2, tags: ['frontend', 'react', 'nextjs', 'ui', 'responsive'],
  },
  {
    title: '3D & Interactive Web Experiences', description: 'Immersive 3D web experiences using Three.js, React Three Fiber, and WebGL.', shortDescription: 'Immersive Three.js & WebGL experiences that captivate users.', category: '3D & Interactive', hourlyRate: 55, currency: 'USD', minHours: 30, maxHours: 300,
    deliverables: ['Interactive 3D web experience', 'Optimized GLTF/GLB models', 'Custom shader programs', 'Progressive loading system', 'Cross-device performance testing'],
    techStack: ['Three.js', 'React Three Fiber', 'GLSL', 'Blender', 'WebGL', 'Drei'], isActive: true, isFeatured: true, estimatedTimeline: '4-10 weeks', icon: 'box', order: 3, tags: ['3d', 'threejs', 'webgl', 'interactive', 'creative'],
  },
  {
    title: 'Backend API Development', description: 'Robust, secure, and well-documented API development with Node.js.', shortDescription: 'Scalable APIs with Node.js — secure, documented, production-ready.', category: 'Backend & API', hourlyRate: 40, currency: 'USD', minHours: 20, maxHours: 250,
    deliverables: ['RESTful or GraphQL API', 'Authentication & authorization system', 'API documentation (Swagger/OpenAPI)', 'Automated test suite', 'Monitoring & logging setup'],
    techStack: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'JWT'], isActive: true, isFeatured: false, estimatedTimeline: '3-6 weeks', icon: 'server', order: 4, tags: ['backend', 'api', 'nodejs', 'rest', 'graphql'],
  },
  {
    title: 'Mobile App (React Native)', description: 'Cross-platform mobile applications with React Native and Expo.', shortDescription: 'Cross-platform mobile apps with React Native — iOS & Android.', category: 'Mobile Development', hourlyRate: 40, currency: 'USD', minHours: 40, maxHours: 350,
    deliverables: ['React Native mobile application', 'iOS & Android builds', 'App Store / Play Store submission', 'Push notification integration', 'Analytics dashboard setup'],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'Redux', 'React Navigation'], isActive: true, isFeatured: false, estimatedTimeline: '6-14 weeks', icon: 'smartphone', order: 5, tags: ['mobile', 'react-native', 'ios', 'android', 'cross-platform'],
  },
  {
    title: 'UI/UX Consulting & Design Systems', description: 'Strategic UI/UX consulting and design system development.', shortDescription: 'Design audits, systems, and UX strategy to level up your product.', category: 'Consulting', hourlyRate: 30, currency: 'USD', minHours: 10, maxHours: 80,
    deliverables: ['UX audit report with recommendations', 'Design system (tokens + components)', 'Figma component library', 'Accessibility compliance report'],
    techStack: ['Figma', 'Storybook', 'Tailwind CSS', 'Design Tokens', 'WCAG'], isActive: true, isFeatured: false, estimatedTimeline: '2-4 weeks', icon: 'palette', order: 6, tags: ['design', 'ux', 'consulting', 'design-system', 'audit'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS — placeholder images, admin uploads real ones to Cloudinary
// ═══════════════════════════════════════════════════════════════════════════════
const projects = [
  { projectId: '5f1687dc', title: 'TemplateZone', subtitle: 'Digital Template Marketplace', description: 'Full-stack e-commerce platform for buying and selling premium digital templates. Built with Next.js, Node.js, MongoDB, Clerk auth, and ImageKit media delivery.', longDescription: 'TemplateZone started as a challenge: could I build a fully functional digital marketplace solo, from auth to checkout, in a production-ready way? The answer became this platform.', features: ['Full buyer/seller marketplace with role-based access', 'Clerk authentication — Google, GitHub, and email flows', 'ImageKit CDN for optimised template previews and delivery', 'Stripe-ready checkout architecture', 'Admin dashboard for template moderation and analytics', 'Download tracking and purchase history per user'], role: 'Solo Full-Stack Developer', imageUrl: ph(1200, 675, 'TemplateZone'), screenshots: [], projectUrl: 'https://templatezone.vercel.app/', githubLink: 'https://github.com', tags: ['Next.js', 'Node.js', 'MongoDB', 'Clerk', 'Tailwind'], category: 'Full Stack', year: 2026, featured: true, order: 1 },
  { projectId: '58e4ed1e', title: 'AniVoice AI', subtitle: 'AI SaaS Voice Chat Platform', description: 'Full-stack SaaS app for conversing with AI characters via text and voice.', longDescription: 'AniVoice AI was built to explore one question: what does a real conversational AI product feel like to ship?', features: ['Multiple AI character personas', 'Token-by-token streaming responses', 'Voice output via Web Speech API', 'Persistent conversation memory', 'Cloudinary for avatar management', 'Subscription tier scaffold'], role: 'Solo Full-Stack Developer', imageUrl: ph(1200, 675, 'AniVoice+AI'), screenshots: [], projectUrl: 'https://anivoice-ai-v1.vercel.app/', githubLink: 'https://github.com', tags: ['Next.js', 'HuggingFace', 'Express', 'MongoDB', 'Shadcn'], category: 'Full Stack', year: 2026, featured: true, order: 2 },
  { projectId: '52a62213', title: 'AniResume', subtitle: 'AI-Powered Resume Builder', description: 'MERN app with AI extraction, live editor, and ATS-friendly templates.', longDescription: 'AniResume solves a real pain point: most resume builders either look generic or require you to start from scratch.', features: ['PDF upload with AI-powered content extraction via Gemini', 'Live resume editor with real-time preview', 'ATS-optimised export using Puppeteer', 'Multiple resume templates', 'Full admin dashboard', 'JWT auth with refresh token rotation'], role: 'Solo Full-Stack Developer', imageUrl: ph(1200, 675, 'AniResume'), screenshots: [], projectUrl: 'https://aniresume.vercel.app/', githubLink: 'https://github.com', tags: ['React', 'Node.js', 'MongoDB', 'JWT', 'AI'], category: 'Full Stack', year: 2025, featured: true, order: 3 },
  { projectId: 'f1d254a9', title: 'AniCrypto', subtitle: 'Real-Time Crypto Dashboard', description: 'Live cryptocurrency prices, charts, and market news.', longDescription: 'AniCrypto was built to get comfortable with real-time data pipelines and API rate limiting in a React SPA.', features: ['Live prices for top 100 cryptocurrencies', 'Interactive 7-day and 30-day charts', 'Client-side caching reducing API calls by ~70%', 'Per-coin news feed', 'Search and sort', 'Fully responsive layout'], role: 'Solo Frontend Developer', imageUrl: ph(1200, 675, 'AniCrypto'), screenshots: [], projectUrl: 'https://ani-crypto.vercel.app/', githubLink: 'https://github.com', tags: ['React', 'CoinGecko API', 'NewsData API'], category: 'Frontend', year: 2025, featured: false, order: 4 },
  { projectId: 'f9497ea1', title: 'Animi AI', subtitle: 'Personal AI Research Tool', description: 'Personal AI tool for research and content generation.', longDescription: 'Animi AI is my personal Gemini-powered research assistant.', features: ['Gemini API with multi-turn memory', 'Auto-generated conversation titles', 'Full markdown rendering with syntax highlighting', 'Saved conversation sidebar', 'Streaming response display', 'Clean minimal UI'], role: 'Solo Frontend Developer', imageUrl: ph(1200, 675, 'Animi+AI'), screenshots: [], projectUrl: 'https://animi-ai.vercel.app/', githubLink: 'https://github.com', tags: ['React', 'Gemini API'], category: 'Frontend', year: 2025, featured: false, order: 5 },
  { projectId: '013522fb', title: 'AniBlog', subtitle: 'AI-Powered Blog Platform', description: 'MERN blog app with AI-enhanced writing.', longDescription: 'AniBlog is a full-stack blogging platform with AI-enhanced admin writing experience.', features: ['AI writing assistant', 'Full MERN stack with JWT', 'Category filtering and tag system', 'Auto-generated table of contents', 'Post version history', 'Estimated read time'], role: 'Solo Full-Stack Developer', imageUrl: ph(1200, 675, 'AniBlog'), screenshots: [], projectUrl: 'https://aniblog-v1.vercel.app/', githubLink: 'https://github.com', tags: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'AI'], category: 'Full Stack', year: 2025, featured: false, order: 6 },
  { projectId: 'cbd3e65e', title: 'AI Notes App', subtitle: 'Faculty Tool — MERN + AI', description: 'Full-stack AI-powered notes sharing app for a college faculty member.', longDescription: 'First real client project — built for a college faculty member who needed a simple way to share structured notes.', features: ['Faculty admin panel', 'AI-assisted note formatting', 'Student-facing read-only view', 'Subject and topic filtering', 'PDF export', 'Mobile-first responsive design'], role: 'Solo Full-Stack Developer (Client Project)', imageUrl: ph(1200, 675, 'AI+Notes'), screenshots: [], projectUrl: 'https://sarmila-mam.vercel.app/', githubLink: 'https://github.com', tags: ['React', 'Node.js', 'MongoDB', 'AI'], category: 'Full Stack', year: 2025, featured: false, order: 7 },
  { projectId: 'cedf7682', title: 'Aniflix V2', subtitle: 'Movie Info App', description: 'React app for browsing movies and actors with TMDB API.', longDescription: 'Aniflix V2 was a ground-up rebuild of my first movie app.', features: ['TMDB API integration', 'Detail pages with cast and trailers', 'Custom useFetch hook', 'Prop-normalised card component', 'Fully responsive navigation', 'Debounced search'], role: 'Solo Frontend Developer', imageUrl: ph(1200, 675, 'Aniflix+V2'), screenshots: [], projectUrl: 'https://aniflix-version2.vercel.app/', githubLink: 'https://github.com', tags: ['React', 'TMDB API'], category: 'Frontend', year: 2025, featured: false, order: 8 },
  { projectId: '963b46e9', title: 'Aniflix V1', subtitle: '3D Movie Display Site', description: 'First 3D-powered responsive site. Vanilla HTML, CSS, JS.', longDescription: 'Aniflix V1 was my first attempt at building something visually impressive.', features: ['CSS 3D card flip effect', 'Vanilla JS DOM manipulation', 'Responsive grid layout', 'Movie and series categorisation', 'Custom scrollbar and hover design', 'Zero dependencies'], role: 'Solo Frontend Developer', imageUrl: ph(1200, 675, 'Aniflix+V1'), screenshots: [], projectUrl: 'https://aniflix-v1.vercel.app/', githubLink: 'https://github.com', tags: ['HTML', 'CSS', 'JavaScript', '3D'], category: 'Frontend', year: 2025, featured: false, order: 9 },
  { projectId: '64beeb2c', title: 'Signature Pad V1', subtitle: 'Signature Practice Tool', description: 'Browser-based signature pad.', longDescription: 'A canvas-based drawing tool that lets users practice and save their handwritten signature.', features: ['HTML5 Canvas drawing engine', 'Stroke smoothing', 'Cross-device pointer support', 'One-click PNG download', 'Pen colour and width controls', 'Single-file deployment'], role: 'Solo Frontend Developer', imageUrl: ph(1200, 675, 'Signature+Pad'), screenshots: [], projectUrl: 'https://anishsignatureappv1.netlify.app/', githubLink: 'https://github.com', tags: ['HTML', 'CSS', 'JavaScript'], category: 'Frontend', year: 2025, featured: false, order: 10 },
  { projectId: '2d700c03', title: 'Portfolio V1', subtitle: 'First Portfolio Site', description: 'First fully responsive portfolio site. HTML, CSS, JS.', longDescription: 'Portfolio V1 was the project that made me take web development seriously.', features: ['Fully responsive layout', 'Smooth scroll navigation', 'CSS-only animated hero', 'Contact form with validation', 'Project showcase with hover effects', 'Zero dependencies'], role: 'Solo Frontend Developer', imageUrl: ph(1200, 675, 'Portfolio+V1'), screenshots: [], projectUrl: 'https://anishkumarversion1.netlify.app/', githubLink: 'https://github.com', tags: ['HTML', 'CSS', 'JavaScript'], category: 'Frontend', year: 2025, featured: false, order: 11 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SKILL CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════
const skillCategories = [
  { categoryId: 'frontend', label: 'Frontend & UI', accent: '#52aeff', glow: 'rgba(82,174,255,0.15)', icon: '⬡', summary: 'Cinematic interfaces, component systems, and motion-driven UX.', order: 1, skills: [
    { name: 'React', level: 5, since: 2023, desc: 'Primary framework across 8+ projects.' },
    { name: 'Next.js', level: 4, since: 2024, desc: 'App Router, server components, and ISR.' },
    { name: 'JavaScript (ES6+)', level: 5, since: 2023, desc: 'First language — async/await, closures, prototypes.' },
    { name: 'HTML5 & CSS3', level: 5, since: 2022, desc: 'Deep box model understanding.' },
    { name: 'Tailwind CSS', level: 5, since: 2023, desc: 'Go-to utility framework.' },
    { name: 'Framer Motion', level: 4, since: 2024, desc: 'AnimatePresence, layout animations, gesture-driven UX.' },
    { name: 'Shadcn UI', level: 4, since: 2024, desc: 'Accessible base components.' },
    { name: 'TypeScript', level: 4, since: 2025, desc: 'Caught three real bugs before production.' },
  ]},
  { categoryId: 'threejs', label: '3D & Creative Dev', accent: '#a78bfa', glow: 'rgba(167,139,250,0.15)', icon: '◈', summary: 'WebGL, 3D scenes, and GPU-accelerated experiences.', order: 2, skills: [
    { name: 'Three.js', level: 3, since: 2025, desc: 'Direct Three.js — scene graph, render loop, materials.' },
    { name: 'React Three Fiber', level: 3, since: 2025, desc: 'Deepest R3F project — this portfolio.' },
    { name: '@react-three/drei', level: 3, since: 2025, desc: 'Float, ContactShadows, Environment, OrbitControls.' },
    { name: 'GSAP', level: 3, since: 2025, desc: 'ScrollTrigger for scroll-linked animations.' },
    { name: 'Blender (GLB export)', level: 2, since: 2025, desc: 'Model inspection and optimised GLB export.' },
  ]},
  { categoryId: 'backend', label: 'Backend & APIs', accent: '#34d399', glow: 'rgba(52,211,153,0.15)', icon: '⬢', summary: 'Production-grade REST APIs, auth systems, and data pipelines.', order: 3, skills: [
    { name: 'Node.js', level: 5, since: 2023, desc: 'Backbone of every full-stack project.' },
    { name: 'Express.js', level: 5, since: 2023, desc: 'Custom middleware for rate limiting and JWT.' },
    { name: 'MongoDB', level: 4, since: 2023, desc: 'Document schema design across 5+ apps.' },
    { name: 'JWT Auth', level: 4, since: 2023, desc: 'Full refresh token rotation.' },
    { name: 'Clerk Auth', level: 4, since: 2024, desc: 'Role-based access across social and email flows.' },
    { name: 'REST API Design', level: 4, since: 2023, desc: 'Consistent resource naming, versioning, error contracts.' },
    { name: 'Puppeteer', level: 3, since: 2024, desc: 'Server-side ATS-clean PDF generation.' },
  ]},
  { categoryId: 'ai', label: 'AI & Integrations', accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)', icon: '◎', summary: 'LLM integrations, prompt engineering, and AI-powered features.', order: 4, skills: [
    { name: 'Gemini API', level: 4, since: 2024, desc: 'Multi-turn conversations, structured JSON extraction.' },
    { name: 'HuggingFace', level: 3, since: 2024, desc: 'Inference endpoints for AniVoice AI.' },
    { name: 'Prompt Engineering', level: 4, since: 2024, desc: 'Multi-column PDF extraction prompts with schema validation.' },
    { name: 'Streaming Responses', level: 3, since: 2024, desc: 'Token-by-token streaming to reduce perceived latency.' },
    { name: 'Web Speech API', level: 3, since: 2024, desc: 'Zero-cost TTS.' },
  ]},
  { categoryId: 'devops', label: 'DevOps & Tooling', accent: '#fb7185', glow: 'rgba(251,113,133,0.15)', icon: '⬟', summary: 'Modern build tools, deployment pipelines, and media delivery.', order: 5, skills: [
    { name: 'Git & GitHub', level: 5, since: 2023, desc: 'Branching strategies, atomic commits, and PR workflows.' },
    { name: 'Vite', level: 5, since: 2023, desc: 'Build tool for this portfolio.' },
    { name: 'Vercel', level: 5, since: 2023, desc: 'Every project deployed on Vercel.' },
    { name: 'Netlify', level: 4, since: 2023, desc: 'First deployment platform.' },
    { name: 'ImageKit CDN', level: 3, since: 2024, desc: 'Migrated from Cloudinary mid-build.' },
    { name: 'Cloudinary', level: 3, since: 2024, desc: 'Avatar management and on-the-fly transformations.' },
  ]},
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════
const experiences = [
  { experienceId: 'kairox', role: 'Full Stack Developer Intern', company: 'Kairox Pvt Ltd', type: 'Internship', period: 'Feb 2026 – Apr 2026', duration: '2 months', location: 'Remote', current: true, accent: '#52aeff', summary: 'Shipped a production-grade AI-powered React Native mobile app — sole frontend engineer.', points: ['Architected and built the entire React Native frontend', 'Wired REST APIs for live issue feeds and push notifications', 'Implemented role-based UI rendering across three personas', 'Shipped sprint deliverables under tight deadlines', 'Reduced UI bug report rate with strict component contracts'], tags: ['React Native', 'REST API', 'Mobile', 'AI', 'Role-based UI', 'Push Notifications'], impact: 'Sole frontend engineer — zero to production in 2 months', order: 1 },
  { experienceId: 'mannit', role: 'Frontend Developer Intern', company: 'Mannit Innovations', type: 'Internship', period: 'Jun 2025 – Jul 2025', duration: '15 days', location: 'Offline', current: false, accent: '#a78bfa', summary: 'Delivered a full-stack AI-powered MERN blog platform in 15 days.', points: ['Designed and shipped a full-stack blog on MERN stack in 15 days', 'Integrated Gemini API for AI-assisted content tools', 'Migrated media to ImageKit.io', 'Deployed to Vercel with CI/CD'], tags: ['MERN', 'Gemini API', 'ImageKit', 'MongoDB', 'Express', 'Vercel'], impact: 'Live production app shipped in 15 days', order: 2 },
  { experienceId: 'startmycareer', role: 'Frontend Developer Intern', company: 'StartMyCareer', type: 'Internship', period: 'Jun 2024 – Jul 2024', duration: '15 days', location: 'Offline', current: false, accent: '#34d399', summary: 'Built and deployed a fully responsive, animated portfolio website in 15 days.', points: ['Designed and developed a custom portfolio end-to-end', 'Implemented scroll interactions with pure CSS and vanilla JS', 'Deployed on Netlify with continuous deployment'], tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Netlify', 'Animations'], impact: 'Full site from design to deploy in 2 weeks', order: 3 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EDUCATION
// ═══════════════════════════════════════════════════════════════════════════════
const educationItems = [
  { educationId: 'btech', degree: 'B.Tech — Information Technology', institution: 'BSA Crescent Institute of Science & Technology', shortName: 'BSACIST', period: '2022 – Present', grade: 'CGPA 9.02', status: 'Ongoing', location: 'Chennai, Tamil Nadu', highlights: ['Specialising in MERN stack, AI/ML integration, and modern web engineering.', 'Class Representative for 4 consecutive years.', 'General Secretary — IT Trailblazer Club.', 'Co-founded Spark Solutions.', 'Maintained CGPA 9.02 while shipping 10+ projects.'], courses: ['Data Structures', 'OS', 'DBMS', 'Web Technologies', 'AI & ML', 'Cloud Computing'], order: 1 },
  { educationId: 'school', degree: 'Higher Secondary Education (Science — CS)', institution: 'Ida Scudder School', shortName: 'ISS', period: 'Completed 2022', grade: '12th — 86.6% | 10th — 82.8%', status: 'Completed', location: 'Vellore, Tamil Nadu', highlights: ['Computer Science stream — first lines of C++.', 'Strong foundation in mathematics, physics, and logical reasoning.', 'Active participant in inter-school science exhibitions.'], courses: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'], order: 2 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// LEADERSHIP
// ═══════════════════════════════════════════════════════════════════════════════
const leadershipItems = [
  { leadershipId: 'spark', title: 'Co-Founder & CFO', org: 'Spark Solutions', period: '2022 – Mar 2026', url: 'https://www.sparksolution.org/', summary: 'Co-founded a student-run tech organisation officially recognised by BSACIST.', highlights: ['Built the organisation from scratch', 'Hosted "Build Your Brand With AI" workshop — 80+ attendees', 'Managed budgets and financial planning', 'Drove cross-departmental collaboration'], badge: 'Founder', order: 1 },
  { leadershipId: 'cr', title: 'Class Representative', org: 'BSACIST — IT Department', period: '2022 – Present', url: null, summary: 'Elected CR for four consecutive years — bridge between 60+ students and faculty.', highlights: ['Facilitated transparent communication for 4 years', 'Coordinated exam schedules and academic events', 'Mediated student-faculty concerns', 'Trusted at official department meetings'], badge: '4x Elected', order: 2 },
  { leadershipId: 'club', title: 'General Secretary', org: 'IT Trailblazer Club', period: '2023 – Present', url: null, summary: 'Driving technical culture — workshops, hackathons, and deep-dives.', highlights: ['Organised MERN stack workshops for 100+ students', 'Ran internal hackathons producing 3 deployed projects', 'Curated industry trend sessions', 'Mentored 15+ junior members'], badge: 'Secretary', order: 3 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS — placeholder avatars
// ═══════════════════════════════════════════════════════════════════════════════
const testimonials = [
  { name: 'Esther Howard', mentions: '@estherhoward', review: "I can't say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.", imgPath: ph(100, 100, 'EH'), order: 1 },
  { name: 'Wade Warren', mentions: '@wadewarren', review: 'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched.', imgPath: ph(100, 100, 'WW'), order: 2 },
  { name: 'Guy Hawkins', mentions: '@guyhawkins', review: "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project.", imgPath: ph(100, 100, 'GH'), order: 3 },
  { name: 'Marvin McKinney', mentions: '@marvinmckinney', review: 'Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform.', imgPath: ph(100, 100, 'MM'), order: 4 },
  { name: 'Floyd Miles', mentions: '@floydmiles', review: "Adrian's expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site.", imgPath: ph(100, 100, 'FM'), order: 5 },
  { name: 'Albert Flores', mentions: '@albertflores', review: 'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations.', imgPath: ph(100, 100, 'AF'), order: 6 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE — placeholder avatar
// ═══════════════════════════════════════════════════════════════════════════════
const profileData = {
  name: 'Anish Kumar S', firstName: 'Anish', lastName: 'Kumar S', initials: 'AK',
  role: 'Full Stack Developer', roleAlt: 'Creative Developer · AI Integrator · 3D Web Explorer',
  tagline: "I build things that ship — full-stack, AI-powered, and increasingly 3D.",
  location: 'Chennai, Tamil Nadu, India', locationShort: 'Chennai, IN', timezone: 'IST (UTC +5:30)',
  email: 'akcoder1102004@gmail.com', phone: '+91 94889 90495',
  linkedin: 'https://www.linkedin.com', github: 'https://github.com',
  resume: 'https://placehold.co/1/1/transparent?text=.', avatar: ph(400, 400, 'Avatar'),
  available: true,
  bio: "I'm a B.Tech IT student at BSACIST, Chennai, building full-stack products since 2022. I don't wait for assignments — I ship. Every project in my portfolio started as a personal challenge.\n\nRight now I'm deep into 3D web — React Three Fiber, GSAP, and WebGL. This portfolio is proof of that direction.\n\nI'm looking for a role where I can build products that matter, alongside people who care about the craft.",
};

// ═══════════════════════════════════════════════════════════════════════════════
// SITE CONFIG — placeholder images throughout
// ═══════════════════════════════════════════════════════════════════════════════
const siteConfigData = {
  aboutStats: [
    { value: '3+', label: 'Years Coding' },
    { value: '10+', label: 'Projects Shipped' },
    { value: '9.02', label: 'CGPA' },
    { value: '1', label: 'Client Delivered' },
  ],
  heroStats: [
    { value: '3+', label: 'Years Building' },
    { value: '11', label: 'Projects Shipped' },
    { value: '30+', label: 'Technologies Used' },
  ],
  quickFacts: [
    { icon: '🎓', label: 'Degree', value: 'B.Tech IT — BSACIST' },
    { icon: '📍', label: 'Based In', value: 'Chennai, Tamil Nadu' },
    { icon: '💼', label: 'Status', value: 'Open to full-time roles' },
    { icon: '🚀', label: 'Current Stack', value: 'MERN · React Native · R3F' },
    { icon: '🤖', label: 'AI Tools', value: 'Gemini · OpenAI · LangChain' },
    { icon: '⏰', label: 'Timezone', value: 'IST (UTC +5:30)' },
    { icon: '🌐', label: 'Languages', value: 'Tamil · English' },
    { icon: '☕', label: 'Fuel', value: 'Coffee + lo-fi playlists' },
  ],
  values: [
    { icon: '⚡', title: 'Ship Fast, Learn Faster', body: 'Every project started as a question. I build the answer, deploy it, and move to the next challenge.' },
    { icon: '🎯', title: 'Real Users, Real Problems', body: 'Shipping for actual users changes how you think about every line of code.' },
    { icon: '🔬', title: 'Go Deeper Than Tutorials', body: "I deliberately seek the hard problems because that's where the real learning lives." },
    { icon: '🌐', title: 'The Web Should Feel Alive', body: 'I believe the next interface generation lives where 3D, AI, and motion intersect.' },
  ],
  hobbies: [
    { id: 'music', icon: '🎵', title: 'Music & Lo-fi Production', description: 'Lo-fi hip-hop is my default work OS.', tag: 'creative' },
    { id: '3d', icon: '🧊', title: '3D World Building', description: 'I explore Blender for fun — modeling abstract low-poly environments.', tag: 'technical' },
    { id: 'chess', icon: '♟️', title: 'Chess', description: 'Chess teaches the same thing good engineering does.', tag: 'intellectual' },
    { id: 'films', icon: '🎬', title: 'Cinematography & Films', description: 'I study films for their visual language.', tag: 'creative' },
    { id: 'oss', icon: '🐙', title: 'Open Source Exploring', description: 'I regularly crawl GitHub trending to study elite codebases.', tag: 'technical' },
    { id: 'fitness', icon: '🏃', title: 'Running & Fitness', description: 'Early morning runs are non-negotiable.', tag: 'physical' },
    { id: 'writing', icon: '✍️', title: 'Technical Writing', description: 'Writing forces me to actually understand what I built.', tag: 'intellectual' },
    { id: 'gaming', icon: '🎮', title: 'Game Design Appreciation', description: 'I dissect game UI/UX the way designers dissect websites.', tag: 'creative' },
  ],
  achievements: [
    { id: 'cgpa', title: 'Top Academic Performer', body: 'Maintained CGPA 9.02 while shipping 10+ personal projects.', icon: '🏆', year: '2022–Present' },
    { id: 'workshop', title: '"Build Your Brand With AI" Workshop', body: 'Organised and delivered a full-day AI workshop for 80+ students.', icon: '🧠', year: 'Apr 2025' },
    { id: 'client', title: 'First Paid Client Delivered', body: 'Delivered a production-ready web application for a real client.', icon: '💼', year: '2024' },
    { id: 'cr', title: 'Class Representative × 4 Years', body: 'Consecutively elected CR by 60+ peers for four academic years.', icon: '🎓', year: '2022–Present' },
  ],
  currentlyLearning: [
    { label: 'React Three Fiber', progress: 72, color: '#52aeff' },
    { label: 'GSAP ScrollTrigger', progress: 65, color: '#a78bfa' },
    { label: 'WebGL / GLSL', progress: 38, color: '#f97316' },
    { label: 'LangChain / RAG', progress: 55, color: '#34d399' },
    { label: 'Blender (3D)', progress: 42, color: '#fbbf24' },
  ],
  words: [
    { text: 'Ideas', imgPath: ph(60, 60, '💡') },
    { text: 'Concepts', imgPath: ph(60, 60, '🧩') },
    { text: 'Designs', imgPath: ph(60, 60, '🎨') },
    { text: 'Code', imgPath: ph(60, 60, '💻') },
    { text: 'Ideas', imgPath: ph(60, 60, '💡') },
    { text: 'Concepts', imgPath: ph(60, 60, '🧩') },
    { text: 'Designs', imgPath: ph(60, 60, '🎨') },
    { text: 'Code', imgPath: ph(60, 60, '💻') },
  ],
  counterItems: [
    { value: 20, suffix: '+', label: 'Projects Completed' },
    { value: 10, suffix: '+', label: 'Happy Clients' },
    { value: 3, suffix: '+', label: 'Tech Stacks Mastered' },
    { value: 100, suffix: '%', label: 'Passion for Code' },
  ],
  abilities: [
    { imgPath: ph(80, 80, 'Quality'), title: 'Quality Focus', desc: 'Delivering high-quality results while maintaining attention to every detail.' },
    { imgPath: ph(80, 80, 'Comms'), title: 'Reliable Communication', desc: 'Keeping you updated at every step to ensure transparency and clarity.' },
    { imgPath: ph(80, 80, 'Time'), title: 'On-Time Delivery', desc: 'Making sure projects are completed on schedule, with quality & attention to detail.' },
  ],
  socialLinks: [
    { name: 'insta', url: 'https://www.instagram.com/', imgPath: ph(40, 40, 'IG') },
    { name: 'fb', url: 'https://www.facebook.com/', imgPath: ph(40, 40, 'FB') },
    { name: 'x', url: 'https://www.x.com/', imgPath: ph(40, 40, 'X') },
    { name: 'linkedin', url: 'https://www.linkedin.com/', imgPath: ph(40, 40, 'LI') },
  ],
  logoIcons: [
    { imgPath: ph(60, 60, 'Logo+1') },
    { imgPath: ph(60, 60, 'Logo+2') },
    { imgPath: ph(60, 60, 'Logo+3') },
    { imgPath: ph(60, 60, 'Logo+4') },
    { imgPath: ph(60, 60, 'Logo+5') },
    { imgPath: ph(60, 60, 'Logo+6') },
    { imgPath: ph(60, 60, 'Logo+7') },
    { imgPath: ph(60, 60, 'Logo+8') },
    { imgPath: ph(60, 60, 'Logo+9') },
    { imgPath: ph(60, 60, 'Logo+10') },
    { imgPath: ph(60, 60, 'Logo+11') },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEED RUNNER
// ═══════════════════════════════════════════════════════════════════════════════
const seed = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB\n');

    await Promise.all([
      Service.deleteMany({}),
      Project.deleteMany({}),
      SkillCategory.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Leadership.deleteMany({}),
      Testimonial.deleteMany({}),
      Profile.deleteMany({}),
      SiteConfig.deleteMany({}),
    ]);
    console.log('✓ Cleared all collections\n');

    const [svc, proj, sk, exp, edu, lead, test] = await Promise.all([
      Service.insertMany(services),
      Project.insertMany(projects),
      SkillCategory.insertMany(skillCategories),
      Experience.insertMany(experiences),
      Education.insertMany(educationItems),
      Leadership.insertMany(leadershipItems),
      Testimonial.insertMany(testimonials),
    ]);

    await Profile.create(profileData);
    await SiteConfig.create(siteConfigData);

    console.log(`  Services:      ${svc.length} seeded`);
    console.log(`  Projects:      ${proj.length} seeded`);
    console.log(`  Skills:        ${sk.length} categories seeded`);
    console.log(`  Experience:    ${exp.length} seeded`);
    console.log(`  Education:     ${edu.length} seeded`);
    console.log(`  Leadership:    ${lead.length} seeded`);
    console.log(`  Testimonials:  ${test.length} seeded`);
    console.log(`  Profile:       singleton seeded`);
    console.log(`  Site Config:   singleton seeded`);

    console.log('\n✓ Database fully seeded.');
    console.log('  All images are placeholders — replace via Admin Panel → Cloudinary URLs.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
