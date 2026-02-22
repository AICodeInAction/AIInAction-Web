import { getStats, getCategories, getChallenges } from "@/lib/challenges";
import { HomeClient } from "./home-client";

export default async function HomePage() {
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
