import type { MetadataRoute } from "next";
import { getAllChallenges, getAllPaths } from "@/lib/challenges";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aiinaction.top";
  const now = new Date();

  const challenges = getAllChallenges().map((c) => ({
    url: `${baseUrl}/challenges/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const paths = getAllPaths().map((p) => ({
    url: `${baseUrl}/paths/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/challenges`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/paths`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...paths,
    ...challenges,
  ];
}
