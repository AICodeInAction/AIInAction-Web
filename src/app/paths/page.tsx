import type { Metadata } from "next";
import { getAllPaths, getChallengesByPath } from "@/lib/challenges";
import { PathCards } from "./path-cards";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Four structured learning paths from beginner to expert. Web, Game, Mobile, and AI Agent development.",
};

export default function PathsPage() {
  const paths = getAllPaths();

  const pathsWithStats = paths.map((path) => {
    const challenges = getChallengesByPath(path.slug);
    const difficultyBreakdown = {
      beginner: challenges.filter((c) => c.difficulty === "BEGINNER").length,
      intermediate: challenges.filter((c) => c.difficulty === "INTERMEDIATE")
        .length,
      advanced: challenges.filter((c) => c.difficulty === "ADVANCED").length,
      expert: challenges.filter((c) => c.difficulty === "EXPERT").length,
    };
    return {
      ...path,
      challengeCount: challenges.length,
      difficultyBreakdown,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Learning Paths
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Four structured tracks from fundamentals to expert-level builds.
          Follow a path or explore freely.
        </p>
      </div>

      <PathCards paths={pathsWithStats} />
    </div>
  );
}
