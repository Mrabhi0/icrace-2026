# ICRACE 2026 — Conference Management Portal

A complete, functional prototype of a Conference Management Portal built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Quick Start

```bash
cd conference-portal
npm install
npx prisma db push --force-reset   # Create SQLite database
node prisma/seed.js                  # Load demo data
npm run dev                          # Start dev server at http://localhost:3000
```

## Demo Accounts (Password: `Demo@1234` for all)

| Role | Email | Dashboard |
|------|-------|-----------|
| Super Admin | admin@icrace2026.edu | /dashboard/admin |
| Finance Manager | finance@icrace2026.edu | /dashboard/finance |
| Operations Manager | operations@icrace2026.edu | /dashboard/operations |
| Committee Member | committee@icrace2026.edu | /dashboard/committee |
| Reviewer | reviewer@icrace2026.edu | /dashboard/reviewer |
| Participant | participant@icrace2026.edu | /dashboard/participant |

All accounts use the password `Demo@1234`. The login page has quick-fill buttons for each role.

## Implemented Features

### Public Website (no login required)
- Home page with countdown timer, speakers, tracks, fees, FAQ
- About page with committees and advisory board
- Research tracks page (6 tracks)
- Important dates timeline
- Registration info with fee table
- Call for Papers with guidelines
- Day-wise programme schedule (3 days)
- Contact form + FAQ accordion

### Authentication
- Registration and login with JWT sessions
- Password hashing (bcryptjs)
- Role-based access control via middleware
- Protected dashboard routes
- Access denied page for unauthorized access

### Participant Dashboard
- Overview with registration status, submissions, certificates
- Editable profile with institution details
- Registration workflow: create registration → simulate payment → confirmed
- Abstract submission with track selection and co-authors
- View reviewer feedback and editorial decisions
- Certificates (eligibility-based)
- Announcements and notifications

### Reviewer Dashboard
- Overview of assigned/completed reviews
- View assigned submissions with abstracts
- Review form with scoring (relevance, originality, methodology, clarity, technical quality, overall)
- Recommendation system (Accept, Minor Revision, Major Revision, Reject)
- Confidential comments for committee
- Review history

### Scientific Committee Dashboard
- Submission overview with status breakdown
- Initial screening queue
- Reviewer assignment and workload tracking
- Review comparison and feedback viewing
- Editorial decisions (Accept/Reject/Revision Requested) with timestamps
- Decision history log

### Finance Dashboard
- Revenue overview with stats
- Transaction list with search/sort/pagination
- Registration management
- Configurable fee engine (per category, early-bird, standard)
- Refund tracking
- CSV report exports (registrations, payments, submissions, decisions, users)

### Operations Dashboard
- Day-wise programme view
- QR/manual attendance check-in with duplicate detection
- Speaker management
- Volunteer management
- Announcement publishing

### Super Admin Dashboard
- Full system overview (users, registrations, revenue, submissions, attendance)
- User management (suspend, reactivate, edit roles)
- Conference configuration (name, dates, venue, contact)
- Fee rules management
- Track management (create/edit)
- Announcement management
- Email templates & test email log
- Audit logs (all system actions logged)
- CSV report exports

### Database (SQLite — switchable to PostgreSQL)
- 25+ tables with proper relationships, foreign keys, and unique constraints
- Persistent storage — data survives page refresh
- Seed data with demo users, submissions, reviews, payments, sessions, fees

### Security
- Server-side JWT sessions (httpOnly cookies)
- Password hashing with bcryptjs
- Role-based API authorization (server-side checks)
- Audit logging for sensitive actions
- All payments marked as TEST MODE

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Database:** Prisma ORM with SQLite (production: PostgreSQL)
- **Auth:** JWT sessions with bcryptjs password hashing
- **UI:** lucide-react icons, custom component library
- **QR:** qrcode library (for attendance)
- **Icons:** lucide-react

## Environment Variables

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="conference-portal-prototype-secret-key-change-in-production-2026"
NODE_ENV="development"
```

## Database Commands

```bash
npx prisma db push --force-reset   # Reset database
node prisma/seed.js                 # Seed demo data
npx prisma studio                   # Browse database visually
```

## Features in TEST MODE (simulated)

- **Payments:** Simulated gateway with success/fail/pending options. No real charges. All transactions marked TEST.
- **Emails:** Logged to database but not sent. Email log visible in admin panel.
- **Certificates:** PDF download not yet implemented — status tracking works.

## Production Requirements (not yet implemented)

- Switch SQLite to PostgreSQL (`provider = "postgresql"` in schema.prisma)
- Integrate Razorpay/Cashfree payment gateway with webhook verification
- Configure transactional email provider (SendGrid/SES)
- Server-side PDF generation for certificates and receipts
- Real QR code scanning (camera-based) for attendance
- Rate limiting on API endpoints
- CSRF protection
- File upload storage (S3/Cloud Storage)
- HTTPS, monitoring, and backup infrastructure
```
