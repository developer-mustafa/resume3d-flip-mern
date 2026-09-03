# 3D Resume Book — MERN Stack

A premium interactive 3D digital resume book for **Mustafa Rahman, Full Stack Software Engineer**, built with a complete MERN architecture.

## Features

- **Interactive 3D Book** — CSS 3D transforms, realistic page effects, keyboard/touch navigation using `react-pageflip`.
- **High-Quality PDF Export** — Pixel-perfect A4 server-side PDF generation using `puppeteer-core`.
- **5 Resume Pages** — Cover, Engineering Profile, Experience, Projects, Contact.
- **Admin Dashboard** — Full CMS with 15+ management modules (Education, Certifications, Services, etc.).
- **Dynamic Content** — All content served from MongoDB via REST API, perfectly synced between the 3D book and PDF generator.
- **Authentication** — JWT with HTTP-only cookies, role-based authorization.
- **Responsive** — Desktop spread, tablet scaled, mobile single-page.
- **Accessibility** — WCAG-oriented, reduced motion support, keyboard navigation.
- **SEO** — React Helmet, meta tags, Open Graph.

## Tech Stack & Versions

### Frontend (Client)
- **Framework:** React `v19.2.8`
- **Build Tool:** Vite `v8.2.2`
- **Styling:** Tailwind CSS `v3.4.17`, PostCSS `v8.5.26`
- **State Management:** Zustand `v5.0.15`
- **Animations:** Framer Motion `v13.1.1`
- **3D Flip Engine:** react-pageflip `v2.0.3`
- **Routing:** react-router-dom `v7.18.3`
- **API Client:** Axios `v1.20.0`
- **Icons:** lucide-react `v1.39.0`

### Backend (Server)
- **Runtime:** Node.js (Optimized for `v22+`)
- **Framework:** Express `v5.1.0`
- **Database ORM:** Mongoose `v8.14.3`
- **PDF Generation:** puppeteer-core `v25.9.0` (Configured for dynamic Chrome/Edge executable)
- **Authentication:** jsonwebtoken `v9.0.2`, bcryptjs `v3.0.2`
- **Security:** helmet `v8.1.0`, express-rate-limit `v7.5.0`, express-mongo-sanitize `v2.2.0`, xss `v1.0.15`
- **File Uploads:** multer `v2.0.1`

## Architecture

```
resume-book/
├── client/               # React frontend
│   ├── src/
│   │   ├── api/          # Centralized API client
│   │   ├── components/
│   │   │   ├── admin/    # Dashboard modules
│   │   │   ├── book/     # 3D book engine
│   │   │   ├── print/    # High-quality printable UI layout
│   │   │   └── ui/       # Reusable UI components
│   │   ├── stores/       # Zustand stores
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
├── server/               # Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route handlers (including pdfController)
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/           # 14 Mongoose models
│   ├── routes/           # 15 route groups (including PDF route)
│   ├── seed/             # Database seeding
│   ├── utils/            # JWT, activity logging
│   ├── validators/       # express-validator rules
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
└── package.json          # Monorepo scripts
```

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd resume-book

# Install all dependencies (root + client + server) using the custom script
npm run install:all
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-book
JWT_SECRET=your-secret-change-in-production
JWT_EXPIRE=7d
COOKIE_SECRET=your-cookie-secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Puppeteer Configuration for PDF generation
# Local Windows (Edge): "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
# Linux VPS (Ubuntu): "/usr/bin/chromium-browser"
PUPPETEER_EXECUTABLE_PATH="C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
```

## MongoDB Setup

**Local MongoDB:**
```bash
# Ensure MongoDB is running locally on port 27017
```

**MongoDB Atlas:**
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string
3. Set `MONGODB_URI` in `server/.env`

## Seed Database

```bash
# Run from the root directory
npm run seed
```

This creates:
- **Superadmin account**: `admin@resumebook.dev` / `Admin@123456`
- Default profile, skills, experience, projects, services, settings

⚠️ **Change the admin password in production!**

## Development

```bash
# Run both client + server concurrently
npm run dev

# Or run separately
npm run client    # Frontend on http://localhost:5173
npm run server    # Backend on http://localhost:5000
```

## Admin Dashboard

1. Navigate to `/admin/login`
2. Login with seeded credentials
3. Access the full CMS at `/admin/dashboard`

### Admin Roles

| Role | Permissions |
|---|---|
| `superadmin` | Full access (user management, settings, all CRUD) |
| `admin` | Content + settings (no user management) |
| `editor` | Content editing only (no delete, no settings) |

## API Overview

| Endpoint | Public | Protected | Description |
|---|---|---|---|
| `/api/auth` | — | POST login/logout, GET me | Authentication |
| `/api/profile` | GET | PUT | Profile management |
| `/api/skills` | GET | POST, PUT, DELETE | Skills CRUD |
| `/api/experience` | GET | POST, PUT, DELETE | Experience CRUD |
| `/api/projects` | GET, GET :slug | POST, PUT, DELETE, duplicate | Projects CRUD |
| `/api/education` | GET | POST, PUT, DELETE | Education CRUD |
| `/api/certifications` | GET | POST, PUT, DELETE | Certifications CRUD |
| `/api/services` | GET | POST, PUT, DELETE | Services CRUD |
| `/api/social-links` | GET | POST, PUT, DELETE | Social links CRUD |
| `/api/contact` | POST | GET, PUT status, DELETE | Contact form |
| `/api/settings` | GET | PUT | Book settings |
| `/api/seo` | GET | PUT | SEO settings |
| `/api/media` | — | GET, POST, DELETE | File management |
| `/api/admin` | — | Dashboard, users, logs | Admin management |
| `/api/resume/pdf` | GET | — | Generates high-quality PDF resume |

## Production Build

```bash
npm run build    # Builds frontend to client/dist/
```

## Deployment Guidelines

**Frontend** — Deploy `client/dist/` to Vercel, Netlify, or serve statically via Express.

**Backend** — Deploy `server/` to Render, Railway, or VPS.

**PDF Generation in Production (Puppeteer):**
- **VPS (Ubuntu):** Install `chromium-browser` via `apt` and set `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`.
- **Serverless (Vercel/AWS):** You must install `@sparticuz/chromium` in your server dependencies and update `executablePath` in `pdfController.js` to point to it dynamically.

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT stored in HTTP-only secure cookies
- Helmet security headers
- CORS configured for client origin only
- Rate limiting (100 req/15min API, 10 req/15min auth)
- MongoDB query sanitization
- XSS protection on contact form inputs
- Request size limits (10MB)
- Environment variables for all secrets

## License

Private — All rights reserved.
