# Completion Reflection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When users mark a challenge as complete, prompt them to optionally share their reflection (methods, insights, lessons learned) via the completion modal.

**Architecture:** Extend the existing `ChallengeCompletion` model with `reflection` and `isPublic` fields. Add a new `saveReflection` server action. Modify the completion modal to include a textarea and checkbox. Display public reflections on the challenge detail page and all reflections on the user's profile.

**Tech Stack:** Next.js 16 (App Router), Prisma, PostgreSQL, shadcn/ui, Framer Motion, next-intl

---

### Task 1: Add reflection fields to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma:159-171`

**Step 1: Add fields to ChallengeCompletion model**

In `prisma/schema.prisma`, update the `ChallengeCompletion` model to:

```prisma
model ChallengeCompletion {
  id          String           @id @default(cuid())
  userId      String           @map("user_id")
  challengeId String           @map("challenge_id")
  status      CompletionStatus @default(IN_PROGRESS)
  completedAt DateTime?        @map("completed_at")
  reflection  String?          @db.Text
  isPublic    Boolean          @default(true) @map("is_public")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@unique([userId, challengeId])
  @@map("challenge_completions")
}
```

**Step 2: Push schema to database and regenerate client**

Run: `pnpm db:push && pnpm db:generate`
Expected: Schema pushed successfully, Prisma client regenerated.

**Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add reflection and isPublic fields to ChallengeCompletion model"
```

---

### Task 2: Add i18n translation keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

**Step 1: Add English translations**

In `messages/en.json`, add to the `"gamification"` section:

```json
"reflectionPlaceholder": "Share your approach, tools used, or lessons learned...",
"sharePublicly": "Share publicly",
"submitReflection": "Submit",
"skipReflection": "Skip"
```

Add a new `"reflections"` section:

```json
"reflections": {
  "title": "Reflections",
  "noReflections": "No reflections yet. Complete this challenge and share your experience!",
  "completedOn": "Completed on {date}"
}
```

**Step 2: Add Chinese translations**

In `messages/zh.json`, add to the `"gamification"` section:

```json
"reflectionPlaceholder": "分享你的方法、使用的工具或心得感悟...",
"sharePublicly": "公开分享",
"submitReflection": "提交",
"skipReflection": "跳过"
```

Add a new `"reflections"` section:

```json
"reflections": {
  "title": "完成心得",
  "noReflections": "暂无心得。完成此挑战并分享你的经验！",
  "completedOn": "完成于 {date}"
}
```

**Step 3: Commit**

```bash
git add messages/en.json messages/zh.json
git commit -m "feat: add i18n keys for completion reflections"
```

---

### Task 3: Create saveReflection server action

**Files:**
- Modify: `src/actions/completions.ts`

**Step 1: Add the saveReflection function**

Append to `src/actions/completions.ts`:

```typescript
export async function saveReflection(
  challengeId: string,
  reflection: string,
  isPublic: boolean
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const completion = await prisma.challengeCompletion.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
    include: { challenge: { select: { slug: true } } },
  });

  if (!completion || completion.status !== "COMPLETED") {
    throw new Error("Challenge not completed");
  }

  await prisma.challengeCompletion.update({
    where: { userId_challengeId: { userId, challengeId } },
    data: { reflection, isPublic },
  });

  if (completion.challenge) {
    revalidatePath(`/challenges/${completion.challenge.slug}`);
  }
}
```

**Step 2: Commit**

```bash
git add src/actions/completions.ts
git commit -m "feat: add saveReflection server action"
```

---

### Task 4: Update CompletionModal with reflection form

**Files:**
- Modify: `src/components/gamification/completion-modal.tsx`

**Step 1: Update the CompletionModal component**

Rewrite `src/components/gamification/completion-modal.tsx` to add a textarea and checkbox after the celebration content. The modal needs:

- Accept new props: `challengeId: string`, `onSubmitReflection: (reflection: string, isPublic: boolean) => void`
- Add state for `reflection` (string) and `isPublic` (boolean, default true)
- Add a `<Textarea>` with placeholder from `gamification.reflectionPlaceholder`
- Add a checkbox labeled `gamification.sharePublicly` (default checked)
- Change footer to two buttons: "Submit" (calls `onSubmitReflection`) and "Skip" (calls `onClose`)
- Import `Textarea` from `@/components/ui/textarea` and `Checkbox` from `@/components/ui/checkbox`
- Import `Label` from `@/components/ui/label`

Updated component structure:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CompletionResult } from "@/actions/completions";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
  result: CompletionResult | null;
  onSubmitReflection: (reflection: string, isPublic: boolean) => void;
};

export function CompletionModal({ open, onClose, result, onSubmitReflection }: Props) {
  const t = useTranslations("gamification");
  const tl = useTranslations("levels");
  const [reflection, setReflection] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  if (!result) return null;

  const handleSubmit = () => {
    if (reflection.trim()) {
      onSubmitReflection(reflection.trim(), isPublic);
    }
    onClose();
  };

  const handleClose = () => {
    setReflection("");
    setIsPublic(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {t("challengeCompleted")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* XP gained - keep existing animation */}
          <AnimatePresence>
            {result.xpGained > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold text-primary"
              >
                +{result.xpGained} {t("xp")}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level info - keep existing animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-1"
          >
            {result.leveledUp ? (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">{t("levelUp")}</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: result.levelColor }}
                >
                  Lv.{result.newLevel} {tl(String(result.newLevel))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Lv.{result.newLevel}{" "}
                <span style={{ color: result.levelColor }}>
                  {tl(String(result.newLevel))}
                </span>{" "}
                &middot; {result.newXP} {t("xp")}
              </div>
            )}
          </motion.div>

          {/* New achievements - keep existing animation */}
          {result.newAchievements.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="text-sm font-medium text-muted-foreground">
                {t("achievementsUnlocked")}
              </div>
              <div className="space-y-2">
                {result.newAchievements.map((a) => (
                  <motion.div
                    key={a.slug}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-sm font-medium">{a.name}</span>
                    <span className="text-xs text-primary">+{a.xpReward} {t("xp")}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reflection input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3 text-left"
          >
            <Textarea
              placeholder={t("reflectionPlaceholder")}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="isPublic" className="text-sm text-muted-foreground cursor-pointer">
                {t("sharePublicly")}
              </Label>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t("skipReflection")}
          </Button>
          <Button onClick={handleSubmit}>
            {reflection.trim() ? t("submitReflection") : t("skipReflection")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/gamification/completion-modal.tsx
git commit -m "feat: add reflection textarea and public checkbox to completion modal"
```

---

### Task 5: Wire up ChallengeActions to pass reflection to modal

**Files:**
- Modify: `src/app/[locale]/challenges/[slug]/challenge-actions.tsx`

**Step 1: Update ChallengeActions to handle reflection submission**

In `src/app/[locale]/challenges/[slug]/challenge-actions.tsx`:

1. Import `saveReflection` from `@/actions/completions`
2. Add a `handleSubmitReflection` callback:

```typescript
const handleSubmitReflection = (reflection: string, isPublic: boolean) => {
  startTransition(() => saveReflection(challengeId, reflection, isPublic));
};
```

3. Pass `onSubmitReflection={handleSubmitReflection}` to `<CompletionModal>`

**Step 2: Commit**

```bash
git add src/app/[locale]/challenges/[slug]/challenge-actions.tsx
git commit -m "feat: wire saveReflection action to completion modal"
```

---

### Task 6: Add query function for public reflections

**Files:**
- Modify: `src/lib/challenges.ts`

**Step 1: Add getPublicReflections function**

Append to `src/lib/challenges.ts`:

```typescript
export async function getPublicReflections(challengeId: string) {
  return prisma.challengeCompletion.findMany({
    where: {
      challengeId,
      status: "COMPLETED",
      reflection: { not: null },
      isPublic: true,
    },
    select: {
      id: true,
      reflection: true,
      completedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
    take: 20,
  });
}
```

**Step 2: Commit**

```bash
git add src/lib/challenges.ts
git commit -m "feat: add getPublicReflections query function"
```

---

### Task 7: Display reflections on challenge detail page

**Files:**
- Create: `src/app/[locale]/challenges/[slug]/reflections-section.tsx`
- Modify: `src/app/[locale]/challenges/[slug]/page.tsx`

**Step 1: Create ReflectionsSection client component**

Create `src/app/[locale]/challenges/[slug]/reflections-section.tsx`:

```tsx
"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Reflection = {
  id: string;
  reflection: string | null;
  completedAt: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export function ReflectionsSection({ reflections }: { reflections: Reflection[] }) {
  const t = useTranslations("reflections");

  if (reflections.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold">{t("title")}</h2>
      <div className="mt-4 space-y-4">
        {reflections.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-border/60 bg-card/50 p-4"
          >
            <div className="flex items-center gap-2">
              {r.user.image && (
                <Image
                  src={r.user.image}
                  alt={r.user.name || ""}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <Link
                href={`/profile/${r.user.id}`}
                className="text-sm font-medium hover:underline"
              >
                {r.user.name}
              </Link>
              {r.completedAt && (
                <span className="text-xs text-muted-foreground">
                  {t("completedOn", {
                    date: new Date(r.completedAt).toLocaleDateString(),
                  })}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {r.reflection}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Import and render in challenge detail page**

In `src/app/[locale]/challenges/[slug]/page.tsx`:

1. Import `getPublicReflections` from `@/lib/challenges`
2. Import `ReflectionsSection` from `./reflections-section`
3. Add `getPublicReflections(challenge.id)` to the `Promise.all` call
4. Render `<ReflectionsSection>` between `<ChallengeActions>` and the Comments section (before the comments `<Separator>`)

Add to the `Promise.all`:
```typescript
const [pathChallenges, { comments, total: commentTotal }, liked, reflections] =
  await Promise.all([
    challenge.path ? getChallengesByPath(challenge.path.slug) : Promise.resolve([]),
    getChallengeComments(challenge.id),
    userId ? hasUserLiked(userId, challenge.id) : Promise.resolve(false),
    getPublicReflections(challenge.id),
  ]);
```

Add the section before comments:
```tsx
{/* Reflections */}
{reflections.length > 0 && (
  <>
    <Separator className="my-8" />
    <ReflectionsSection
      reflections={JSON.parse(JSON.stringify(reflections))}
    />
  </>
)}
```

**Step 3: Commit**

```bash
git add src/app/[locale]/challenges/[slug]/reflections-section.tsx src/app/[locale]/challenges/[slug]/page.tsx
git commit -m "feat: display public reflections on challenge detail page"
```

---

### Task 8: Show reflections on profile completed tab

**Files:**
- Modify: `src/app/[locale]/profile/[id]/page.tsx`
- Modify: `src/app/[locale]/profile/[id]/profile-content.tsx`

**Step 1: Query completions with reflections in the profile page**

In `src/app/[locale]/profile/[id]/page.tsx`, add a query to fetch the user's completed challenges with their reflections:

```typescript
const completions = await prisma.challengeCompletion.findMany({
  where: { userId: user.id, status: "COMPLETED" },
  select: {
    id: true,
    reflection: true,
    isPublic: true,
    completedAt: true,
    challenge: {
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        category: { select: { name: true } },
      },
    },
  },
  orderBy: { completedAt: "desc" },
});
```

Pass `completions` to `<ProfileContent>`.

**Step 2: Update ProfileContent to render completions with reflections**

In `src/app/[locale]/profile/[id]/profile-content.tsx`:

1. Add a `CompletionData` type and accept it as a prop
2. Update the "completed" tab to show each completed challenge with its reflection (if any)
3. Show a lock icon or "(private)" indicator for private reflections when viewing own profile

The completed tab should show each completion as a card with:
- Challenge title (linked to challenge page)
- Difficulty badge
- Completion date
- Reflection text (if exists)
- Public/private indicator (only on own profile)

**Step 3: Commit**

```bash
git add src/app/[locale]/profile/[id]/page.tsx src/app/[locale]/profile/[id]/profile-content.tsx
git commit -m "feat: show completed challenges with reflections on profile page"
```

---

### Task 9: Verify and test

**Step 1: Run lint**

Run: `pnpm lint`
Expected: No errors.

**Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds with no type errors.

**Step 3: Manual testing checklist**

- [ ] Mark a challenge complete → modal shows textarea + checkbox
- [ ] Submit a reflection with "share publicly" checked → saved to DB
- [ ] Skip without reflection → modal closes, no reflection saved
- [ ] Public reflection appears on challenge detail page
- [ ] Private reflection does NOT appear on challenge detail page
- [ ] Profile completed tab shows challenges with reflections
- [ ] Own profile shows private/public indicator
- [ ] Other user's profile only shows public reflections
- [ ] Both EN and ZH translations render correctly

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address any issues found during testing"
```
