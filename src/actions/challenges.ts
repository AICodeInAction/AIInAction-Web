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
      difficulty: difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
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
      difficulty: difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
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
