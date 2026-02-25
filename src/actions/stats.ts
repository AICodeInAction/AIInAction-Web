"use server";

import { auth } from "@/lib/auth";
import { getUserStats, type UserStatsWithLevel } from "@/lib/gamification";

export async function getMyStats(): Promise<UserStatsWithLevel | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return getUserStats(session.user.id);
}
