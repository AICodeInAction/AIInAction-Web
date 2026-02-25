"use client";

import { useEffect, useState } from "react";
import { getMyStats } from "@/actions/stats";
import type { Level } from "@/lib/xp";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Stats = {
  xp: number;
  level: number;
  currentStreak: number;
  levelInfo: Level;
};

export function HeaderXPBadge({ userId }: { userId: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const t = useTranslations("gamification");

  useEffect(() => {
    getMyStats().then((s) => {
      if (s) setStats(s);
    });
  }, []);

  if (!stats) return null;

  return (
    <Link
      href={`/profile/${userId}` as never}
      className="hidden items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-card md:flex"
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: stats.levelInfo.color }}
      >
        {stats.level}
      </span>
      <span className="text-muted-foreground">{stats.xp} {t("xp")}</span>
      {stats.currentStreak > 0 && (
        <span title={`${stats.currentStreak} ${t("dayStreak")}`}>
          🔥{stats.currentStreak}
        </span>
      )}
    </Link>
  );
}
