// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export const profile = {
  name:        'Anish Kumar S',
  firstName:   'Anish',
  lastName:    'Kumar S',
  initials:    'AK',
  role:        'Full Stack Developer',
  roleAlt:     'Creative Developer · AI Integrator · 3D Web Explorer',
  tagline:     'I build things that ship — full-stack, AI-powered, and increasingly 3D.',
  location:    'Chennai, Tamil Nadu, India',
  locationShort: 'Chennai, IN',
  timezone:    'IST (UTC +5:30)',
  email:       'akcoder1102004@gmail.com',
  phone:       '+91 94889 90495',
  linkedin:    'https://www.linkedin.com',
  github:      'https://github.com',
  resume:      '/finalAk-2.pdf',
  avatar:      '/images/avatar.jpg',
  available:   true, // drives the "Open to Work" badge

  // Bio — split into paragraphs with \n\n
  bio: `I'm a B.Tech IT student at BSACIST, Chennai, building full-stack products since 2022. I don't wait for assignments — I ship. Every project in my portfolio started as a personal challenge: "Can I build a production-ready version of this, solo?"

The answer has always been yes. From a digital template marketplace handling real buyers and sellers, to an AI voice chat SaaS with token-streaming and subscription tiers, to a resume builder that uses Gemini to extract content from uploaded PDFs — each one pushed me into new territory.

Right now I'm deep into 3D web — React Three Fiber, GSAP, and WebGL. Not because it's trendy, but because I believe the next generation of interfaces lives at the intersection of 3D, AI, and cinematic motion. This portfolio is proof of that direction.

I'm looking for a role where I can build products that matter, alongside people who care about the craft.`,
}


// ─────────────────────────────────────────────────────────────────────────────
// HERO STATS
// ─────────────────────────────────────────────────────────────────────────────
export const aboutStats = [
  { value: '3+',   label: 'Years Coding'       },
  { value: '10+',  label: 'Projects Shipped'   },
  { value: '9.02', label: 'CGPA'               },
  { value: '1',    label: 'Client Delivered'   },
]


// ─────────────────────────────────────────────────────────────────────────────
// QUICK FACTS — displayed as a scannable list in the hero or sidebar
// ─────────────────────────────────────────────────────────────────────────────
export const quickFacts = [
  { icon: '🎓', label: 'Degree',        value: 'B.Tech IT — BSACIST'     },
  { icon: '📍', label: 'Based In',      value: 'Chennai, Tamil Nadu'      },
  { icon: '💼', label: 'Status',        value: 'Open to full-time roles'  },
  { icon: '🚀', label: 'Current Stack', value: 'MERN · React Native · R3F' },
  { icon: '🤖', label: 'AI Tools',      value: 'Gemini · OpenAI · LangChain' },
  { icon: '⏰', label: 'Timezone',      value: 'IST (UTC +5:30)'          },
  { icon: '🌐', label: 'Languages',     value: 'Tamil · English'           },
  { icon: '☕', label: 'Fuel',          value: 'Coffee + lo-fi playlists'  },
]


// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────
export const experience = [
  {
    id:       'kairox',
    role:     'Full Stack Developer Intern',
    company:  'Kairox Pvt Ltd',
    type:     'Internship',
    period:   'Feb 2026 – Apr 2026',
    duration: '2 months',
    location: 'Remote',
    current:  true,
    accent:   '#52aeff',
    summary:
      'Shipped a production-grade AI-powered React Native mobile app for an industrial client — sole frontend engineer on a cross-functional team.',
    points: [
      'Architected and built the entire React Native frontend for an industry-facing app: issue reporting, stakeholder task assignment, and real-time dashboards.',
      'Wired REST APIs for live issue feeds, user role management, and push notifications — handling edge cases like offline queuing and retry logic.',
      'Implemented role-based UI rendering across three user personas (field worker, supervisor, admin), each with a tailored, context-aware dashboard.',
      'Shipped sprint deliverables consistently under tight deadlines in close collaboration with backend and product teams.',
      'Reduced UI bug report rate by enforcing strict component contracts and writing reusable, typed utility hooks across the codebase.',
    ],
    tags: ['React Native', 'REST API', 'Mobile', 'AI', 'Role-based UI', 'Push Notifications'],
    impact: 'Sole frontend engineer — zero to production in 2 months',
  },
  {
    id:       'mannit',
    role:     'Frontend Developer Intern',
    company:  'Mannit Innovations',
    type:     'Internship',
    period:   'Jun 2025 – Jul 2025',
    duration: '15 days',
    location: 'Offline',
    current:  false,
    accent:   '#a78bfa',
    summary:
      'Delivered a full-stack AI-powered MERN blog platform with Gemini API content tools, ImageKit media delivery, and production deployment — in 15 days.',
    points: [
      'Designed and shipped a full-stack blog platform on the MERN stack, from schema design to deployed product, in a compressed 15-day window.',
      'Integrated Gemini API for AI-assisted content summarisation, title suggestions, and auto-generated SEO metadata on every article.',
      'Migrated media to ImageKit.io, implementing real-time transformations and CDN delivery — cutting perceived image load time significantly.',
      'Deployed to Vercel with CI/CD — live at aniblog-v1.vercel.app before the internship window closed.',
    ],
    tags: ['MERN', 'Gemini API', 'ImageKit', 'MongoDB', 'Express', 'Vercel'],
    impact: 'Live production app shipped in 15 days',
  },
  {
    id:       'startmycareer',
    role:     'Frontend Developer Intern',
    company:  'StartMyCareer',
    type:     'Internship',
    period:   'Jun 2024 – Jul 2024',
    duration: '15 days',
    location: 'Offline',
    current:  false,
    accent:   '#34d399',
    summary:
      'Built and deployed a fully responsive, animated custom portfolio website from scratch in 15 days.',
    points: [
      'Designed and developed a custom portfolio website end-to-end: wireframes, responsive layouts, and CSS-driven scroll animations.',
      'Implemented smooth scroll interactions and micro-animations using pure CSS and vanilla JS — no framework.',
      'Deployed on Netlify with a continuous deployment pipeline connected to GitHub.',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Netlify', 'Animations'],
    impact: 'Full site from design to deploy in 2 weeks',
  },
]


// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────────────────────────
export const education = [
  {
    id:          'btech',
    degree:      'B.Tech — Information Technology',
    institution: 'BSA Crescent Institute of Science & Technology',
    shortName:   'BSACIST',
    period:      '2022 – Present',
    grade:       'CGPA 9.02',
    status:      'Ongoing',
    location:    'Chennai, Tamil Nadu',
    highlights: [
      'Specialising in MERN stack, AI/ML integration, and modern web engineering.',
      'Class Representative for 4 consecutive years — elected by peers, 60+ students per batch.',
      'General Secretary — IT Trailblazer Club (2023–Present): led workshops, hackathons, and industry sessions.',
      'Co-founded Spark Solutions — a student-run tech org officially recognised by the institution.',
      'Maintained a top-tier CGPA of 9.02 across all semesters while shipping 10+ personal projects.',
    ],
    courses: ['Data Structures', 'OS', 'DBMS', 'Web Technologies', 'AI & ML', 'Cloud Computing'],
  },
  {
    id:          'school',
    degree:      'Higher Secondary Education (Science — CS)',
    institution: 'Ida Scudder School',
    shortName:   'ISS',
    period:      'Completed 2022',
    grade:       '12th — 86.6%  |  10th — 82.8%',
    status:      'Completed',
    location:    'Vellore, Tamil Nadu',
    highlights: [
      'Chose the Computer Science stream — wrote first lines of C++ here.',
      'Strong foundation in mathematics, physics, and logical reasoning.',
      'Active participant in inter-school science exhibitions and tech fests.',
    ],
    courses: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'],
  },
]


// ─────────────────────────────────────────────────────────────────────────────
// LEADERSHIP & INITIATIVES
// ─────────────────────────────────────────────────────────────────────────────
export const leadership = [
  {
    id:      'spark',
    title:   'Co-Founder & CFO',
    org:     'Spark Solutions',
    period:  '2022 – Mar 2026',
    url:     'https://www.sparksolution.org/',
    summary:
      'Co-founded a student-run tech organisation officially recognised by BSACIST. Led finances, strategy, and community initiatives.',
    highlights: [
      'Built the organisation from scratch to a college-recognised student body.',
      'Hosted "Build Your Brand With AI" workshop — 7th April 2025, 80+ attendees.',
      'Managed budgets, sponsorships, and financial planning for all club activities.',
      'Drove cross-departmental collaboration between CS, IT, and ECE students.',
    ],
    badge: 'Founder',
  },
  {
    id:      'cr',
    title:   'Class Representative',
    org:     'BSACIST — IT Department',
    period:  '2022 – Present',
    url:     null,
    summary:
      'Elected CR for four consecutive years — the primary communication bridge between 60+ students and faculty.',
    highlights: [
      'Facilitated transparent communication between 60+ students and departmental faculty over 4 years.',
      'Coordinated exam schedules, academic events, and departmental announcements.',
      'Mediated student-faculty concerns and resolved timetable conflicts.',
      'Trusted to represent the class at official department meetings.',
    ],
    badge: '4x Elected',
  },
  {
    id:      'club',
    title:   'General Secretary',
    org:     'IT Trailblazer Club',
    period:  '2023 – Present',
    url:     null,
    summary:
      'Driving technical culture in the department — workshops, hackathons, and deep-dives into real-world engineering.',
    highlights: [
      'Organised MERN stack and React workshops attended by 100+ students.',
      'Ran internal hackathons that produced 3 production-deployed projects.',
      'Curated industry trend sessions featuring alumni guest speakers.',
      'Onboarded and mentored 15+ junior club members into project-ready developers.',
    ],
    badge: 'Secretary',
  },
]


// ─────────────────────────────────────────────────────────────────────────────
// VALUES / PHILOSOPHY
// ─────────────────────────────────────────────────────────────────────────────
export const values = [
  {
    icon:  '⚡',
    title: 'Ship Fast, Learn Faster',
    body:  'Every project in my portfolio started as a question. I build the answer, deploy it, and move to the next challenge without waiting for permission.',
  },
  {
    icon:  '🎯',
    title: 'Real Users, Real Problems',
    body:  'The AI Notes App was built for a real faculty member with real feedback cycles. Shipping for actual users changes how you think about every line of code.',
  },
  {
    icon:  '🔬',
    title: 'Go Deeper Than Tutorials',
    body:  'Token streaming, PDF extraction pipelines, media migration mid-build — I deliberately seek the hard problems because that\'s where the real learning lives.',
  },
  {
    icon:  '🌐',
    title: 'The Web Should Feel Alive',
    body:  'I believe the next interface generation lives where 3D, AI, and motion intersect. This portfolio is that experiment running live.',
  },
]


// ─────────────────────────────────────────────────────────────────────────────
// HOBBIES & INTERESTS — new section
// Each item: { id, icon, title, description, tag }
// tag: 'creative' | 'technical' | 'physical' | 'intellectual'
// ─────────────────────────────────────────────────────────────────────────────
export const hobbies = [
  {
    id:          'music',
    icon:        '🎵',
    title:       'Music & Lo-fi Production',
    description: 'I build playlists the way I build products — obsessively curated. Lo-fi hip-hop is my default work OS. Occasionally I tinker with beats in GarageBand.',
    tag:         'creative',
  },
  {
    id:          '3d',
    icon:        '🧊',
    title:       '3D World Building',
    description: 'Outside of R3F, I explore Blender for fun — modeling abstract low-poly environments. It\'s where I\'m learning the geometry that makes my Three.js scenes feel right.',
    tag:         'technical',
  },
  {
    id:          'chess',
    icon:        '♟️',
    title:       'Chess',
    description: 'Chess teaches the same thing good engineering does — every move has downstream consequences. I play on Chess.com regularly and use it to decompress.',
    tag:         'intellectual',
  },
  {
    id:          'films',
    icon:        '🎬',
    title:       'Cinematography & Films',
    description: 'I study films for their visual language — composition, colour grading, and pacing. It directly influences how I think about UI motion design and layout rhythm.',
    tag:         'creative',
  },
  {
    id:          'oss',
    icon:        '🐙',
    title:       'Open Source Exploring',
    description: 'I regularly crawl GitHub trending to study how elite engineers structure large codebases. Reading real production code is the best textbook I\'ve found.',
    tag:         'technical',
  },
  {
    id:          'fitness',
    icon:        '🏃',
    title:       'Running & Fitness',
    description: 'Early morning runs are non-negotiable. Physical discipline and code discipline reinforce each other — both require showing up consistently when you don\'t feel like it.',
    tag:         'physical',
  },
  {
    id:          'writing',
    icon:        '✍️',
    title:       'Technical Writing',
    description: 'I document my project builds and architecture decisions in Notion. Writing forces me to actually understand what I built — and it sharpens how I communicate to teams.',
    tag:         'intellectual',
  },
  {
    id:          'gaming',
    icon:        '🎮',
    title:       'Game Design Appreciation',
    description: 'I dissect game UI/UX the way designers dissect websites. The feedback loop design in games like Hollow Knight directly inspires micro-interaction patterns in my work.',
    tag:         'creative',
  },
]

// Hobby tag colours — consumed by the UI
export const hobbyTagColors = {
  creative:     { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.22)', color: '#a78bfa' },
  technical:    { bg: 'rgba(82,174,255,0.08)',  border: 'rgba(82,174,255,0.22)',  color: '#52aeff' },
  intellectual: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.22)',  color: '#fbbf24' },
  physical:     { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.22)',  color: '#34d399' },
}


// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS / ACHIEVEMENTS (optional section)
// ─────────────────────────────────────────────────────────────────────────────
export const achievements = [
  {
    id:     'cgpa',
    title:  'Top Academic Performer',
    body:   'Maintained CGPA 9.02 across all semesters while simultaneously shipping 10+ personal projects.',
    icon:   '🏆',
    year:   '2022–Present',
  },
  {
    id:     'workshop',
    title:  '"Build Your Brand With AI" Workshop',
    body:   'Conceptualised, organised, and delivered a full-day AI workshop for 80+ students — covering prompt engineering, AI tools, and personal brand strategy.',
    icon:   '🧠',
    year:   'Apr 2025',
  },
  {
    id:     'client',
    title:  'First Paid Client Delivered',
    body:   'Delivered a production-ready web application for a real client — scoped requirements, built solo, and shipped on deadline.',
    icon:   '💼',
    year:   '2024',
  },
  {
    id:     'cr',
    title:  'Class Representative × 4 Years',
    body:   'Consecutively elected CR by 60+ peers for four academic years — the longest consecutive tenure in the department batch.',
    icon:   '🎓',
    year:   '2022–Present',
  },
]


// ─────────────────────────────────────────────────────────────────────────────
// CURRENTLY LEARNING — adds dynamism and shows growth mindset
// ─────────────────────────────────────────────────────────────────────────────
export const currentlyLearning = [
  { label: 'React Three Fiber',  progress: 72, color: '#52aeff' },
  { label: 'GSAP ScrollTrigger', progress: 65, color: '#a78bfa' },
  { label: 'WebGL / GLSL',       progress: 38, color: '#f97316' },
  { label: 'LangChain / RAG',    progress: 55, color: '#34d399' },
  { label: 'Blender (3D)',       progress: 42, color: '#fbbf24' },
]
