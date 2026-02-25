"use client";

import { useTranslations } from "next-intl";

type Props = {
  currentStreak: number;
  longestStreak: number;
};

export function StreakDisplay({ currentStreak, longestStreak }: Props) {
  const t = useTranslations("gamification");

  const flames =
    currentStreak >= 30
      ? "🔥🔥🔥"
      : currentStreak >= 7
        ? "🔥🔥"
        : currentStreak >= 1
          ? "🔥"
          : "";

  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold">
          {flames} {currentStreak}
        </div>
        <div className="text-xs text-muted-foreground">{t("dayStreak")}</div>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-center">
        <div className="text-lg font-semibold text-muted-foreground">
          {longestStreak}
        </div>
        <div className="text-xs text-muted-foreground">{t("best")}</div>
      </div>
    </div>
  );
}
