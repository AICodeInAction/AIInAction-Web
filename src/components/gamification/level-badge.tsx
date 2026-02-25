"use client";

import type { Level } from "@/lib/xp";
import { useTranslations } from "next-intl";

type Props = {
  levelInfo: Level;
  size?: "sm" | "md" | "lg";
};

export function LevelBadge({ levelInfo, size = "md" }: Props) {
  const t = useTranslations("gamification");
  const tl = useTranslations("levels");

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full font-bold text-white shadow-lg`}
        style={{
          backgroundColor: levelInfo.color,
          boxShadow: `0 0 16px ${levelInfo.color}40`,
        }}
      >
        {levelInfo.level}
      </div>
      <div>
        <div className="text-sm font-semibold" style={{ color: levelInfo.color }}>
          {tl(String(levelInfo.level))}
        </div>
        <div className="text-xs text-muted-foreground">{t("level", { level: levelInfo.level })}</div>
      </div>
    </div>
  );
}
