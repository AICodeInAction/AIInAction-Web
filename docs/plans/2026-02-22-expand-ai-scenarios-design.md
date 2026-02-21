# Expand AIInAction to All AI Scenarios + User-Generated Challenges

**Date:** 2026-02-22
**Status:** Approved

## Goals

1. Expand from "Vibe Coding" to all AI application scenarios
2. Allow users to publish their own challenges (no moderation)
3. Keep existing 100 challenges as "official" content
4. Add community features: likes, comments, fork challenges
5. Rebrand from "Vibe Coding" to "AI Practice"

## Approach: Full DB + Prisma Seed (Approach C)

- All runtime reads from DB; `src/data/challenges.ts` retained only as seed source
- Official challenges managed via Git, synced to DB by seed script
- User challenges written directly to the same `Challenge` table
- Unified query/filter/sort logic for both official and community content

## Data Model Changes

### New Tables

**Category** (replaces `Category` enum):
- `id`, `slug` (unique), `name`, `description?`, `icon?`, `color?`, `order`, `isOfficial`, `createdAt`
- 10 official categories seeded (see below)

**Tag** (user-defined free tags):
- `id`, `name` (unique, lowercase normalized)

**ChallengeTag** (many-to-many):
- `challengeId`, `tagId` (composite PK)

**ChallengeLike**:
- `userId`, `challengeId` (composite PK), `createdAt`

**ChallengeComment**:
- `id`, `content`, `userId`, `challengeId`, `createdAt`, `updatedAt`

### Challenge Table Changes

New fields:
- `isOfficial` (bool, default false) — official challenges set to true by seed
- `authorId` (nullable FK to User) — null for official challenges
- `forkedFromId` (nullable self-reference) — links fork to original
- `likesCount` (int, default 0) — denormalized counter
- `categoryId` (FK to Category table) — replaces enum field
- `updatedAt` — added for edit tracking

Removed:
- `category` enum field (replaced by `categoryId` FK)
- `tags` string array (replaced by `ChallengeTag` relation)

### User Table Additions

New relations:
- `authoredChallenges` (Challenge[])
- `challengeLikes` (ChallengeLike[])
- `challengeComments` (ChallengeComment[])

### Enums

- `Difficulty` enum kept (BEGINNER / INTERMEDIATE / ADVANCED / EXPERT)
- `Category` enum deleted
- `CompletionStatus` enum kept

## Official Categories (Seed Data)

| slug | name | icon (Lucide) | color |
|------|------|---------------|-------|
| `web-development` | Web Development | `Code2` | `#3B82F6` |
| `game-development` | Game Development | `Gamepad2` | `#10B981` |
| `mobile-development` | Mobile App Development | `Smartphone` | `#F59E0B` |
| `ai-agents` | AI Agents & Automation | `Bot` | `#8B5CF6` |
| `ai-writing` | AI Writing & Content | `Pen` | TBD |
| `ai-image` | AI Image & Design | `Image` | TBD |
| `ai-video` | AI Video Generation | `Video` | TBD |
| `ai-data` | AI Data Analysis | `BarChart3` | TBD |
| `ai-audio` | AI Audio & Speech | `AudioLines` | TBD |
| `ai-coding` | AI-Assisted Coding | `Terminal` | TBD |

Multimodal projects use `#multimodal` tag to span categories.

## Server Actions

All write operations via Next.js Server Actions in `src/actions/`:

| Action | File | Auth |
|--------|------|------|
| `createChallenge` | `challenges.ts` | Required |
| `updateChallenge` | `challenges.ts` | Required (author only) |
| `deleteChallenge` | `challenges.ts` | Required (author only) |
| `forkChallenge` | `challenges.ts` | Required |
| `toggleLike` | `likes.ts` | Required |
| `createComment` | `comments.ts` | Required |
| `deleteComment` | `comments.ts` | Required (author only) |
| `markComplete` | `completions.ts` | Required |

## Data Query Functions

`src/lib/challenges.ts` rewritten from static data to DB queries:

- `getChallenges(filters)` — paginated + filter by category, difficulty, tags, search, official/community
- `getChallengeBySlug(slug)` — single challenge with author, tags, likes count
- `getChallengeComments(challengeId, page)` — paginated comments
- `getCategories()` — all official categories
- `getPopularTags(limit)` — hot tags
- `getUserChallenges(userId)` — challenges authored by user

## Page Routes

### New Pages
- `/challenges/new` — create challenge form (auth required)
- `/challenges/[slug]/edit` — edit challenge (author only)

### Modified Pages
- `/` — rebrand copy, 10 category cards, dynamic stats, popular challenges by likes
- `/challenges` — add official/community filter tab, expand to 10 categories
- `/challenges/[slug]` — add like button, comments section, fork button, author info
- `/profile/[id]` — add "Published Challenges" tab

### Unchanged Pages
- `/paths`, `/paths/[slug]` — official learning paths, unchanged
- `/showcase`, `/showcase/submit` — unchanged
- `/login` — unchanged

## Create Challenge Form Fields

| Field | Type | Required |
|-------|------|----------|
| title | text | Yes |
| description | textarea | Yes |
| difficulty | select (4 levels) | Yes |
| category | select (official categories) | Yes |
| tags | tag input (autocomplete existing) | No |
| objectives | dynamic list (add/remove items) | No |
| hints | dynamic list | No |
| resources | dynamic list (URLs) | No |
| estimatedTime | text | No |

Fork pre-fills all fields from original challenge.

## Brand Changes

| Location | Before | After |
|----------|--------|-------|
| Site title | "AI In Action - Learn Vibe Coding by Building" | "AI In Action - Learn AI by Building" |
| Hero title | "Learn Vibe Coding by Building Real Projects" | "Learn AI by Building Real Projects" |
| Hero subtitle | web apps to AI agents | AI agents to creative tools |
| Badge | "100 Vibe Coding Challenges" | "AI Practice Challenges" |
| Stats | hardcoded 100/4 | dynamic from DB |
| CTA | "Ready to Start Vibing?" | "Ready to Start Building?" |
| Terminal preview | `npx create-vibe-project` | remove or replace with challenge card preview |

## Seed Script Changes

Execution order:
1. Upsert 10 official `Category` records (by slug)
2. Upsert 4 `LearningPath` records (unchanged)
3. Upsert 100 `Challenge` records: `isOfficial=true`, `authorId=null`, `categoryId` mapped from `categorySlug`, `tags[]` written to `Tag` + `ChallengeTag`

`src/data/challenges.ts` type change: `category` enum field renamed to `categorySlug: string`.

## Out of Scope (YAGNI)

- No moderation / review system
- No notification system
- No challenge version history
- No leaderboard
- No rich text / Markdown editor (plain textarea)
