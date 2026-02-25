import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserChallenges } from "@/lib/challenges";
import { getUserStats, getUserAchievements, getCompletionHeatmap } from "@/lib/gamification";
import { ProfileContent } from "./profile-content";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "profile" });
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true },
  });
  return {
    title: user ? t("profileOf", { name: user.name || "User" }) : t("title"),
  };
}

export default async function ProfilePage({ params }: Props) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      githubUrl: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          completions: true,
          projects: true,
          authoredChallenges: true,
        },
      },
    },
  });

  if (!user) notFound();

  const [publishedChallenges, stats, achievements, heatmapData, completions] = await Promise.all([
    getUserChallenges(id),
    getUserStats(id),
    getUserAchievements(id),
    getCompletionHeatmap(id),
    prisma.challengeCompletion.findMany({
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
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <ProfileContent
        user={JSON.parse(JSON.stringify(user))}
        publishedChallenges={JSON.parse(JSON.stringify(publishedChallenges))}
        stats={JSON.parse(JSON.stringify(stats))}
        achievements={JSON.parse(JSON.stringify(achievements))}
        heatmapData={heatmapData}
        completions={JSON.parse(JSON.stringify(completions))}
      />
    </div>
  );
}
