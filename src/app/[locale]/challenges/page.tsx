import type { Metadata } from "next";
import { getChallenges, getCategories } from "@/lib/challenges";
import type { Difficulty } from "@prisma/client";
import { ChallengeListClient } from "./challenge-list-client";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    search?: string;
    tab?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("challengesTitle"),
    description: t("challengesDescription"),
  };
}

export default async function ChallengesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const categories = await getCategories();

  const official =
    sp.tab === "official" ? true : sp.tab === "community" ? false : undefined;

  const { challenges, total } = await getChallenges({
    categorySlug: sp.category,
    difficulty: sp.difficulty as Difficulty | undefined,
    search: sp.search,
    official,
    page: sp.page ? parseInt(sp.page) : 1,
  });

  return (
    <ChallengeListClient
      challenges={JSON.parse(JSON.stringify(challenges))}
      categories={JSON.parse(JSON.stringify(categories))}
      total={total}
      currentFilters={{
        category: sp.category || "ALL",
        difficulty: sp.difficulty || "ALL",
        search: sp.search || "",
        tab: sp.tab || "all",
      }}
      currentPage={sp.page ? parseInt(sp.page) : 1}
    />
  );
}
