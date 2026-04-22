export const projects = [
  {
    id: '5f1687dc',
    title: 'TemplateZone',
    subtitle: 'Digital Template Marketplace',
    description:
      'Full-stack e-commerce platform for buying and selling premium digital templates. Built with Next.js, Node.js, MongoDB, Clerk auth, and ImageKit media delivery.',
    longDescription: `TemplateZone started as a challenge: could I build a fully functional digital marketplace solo, from auth to checkout, in a production-ready way? The answer became this platform. The biggest architectural decision was separating the storefront (Next.js App Router) from the admin dashboard, keeping concerns clean and the buyer experience fast.

On the backend, I designed a MongoDB schema that handles both free and paid templates, with seller profiles, download tracking, and purchase history. Clerk handles auth seamlessly across social and email flows without a single custom auth route.

ImageKit replaced Cloudinary mid-build after hitting transformation limits — a real-world decision that taught me how to migrate media pipelines without downtime. The result is a platform that feels commercially viable, not just a project.`,
    features: [
      'Full buyer/seller marketplace with role-based access',
      'Clerk authentication — Google, GitHub, and email flows',
      'ImageKit CDN for optimised template previews and delivery',
      'Stripe-ready checkout architecture (payment integration scaffold)',
      'Admin dashboard for template moderation and analytics',
      'Download tracking and purchase history per user',
    ],
    role: 'Solo Full-Stack Developer',
    imageUrl: '/images/projects/templatezone.png',
    screenshots: [],
    projectUrl: 'https://templatezone.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Clerk', 'Tailwind'],
    category: 'Full Stack',
    year: 2026,
    featured: true,
  },
  {
    id: '58e4ed1e',
    title: 'AniVoice AI',
    subtitle: 'AI SaaS Voice Chat Platform',
    description:
      'Full-stack SaaS app for conversing with AI characters via text and voice. Powered by HuggingFace models, Next.js, Express, MongoDB, and Cloudinary.',
    longDescription: `AniVoice AI was built to explore one question: what does a real conversational AI product feel like to ship? Not a wrapper around a chat API, but a full SaaS — with character selection, voice synthesis, subscription tiers, and persistent conversation memory.

The hardest part was latency. HuggingFace inference endpoints have cold start delays, so I built a queuing layer in Express that streams responses token-by-token, keeping the UI feeling alive even when the model is warming up. Voice output uses Web Speech API on the client, keeping costs at zero while still delivering the "talking AI" experience.

MongoDB stores full conversation threads per user per character, enabling the app to maintain context across sessions — a feature that makes the experience feel genuinely personal rather than stateless.`,
    features: [
      'Multiple AI character personas with distinct system prompts',
      'Token-by-token streaming responses for low perceived latency',
      'Voice output via Web Speech API — zero cost TTS',
      'Persistent conversation memory per user per character',
      'Cloudinary for character avatar management',
      'Subscription tier scaffold with usage limits per plan',
    ],
    role: 'Solo Full-Stack Developer',
    imageUrl: '/images/projects/anivoice.png',
    screenshots: [],
    projectUrl: 'https://anivoice-ai-v1.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['Next.js', 'HuggingFace', 'Express', 'MongoDB', 'Shadcn'],
    category: 'Full Stack',
    year: 2026,
    featured: true,
  },
  {
    id: '52a62213',
    title: 'AniResume',
    subtitle: 'AI-Powered Resume Builder',
    description:
      'MERN app that lets users upload PDFs for AI extraction, build resumes with a live editor, and export ATS-friendly templates. Includes full admin dashboard.',
    longDescription: `AniResume solves a real pain point: most resume builders either look generic or require you to start from scratch. This one lets you upload an existing PDF, uses AI to extract your experience, education, and skills, then drops everything into a live editor where you refine it.

The PDF extraction pipeline was the most technically complex part — using pdf-parse on the backend to pull raw text, then sending it through a structured prompt to Gemini to return clean JSON that maps directly to the resume schema. Edge cases like multi-column PDFs and non-standard formatting required significant prompt engineering.

The export system generates ATS-clean HTML templates server-side and converts them to PDF using Puppeteer, ensuring the output passes keyword scanners that many design-heavy builders fail.`,
    features: [
      'PDF upload with AI-powered content extraction via Gemini',
      'Live resume editor with real-time preview',
      'ATS-optimised export using Puppeteer PDF generation',
      'Multiple resume templates with consistent formatting',
      'Full admin dashboard — user management and usage stats',
      'JWT authentication with refresh token rotation',
    ],
    role: 'Solo Full-Stack Developer',
    imageUrl: '/images/projects/aniresume.png',
    screenshots: [],
    projectUrl: 'https://aniresume.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['React', 'Node.js', 'MongoDB', 'JWT', 'AI'],
    category: 'Full Stack',
    year: 2025,
    featured: true,
  },
  {
    id: 'f1d254a9',
    title: 'AniCrypto',
    subtitle: 'Real-Time Crypto Dashboard',
    description:
      'Live cryptocurrency prices, charts, and market news. Integrated CoinGecko API and NewsData.io API.',
    longDescription: `AniCrypto was built to get comfortable with real-time data pipelines and API rate limiting in a React SPA. The CoinGecko free tier has aggressive limits, so I implemented a client-side caching layer using localStorage with TTL stamps — reducing API calls by ~70% while keeping data fresh enough for a dashboard context.

The charting system uses recharts with custom tooltips and responsive containers, displaying 7-day and 30-day price history per coin. The news feed pulls from NewsData.io and filters by coin name, giving each coin detail page contextually relevant headlines.

This project sharpened my instinct for building within API constraints — a skill that matters in production where every third-party call has a cost.`,
    features: [
      'Live prices for top 100 cryptocurrencies via CoinGecko API',
      'Interactive 7-day and 30-day price history charts',
      'Client-side caching layer reducing API calls by ~70%',
      'Per-coin news feed filtered from NewsData.io',
      'Search and sort across the full coin list',
      'Fully responsive layout for mobile trading on the go',
    ],
    role: 'Solo Frontend Developer',
    imageUrl: '/images/projects/anicrypto.png',
    screenshots: [],
    projectUrl: 'https://ani-crypto.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['React', 'CoinGecko API', 'NewsData API'],
    category: 'Frontend',
    year: 2025,
    featured: false,
  },
  {
    id: 'f9497ea1',
    title: 'Animi AI',
    subtitle: 'Personal AI Research Tool',
    description:
      'Personal AI tool for research and content generation built with React and Gemini API.',
    longDescription: `Animi AI is my personal Gemini-powered research assistant, built because I wanted a cleaner interface than the default Gemini UI with features tuned to how I actually work — code formatting, markdown rendering, and conversation branching.

The app maintains a sidebar of saved conversation threads, each with a custom title auto-generated from the first message. Responses render with full markdown support including syntax-highlighted code blocks, making it genuinely useful for technical queries.

Building this deepened my understanding of the Gemini API's multi-turn conversation format and how to structure history arrays correctly to maintain coherent context without ballooning token usage.`,
    features: [
      'Gemini API integration with multi-turn conversation memory',
      'Auto-generated conversation titles from first message',
      'Full markdown rendering with syntax-highlighted code blocks',
      'Saved conversation sidebar with persistent localStorage state',
      'Streaming response display for immediate feedback',
      'Clean minimal UI optimised for research and writing workflows',
    ],
    role: 'Solo Frontend Developer',
    imageUrl: '/images/projects/animi.png',
    screenshots: [],
    projectUrl: 'https://animi-ai.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['React', 'Gemini API'],
    category: 'Frontend',
    year: 2025,
    featured: false,
  },
  {
    id: '013522fb',
    title: 'AniBlog',
    subtitle: 'AI-Powered Blog Platform',
    description:
      'MERN blog app with AI-enhanced writing for admins, category filtering, and a modern Tailwind UI.',
    longDescription: `AniBlog is a full-stack blogging platform built with the MERN stack, with one key differentiator: the admin writing experience is AI-enhanced. While composing a post, admins can highlight any section and invoke Gemini to rewrite, expand, or summarise it — cutting writing time significantly.

The frontend is a clean reader-first design with category filtering, estimated read times, and a responsive card grid. Each post page has a sticky table of contents generated from markdown headers, making longer articles navigable.

On the backend, posts are stored with full version history, so admins can revert to any previous draft. This was my first time implementing a document versioning pattern in MongoDB — using an array of snapshots rather than a separate versions collection.`,
    features: [
      'AI writing assistant — rewrite, expand, or summarise any selection',
      'Full MERN stack with JWT-protected admin routes',
      'Category filtering and tag system for post discovery',
      'Auto-generated table of contents from markdown headers',
      'Post version history with revert functionality',
      'Estimated read time and responsive card grid layout',
    ],
    role: 'Solo Full-Stack Developer',
    imageUrl: '/images/projects/aniblog.png',
    screenshots: [],
    projectUrl: 'https://aniblog-v1.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'AI'],
    category: 'Full Stack',
    year: 2025,
    featured: false,
  },
  {
    id: 'cbd3e65e',
    title: 'AI Notes App',
    subtitle: 'Faculty Tool — MERN + AI',
    description:
      'Full-stack AI-powered notes sharing app built for a college faculty member.',
    longDescription: `This was my first real client project — built for a college faculty member who needed a simple way to share structured notes with students without relying on WhatsApp groups or email chains.

The app lets the faculty create, categorise, and publish notes with AI-assisted formatting. Students access a clean read-only view with subject filtering and a search bar. No login required for students — friction-free access was the core requirement.

Building for a real user with real feedback cycles was the most valuable part. Requirements shifted mid-build (they wanted PDF export added late), which taught me how to extend an existing schema and UI without breaking what was already working.`,
    features: [
      'Faculty admin panel for creating and categorising notes',
      'AI-assisted note formatting and summarisation',
      'Student-facing read-only view — no login required',
      'Subject and topic filtering with live search',
      'PDF export for individual notes via browser print API',
      'Mobile-first responsive design for student access on phones',
    ],
    role: 'Solo Full-Stack Developer (Client Project)',
    imageUrl: '/images/projects/notes.png',
    screenshots: [],
    projectUrl: 'https://sarmila-mam.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['React', 'Node.js', 'MongoDB', 'AI'],
    category: 'Full Stack',
    year: 2025,
    featured: false,
  },
  {
    id: 'cedf7682',
    title: 'Aniflix V2',
    subtitle: 'Movie Info App',
    description:
      'React app for browsing movies and actors with TMDB API integration and full responsive navigation.',
    longDescription: `Aniflix V2 was a ground-up rebuild of my first movie app, driven by everything I had learned about React patterns, component architecture, and API design since V1. The goal was to build something that felt like a real streaming platform UI — not a tutorial project.

The TMDB integration covers movies, TV shows, actors, and trending content — each with dedicated detail pages showing cast, similar titles, and trailers via YouTube embed. A custom hook handles all API fetching with loading, error, and empty states consistently across every page.

This project was where I first got serious about component reusability — the same card component renders movies, shows, and actors with different data shapes via prop normalisation.`,
    features: [
      'TMDB API integration — movies, TV shows, actors, and trending',
      'Detail pages with cast, trailers, and similar title recommendations',
      'Custom useFetch hook with unified loading/error/empty states',
      'Prop-normalised card component rendering three content types',
      'Fully responsive navigation with mobile menu',
      'Debounced search with instant results',
    ],
    role: 'Solo Frontend Developer',
    imageUrl: '/images/projects/aniflixv2.png',
    screenshots: [],
    projectUrl: 'https://aniflix-version2.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['React', 'TMDB API'],
    category: 'Frontend',
    year: 2025,
    featured: false,
  },
  {
    id: '963b46e9',
    title: 'Aniflix V1',
    subtitle: '3D Movie Display Site',
    description:
      'First 3D-powered responsive site for displaying movies and series. Built with vanilla HTML, CSS, JS.',
    longDescription: `Aniflix V1 was my first attempt at building something that felt visually impressive — before I knew React, before I knew any framework. Pure HTML, CSS, and vanilla JavaScript.

The "3D" effect is achieved with CSS perspective transforms on the movie cards — on hover they rotate on the Y-axis, giving a physical card-flip feel. This was my first time deliberately engineering a visual interaction rather than just making something functional.

Looking back, the code is messy by my current standards — lots of DOM manipulation, no component thinking. But it taught me that good UI is about intention, and that foundation shaped everything I built after it.`,
    features: [
      'CSS 3D card flip effect using perspective transforms',
      'Vanilla JS DOM manipulation — no frameworks',
      'Responsive grid layout with CSS Grid',
      'Movie and series categorisation with tab switching',
      'Custom scrollbar and hover interaction design',
      'Zero dependencies — pure browser APIs only',
    ],
    role: 'Solo Frontend Developer',
    imageUrl: '/images/projects/aniflixv1.png',
    screenshots: [],
    projectUrl: 'https://aniflix-v1.vercel.app/',
    githubLink: 'https://github.com',
    tags: ['HTML', 'CSS', 'JavaScript', '3D'],
    category: 'Frontend',
    year: 2025,
    featured: false,
  },
  {
    id: '64beeb2c',
    title: 'Signature Pad V1',
    subtitle: 'Signature Practice Tool',
    description:
      'Browser-based signature pad where users can practice and download their signatures.',
    longDescription: `Signature Pad V1 was a focused single-feature project: a canvas-based drawing tool that lets users practice and save their handwritten signature in the browser. Small in scope, but technically interesting.

The drawing engine uses the HTML5 Canvas API with pointer events for cross-device support — works with mouse, touch, and stylus. Stroke smoothing was added by averaging the last three pointer positions before drawing, eliminating the jagged edges that raw pointer events produce.

Download is handled client-side via canvas.toDataURL() piped into a temporary anchor element — no server required. The entire app is a single HTML file with embedded CSS and JS, making it trivially deployable anywhere.`,
    features: [
      'HTML5 Canvas drawing engine with pointer event support',
      'Stroke smoothing via 3-point position averaging',
      'Works with mouse, touch, and stylus input',
      'One-click PNG download via canvas.toDataURL()',
      'Pen colour and stroke width controls',
      'Single-file deployment — no build step required',
    ],
    role: 'Solo Frontend Developer',
    imageUrl: '/images/projects/signaturepad.png',
    screenshots: [],
    projectUrl: 'https://anishsignatureappv1.netlify.app/',
    githubLink: 'https://github.com',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'Frontend',
    year: 2025,
    featured: false,
  },
  {
    id: '2d700c03',
    title: 'Portfolio V1',
    subtitle: 'First Portfolio Site',
    description:
      'First fully responsive portfolio site built with HTML, CSS, and JavaScript.',
    longDescription: `Portfolio V1 was the project that made me take web development seriously. Before this, everything I built was functional but rough. This was the first time I sat down and thought deliberately about layout, typography, spacing, and user flow.

Built entirely without frameworks — just HTML, CSS, and JavaScript — it forced me to understand the box model deeply, learn CSS positioning properly, and handle responsive breakpoints by hand without a utility library to lean on.

Looking at it now, the design is dated and the code is verbose. But it was the project where I first felt like a developer rather than someone following tutorials — and that shift in identity is what led to everything that came after.`,
    features: [
      'Fully responsive layout built without any CSS framework',
      'Smooth scroll navigation with active section highlighting',
      'CSS-only animated hero section',
      'Contact form with client-side validation',
      'Project showcase with hover reveal effects',
      'Zero dependencies — pure HTML, CSS, and JavaScript',
    ],
    role: 'Solo Frontend Developer',
    imageUrl: '/images/projects/portfoliov1.png',
    screenshots: [],
    projectUrl: 'https://anishkumarversion1.netlify.app/',
    githubLink: 'https://github.com',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'Frontend',
    year: 2025,
    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const FILTER_CATEGORIES = [
  'All',
  ...Array.from(new Set(projects.map((p) => p.category))),
]