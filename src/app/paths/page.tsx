import type { Metadata } from "next";
import { getAllPaths, getChallengesByPath } from "@/lib/challenges";
import { PathCards } from "./path-cards";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Structured learning paths from beginner to expert. Web, Game, Mobile, and AI Agent development.",
};

export default async function PathsPage() {
  const paths = await getAllPaths();

  const pathsWithStats = await Promise.all(
    paths.map(async (path) => {
      const challenges = await getChallengesByPath(path.slug);
      const difficultyBreakdown = {
        beginner: challenges.filter((c) => c.difficulty === "BEGINNER").length,
        intermediate: challenges.filter((c) => c.difficulty === "INTERMEDIATE").length,
        advanced: challenges.filter((c) => c.difficulty === "ADVANCED").length,
        expert: challenges.filter((c) => c.difficulty === "EXPERT").length,
      };
      return {
        slug: path.slug,
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        order: path.order,
        challengeCount: challenges.length,
        difficultyBreakdown,
      };
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Learning Paths
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Structured tracks from fundamentals to expert-level builds.
          Follow a path or explore freely.
        </p>
      </div>

      <PathCards paths={pathsWithStats} />
    </div>
  );
}
