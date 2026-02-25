import type { Difficulty } from "@prisma/client";

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  BEGINNER: 10,
  INTERMEDIATE: 25,
  ADVANCED: 50,
  EXPERT: 100,
};

export type Level = {
  level: number;
  xpRequired: number;
  title: string;
  color: string;
};

export const LEVELS: Level[] = [
  { level: 1, xpRequired: 0, title: "AI 新手", color: "#9CA3AF" },
  { level: 2, xpRequired: 50, title: "AI 探索者", color: "#6EE7B7" },
  { level: 3, xpRequired: 150, title: "AI 实践者", color: "#34D399" },
  { level: 4, xpRequired: 300, title: "提示工程师", color: "#60A5FA" },
  { level: 5, xpRequired: 500, title: "AI 构建者", color: "#3B82F6" },
  { level: 6, xpRequired: 800, title: "全栈 AI 工程师", color: "#818CF8" },
  { level: 7, xpRequired: 1200, title: "AI 产品创作者", color: "#A78BFA" },
  { level: 8, xpRequired: 1800, title: "AI 应用专家", color: "#C084FC" },
  { level: 9, xpRequired: 2600, title: "AI 架构师", color: "#F472B6" },
  { level: 10, xpRequired: 3500, title: "AI 大师", color: "#FB923C" },
  { level: 11, xpRequired: 4500, title: "传说·AI 领袖 I", color: "#F59E0B" },
  { level: 12, xpRequired: 5700, title: "传说·AI 领袖 II", color: "#F59E0B" },
  { level: 13, xpRequired: 7000, title: "传说·AI 领袖 III", color: "#EAB308" },
  { level: 14, xpRequired: 8500, title: "传说·AI 领袖 IV", color: "#EAB308" },
  { level: 15, xpRequired: 10000, title: "传说·AI 领袖 V", color: "#FACC15" },
  { level: 16, xpRequired: 12000, title: "神话·AI 先驱 I", color: "#EF4444" },
  { level: 17, xpRequired: 14500, title: "神话·AI 先驱 II", color: "#DC2626" },
  { level: 18, xpRequired: 17500, title: "神话·AI 先驱 III", color: "#B91C1C" },
  { level: 19, xpRequired: 21000, title: "神话·AI 先驱 IV", color: "#991B1B" },
  { level: 20, xpRequired: 25000, title: "神话·AI 先驱 V", color: "#7F1D1D" },
];

export function getLevelFromXP(xp: number): Level {
  let result = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      result = level;
    } else {
      break;
    }
  }
  return result;
}

export function getXPForNextLevel(level: number): number {
  const nextLevel = LEVELS.find((l) => l.level === level + 1);
  return nextLevel?.xpRequired ?? LEVELS[LEVELS.length - 1].xpRequired;
}

export function getProgressToNextLevel(xp: number): {
  current: number;
  needed: number;
  percent: number;
} {
  const currentLevel = getLevelFromXP(xp);
  const nextLevelXP = getXPForNextLevel(currentLevel.level);

  if (currentLevel.level >= 20) {
    return { current: xp - currentLevel.xpRequired, needed: 0, percent: 100 };
  }

  const current = xp - currentLevel.xpRequired;
  const needed = nextLevelXP - currentLevel.xpRequired;
  const percent = Math.min(Math.round((current / needed) * 100), 100);

  return { current, needed, percent };
}
