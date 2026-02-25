"use client";

import type { AchievementRarity } from "@prisma/client";
import { useTranslations } from "next-intl";

type Props = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt: string | null;
};

const rarityColors: Record<AchievementRarity, string> = {
  COMMON: "border-zinc-400/40 bg-zinc-500/5",
  RARE: "border-blue-400/40 bg-blue-500/5",
  EPIC: "border-purple-400/40 bg-purple-500/5",
  LEGENDARY: "border-amber-400/40 bg-amber-500/5",
};

const rarityTextColors: Record<AchievementRarity, string> = {
  COMMON: "text-zinc-500",
  RARE: "text-blue-500",
  EPIC: "text-purple-500",
  LEGENDARY: "text-amber-500",
};

export function AchievementCard({
  slug,
  icon,
  rarity,
  unlocked,
  unlockedAt,
}: Props) {
  const ta = useTranslations("achievements");
  const tr = useTranslations("rarity");

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        unlocked
          ? rarityColors[rarity]
          : "border-border/30 bg-muted/20 opacity-50 grayscale"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {ta(`${slug}.name` as never)}
            </span>
            <span className={`text-[10px] font-medium ${rarityTextColors[rarity]}`}>
              {tr(rarity)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {ta(`${slug}.description` as never)}
          </p>
          {unlocked && unlockedAt && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
