# Netlify Deployment Guide

## Step 1: Create a Free PostgreSQL Database

1. Go to **https://neon.tech** and sign up (free, no credit card)
2. Create a new project — it gives you a connection string like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. Copy this connection string

## Step 2: Set Up Local Environment (Optional)

Update `.env` with your Neon connection string:
```
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
JWT_SECRET="conference-portal-prototype-secret-key-change-in-production-2026"
```

Then push the schema and seed:
```bash
npx prisma db push --force-reset
node prisma/seed.js
```

## Step 3: Deploy to Netlify

### Option A: Using Netlify CLI
```bash
cd conference-portal
netlify deploy

# When prompted:
# - Create a new site
# - Choose a team
# - Site name: icrace-2026 (or any name)

# Set environment variables:
netlify env:set DATABASE_URL "postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
netlify env:set JWT_SECRET "conference-portal-prototype-secret-key-change-in-production-2026"

# Deploy to production:
netlify deploy --prod
```

### Option B: Using Netlify Dashboard
1. Go to **https://app.netlify.com**
2. Click **Add new site** → **Import from Git**
3. Connect your repository (push the project to GitHub first)
4. Build settings (auto-detected from netlify.toml):
   - Build command: `npx prisma generate && npx next build`
   - Publish directory: `.next`
5. Add environment variables:
   - `DATABASE_URL` = your Neon connection string
   - `JWT_SECRET` = `conference-portal-prototype-secret-key-change-in-production-2026`
6. Click **Deploy**

## Step 4: Seed the Database

After the first deploy, run the seed against your Neon database:

```bash
# Set your DATABASE_URL to the Neon connection string
npx prisma db push --force-reset
node prisma/seed.js
```

## Step 5: Test Your Live Site

Your site will be at something like `https://icrace-2026.netlify.app`

Login with any demo account (password: `Demo@1234`):
- admin@icrace2026.edu (Super Admin)
- participant@icrace2026.edu (Participant)
- reviewer@icrace2026.edu (Reviewer)
- etc.

## Environment Variables for Netlify

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Any long random string |

## Files Configured for Netlify

- `netlify.toml` — Build settings and Next.js plugin config
- `next.config.js` — External packages config for serverless
- `prisma/schema.prisma` — Set to PostgreSQL provider
- `package.json` — `postinstall` script runs `prisma generate` automatically
