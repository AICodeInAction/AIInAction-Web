# Expand AI Scenarios + User Challenges — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform AIInAction from a fixed "Vibe Coding" challenge site into an open platform covering all AI application scenarios with user-generated challenges, likes, comments, and fork.

**Architecture:** Approach C — all runtime reads from PostgreSQL via Prisma. `src/data/challenges.ts` retained as seed source only. Category becomes a DB table (replacing enum). Server Actions handle all writes. No REST API routes.

**Tech Stack:** Next.js 16 (App Router), Prisma 7 with `@prisma/adapter-pg`, NextAuth v5, shadcn/ui (Radix + Tailwind v4), Framer Motion, pnpm.

**Design doc:** `docs/plans/2026-02-22-expand-ai-scenarios-design.md`

---

## Task 1: Update Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Update the schema**

Replace the entire `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  githubId      String?   @unique @map("github_id")
  githubUrl     String?   @map("github_url")
  bio           String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  accounts           Account[]
  sessions           Session[]
  completions        ChallengeCompletion[]
  projects           SharedProject[]
  authoredChallenges Challenge[]        @relation("AuthoredChallenges")
  challengeLikes     ChallengeLike[]
  challengeComments  ChallengeComment[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Category {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String
  description String?     @db.Text
  icon        String?
  color       String?
  order       Int         @default(0)
  isOfficial  Boolean     @default(false) @map("is_official")
  challenges  Challenge[]
  createdAt   DateTime    @default(now()) @map("created_at")

  @@map("categories")
}

model Tag {
  id         String         @id @default(cuid())
  name       String         @unique
  challenges ChallengeTag[]

  @@map("tags")
}

model ChallengeTag {
  challengeId String    @map("challenge_id")
  tagId       String    @map("tag_id")
  challenge   Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  tag         Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([challengeId, tagId])
  @@map("challenge_tags")
}

model LearningPath {
  id          String      @id @default(cuid())
  slug        String      @unique
  title       String
  description String      @db.Text
  icon        String
  color       String
  order       Int         @default(0)
  challenges  Challenge[]
  createdAt   DateTime    @default(now()) @map("created_at")

  @@map("learning_paths")
}

model Challenge {
  id            String     @id @default(cuid())
  slug          String     @unique
  title         String
  description   String     @db.Text
  difficulty    Difficulty
  objectives    String[]
  hints         String[]
  resources     String[]
  estimatedTime String?    @map("estimated_time")
  order         Int        @default(0)

  isOfficial    Boolean    @default(false) @map("is_official")
  authorId      String?    @map("author_id")
  author        User?      @relation("AuthoredChallenges", fields: [authorId], references: [id])
  forkedFromId  String?    @map("forked_from_id")
  forkedFrom    Challenge? @relation("Forks", fields: [forkedFromId], references: [id])
  forks         Challenge[] @relation("Forks")
  likesCount    Int        @default(0) @map("likes_count")

  categoryId    String?    @map("category_id")
  category      Category?  @relation(fields: [categoryId], references: [id])

  pathId        String?    @map("path_id")
  path          LearningPath? @relation(fields: [pathId], references: [id])

  tags          ChallengeTag[]
  completions   ChallengeCompletion[]
  projects      SharedProject[]
  likes         ChallengeLike[]
  comments      ChallengeComment[]

  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")

  @@map("challenges")
}

model ChallengeCompletion {
  id          String           @id @default(cuid())
  userId      String           @map("user_id")
  challengeId String           @map("challenge_id")
  status      CompletionStatus @default(IN_PROGRESS)
  completedAt DateTime?        @map("completed_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@unique([userId, challengeId])
  @@map("challenge_completions")
}

model SharedProject {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  challengeId String?   @map("challenge_id")
  title       String
  description String    @db.Text
  githubUrl   String    @map("github_url")
  demoUrl     String?   @map("demo_url")
  thumbnail   String?
  tags        String[]
  likes       Int       @default(0)

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge Challenge? @relation(fields: [challengeId], references: [id])

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("shared_projects")
}

model ChallengeLike {
  userId      String   @map("user_id")
  challengeId String   @map("challenge_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge   Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now()) @map("created_at")

  @@id([userId, challengeId])
  @@map("challenge_likes")
}

model ChallengeComment {
  id          String   @id @default(cuid())
  content     String   @db.Text
  userId      String   @map("user_id")
  challengeId String   @map("challenge_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge   Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("challenge_comments")
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CompletionStatus {
  IN_PROGRESS
  COMPLETED
}
```

Key changes vs current schema:
- Removed `Category` enum
- Removed `tags String[]` and `category Category` from Challenge
- Added `Category`, `Tag`, `ChallengeTag`, `ChallengeLike`, `ChallengeComment` models
- Added `isOfficial`, `authorId`, `forkedFromId`, `likesCount`, `categoryId`, `updatedAt` to Challenge
- Added new relations to User

**Step 2: Push schema to database**

Run: `pnpm db:push`
Expected: Schema synced, Prisma client regenerated.

**Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "schema: add Category/Tag/Like/Comment tables, expand Challenge model"
```

---

## Task 2: Update Seed Data Types and Seed Script

**Files:**
- Modify: `src/data/challenges.ts` (first ~25 lines — type definition and `learningPaths` array)
- Modify: `prisma/seed.ts`

**Step 1: Update `ChallengeData` type in `src/data/challenges.ts`**

Change the `category` field name and type:

```typescript
// Before:
//   category: "WEB" | "GAME" | "MOBILE" | "AI_AGENT";
// After:
   categorySlug: string;
```

Then do a find-and-replace across the same file for all 100 challenge objects:
- `category: "WEB"` → `categorySlug: "web-development"`
- `category: "GAME"` → `categorySlug: "game-development"`
- `category: "MOBILE"` → `categorySlug: "mobile-development"`
- `category: "AI_AGENT"` → `categorySlug: "ai-agents"`

**Step 2: Add official categories to `src/data/challenges.ts`**

Add this after the `learningPaths` export:

```typescript
export type CategoryData = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
};

export const officialCategories: CategoryData[] = [
  {
    slug: "web-development",
    name: "Web Development",
    description: "Build modern web applications from responsive portfolios to full-stack platforms.",
    icon: "Code2",
    color: "#3B82F6",
    order: 1,
  },
  {
    slug: "game-development",
    name: "Game Development",
    description: "Create browser-based games from classic arcade titles to multiplayer worlds.",
    icon: "Gamepad2",
    color: "#10B981",
    order: 2,
  },
  {
    slug: "mobile-development",
    name: "Mobile App Development",
    description: "Ship cross-platform mobile apps with React Native and Expo.",
    icon: "Smartphone",
    color: "#F59E0B",
    order: 3,
  },
  {
    slug: "ai-agents",
    name: "AI Agents & Automation",
    description: "Build intelligent AI-powered agents, from chat bots to autonomous research systems.",
    icon: "Bot",
    color: "#8B5CF6",
    order: 4,
  },
  {
    slug: "ai-writing",
    name: "AI Writing & Content",
    description: "Create AI-powered writing tools, content generators, and text transformation apps.",
    icon: "Pen",
    color: "#EC4899",
    order: 5,
  },
  {
    slug: "ai-image",
    name: "AI Image & Design",
    description: "Build image generation, editing, and computer vision applications.",
    icon: "Image",
    color: "#F43F5E",
    order: 6,
  },
  {
    slug: "ai-video",
    name: "AI Video Generation",
    description: "Create AI-powered video generation, editing, and analysis tools.",
    icon: "Video",
    color: "#EF4444",
    order: 7,
  },
  {
    slug: "ai-data",
    name: "AI Data Analysis",
    description: "Build intelligent data analysis, visualization, and insight generation tools.",
    icon: "BarChart3",
    color: "#06B6D4",
    order: 8,
  },
  {
    slug: "ai-audio",
    name: "AI Audio & Speech",
    description: "Create speech recognition, text-to-speech, music generation, and audio processing apps.",
    icon: "AudioLines",
    color: "#14B8A6",
    order: 9,
  },
  {
    slug: "ai-coding",
    name: "AI-Assisted Coding",
    description: "Build AI-powered code generation, review, debugging, and developer tools.",
    icon: "Terminal",
    color: "#6366F1",
    order: 10,
  },
];
```

**Step 3: Rewrite `prisma/seed.ts`**

```typescript
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  learningPaths,
  challenges,
  officialCategories,
} from "../src/data/challenges";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Upsert official categories
  for (const cat of officialCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        order: cat.order,
        isOfficial: true,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        order: cat.order,
        isOfficial: true,
      },
    });
  }
  console.log(`  Seeded ${officialCategories.length} categories.`);

  // 2. Upsert learning paths
  for (const path of learningPaths) {
    await prisma.learningPath.upsert({
      where: { slug: path.slug },
      update: {
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        order: path.order,
      },
      create: {
        slug: path.slug,
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        order: path.order,
      },
    });
    console.log(`  Path: ${path.title}`);
  }

  // Build lookup maps
  const categoryMap = new Map<string, string>();
  for (const c of await prisma.category.findMany()) {
    categoryMap.set(c.slug, c.id);
  }

  const pathMap = new Map<string, string>();
  for (const p of await prisma.learningPath.findMany()) {
    pathMap.set(p.slug, p.id);
  }

  // 3. Upsert challenges + tags
  for (const challenge of challenges) {
    const pathId = pathMap.get(challenge.pathSlug) ?? null;
    const categoryId = categoryMap.get(challenge.categorySlug) ?? null;

    const upserted = await prisma.challenge.upsert({
      where: { slug: challenge.slug },
      update: {
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        objectives: challenge.objectives,
        hints: challenge.hints,
        resources: challenge.resources,
        estimatedTime: challenge.estimatedTime,
        order: challenge.order,
        isOfficial: true,
        categoryId,
        pathId,
      },
      create: {
        slug: challenge.slug,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        objectives: challenge.objectives,
        hints: challenge.hints,
        resources: challenge.resources,
        estimatedTime: challenge.estimatedTime,
        order: challenge.order,
        isOfficial: true,
        authorId: null,
        categoryId,
        pathId,
      },
    });

    // Sync tags: delete existing, re-create
    await prisma.challengeTag.deleteMany({
      where: { challengeId: upserted.id },
    });

    for (const tagName of challenge.tags) {
      const normalized = tagName.toLowerCase().trim();
      const tag = await prisma.tag.upsert({
        where: { name: normalized },
        update: {},
        create: { name: normalized },
      });
      await prisma.challengeTag.create({
        data: { challengeId: upserted.id, tagId: tag.id },
      });
    }
  }

  console.log(`  Seeded ${challenges.length} challenges.`);
  console.log("Done.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

**Step 4: Run seed**

Run: `pnpm db:seed`
Expected: All categories, paths, and challenges seeded successfully.

**Step 5: Commit**

```bash
git add src/data/challenges.ts prisma/seed.ts
git commit -m "feat: update seed data types and script for new category/tag model"
```

---

## Task 3: Rewrite Data Query Layer (`src/lib/challenges.ts`)

**Files:**
- Rewrite: `src/lib/challenges.ts`

**Step 1: Replace `src/lib/challenges.ts` with DB queries**

```typescript
import { prisma } from "./prisma";
import type { Difficulty } from "@prisma/client";

export type ChallengeFilters = {
  categorySlug?: string;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
  official?: boolean;   // true = official only, false = community only, undefined = all
  page?: number;
  pageSize?: number;
};

export async function getChallenges(filters: ChallengeFilters = {}) {
  const { categorySlug, difficulty, tag, search, official, page = 1, pageSize = 30 } = filters;

  const where: Parameters<typeof prisma.challenge.findMany>[0]["where"] = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (difficulty) {
    where.difficulty = difficulty;
  }
  if (official !== undefined) {
    where.isOfficial = official;
  }
  if (tag) {
    where.tags = { some: { tag: { name: tag.toLowerCase() } } };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      include: {
        category: true,
        tags: { include: { tag: true } },
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: [{ isOfficial: "desc" }, { likesCount: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.challenge.count({ where }),
  ]);

  return { challenges, total, page, pageSize };
}

export async function getChallengeBySlug(slug: string) {
  return prisma.challenge.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true, image: true, githubUrl: true } },
      forkedFrom: { select: { id: true, slug: true, title: true } },
      path: true,
      _count: { select: { forks: true, comments: true } },
    },
  });
}

export async function getChallengeComments(challengeId: string, page = 1, pageSize = 20) {
  const [comments, total] = await Promise.all([
    prisma.challengeComment.findMany({
      where: { challengeId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.challengeComment.count({ where: { challengeId } }),
  ]);
  return { comments, total, page, pageSize };
}

export async function getChallengesByPath(pathSlug: string) {
  return prisma.challenge.findMany({
    where: { path: { slug: pathSlug } },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { order: "asc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isOfficial: true },
    orderBy: { order: "asc" },
  });
}

export async function getPopularTags(limit = 20) {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { challenges: true } } },
    orderBy: { challenges: { _count: "desc" } },
    take: limit,
  });
  return tags.map((t) => ({ name: t.name, count: t._count.challenges }));
}

export async function getUserChallenges(userId: string) {
  return prisma.challenge.findMany({
    where: { authorId: userId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function hasUserLiked(userId: string, challengeId: string) {
  const like = await prisma.challengeLike.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });
  return !!like;
}

export async function getStats() {
  const [challengeCount, categoryCount, userCount, projectCount] = await Promise.all([
    prisma.challenge.count(),
    prisma.category.count({ where: { isOfficial: true } }),
    prisma.user.count(),
    prisma.sharedProject.count(),
  ]);
  return { challengeCount, categoryCount, userCount, projectCount };
}

// Kept for backward compat during migration — used by path-detail and challenge detail nav
export const difficultyConfig = {
  BEGINNER: {
    label: "Beginner",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  ADVANCED: {
    label: "Advanced",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  EXPERT: {
    label: "Expert",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
} as const;
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Build will fail because pages still import old functions/types. That's OK — we fix pages in later tasks.

**Step 3: Commit**

```bash
git add src/lib/challenges.ts
git commit -m "feat: rewrite challenge queries from static data to DB"
```

---

## Task 4: Server Actions — Challenge CRUD + Fork

**Files:**
- Create: `src/actions/challenges.ts`

**Step 1: Create the server actions file**

```typescript
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (await prisma.challenge.findUnique({ where: { slug } })) {
    suffix++;
    slug = `${slugify(base)}-${suffix}`;
  }
  return slug;
}

async function syncTags(challengeId: string, tagNames: string[]) {
  await prisma.challengeTag.deleteMany({ where: { challengeId } });
  for (const name of tagNames) {
    const normalized = name.toLowerCase().trim();
    if (!normalized) continue;
    const tag = await prisma.tag.upsert({
      where: { name: normalized },
      update: {},
      create: { name: normalized },
    });
    await prisma.challengeTag.create({
      data: { challengeId, tagId: tag.id },
    });
  }
}

export async function createChallenge(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const categoryId = formData.get("categoryId") as string;
  const tagsRaw = formData.get("tags") as string;
  const objectives = formData.getAll("objectives") as string[];
  const hints = formData.getAll("hints") as string[];
  const resources = formData.getAll("resources") as string[];
  const estimatedTime = (formData.get("estimatedTime") as string) || null;

  const slug = await generateUniqueSlug(title);
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const challenge = await prisma.challenge.create({
    data: {
      slug,
      title,
      description,
      difficulty: difficulty as any,
      categoryId: categoryId || null,
      authorId: session.user.id,
      isOfficial: false,
      objectives: objectives.filter(Boolean),
      hints: hints.filter(Boolean),
      resources: resources.filter(Boolean),
      estimatedTime,
    },
  });

  await syncTags(challenge.id, tags);

  revalidatePath("/challenges");
  redirect(`/challenges/${challenge.slug}`);
}

export async function updateChallenge(challengeId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!existing || existing.authorId !== session.user.id) {
    throw new Error("Forbidden");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const categoryId = formData.get("categoryId") as string;
  const tagsRaw = formData.get("tags") as string;
  const objectives = formData.getAll("objectives") as string[];
  const hints = formData.getAll("hints") as string[];
  const resources = formData.getAll("resources") as string[];
  const estimatedTime = (formData.get("estimatedTime") as string) || null;

  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  await prisma.challenge.update({
    where: { id: challengeId },
    data: {
      title,
      description,
      difficulty: difficulty as any,
      categoryId: categoryId || null,
      objectives: objectives.filter(Boolean),
      hints: hints.filter(Boolean),
      resources: resources.filter(Boolean),
      estimatedTime,
    },
  });

  await syncTags(challengeId, tags);

  revalidatePath(`/challenges/${existing.slug}`);
  redirect(`/challenges/${existing.slug}`);
}

export async function deleteChallenge(challengeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!existing || existing.authorId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.challenge.delete({ where: { id: challengeId } });

  revalidatePath("/challenges");
  redirect("/challenges");
}

export async function forkChallenge(originalSlug: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const original = await prisma.challenge.findUnique({
    where: { slug: originalSlug },
    include: { tags: { include: { tag: true } } },
  });
  if (!original) throw new Error("Challenge not found");

  const slug = await generateUniqueSlug(`${original.title}-fork`);

  const forked = await prisma.challenge.create({
    data: {
      slug,
      title: `${original.title} (Fork)`,
      description: original.description,
      difficulty: original.difficulty,
      categoryId: original.categoryId,
      authorId: session.user.id,
      forkedFromId: original.id,
      isOfficial: false,
      objectives: original.objectives,
      hints: original.hints,
      resources: original.resources,
      estimatedTime: original.estimatedTime,
    },
  });

  const tagNames = original.tags.map((ct) => ct.tag.name);
  await syncTags(forked.id, tagNames);

  revalidatePath("/challenges");
  redirect(`/challenges/${forked.slug}/edit`);
}
```

**Step 2: Commit**

```bash
git add src/actions/challenges.ts
git commit -m "feat: add server actions for challenge CRUD and fork"
```

---

## Task 5: Server Actions — Likes, Comments, Completions

**Files:**
- Create: `src/actions/likes.ts`
- Create: `src/actions/comments.ts`
- Create: `src/actions/completions.ts`

**Step 1: Create `src/actions/likes.ts`**

```typescript
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLike(challengeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.challengeLike.findUnique({
    where: { userId_challengeId: { userId: session.user.id, challengeId } },
  });

  if (existing) {
    await prisma.challengeLike.delete({
      where: { userId_challengeId: { userId: session.user.id, challengeId } },
    });
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { likesCount: { decrement: 1 } },
    });
  } else {
    await prisma.challengeLike.create({
      data: { userId: session.user.id, challengeId },
    });
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { likesCount: { increment: 1 } },
    });
  }

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { slug: true },
  });
  if (challenge) {
    revalidatePath(`/challenges/${challenge.slug}`);
  }
}
```

**Step 2: Create `src/actions/comments.ts`**

```typescript
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(challengeId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!content.trim()) throw new Error("Comment cannot be empty");

  await prisma.challengeComment.create({
    data: {
      content: content.trim(),
      userId: session.user.id,
      challengeId,
    },
  });

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { slug: true },
  });
  if (challenge) {
    revalidatePath(`/challenges/${challenge.slug}`);
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const comment = await prisma.challengeComment.findUnique({
    where: { id: commentId },
    include: { challenge: { select: { slug: true } } },
  });
  if (!comment || comment.userId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.challengeComment.delete({ where: { id: commentId } });
  revalidatePath(`/challenges/${comment.challenge.slug}`);
}
```

**Step 3: Create `src/actions/completions.ts`**

```typescript
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markComplete(challengeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.challengeCompletion.upsert({
    where: {
      userId_challengeId: { userId: session.user.id, challengeId },
    },
    update: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      challengeId,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { slug: true },
  });
  if (challenge) {
    revalidatePath(`/challenges/${challenge.slug}`);
  }
}
```

**Step 4: Commit**

```bash
git add src/actions/likes.ts src/actions/comments.ts src/actions/completions.ts
git commit -m "feat: add server actions for likes, comments, and completions"
```

---

## Task 6: Update Challenge List Page (`/challenges`)

**Files:**
- Rewrite: `src/app/challenges/page.tsx`

**Step 1: Rewrite as server component with client filter UI**

The page becomes a server component that fetches categories and passes them down. The filter/search UI stays client-side. Challenges are fetched server-side based on search params.

Replace `src/app/challenges/page.tsx`:

```typescript
import { Suspense } from "react";
import type { Metadata } from "next";
import { getChallenges, getCategories, difficultyConfig } from "@/lib/challenges";
import type { Difficulty } from "@prisma/client";
import { ChallengeListClient } from "./challenge-list-client";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Browse AI practice challenges from beginner to expert.",
};

type Props = {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    search?: string;
    tab?: string;
    page?: string;
  }>;
};

export default async function ChallengesPage({ searchParams }: Props) {
  const params = await searchParams;
  const categories = await getCategories();

  const official =
    params.tab === "official" ? true : params.tab === "community" ? false : undefined;

  const { challenges, total } = await getChallenges({
    categorySlug: params.category,
    difficulty: params.difficulty as Difficulty | undefined,
    search: params.search,
    official,
    page: params.page ? parseInt(params.page) : 1,
  });

  return (
    <ChallengeListClient
      challenges={challenges}
      categories={categories}
      total={total}
      currentFilters={{
        category: params.category || "ALL",
        difficulty: params.difficulty || "ALL",
        search: params.search || "",
        tab: params.tab || "all",
      }}
    />
  );
}
```

**Step 2: Create `src/app/challenges/challenge-list-client.tsx`**

This is the client component with filter UI, replacing the old client-only page. It uses `useRouter` + `useSearchParams` to update URL search params for filtering (server-side data fetching).

Key changes from old page:
- Tab filter: All / Official / Community
- Categories: 10 official categories instead of 4
- Challenge cards show author avatar for community challenges, "Official" badge for official ones
- Uses URL search params instead of local state for filters

This file is large (~200 lines) — the implementer should reference the current `src/app/challenges/page.tsx` for the card design and animation patterns, adapting them to:
- Accept `challenges` as a prop (serialized from server) instead of calling `getAllChallenges()`
- Add tab buttons for "All / Official / Community"
- Show category from `challenge.category.name` instead of the old enum config
- Show tags from `challenge.tags[].tag.name`
- Show author info for non-official challenges
- Use `router.push` with search params for filter changes

**Step 3: Verify**

Run: `pnpm build`
Expected: `/challenges` page builds. Visit `http://localhost:3000/challenges` and confirm filters work.

**Step 4: Commit**

```bash
git add src/app/challenges/page.tsx src/app/challenges/challenge-list-client.tsx
git commit -m "feat: rewrite challenges list with DB queries, tabs, 10 categories"
```

---

## Task 7: Update Challenge Detail Page (`/challenges/[slug]`)

**Files:**
- Rewrite: `src/app/challenges/[slug]/page.tsx`
- Rewrite: `src/app/challenges/[slug]/challenge-actions.tsx`
- Create: `src/app/challenges/[slug]/comment-section.tsx`

**Step 1: Rewrite `page.tsx` as server component with DB query**

Key changes:
- Fetch challenge via `getChallengeBySlug(slug)` from DB
- Show author info (avatar, name, link to profile) for community challenges
- Show "Official" badge for official challenges
- Show "Forked from X" link if `forkedFrom` exists
- Show fork count and comment count
- Tags come from `challenge.tags[].tag.name`
- Category from `challenge.category.name`
- Pass `challenge.id` to `ChallengeActions` (not just slug)
- Render `CommentSection` at bottom

**Step 2: Rewrite `challenge-actions.tsx`**

Add:
- Like button (heart icon + count, calls `toggleLike` action)
- Fork button (calls `forkChallenge` action)
- Edit button (visible only if current user is author, links to `/challenges/[slug]/edit`)
- Delete button (visible only if current user is author, with confirm dialog)
- Keep existing: Mark Complete, Share Your Solution, Share link

**Step 3: Create `comment-section.tsx`**

Client component:
- Shows list of comments with user avatar, name, timestamp, content
- "Add comment" textarea + submit button (calls `createComment` action)
- Delete button on own comments (calls `deleteComment` action)
- Show login prompt if not authenticated

**Step 4: Verify**

Run: `pnpm dev`, visit a challenge detail page. Confirm author info, like, fork, comment UI renders.

**Step 5: Commit**

```bash
git add src/app/challenges/\[slug\]/
git commit -m "feat: challenge detail with likes, comments, fork, author info"
```

---

## Task 8: Create Challenge Form Page (`/challenges/new` and `/challenges/[slug]/edit`)

**Files:**
- Create: `src/app/challenges/new/page.tsx`
- Create: `src/app/challenges/[slug]/edit/page.tsx`
- Create: `src/components/challenge-form.tsx` (shared form component)

**Step 1: Create shared `ChallengeForm` component**

Client component with:
- Title input
- Description textarea
- Difficulty select (4 levels)
- Category select (populated from props)
- Tags input (comma-separated, with autocomplete later)
- Objectives: dynamic list (add/remove items with + and X buttons)
- Hints: same dynamic list
- Resources: same dynamic list (URL inputs)
- Estimated time input
- Submit button
- Form action calls `createChallenge` or `updateChallenge` server action

Props: `categories: Category[]`, `defaultValues?: Challenge` (for edit mode), `challengeId?: string` (for edit mode)

**Step 2: Create `/challenges/new/page.tsx`**

Server component:
- Check auth — redirect to `/login` if not authenticated
- Fetch categories with `getCategories()`
- Render `ChallengeForm` with categories, no default values

**Step 3: Create `/challenges/[slug]/edit/page.tsx`**

Server component:
- Check auth — redirect to `/login` if not authenticated
- Fetch challenge by slug — 404 if not found
- Check if current user is author — 403 or redirect if not
- Fetch categories
- Render `ChallengeForm` with categories + challenge as default values

**Step 4: Verify**

Run: `pnpm dev`, sign in, visit `/challenges/new`. Fill form and submit. Confirm redirect to new challenge detail page. Visit edit page and confirm pre-filled values.

**Step 5: Commit**

```bash
git add src/components/challenge-form.tsx src/app/challenges/new/ src/app/challenges/\[slug\]/edit/
git commit -m "feat: add create and edit challenge pages with shared form"
```

---

## Task 9: Update Homepage Branding and Dynamic Content

**Files:**
- Rewrite: `src/app/page.tsx`
- Modify: `src/app/layout.tsx` (metadata)
- Modify: `src/app/opengraph-image.tsx` (if it references Vibe Coding text)
- Modify: `src/app/manifest.ts` (if it references Vibe Coding)

**Step 1: Update metadata in `layout.tsx`**

Change:
- `"AI In Action - Learn Vibe Coding by Building"` → `"AI In Action - Learn AI by Building"`
- Description: `"Master Vibe Coding through 100 hands-on challenge projects"` → `"Master AI through hands-on challenge projects. Build real web apps, games, mobile apps, and AI tools."`
- OpenGraph and Twitter metadata similarly

**Step 2: Rewrite `page.tsx`**

Convert to server component that fetches data, with client sub-components for animations.

Changes:
- Hero: update text per brand changes table in design doc
- Stats: fetch from `getStats()` — dynamic challenge count, category count, user count, project count
- Learning Paths section → "Explore by Category" section: fetch `getCategories()`, render 10 category cards in a grid
- Featured Challenges: fetch `getChallenges({ pageSize: 6 })` ordered by likes, render mixed official + community
- CTA: "Ready to Start Building?" + "Create a Challenge" button alongside "Browse Challenges"
- Remove or replace terminal preview

**Step 3: Update header nav**

In `src/components/layout/header.tsx`, add a "Create" link or button in the nav for logged-in users (optional, low priority).

**Step 4: Verify**

Run: `pnpm dev`, visit `/`. Confirm new branding, dynamic stats, 10 category cards, popular challenges.

**Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx src/components/layout/header.tsx
git commit -m "feat: rebrand homepage from Vibe Coding to AI Practice, dynamic content"
```

---

## Task 10: Update Path Detail and Profile Pages

**Files:**
- Modify: `src/app/paths/[slug]/page.tsx`
- Modify: `src/app/paths/[slug]/path-detail.tsx`
- Modify: `src/app/paths/page.tsx`
- Modify: `src/app/paths/path-cards.tsx`
- Rewrite: `src/app/profile/[id]/page.tsx`
- Rewrite: `src/app/profile/[id]/profile-content.tsx`

**Step 1: Update path pages**

The paths pages currently import from `@/data/challenges` and `@/lib/challenges` (static helpers). Update to use DB query `getChallengesByPath(slug)` and `getAllPaths()` (which need to be kept/added in the lib). The `PathData` type import changes from `@/data/challenges` to a Prisma-derived type.

Key changes:
- `path-detail.tsx`: receives challenges from server component instead of calling static helpers
- `path-cards.tsx`: receives paths from server component
- Remove all direct imports from `@/data/challenges` in page files

**Step 2: Update profile page**

Add "Published Challenges" tab to profile:
- Fetch `getUserChallenges(userId)` in the server component
- Pass to `ProfileContent` as a prop
- Add a Tabs component (from shadcn/ui) with tabs: Completed Challenges / Published Challenges / Shared Projects
- Render challenge cards in the Published Challenges tab
- Change "Vibe Coding enthusiast" to "AI builder" or similar

**Step 3: Verify**

Run: `pnpm dev`, check `/paths`, `/paths/web-development`, and `/profile/[id]` pages all render correctly.

**Step 4: Commit**

```bash
git add src/app/paths/ src/app/profile/
git commit -m "feat: update paths and profile pages for DB queries + published challenges tab"
```

---

## Task 11: Final Cleanup and Verification

**Files:**
- Modify: `src/app/opengraph-image.tsx` (brand text)
- Modify: `src/app/manifest.ts` (brand text)
- Modify: `src/app/sitemap.ts` (if it references static data)
- Modify: `CLAUDE.md` (update architecture description)

**Step 1: Update brand references**

Search for "Vibe Coding" across the codebase and replace with appropriate AI Practice messaging.

**Step 2: Update CLAUDE.md**

Reflect the new architecture: DB-driven challenges, server actions, expanded categories, user-generated content.

**Step 3: Full build check**

Run: `pnpm lint && pnpm build`
Expected: No errors.

**Step 4: Run seed on clean DB**

Run: `pnpm db:push && pnpm db:seed`
Expected: All 10 categories, 4 paths, 100 challenges seeded.

**Step 5: Smoke test**

Run: `pnpm dev` and manually verify:
- [ ] Homepage shows new branding, 10 categories, dynamic stats
- [ ] `/challenges` lists challenges with All/Official/Community tabs
- [ ] `/challenges/new` form works (requires login)
- [ ] Challenge detail shows like/comment/fork buttons
- [ ] `/paths` and `/paths/[slug]` still work
- [ ] Profile shows Published Challenges tab
- [ ] Fork creates new challenge and redirects to edit

**Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup, brand updates, CLAUDE.md refresh"
```
