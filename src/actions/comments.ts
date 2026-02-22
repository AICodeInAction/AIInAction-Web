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
