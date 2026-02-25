import type { Metadata } from "next";
import { getLeaderboard } from "@/lib/gamification";
import { LeaderboardContent } from "./leaderboard-content";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("leaderboardTitle"),
    description: t("leaderboardDescription"),
  };
}

export default async function LeaderboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leaderboard");

  const [xpBoard, streakBoard] = await Promise.all([
    getLeaderboard("xp", 50),
    getLeaderboard("streak", 50),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      <LeaderboardContent
        xpBoard={JSON.parse(JSON.stringify(xpBoard))}
        streakBoard={JSON.parse(JSON.stringify(streakBoard))}
      />
    </div>
  );
}
