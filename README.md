# AI In Action

A Vibe Coding community website featuring 100 hands-on challenge projects across Web, Game, Mobile, and AI Agent development.

**Live site:** [aiinaction.top](https://aiinaction.top)

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **UI:** shadcn/ui + Tailwind CSS v4 + Framer Motion
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5 with GitHub OAuth
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env .env.local
# Edit .env.local with your database URL and GitHub OAuth credentials

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the 100 challenges
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `GITHUB_ID` | GitHub OAuth App Client ID |
| `GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `NEXTAUTH_URL` | Base URL (e.g., `http://localhost:3000`) |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── challenges/       # Challenge browse + detail
│   ├── paths/            # Learning path pages
│   ├── showcase/         # Community project showcase
│   ├── profile/          # User profiles
│   └── api/auth/         # NextAuth API routes
├── components/
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Header, Footer
├── data/
│   └── challenges.ts     # 100 challenges data
└── lib/
    ├── auth.ts           # NextAuth config
    ├── prisma.ts         # Prisma client
    └── challenges.ts     # Data access helpers
```
