"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllChallenges,
  getGlobalChallengeNumber,
  difficultyConfig,
  categoryConfig,
} from "@/lib/challenges";
import type { ChallengeData } from "@/data/challenges";

const categories = [
  { key: "ALL" as const, label: "All" },
  { key: "WEB" as const, label: "Web" },
  { key: "GAME" as const, label: "Game" },
  { key: "MOBILE" as const, label: "Mobile" },
  { key: "AI_AGENT" as const, label: "AI Agent" },
];

const difficulties = [
  { key: "ALL" as const, label: "All Levels" },
  { key: "BEGINNER" as const, label: "Beginner" },
  { key: "INTERMEDIATE" as const, label: "Intermediate" },
  { key: "ADVANCED" as const, label: "Advanced" },
  { key: "EXPERT" as const, label: "Expert" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function ChallengesPage() {
  const allChallenges = getAllChallenges();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("ALL");
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = allChallenges;
    if (category !== "ALL") {
      result = result.filter((c) => c.category === category);
    }
    if (difficulty !== "ALL") {
      result = result.filter((c) => c.difficulty === difficulty);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q))
      );
    }
    return result;
  }, [allChallenges, category, difficulty, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Challenges
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          100 hands-on projects from beginner to expert. Pick a challenge and
          start building.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div
          className={`space-y-3 ${showFilters ? "block" : "hidden"} sm:block`}
        >
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Button
                key={cat.key}
                variant={category === cat.key ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat.key)}
                className="text-xs"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-1.5">
            {difficulties.map((d) => (
              <Button
                key={d.key}
                variant={difficulty === d.key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setDifficulty(d.key)}
                className="text-xs"
              >
                {d.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-6 text-sm text-muted-foreground">
        Showing {filtered.length} of {allChallenges.length} challenges
      </div>

      {/* Challenge grid */}
      <motion.div
        key={`${category}-${difficulty}-${search}`}
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((challenge) => (
          <ChallengeCard key={challenge.slug} challenge={challenge} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">No challenges found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: ChallengeData }) {
  const num = getGlobalChallengeNumber(challenge);
  const diff = difficultyConfig[challenge.difficulty];
  const cat = categoryConfig[challenge.category];

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/challenges/${challenge.slug}`} className="group block">
        <div className="h-full rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-border hover:bg-card hover:shadow-lg">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              #{String(num).padStart(3, "0")}
            </span>
            <Badge variant="outline" className={`text-[10px] ${diff.className}`}>
              {diff.label}
            </Badge>
          </div>
          <h3 className="mt-3 font-semibold leading-snug group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {challenge.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {cat.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {challenge.estimatedTime}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
