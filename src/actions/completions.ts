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
