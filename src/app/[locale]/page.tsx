import { getStats, getCategories, getChallenges } from "@/lib/challenges";
import { HomeClient } from "./home-client";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [stats, categories, { challenges: featured }] = await Promise.all([
    getStats(),
    getCategories(),
    getChallenges({ pageSize: 6 }),
  ]);

  return (
    <HomeClient
      stats={stats}
      categories={JSON.parse(JSON.stringify(categories))}
      featured={JSON.parse(JSON.stringify(featured))}
    />
  );
}
