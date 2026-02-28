# Welcome Email + Agent Skill API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add welcome emails via Resend for new users and build a REST API with skill.md so AI agents can interact with challenges on aiinaction.top.

**Architecture:** Feature 1 hooks into NextAuth's `events.createUser` to trigger Resend emails. Feature 2 adds an `ApiKey` model, API key auth middleware, Next.js API route handlers under `/api/v1/`, API key management UI on the profile page, and a `public/skill.md` skill file.

**Tech Stack:** Resend (email), Next.js API Routes, Prisma, crypto (Node.js built-in for SHA-256 hashing)

---

### Task 1: Install Resend and create email service

**Files:**
- Create: `src/lib/email.ts`
- Modify: `package.json` (via pnpm add)

**Step 1: Install resend**

Run: `pnpm add resend`

**Step 2: Create email service**

Create `src/lib/email.ts`:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(name: string, email: string) {
  const firstName = name?.split(" ")[0] || "there";

  await resend.emails.send({
    from: "AI In Action <noreply@aiinaction.top>",
    to: email,
    subject: "Welcome to AI In Action!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Welcome to AI In Action, ${firstName}!</h1>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
          Thanks for joining our community of AI builders. AI In Action is a hands-on learning platform where you can sharpen your AI skills through real-world challenge projects.
        </p>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
          Here's how to get started:
        </p>
        <ul style="color: #4a4a4a; font-size: 16px; line-height: 1.8;">
          <li>Browse challenges across 10 AI categories</li>
          <li>Pick a challenge that matches your skill level</li>
          <li>Build your project and mark it complete to earn XP</li>
          <li>Share your work in the community showcase</li>
        </ul>
        <div style="margin-top: 32px;">
          <a href="https://aiinaction.top/challenges" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 500;">
            Explore Challenges
          </a>
        </div>
        <p style="color: #9a9a9a; font-size: 14px; margin-top: 40px;">
          — The AI In Action Team
        </p>
      </div>
    `,
  });
}
```

**Step 3: Commit**

```bash
git add src/lib/email.ts package.json pnpm-lock.yaml
git commit -m "feat: add Resend email service with welcome email template"
```

---

### Task 2: Hook welcome email into NextAuth

**Files:**
- Modify: `src/lib/auth.ts`

**Step 1: Add createUser event to NextAuth config**

In `src/lib/auth.ts`, add the `events` property to the NextAuth config object (after the `pages` property):

```typescript
import { sendWelcomeEmail } from "./email";

// Inside NextAuth config, add after pages: { ... }:
  events: {
    async createUser({ user }) {
      if (user.email) {
        try {
          await sendWelcomeEmail(user.name || "", user.email);
        } catch {
          // Graceful degradation — don't block sign-in if email fails
        }
      }
    },
  },
```

**Step 2: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: send welcome email on new user registration"
```

---

### Task 3: Add ApiKey model to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Add ApiKey model and User relation**

Add to `prisma/schema.prisma`:

```prisma
model ApiKey {
  id         String    @id @default(cuid())
  key        String    @unique
  name       String    @default("Default")
  userId     String    @map("user_id")
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastUsedAt DateTime? @map("last_used_at")
  createdAt  DateTime  @default(now()) @map("created_at")

  @@map("api_keys")
}
```

Add to the User model's relations:

```prisma
  apiKeys            ApiKey[]
```

**Step 2: Push schema to DB**

Run: `pnpm db:push`

**Step 3: Regenerate Prisma client**

Run: `pnpm db:generate`

**Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add ApiKey model to Prisma schema"
```

---

### Task 4: Create API key auth middleware

**Files:**
- Create: `src/lib/api-auth.ts`

**Step 1: Create the auth middleware**

Create `src/lib/api-auth.ts`:

```typescript
import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma";

const API_KEY_PREFIX = "aia_";

export function generateApiKey(): string {
  return API_KEY_PREFIX + randomBytes(32).toString("hex");
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export type ApiUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export async function authenticateApiKey(
  request: Request
): Promise<ApiUser | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const rawKey = authHeader.slice(7);
  if (!rawKey.startsWith(API_KEY_PREFIX)) return null;

  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  if (!apiKey) return null;

  // Update lastUsedAt (fire and forget)
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {});

  return apiKey.user;
}

export function jsonSuccess(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function jsonError(code: string, message: string, status = 400) {
  return Response.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export async function requireAuth(request: Request) {
  const user = await authenticateApiKey(request);
  if (!user) {
    return { user: null, error: jsonError("UNAUTHORIZED", "Invalid or missing API key", 401) };
  }
  return { user, error: null };
}
```

**Step 2: Commit**

```bash
git add src/lib/api-auth.ts
git commit -m "feat: add API key auth middleware with helpers"
```

---

### Task 5: Create API key management endpoints

**Files:**
- Create: `src/app/api/v1/me/route.ts`
- Create: `src/app/api/v1/me/keys/route.ts`
- Create: `src/app/api/v1/me/keys/[id]/route.ts`

**Step 1: Create GET /api/v1/me**

Create `src/app/api/v1/me/route.ts`:

```typescript
import { requireAuth, jsonSuccess } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const stats = await prisma.userStats.findUnique({
    where: { userId: user!.id },
  });

  const completionCount = await prisma.challengeCompletion.count({
    where: { userId: user!.id, status: "COMPLETED" },
  });

  const challengeCount = await prisma.challenge.count({
    where: { authorId: user!.id },
  });

  return jsonSuccess({
    ...user,
    stats: stats
      ? { xp: stats.xp, level: stats.level, currentStreak: stats.currentStreak }
      : { xp: 0, level: 1, currentStreak: 0 },
    completedChallenges: completionCount,
    publishedChallenges: challengeCount,
  });
}
```

**Step 2: Create GET/POST /api/v1/me/keys**

Create `src/app/api/v1/me/keys/route.ts`:

```typescript
import { requireAuth, jsonSuccess, jsonError, generateApiKey, hashApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const keys = await prisma.apiKey.findMany({
    where: { userId: user!.id },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: "desc" },
  });

  return jsonSuccess(keys);
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const name = (body as { name?: string }).name || "Default";

  // Limit to 5 keys per user
  const count = await prisma.apiKey.count({ where: { userId: user!.id } });
  if (count >= 5) {
    return jsonError("LIMIT_REACHED", "Maximum 5 API keys per user", 400);
  }

  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: { key: hashedKey, name, userId: user!.id },
  });

  // Return the raw key only on creation — it won't be retrievable again
  return jsonSuccess({ id: apiKey.id, name: apiKey.name, key: rawKey }, 201);
}
```

**Step 3: Create DELETE /api/v1/me/keys/[id]**

Create `src/app/api/v1/me/keys/[id]/route.ts`:

```typescript
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const { id } = await params;

  const apiKey = await prisma.apiKey.findUnique({ where: { id } });
  if (!apiKey || apiKey.userId !== user!.id) {
    return jsonError("NOT_FOUND", "API key not found", 404);
  }

  await prisma.apiKey.delete({ where: { id } });

  return jsonSuccess({ deleted: true });
}
```

**Step 4: Commit**

```bash
git add src/app/api/v1/me/
git commit -m "feat: add API key management endpoints (me, keys CRUD)"
```

---

### Task 6: Create categories endpoint

**Files:**
- Create: `src/app/api/v1/categories/route.ts`

**Step 1: Create GET /api/v1/categories**

Create `src/app/api/v1/categories/route.ts`:

```typescript
import { jsonSuccess } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isOfficial: true },
    select: { id: true, slug: true, name: true, description: true, icon: true },
    orderBy: { order: "asc" },
  });

  return jsonSuccess(categories);
}
```

**Step 2: Commit**

```bash
git add src/app/api/v1/categories/
git commit -m "feat: add categories API endpoint"
```

---

### Task 7: Create challenges list and create endpoints

**Files:**
- Create: `src/app/api/v1/challenges/route.ts`

**Step 1: Create GET/POST /api/v1/challenges**

Create `src/app/api/v1/challenges/route.ts`:

```typescript
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import type { Difficulty } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = url.searchParams.get("search") || undefined;
  const category = url.searchParams.get("category") || undefined;
  const difficulty = url.searchParams.get("difficulty") as Difficulty | undefined;
  const official = url.searchParams.get("official");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { slug: category };
  if (difficulty) where.difficulty = difficulty;
  if (official === "true") where.isOfficial = true;
  if (official === "false") where.isOfficial = false;

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        difficulty: true,
        isOfficial: true,
        likesCount: true,
        estimatedTime: true,
        createdAt: true,
        category: { select: { slug: true, name: true } },
        author: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.challenge.count({ where }),
  ]);

  const formatted = challenges.map((c) => ({
    ...c,
    tags: c.tags.map((t) => t.tag.name),
  }));

  return jsonSuccess({ challenges: formatted, total, page, limit });
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("BAD_REQUEST", "Invalid JSON body", 400);

  const { title, description, difficulty, categoryId, tags, objectives, hints, resources, estimatedTime } = body as {
    title?: string;
    description?: string;
    difficulty?: string;
    categoryId?: string;
    tags?: string[];
    objectives?: string[];
    hints?: string[];
    resources?: string[];
    estimatedTime?: string;
  };

  if (!title || !description || !difficulty) {
    return jsonError("VALIDATION_ERROR", "title, description, and difficulty are required", 400);
  }

  const validDifficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
  if (!validDifficulties.includes(difficulty)) {
    return jsonError("VALIDATION_ERROR", `difficulty must be one of: ${validDifficulties.join(", ")}`, 400);
  }

  // Generate unique slug
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let suffix = 0;
  while (await prisma.challenge.findUnique({ where: { slug } })) {
    suffix++;
    slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${suffix}`;
  }

  const challenge = await prisma.challenge.create({
    data: {
      slug,
      title,
      description,
      difficulty: difficulty as Difficulty,
      categoryId: categoryId || null,
      authorId: user!.id,
      isOfficial: false,
      objectives: (objectives || []).filter(Boolean),
      hints: (hints || []).filter(Boolean),
      resources: (resources || []).filter(Boolean),
      estimatedTime: estimatedTime || null,
    },
  });

  // Sync tags
  if (tags?.length) {
    for (const name of tags) {
      const normalized = name.toLowerCase().trim();
      if (!normalized) continue;
      const tag = await prisma.tag.upsert({
        where: { name: normalized },
        update: {},
        create: { name: normalized },
      });
      await prisma.challengeTag.create({
        data: { challengeId: challenge.id, tagId: tag.id },
      });
    }
  }

  return jsonSuccess({
    id: challenge.id,
    slug: challenge.slug,
    title: challenge.title,
    url: `https://aiinaction.top/challenges/${challenge.slug}`,
  }, 201);
}
```

**Step 2: Commit**

```bash
git add src/app/api/v1/challenges/route.ts
git commit -m "feat: add challenges list and create API endpoints"
```

---

### Task 8: Create challenge detail, update, and complete endpoints

**Files:**
- Create: `src/app/api/v1/challenges/[slug]/route.ts`
- Create: `src/app/api/v1/challenges/[slug]/complete/route.ts`

**Step 1: Create GET/PUT /api/v1/challenges/[slug]**

Create `src/app/api/v1/challenges/[slug]/route.ts`:

```typescript
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import type { Difficulty } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true, name: true } },
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: { select: { name: true } } } },
      forkedFrom: { select: { slug: true, title: true } },
    },
  });

  if (!challenge) {
    return jsonError("NOT_FOUND", "Challenge not found", 404);
  }

  return jsonSuccess({
    ...challenge,
    tags: challenge.tags.map((t) => t.tag.name),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const { slug } = await params;

  const existing = await prisma.challenge.findUnique({ where: { slug } });
  if (!existing) return jsonError("NOT_FOUND", "Challenge not found", 404);
  if (existing.authorId !== user!.id) return jsonError("FORBIDDEN", "You can only edit your own challenges", 403);

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("BAD_REQUEST", "Invalid JSON body", 400);

  const { title, description, difficulty, categoryId, tags, objectives, hints, resources, estimatedTime } = body as {
    title?: string;
    description?: string;
    difficulty?: string;
    categoryId?: string;
    tags?: string[];
    objectives?: string[];
    hints?: string[];
    resources?: string[];
    estimatedTime?: string;
  };

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (difficulty !== undefined) {
    const validDifficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
    if (!validDifficulties.includes(difficulty)) {
      return jsonError("VALIDATION_ERROR", `difficulty must be one of: ${validDifficulties.join(", ")}`, 400);
    }
    updateData.difficulty = difficulty as Difficulty;
  }
  if (categoryId !== undefined) updateData.categoryId = categoryId || null;
  if (objectives !== undefined) updateData.objectives = objectives.filter(Boolean);
  if (hints !== undefined) updateData.hints = hints.filter(Boolean);
  if (resources !== undefined) updateData.resources = resources.filter(Boolean);
  if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime || null;

  const updated = await prisma.challenge.update({
    where: { id: existing.id },
    data: updateData,
  });

  // Sync tags if provided
  if (tags) {
    await prisma.challengeTag.deleteMany({ where: { challengeId: existing.id } });
    for (const name of tags) {
      const normalized = name.toLowerCase().trim();
      if (!normalized) continue;
      const tag = await prisma.tag.upsert({
        where: { name: normalized },
        update: {},
        create: { name: normalized },
      });
      await prisma.challengeTag.create({
        data: { challengeId: existing.id, tagId: tag.id },
      });
    }
  }

  return jsonSuccess({
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    url: `https://aiinaction.top/challenges/${updated.slug}`,
  });
}
```

**Step 2: Create POST /api/v1/challenges/[slug]/complete**

Create `src/app/api/v1/challenges/[slug]/complete/route.ts`:

```typescript
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { XP_BY_DIFFICULTY } from "@/lib/xp";
import { awardXP, updateStreak } from "@/lib/gamification";
import { checkAndAwardAchievements } from "@/lib/achievements";
import type { Difficulty } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const { slug } = await params;

  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    select: { id: true, difficulty: true },
  });

  if (!challenge) return jsonError("NOT_FOUND", "Challenge not found", 404);

  const userId = user!.id;

  const existing = await prisma.challengeCompletion.findUnique({
    where: { userId_challengeId: { userId, challengeId: challenge.id } },
  });

  const alreadyCompleted = existing?.status === "COMPLETED";

  await prisma.challengeCompletion.upsert({
    where: { userId_challengeId: { userId, challengeId: challenge.id } },
    update: { status: "COMPLETED", completedAt: new Date() },
    create: { userId, challengeId: challenge.id, status: "COMPLETED", completedAt: new Date() },
  });

  let xpGained = 0;
  if (!alreadyCompleted) {
    xpGained = XP_BY_DIFFICULTY[challenge.difficulty as Difficulty];
    await updateStreak(userId);
    await awardXP(userId, xpGained);
  }

  const newAchievements = await checkAndAwardAchievements(userId, "challenge_complete");

  let achievementXP = 0;
  for (const a of newAchievements) achievementXP += a.xpReward;
  if (achievementXP > 0) {
    await awardXP(userId, achievementXP);
    xpGained += achievementXP;
  }

  return jsonSuccess({
    completed: true,
    alreadyCompleted,
    xpGained,
    achievements: newAchievements.map((a) => ({ name: a.name, icon: a.icon, xpReward: a.xpReward })),
  });
}
```

**Step 3: Commit**

```bash
git add src/app/api/v1/challenges/
git commit -m "feat: add challenge detail, update, and complete API endpoints"
```

---

### Task 9: Create API key management server actions and UI

**Files:**
- Create: `src/actions/api-keys.ts`
- Modify: `src/app/[locale]/profile/[id]/profile-content.tsx`

**Step 1: Create server actions for API key management from the web UI**

Create `src/actions/api-keys.ts`:

```typescript
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";

export async function createApiKey(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const count = await prisma.apiKey.count({ where: { userId: session.user.id } });
  if (count >= 5) throw new Error("Maximum 5 API keys");

  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: { key: hashedKey, name: name || "Default", userId: session.user.id },
  });

  return { id: apiKey.id, name: apiKey.name, key: rawKey };
}

export async function listApiKeys() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.apiKey.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteApiKey(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const apiKey = await prisma.apiKey.findUnique({ where: { id } });
  if (!apiKey || apiKey.userId !== session.user.id) throw new Error("Not found");

  await prisma.apiKey.delete({ where: { id } });
}
```

**Step 2: Add API Keys tab to profile page**

Add an "API Keys" tab to `src/app/[locale]/profile/[id]/profile-content.tsx` that shows only when `isOwnProfile` is true. The tab should:
- List existing keys with name, created date, last used
- Have a "Generate New Key" button that calls `createApiKey()` and shows the raw key in a copyable dialog (only shown once)
- Have a delete button per key that calls `deleteApiKey()`

Use the existing tab pattern in the component. The new tab value should be `"api-keys"` and only appear in the tab list when `isOwnProfile`.

**Step 3: Commit**

```bash
git add src/actions/api-keys.ts src/app/[locale]/profile/[id]/profile-content.tsx
git commit -m "feat: add API key management UI to profile page"
```

---

### Task 10: Create skill.md

**Files:**
- Create: `public/skill.md`

**Step 1: Create the skill.md file**

Create `public/skill.md` with the full agent skill documentation. This file should include:

- Frontmatter: name (aiinaction), version, description, homepage, api_base
- Authentication section: how to get an API key from the profile page, Bearer token usage
- All endpoint documentation with method, path, request/response JSON examples
- Endpoints: GET /challenges, GET /challenges/:slug, POST /challenges, PUT /challenges/:slug, POST /challenges/:slug/complete, GET /categories, GET /me
- Usage workflow for agents
- Rate limits

Format it as a proper skill markdown file that AI agents (Claude Code, OpenClaw) can read and follow.

**Step 2: Commit**

```bash
git add public/skill.md
git commit -m "feat: add skill.md for AI agent integration"
```

---

### Task 11: Update environment and documentation

**Files:**
- Modify: `CLAUDE.md` (add API section)

**Step 1: Add RESEND_API_KEY to .env**

Add to `.env`:
```
RESEND_API_KEY=re_xxx  # Get from https://resend.com/api-keys
```

**Step 2: Update CLAUDE.md**

Add to the Key Environment Variables section:
```
RESEND_API_KEY    # Resend API key for sending emails
```

Add a new "API" section documenting the `/api/v1/` endpoints.

**Step 3: Final commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with API and email documentation"
```
