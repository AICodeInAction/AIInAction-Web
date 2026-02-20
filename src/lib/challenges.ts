import {
  challenges as challengeData,
  learningPaths as pathData,
  type ChallengeData,
  type PathData,
} from "@/data/challenges";

export function getAllChallenges(): ChallengeData[] {
  return challengeData;
}

export function getChallengeBySlug(slug: string): ChallengeData | undefined {
  return challengeData.find((c) => c.slug === slug);
}

export function getChallengesByCategory(
  category: ChallengeData["category"]
): ChallengeData[] {
  return challengeData.filter((c) => c.category === category);
}

export function getChallengesByPath(pathSlug: string): ChallengeData[] {
  return challengeData
    .filter((c) => c.pathSlug === pathSlug)
    .sort((a, b) => a.order - b.order);
}

export function getChallengesByDifficulty(
  difficulty: ChallengeData["difficulty"]
): ChallengeData[] {
  return challengeData.filter((c) => c.difficulty === difficulty);
}

export function getAllPaths(): PathData[] {
  return pathData.sort((a, b) => a.order - b.order);
}

export function getPathBySlug(slug: string): PathData | undefined {
  return pathData.find((p) => p.slug === slug);
}

export function getGlobalChallengeNumber(challenge: ChallengeData): number {
  const pathOrder: Record<string, number> = {
    "web-development": 0,
    "game-development": 25,
    "mobile-development": 50,
    "ai-agents": 75,
  };
  return (pathOrder[challenge.pathSlug] ?? 0) + challenge.order;
}

export const difficultyConfig = {
  BEGINNER: {
    label: "Beginner",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  ADVANCED: {
    label: "Advanced",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  EXPERT: {
    label: "Expert",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
} as const;

export const categoryConfig = {
  WEB: { label: "Web", slug: "web-development" },
  GAME: { label: "Game", slug: "game-development" },
  MOBILE: { label: "Mobile", slug: "mobile-development" },
  AI_AGENT: { label: "AI Agent", slug: "ai-agents" },
} as const;
