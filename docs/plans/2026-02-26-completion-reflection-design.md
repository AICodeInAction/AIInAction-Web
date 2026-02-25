# Completion Reflection Feature Design

## Overview

When a user marks a challenge as complete, prompt them to share their reflections (methods, insights, lessons learned). This encourages learning consolidation and community knowledge sharing.

## Requirements

- Reflection is **optional** — user can skip
- Single **textarea** for free-form input
- **Default public**, with a checkbox to make private (only visible to the author)
- Filled in directly within the existing **Completion Modal** after the celebration animation
- Public reflections are visible on the **challenge detail page**
- All reflections (including private) are visible on the **user's profile page**

## Data Layer

Extend `ChallengeCompletion` model with two new fields:

```prisma
model ChallengeCompletion {
  // ... existing fields ...
  reflection  String?  @db.Text
  isPublic    Boolean  @default(true) @map("is_public")
}
```

No new models needed — reflection has a 1:1 relationship with completion.

## Server Action

New action `saveReflection(challengeId: string, reflection: string, isPublic: boolean)`:

- Auth check
- Find existing `ChallengeCompletion` for user + challenge (must exist and be COMPLETED)
- Update `reflection` and `isPublic` fields
- Revalidate challenge detail page path

The existing `markComplete` action remains unchanged.

## UI Changes

### Completion Modal (`src/components/gamification/completion-modal.tsx`)

After XP/achievement celebration content, add:

1. A `<textarea>` with placeholder guiding the user (e.g., "Share your approach, tools used, or lessons learned...")
2. A checkbox: "Share publicly" (checked by default)
3. Two buttons: "Submit" (saves reflection) and "Skip" (closes modal without saving)

### Challenge Detail Page (`src/app/[locale]/challenges/[slug]/page.tsx`)

Add a "Reflections" section (above or near comments) displaying public reflections:

- User avatar + name
- Reflection text
- Completion date
- Query: all completions for this challenge where `reflection IS NOT NULL` and `isPublic = true`

### Profile Page (`src/app/[locale]/profile/[id]/page.tsx`)

In the "Completed" tab, show reflections alongside completed challenges:

- Display reflection text if present
- Show public/private indicator for the user's own reflections

## i18n

Add translation keys in `messages/en.json` and `messages/zh.json` for:

- Textarea placeholder
- Checkbox label
- Submit/Skip button labels
- Reflections section title on challenge detail page
- Empty state text
