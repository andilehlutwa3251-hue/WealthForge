# WealthForge

WealthForge is a SaaS-style financial operating system for ambitious South Africans. It combines portfolio tracking, AI-guided financial planning, course delivery, and subscription-based access to premium insights.

## Features
- Portfolio dashboard and wealth score engine
- Academy and learning modules
- Secure credentials-based authentication via NextAuth
- Prisma/PostgreSQL persistence
- Stripe checkout and subscription lifecycle support
- Vercel-ready deployment configuration

## Stack
- Next.js 14
- TypeScript
- Prisma + PostgreSQL
- NextAuth v4
- Stripe
- Tailwind CSS

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account and webhook secret
- Vercel account if deploying there

## Setup

1. Install dependencies:
   npm install

2. Copy environment variables:
   cp .env.example .env.local

3. Update the values in `.env.local` with your own secrets.

4. Push the Prisma schema:
   npx prisma db push

5. Generate the Prisma client:
   npx prisma generate

6. Start the app:
   npm run dev

## Production deploy

For Vercel, add the same environment variables in the project settings. The app expects these values to be available at runtime:
- DATABASE_URL
- DIRECT_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_FORGER
- STRIPE_PRICE_ELITE

## Useful scripts
- `npm run build` — production build
- `npm run lint` — linting
- `npm run typecheck` — TypeScript validation
- `npm run db:push` — apply schema updates
- `npm run db:studio` — Prisma Studio
