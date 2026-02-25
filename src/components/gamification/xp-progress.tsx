"use client";

import { Progress } from "@/components/ui/progress";
import { getProgressToNextLevel, type Level } from "@/lib/xp";
import { useTranslations } from "next-intl";

type Props = {
  xp: number;
  levelInfo: Level;
};

export function XPProgress({ xp, levelInfo }: Props) {
  const t = useTranslations("gamification");
  const tl = useTranslations("levels");
  const progress = getProgressToNextLevel(xp);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium" style={{ color: levelInfo.color }}>
          Lv.{levelInfo.level} {tl(String(levelInfo.level))}
        </span>
        <span className="text-muted-foreground">
          {xp} {t("xp")}
        </span>
      </div>
      <Progress value={progress.percent} className="h-2.5" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{progress.current} / {progress.needed || t("max")}</span>
        {levelInfo.level < 20 && (
          <span>{t("nextLevel", { level: levelInfo.level + 1 })}</span>
        )}
      </div>
    </div>
  );
}
