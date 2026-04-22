# Portfolio V3 — Full Stack

A production-grade React 19 + Three.js portfolio with a Node.js/Express/MongoDB backend. Features 3D hero experiences, page analytics, a services marketplace with inquiry system, maintenance mode, and a full admin API.

## Architecture

```
portfolioV3-main/
├── src/                         # React 19 + Vite 8 frontend
│   ├── components/              # Shared + page-specific components
│   │   ├── shared/              # Navbar, Footer, PageTransition, MaintenanceMode
│   │   ├── Home/                # 3D hero models, particle system, process steps
│   │   ├── skills/              # 3D computer model
│   │   └── work/                # Project cards, filters, data
│   ├── context/                 # ThemeContext (dark/light toggle)
│   ├── hooks/                   # useMaintenanceCheck
│   ├── pages/                   # Home, Work, Services, Skills, About, Contact, ProjectDetail
│   ├── sections/                # Hero, StatsBar, FeaturedProjects, TechStack, etc.
│   ├── services/                # api.js — all backend API calls
│   ├── constants/               # Static data for about, skills pages
│   └── App.jsx                  # Router, MaintenanceModeWrapper
├── backend/                     # Node.js + Express + MongoDB API
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # Express route handlers
│   ├── middleware/              # Auth, rate limiting, maintenance, error handler
│   ├── utils/                   # Logger (Winston), email (Nodemailer)
│   ├── server.js                # App entry point
│   └── seed.js                  # Database seed script
├── public/                      # Static assets (3D models, images, Draco decoder)
└── .env                         # Frontend env vars
```

## Tech Stack

**Frontend:** React 19, Vite 8, Three.js 0.183, @react-three/fiber v9, @react-three/drei v10, Framer Motion 12, GSAP 3.14, React Router DOM v7, Tailwind CSS v4

**Backend:** Node.js, Express 4, MongoDB, Mongoose 8, JWT (jsonwebtoken), bcryptjs, express-rate-limit, express-validator, Helmet, Morgan, Winston, Nodemailer

## Frontend Setup

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, admin credentials, etc.

# Seed the database with 6 services
npm run seed

# Start dev server with file watching (runs on http://localhost:5000)
npm run dev

# Start production server
npm start
```

## Environment Variables

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Backend (backend/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/portfolio` |
| `JWT_SECRET` | Secret key for JWT signing | — (required) |
| `JWT_EXPIRES_IN` | Access token expiry | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `30d` |
| `ADMIN_EMAIL` | Admin login email | — (required) |
| `ADMIN_PASSWORD` | Admin login password | — (required) |
| `SMTP_HOST` | SMTP server hostname | — (optional) |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use TLS for SMTP | `false` |
| `SMTP_USER` | SMTP username/email | — (optional) |
| `SMTP_PASS` | SMTP password/app password | — (optional) |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |

If SMTP is not configured, emails are logged to console but not sent.

## API Endpoints

### Public

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `GET` | `/api/health` | Health check (DB status, uptime) | 200/15min |
| `GET` | `/api/maintenance/status` | Maintenance mode status | 200/15min |
| `GET` | `/api/services` | List active services (?category, ?featured) | 200/15min |
| `GET` | `/api/services/categories` | Distinct service categories | 200/15min |
| `GET` | `/api/services/:slug` | Single service by slug | 200/15min |
| `POST` | `/api/contact` | Submit contact message | 5/15min |
| `POST` | `/api/inquiries` | Submit service inquiry | 5/15min |
| `POST` | `/api/analytics/track` | Track analytics event | 500/15min |

### Admin (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Login, returns JWT + refresh token |
| `POST` | `/api/admin/refresh` | Refresh access token |
| `GET` | `/api/admin/dashboard` | Stats: services, inquiries, messages, views |
| `GET` | `/api/admin/services` | List all services (including inactive) |
| `POST` | `/api/admin/services` | Create service |
| `PUT` | `/api/admin/services/:id` | Update service |
| `DELETE` | `/api/admin/services/:id` | Soft delete (sets isActive: false) |
| `PUT` | `/api/admin/services/:id/restore` | Restore soft-deleted service |
| `GET` | `/api/admin/inquiries` | List inquiries (?status) |
| `GET` | `/api/admin/inquiries/:id` | Single inquiry |
| `PUT` | `/api/admin/inquiries/:id` | Update inquiry (status, notes) |
| `DELETE` | `/api/admin/inquiries/:id` | Delete inquiry |
| `GET` | `/api/admin/messages` | List contact messages (?status) |
| `GET` | `/api/admin/messages/:id` | Single message |
| `PUT` | `/api/admin/messages/:id` | Update message (status) |
| `DELETE` | `/api/admin/messages/:id` | Delete message |
| `GET` | `/api/admin/analytics` | Aggregated analytics (?days=30) |
| `GET` | `/api/admin/analytics/export` | CSV export (?days=30) |
| `GET` | `/api/admin/maintenance` | Full maintenance config |
| `PUT` | `/api/admin/maintenance` | Toggle maintenance mode |

## Maintenance Mode

When enabled, all public API routes (except `/api/health`, `/api/maintenance/status`, and `/api/admin/*`) return `503` with a maintenance message. The frontend polls `/api/maintenance/status` every 5 minutes and shows a full-screen overlay with animated gears, the message, and a countdown timer.

### Enable maintenance mode

```bash
# Login first
TOKEN=$(curl -s -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}' \
  | jq -r '.token')

# Enable with message and estimated end time
curl -X PUT http://localhost:5000/api/admin/maintenance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "isEnabled": true,
    "message": "Deploying new features. Back in 30 minutes!",
    "estimatedEnd": "2025-01-15T14:00:00Z",
    "allowedIPs": ["127.0.0.1"]
  }'
```

### Disable maintenance mode

```bash
curl -X PUT http://localhost:5000/api/admin/maintenance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"isEnabled": false}'
```

## Deployment

### Frontend — Vercel

1. Push repo to GitHub
2. Import project in Vercel
3. Set **Root Directory** to `.` (project root)
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add environment variable: `VITE_API_URL` = your backend URL (e.g., `https://your-api.onrender.com/api`)
7. Add `vercel.json` rewrite (already included) to handle SPA routing

### Backend — Render

1. Create a new **Web Service** on Render
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add all environment variables from `backend/.env.example`
6. Set `FRONTEND_URL` to your Vercel deployment URL
7. Set `NODE_ENV` to `production`

### Database — MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user and whitelist your Render IP (or 0.0.0.0/0 for all)
3. Copy the connection string and set it as `MONGODB_URI` in Render
4. Run the seed script locally with the Atlas URI:
   ```bash
   cd backend
   MONGODB_URI="mongodb+srv://..." npm run seed
   ```

## Theming

The app uses CSS variables for a dual-theme system:

- **Dark mode** (default): Batman-inspired — blue accent (`#52aeff`), black backgrounds
- **Light mode**: Superman-inspired — red accent (`#d4200c`), light blue backgrounds

Theme is toggled via `ThemeContext` and persisted to `localStorage` under `portfolio-theme`.

## License

Private project. All rights reserved.
