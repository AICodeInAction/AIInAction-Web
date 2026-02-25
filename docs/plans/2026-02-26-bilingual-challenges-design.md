# Bilingual Challenge System Design

## Goal

1. CLI tool: input a challenge topic, AI generates full bilingual (en+zh) challenge content, inserts into DB
2. Web creation: when user creates a challenge, auto-translate to the other language so both always exist

## Data Layer

### New Model: ChallengeTranslation

```prisma
model ChallengeTranslation {
  id          String   @id @default(cuid())
  challengeId String   @map("challenge_id")
  locale      String   // "en" | "zh"
  title       String
  description String   @db.Text
  objectives  String[]
  hints       String[]

  challenge   Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@unique([challengeId, locale])
  @@map("challenge_translations")
}
```

- Challenge table fields remain as English fallback (no schema change to existing fields)
- Add `translations ChallengeTranslation[]` relation to Challenge model
- `@@unique([challengeId, locale])` ensures one translation per language per challenge

### Query Layer Changes

All query functions in `src/lib/challenges.ts` gain a `locale` parameter:

- `getChallenges(filters, locale)` — include translations, return translated fields
- `getChallengeBySlug(slug, locale)` — include translations
- Helper function `applyTranslation(challenge, locale)` — picks translated fields or falls back to Challenge table (English)

Frontend pages stop reading `messages/*-content.json` for `challengeContent` namespace. All challenge content comes from DB translations.

## AI Service Layer — `src/lib/ai.ts`

Uses Anthropic SDK (`@anthropic-ai/sdk`).

### Functions

**`generateChallenge(topic: string)`**
- Input: challenge topic/title string
- Calls Claude API with structured output prompt
- Returns: `{ en: ChallengeContent, zh: ChallengeContent }` with all fields (title, description, difficulty, objectives, hints, resources, estimatedTime, tags, categorySlug)

**`translateChallenge(content: ChallengeContent, sourceLocale: string, targetLocale: string)`**
- Input: existing challenge content + source/target locales
- Calls Claude API to translate
- Returns: translated `ChallengeContent`

### ChallengeContent type

```typescript
type ChallengeContent = {
  title: string;
  description: string;
  objectives: string[];
  hints: string[];
};
```

## CLI Tool — `scripts/generate-challenge.ts`

Command: `pnpm challenge:generate "topic here"`

Flow:
1. Read topic from CLI args
2. Call `generateChallenge(topic)` → get en + zh content
3. Interactive prompts: select category, path, difficulty (or accept AI suggestion)
4. Create Challenge record (English fields as primary, `isOfficial: true`)
5. Create 2 ChallengeTranslation records (en + zh)
6. Sync tags
7. Print summary

Environment: requires `ANTHROPIC_API_KEY` in `.env`.

## Web Creation Changes

### `src/actions/challenges.ts` — createChallenge

Modified flow:
1. Parse formData + new `locale` field (from hidden input or header)
2. Create Challenge record (same as before)
3. Create ChallengeTranslation for current locale (user's input)
4. Call `translateChallenge()` to generate the other locale
5. Create ChallengeTranslation for the other locale
6. If AI translation fails, still save — the other locale just won't exist yet (graceful degradation)

### `src/actions/challenges.ts` — updateChallenge

Modified flow:
1. Update Challenge record (same as before)
2. Upsert ChallengeTranslation for current locale
3. Call `translateChallenge()` for the other locale
4. Upsert ChallengeTranslation for the other locale

### `src/components/challenge-form.tsx`

- Add hidden `locale` field (from `useLocale()`)
- Add loading state for "saving + translating..." feedback

## Data Migration

Script: `scripts/migrate-translations.ts`

1. Read `messages/en-content.json` and `messages/zh-content.json`
2. For each slug in `challengeContent`:
   - Find Challenge by slug
   - Upsert ChallengeTranslation for "en" with en-content data
   - Upsert ChallengeTranslation for "zh" with zh-content data
3. After migration verified, remove `challengeContent` from message files
4. Remove `tContent` usage from frontend pages

Command: `pnpm db:migrate-translations`

## Display Layer Changes

### Pages to update

- `src/app/[locale]/challenges/[slug]/page.tsx` — use translation from DB instead of `tContent`
- `src/app/[locale]/challenges/challenge-list-client.tsx` — use translation from included data
- `src/app/[locale]/home-client.tsx` — use translation from included data
- `src/app/[locale]/paths/[slug]/path-detail.tsx` — use translation from included data

### Pattern

Before:
```typescript
const tContent = await getTranslations("challengeContent");
const title = challenge.isOfficial && tContent.has(`${slug}.title`)
  ? tContent(`${slug}.title`) : challenge.title;
```

After:
```typescript
// Translation already resolved in query layer
const title = challenge.title; // already locale-aware from applyTranslation()
```

## New Dependencies

- `@anthropic-ai/sdk` — Anthropic SDK for Claude API calls

## Environment Variables

- `ANTHROPIC_API_KEY` — required for AI generation/translation (CLI + web)
