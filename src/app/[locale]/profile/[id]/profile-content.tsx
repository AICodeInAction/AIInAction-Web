"use client";

import { useSession } from "next-auth/react";
import {
  Github,
  Calendar,
  Trophy,
  Code2,
  Pencil,
  Lock,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { difficultyConfig } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { XPProgress } from "@/components/gamification/xp-progress";
import { LevelBadge } from "@/components/gamification/level-badge";
import { StreakDisplay } from "@/components/gamification/streak-display";
import { AchievementCard } from "@/components/gamification/achievement-card";
import { ContributionHeatmap } from "@/components/gamification/contribution-heatmap";
import type { AchievementRarity } from "@prisma/client";
import type { Level } from "@/lib/xp";

type User = {
  id: string;
  name: string | null;
  image: string | null;
  githubUrl: string | null;
  bio: string | null;
  createdAt: string;
  _count: {
    completions: number;
    projects: number;
    authoredChallenges: number;
  };
};

type PublishedChallenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: keyof typeof difficultyConfig;
  likesCount: number;
  category: { name: string } | null;
};

type StatsData = {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  levelInfo: Level;
};

type AchievementData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt: string | null;
};

type CompletionData = {
  id: string;
  reflection: string | null;
  isPublic: boolean;
  completedAt: string | null;
  challenge: {
    id: string;
    slug: string;
    title: string;
    difficulty: keyof typeof difficultyConfig;
    category: { name: string } | null;
  };
};

export function ProfileContent({
  user,
  publishedChallenges,
  stats,
  achievements,
  heatmapData,
  completions,
}: {
  user: User;
  publishedChallenges: PublishedChallenge[];
  stats: StatsData;
  achievements: AchievementData[];
  heatmapData: Record<string, number>;
  completions: CompletionData[];
}) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === user.id;
  const t = useTranslations("profile");

  // Filter reflections for non-own profiles
  const visibleCompletions = completions.map((c) => ({
    ...c,
    reflection: (isOwnProfile || c.isPublic) ? c.reflection : null,
  }));
  const tc = useTranslations("common");

  const displayName = user.name || t("aiBuilder");
  const joinYear = new Date(user.createdAt).getFullYear();

  const summaryStats = [
    { icon: Trophy, label: t("completed"), value: user._count.completions },
    { icon: Pencil, label: t("published"), value: user._count.authoredChallenges },
    { icon: Code2, label: t("projects"), value: user._count.projects },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div>
      {/* Profile Header */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
          <AvatarImage src={user.image || ""} alt={displayName} />
          <AvatarFallback className="text-2xl">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {displayName}
            </h1>
            <LevelBadge levelInfo={stats.levelInfo} size="sm" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.bio || t("aiBuilder")}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {t("joined", { year: joinYear })}
            </span>
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* XP & Streak */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/50 p-5">
          <XPProgress xp={stats.xp} levelInfo={stats.levelInfo} />
        </div>
        <div className="flex items-center justify-center rounded-xl border border-border/60 bg-card/50 p-5">
          <StreakDisplay
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/60 bg-card/50 p-4 text-center"
          >
            <stat.icon className="mx-auto h-5 w-5 text-muted-foreground" />
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Contribution Heatmap */}
      <div className="mt-6 rounded-xl border border-border/60 bg-card/50 p-5">
        <ContributionHeatmap
          data={heatmapData}
          year={new Date().getFullYear()}
        />
      </div>

      <Separator className="my-8" />

      {/* Tabs */}
      <Tabs defaultValue="achievements">
        <TabsList>
          <TabsTrigger value="achievements">
            {t("achievementsTab", { unlocked: unlockedAchievements.length, total: achievements.length })}
          </TabsTrigger>
          <TabsTrigger value="completed">{t("completedTab")}</TabsTrigger>
          <TabsTrigger value="published">{t("publishedTab")}</TabsTrigger>
          <TabsTrigger value="projects">{t("projectsTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-6">
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {unlockedAchievements.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {unlockedAchievements.map((a) => (
                    <AchievementCard key={a.id} {...a} />
                  ))}
                </div>
              )}
              {lockedAchievements.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground pt-2">
                    {t("locked")}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {lockedAchievements.map((a) => (
                      <AchievementCard key={a.id} {...a} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noAchievements")}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {visibleCompletions.length > 0 ? (
            <div className="space-y-3">
              {visibleCompletions.map((completion) => {
                const diff = difficultyConfig[completion.challenge.difficulty];
                return (
                  <div
                    key={completion.id}
                    className="rounded-lg border border-border/40 bg-card/30 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/challenges/${completion.challenge.slug}`}
                        className="font-medium text-sm hover:text-primary transition-colors"
                      >
                        {completion.challenge.title}
                      </Link>
                      <div className="flex items-center gap-2">
                        {completion.challenge.category && (
                          <Badge variant="secondary" className="text-[10px]">
                            {completion.challenge.category.name}
                          </Badge>
                        )}
                        <Badge variant="outline" className={`text-[10px] ${diff.className}`}>
                          {diff.label}
                        </Badge>
                      </div>
                    </div>
                    {completion.completedAt && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(completion.completedAt).toLocaleDateString()}
                      </p>
                    )}
                    {completion.reflection && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {completion.reflection}
                        </p>
                        {isOwnProfile && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            {completion.isPublic ? (
                              <><Globe className="h-3 w-3" /> Public</>
                            ) : (
                              <><Lock className="h-3 w-3" /> Private</>
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noCompletions")}
              </p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/challenges">{t("browseChallenges")}</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          {publishedChallenges.length > 0 ? (
            <div className="space-y-2">
              {publishedChallenges.map((challenge) => {
                const diff = difficultyConfig[challenge.difficulty];
                return (
                  <Link
                    key={challenge.id}
                    href={`/challenges/${challenge.slug}`}
                    className="group flex items-center gap-4 rounded-lg border border-border/40 bg-card/30 px-4 py-3.5 transition-all hover:border-border hover:bg-card hover:shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {challenge.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      {challenge.category && (
                        <Badge variant="secondary" className="text-[10px]">
                          {challenge.category.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-[10px] ${diff.className}`}>
                        {diff.label}
                      </Badge>
                    </div>
                    {challenge.likesCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {tc("likes", { count: challenge.likesCount })}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noPublished")}
              </p>
              {isOwnProfile && (
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/challenges/new">{t("createChallenge")}</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {user._count.projects === 0
                ? t("noProjects")
                : t("projectCount", { count: user._count.projects })}
            </p>
            {user._count.projects === 0 && (
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/showcase">{t("visitShowcase")}</Link>
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
