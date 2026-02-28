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
