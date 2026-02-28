# Welcome Email + Agent Skill API Design

Date: 2026-02-28

## Overview

Two features for the AIInAction platform:
1. **Welcome Email** — Send a thank-you email to new users via Resend
2. **Agent Skill API** — REST API + skill.md enabling AI agents (Claude Code, OpenClaw) to interact with the platform programmatically

---

## Feature 1: Welcome Email with Resend

### Data Flow

1. User signs in with GitHub → NextAuth handles OAuth
2. First-time user → PrismaAdapter creates User → NextAuth fires `events.createUser`
3. Handler checks `user.email` — if missing, skip silently
4. If email exists → `sendWelcomeEmail(user.name, user.email)` via Resend

### Changes

**New dependency:** `resend`

**New env var:** `RESEND_API_KEY`

**New file — `src/lib/email.ts`:**
- Resend client singleton
- `sendWelcomeEmail(name: string, email: string)` function
- Simple HTML email template (subject: "Welcome to AI In Action!")

**Modified file — `src/lib/auth.ts`:**
- Add `events: { createUser({ user }) { ... } }` to NextAuth config

### Email Content

- Subject: "Welcome to AI In Action!"
- Body: Greeting by name, brief intro, link to /challenges
- No new DB models needed

---

## Feature 2: Agent Skill API

### 2a. API Key System

**New Prisma model:**

```prisma
model ApiKey {
  id         String    @id @default(cuid())
  key        String    @unique          // SHA-256 hash of the raw key
  name       String    @default("Default")
  userId     String    @map("user_id")
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastUsedAt DateTime? @map("last_used_at")
  createdAt  DateTime  @default(now()) @map("created_at")

  @@map("api_keys")
}
```

**Key format:** `aia_<32-char-random>` — stored hashed, shown once on creation.

**New file — `src/lib/api-auth.ts`:**
- `authenticateApiKey(request)` → reads Bearer token, hashes, looks up, returns user or null
- Updates `lastUsedAt` on use

**User relation:** Add `apiKeys ApiKey[]` to User model.

### 2b. API Route Handlers

Base path: `/api/v1/`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/challenges` | List/search challenges (query params: category, difficulty, search, page, limit) |
| GET | `/api/v1/challenges/:slug` | Get challenge detail |
| POST | `/api/v1/challenges` | Create challenge (auth required) |
| PUT | `/api/v1/challenges/:slug` | Update own challenge (auth required) |
| POST | `/api/v1/challenges/:slug/complete` | Mark challenge complete (auth required) |
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/me` | Get current user profile + stats (auth required) |
| GET | `/api/v1/me/keys` | List API keys (auth required) |
| POST | `/api/v1/me/keys` | Generate new API key (auth required) |
| DELETE | `/api/v1/me/keys/:id` | Revoke API key (auth required) |

**File structure:**
```
src/app/api/v1/
  challenges/
    route.ts              → GET (list) + POST (create)
    [slug]/
      route.ts            → GET (detail) + PUT (update)
      complete/
        route.ts          → POST (mark complete)
  categories/
    route.ts              → GET (list)
  me/
    route.ts              → GET (profile)
    keys/
      route.ts            → GET (list) + POST (generate)
      [id]/
        route.ts          → DELETE (revoke)
```

**Response format:**
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "..." } }
```

### 2c. skill.md

Hosted at `public/skill.md` → `https://aiinaction.top/skill.md`

Format follows the agent skill convention:
- Frontmatter metadata: name, version, description, homepage
- Authentication instructions
- All endpoint documentation with examples
- Usage workflow for agents
- Rate limit info

### 2d. API Key Management UI

Add an "API Keys" section to the user profile page:
- List existing keys (name, created date, last used)
- Generate new key button (shows key once in modal)
- Revoke/delete key button

---

## Decisions

- Welcome email: Skip if no email (no error)
- Agent auth: Per-user API keys (not agent self-registration)
- API scope: Core CRUD + completion (not full feature parity)
- skill.md: Proper agent skill file format, hosted as static file
