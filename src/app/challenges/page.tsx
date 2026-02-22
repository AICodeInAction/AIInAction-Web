import type { Metadata } from "next";
import { getChallenges, getCategories } from "@/lib/challenges";
import type { Difficulty } from "@prisma/client";
import { ChallengeListClient } from "./challenge-list-client";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Browse AI practice challenges from beginner to expert.",
};

type Props = {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    search?: string;
    tab?: string;
    page?: string;
  }>;
};

export default async function ChallengesPage({ searchParams }: Props) {
  const params = await searchParams;
  const categories = await getCategories();

  const official =
    params.tab === "official" ? true : params.tab === "community" ? false : undefined;

  const { challenges, total } = await getChallenges({
    categorySlug: params.category,
    difficulty: params.difficulty as Difficulty | undefined,
    search: params.search,
    official,
    page: params.page ? parseInt(params.page) : 1,
  });

  return (
    <ChallengeListClient
      challenges={JSON.parse(JSON.stringify(challenges))}
      categories={JSON.parse(JSON.stringify(categories))}
      total={total}
      currentFilters={{
        category: params.category || "ALL",
        difficulty: params.difficulty || "ALL",
        search: params.search || "",
        tab: params.tab || "all",
      }}
      currentPage={params.page ? parseInt(params.page) : 1}
    />
  );
}
