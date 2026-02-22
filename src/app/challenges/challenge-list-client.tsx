"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Plus, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { difficultyConfig } from "@/lib/constants";

type SerializedCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  isOfficial: boolean;
};

type SerializedChallenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: keyof typeof difficultyConfig;
  estimatedTime: string | null;
  isOfficial: boolean;
  likesCount: number;
  order: number;
  category: SerializedCategory | null;
  tags: { tag: { name: string } }[];
  author: { id: string; name: string | null; image: string | null } | null;
};

type Filters = {
  category: string;
  difficulty: string;
  search: string;
  tab: string;
};

const tabs = [
  { key: "all", label: "All" },
  { key: "official", label: "Official" },
  { key: "community", label: "Community" },
];

const difficulties = [
  { key: "ALL", label: "All Levels" },
  { key: "BEGINNER", label: "Beginner" },
  { key: "INTERMEDIATE", label: "Intermediate" },
  { key: "ADVANCED", label: "Advanced" },
  { key: "EXPERT", label: "Expert" },
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

const PAGE_SIZE = 30;

export function ChallengeListClient({
  challenges,
  categories,
  total,
  currentFilters,
  currentPage,
}: {
  challenges: SerializedChallenge[];
  categories: SerializedCategory[];
  total: number;
  currentFilters: Filters;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "ALL" || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`/challenges?${params.toString()}`);
    },
    [router, searchParams]
  );

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      router.push(`/challenges?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const search = formData.get("search") as string;
      updateFilter("search", search);
    },
    [updateFilter]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Challenges
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Hands-on AI projects from beginner to expert. Pick a challenge and
            start building.
          </p>
        </div>
        {session && (
          <Button asChild className="gap-2 shrink-0">
            <Link href="/challenges/new">
              <Plus className="h-4 w-4" />
              Create
            </Link>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => updateFilter("tab", t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              currentFilters.tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search challenges..."
              defaultValue={currentFilters.search}
              className="pl-9"
            />
          </div>
        </form>

        <div className="space-y-3">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant={currentFilters.category === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("category", "ALL")}
              className="text-xs"
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                variant={currentFilters.category === cat.slug ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter("category", cat.slug)}
                className="text-xs"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-1.5">
            {difficulties.map((d) => (
              <Button
                key={d.key}
                variant={currentFilters.difficulty === d.key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => updateFilter("difficulty", d.key)}
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
        Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, total)} of {total} challenges
      </div>

      {/* Challenge grid */}
      <motion.div
        key={`${currentFilters.category}-${currentFilters.difficulty}-${currentFilters.tab}-${currentFilters.search}-${currentPage}`}
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.slug} challenge={challenge} />
        ))}
      </motion.div>

      {challenges.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">No challenges found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <div className="flex items-center gap-1">
            {generatePageNumbers(currentPage, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`dot-${i}`} className="px-2 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(p as number)}
                  className="min-w-9"
                >
                  {p}
                </Button>
              )
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

function ChallengeCard({ challenge }: { challenge: SerializedChallenge }) {
  const diff = difficultyConfig[challenge.difficulty];

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/challenges/${challenge.slug}`} className="group block">
        <div className="h-full rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-border hover:bg-card hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {challenge.isOfficial ? (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Shield className="h-3 w-3" />
                  Official
                </Badge>
              ) : challenge.author ? (
                <div className="flex items-center gap-1.5">
                  {challenge.author.image && (
                    <Image
                      src={challenge.author.image}
                      alt={challenge.author.name || ""}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {challenge.author.name}
                  </span>
                </div>
              ) : null}
            </div>
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
            {challenge.category && (
              <Badge variant="secondary" className="text-[10px]">
                {challenge.category.name}
              </Badge>
            )}
            {challenge.estimatedTime && (
              <span className="text-xs text-muted-foreground">
                {challenge.estimatedTime}
              </span>
            )}
            {challenge.likesCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {challenge.likesCount} likes
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
