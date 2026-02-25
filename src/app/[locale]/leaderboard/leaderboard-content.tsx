"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Level } from "@/lib/xp";

type LeaderboardEntry = {
  userId: string;
  userName: string | null;
  userImage: string | null;
  xp: number;
  level: number;
  currentStreak: number;
  levelInfo: Level;
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
      {rank}
    </span>
  );
}

function LeaderboardRow({
  entry,
  rank,
  metric,
  daysLabel,
  levelTitle,
}: {
  entry: LeaderboardEntry;
  rank: number;
  metric: "xp" | "streak";
  daysLabel: string;
  levelTitle: string;
}) {
  const displayName = entry.userName || "AI Builder";

  return (
    <Link
      href={`/profile/${entry.userId}` as never}
      className="flex items-center gap-4 rounded-lg border border-border/40 bg-card/30 px-4 py-3 transition-all hover:border-border hover:bg-card hover:shadow-sm"
    >
      <RankBadge rank={rank} />
      <Avatar className="h-9 w-9">
        <AvatarImage src={entry.userImage || ""} alt={displayName} />
        <AvatarFallback className="text-xs">
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{displayName}</div>
        <div className="text-xs text-muted-foreground">
          <span style={{ color: entry.levelInfo.color }}>
            Lv.{entry.level} {levelTitle}
          </span>
        </div>
      </div>
      <div className="text-right">
        {metric === "xp" ? (
          <div className="text-sm font-bold text-primary">
            {entry.xp.toLocaleString()} XP
          </div>
        ) : (
          <div className="text-sm font-bold">
            🔥 {daysLabel}
          </div>
        )}
      </div>
    </Link>
  );
}

export function LeaderboardContent({
  xpBoard,
  streakBoard,
}: {
  xpBoard: LeaderboardEntry[];
  streakBoard: LeaderboardEntry[];
}) {
  const t = useTranslations("leaderboard");
  const tl = useTranslations("levels");

  return (
    <Tabs defaultValue="xp" className="mt-8">
      <TabsList>
        <TabsTrigger value="xp">{t("totalXP")}</TabsTrigger>
        <TabsTrigger value="streak">{t("currentStreak")}</TabsTrigger>
      </TabsList>

      <TabsContent value="xp" className="mt-6">
        {xpBoard.length > 0 ? (
          <div className="space-y-2">
            {xpBoard.map((entry, i) => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                rank={i + 1}
                metric="xp"
                daysLabel=""
                levelTitle={tl(String(entry.level))}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("noLeaderboard")}
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="streak" className="mt-6">
        {streakBoard.length > 0 ? (
          <div className="space-y-2">
            {streakBoard.filter((e) => e.currentStreak > 0).map((entry, i) => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                rank={i + 1}
                metric="streak"
                daysLabel={t("days", { count: entry.currentStreak })}
                levelTitle={tl(String(entry.level))}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("noStreaks")}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
