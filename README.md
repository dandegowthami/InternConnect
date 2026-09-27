# InternConnect

A full-stack internship platform: students discover and apply to internships, recruiters post openings and review applicants, and admins moderate the platform.

- **Frontend:** React 19, React Router 6, Vite, Bootstrap 5 (grid/utilities) with a custom design system in `Frontend/src/styles`
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT auth, Multer uploads, Nodemailer

## Getting started

### Backend

```bash
cd Backend
npm install
npm run dev        # http://localhost:5000
```

Copy `Backend/.env.example` to `Backend/.env` and fill it in:

| Variable         | Required | Description                                                          |
| ---------------- | -------- | -------------------------------------------------------------------- |
| `MONGO_URI`      | Yes      | MongoDB connection string                                            |
| `JWT_SECRET`     | Yes      | Secret used to sign login tokens (32+ random characters in production) |
| `FRONTEND_URL`   | Yes      | Frontend origin(s) for CORS, comma-separated; the first is used in email links |
| `EMAIL_USER`     | Yes      | Gmail address used to send emails                                    |
| `EMAIL_PASS`     | Yes      | Gmail app password                                                   |
| `PORT`           | No       | API port (default `5000`; hosts usually set this)                    |
| `JWT_EXPIRES_IN` | No       | Login session length (default `1d`)                                  |
| `NODE_ENV`       | No       | `production` hides error details and uses production logging         |

The server refuses to start if `MONGO_URI` or `JWT_SECRET` is missing.

Other scripts:

```bash
npm run lint                               # ESLint
npm run format                             # Prettier (shared config in the repo root)
npm run test-email                         # verify email configuration
npm run make-admin -- someone@example.com  # promote an existing account to admin
```

Admin accounts cannot be created through public sign-up; register normally, then run `make-admin`.

### Frontend

```bash
cd Frontend
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run build
```

Set `VITE_API_URL` in `Frontend/.env` if the API is not at `http://localhost:5000`.

## Frontend routes

| Path | Access | Page |
| --- | --- | --- |
| `/`, `/features`, `/about`, `/contact`, `/companies`, `/internships` | Public | Marketing site and public internship listing |
| `/login`, `/register`, `/forgot-password`, `/reset-password/:token`, `/verify-email/:token` | Public | Authentication |
| `/internships/:id`, `/notifications`, `/view-profile`, `/edit-profile` | Any signed-in user | Shared dashboard pages |
| `/student-dashboard`, `/applications`, `/my-internships` | Student | Browse, track applications, accepted internships |
| `/recruiter-dashboard`, `/recruiter/post-internship`, `/recruiter/internships/:id/applicants` | Recruiter | Manage postings and applicants |
| `/admin-dashboard` | Admin | Platform stats, user and internship moderation |

## API overview

| Method & path | Access |
| --- | --- |
| `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/verify-email/:token` | Public |
| `POST /api/auth/forgot-password` · `POST /api/auth/reset-password/:token` | Public |
| `GET /api/auth/me` · `GET /api/profile/me` · `PUT /api/profile/update` (multipart: `photo`, `resume`) | Signed in |
| `GET /api/internships/public` | Public |
| `GET /api/internships` | Student |
| `GET /api/internships/:id` | Signed in |
| `POST /api/applications/:internshipId/apply` · `GET /api/applications/my` | Student |
| `GET /api/applications/:internshipId/applicants` · `PATCH /api/applications/status/:applicationId` | Recruiter |
| `GET/POST /api/recruiter/internships` · `DELETE /api/recruiter/internships/:id` | Recruiter |
| `GET /api/notifications` · `PATCH /api/notifications/:id/read` · `PATCH /api/notifications/mark-all-read` | Signed in |
| `GET /api/admin/stats` · `GET /api/admin/users` · `GET /api/admin/internships` · `DELETE /api/admin/users/:id` · `DELETE /api/admin/internships/:id` | Admin |

## Deployment

The frontend and backend deploy separately: the API to a Node host (Render, Railway, a VPS…) and the frontend to a static host (Vercel, Netlify…).

### 1. Database

Create a MongoDB Atlas cluster, add a database user, and allow network access from your API host (or `0.0.0.0/0`). Use its connection string as `MONGO_URI`.

### 2. Backend (example: Render web service)

| Setting        | Value                         |
| -------------- | ----------------------------- |
| Root directory | `Backend`                     |
| Build command  | `npm ci`                      |
| Start command  | `npm start`                   |
| Health check   | `/api/health` (503 while the database is unreachable) |

Set every variable from `Backend/.env.example` in the host's dashboard, with `NODE_ENV=production` and `FRONTEND_URL` set to your deployed frontend URL (for example `https://internconnect.vercel.app`).

Production hardening already included: Helmet security headers, CORS restricted to `FRONTEND_URL`, rate limiting (stricter on login/register/password endpoints), gzip compression, request logging, `trust proxy` for correct client IPs, and graceful shutdown on `SIGTERM`.

> **Uploads:** photos and resumes are stored on disk in `Backend/uploads`. Many hosts (including Render's free tier) wipe the disk on every redeploy, so attach a persistent disk mounted at `Backend/uploads`, or move uploads to object storage (e.g. Cloudinary or S3) before going live.

### 3. Frontend (example: Vercel)

| Setting               | Value              |
| --------------------- | ------------------ |
| Root directory        | `Frontend`         |
| Build command         | `npm run build`    |
| Output directory      | `dist`             |
| Environment variable  | `VITE_API_URL=https://<your-api-host>` |

`Frontend/vercel.json` (Vercel) and `Frontend/public/_redirects` (Netlify) route every path to `index.html`, so deep links like `/student-dashboard` work on refresh. `VITE_API_URL` is read at build time, so redeploy the frontend after changing it.

### 4. After deploying

1. Open `https://<your-api-host>/api/health` and confirm `"database": "connected"`.
2. Register an account and confirm the verification email links to your frontend domain.
3. Promote your own account: `npm run make-admin -- you@example.com` (run locally with the production `MONGO_URI`, or in the host's shell).
