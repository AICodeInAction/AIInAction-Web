import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aiinaction.top";
  const now = new Date();

  const [allChallenges, allPaths] = await Promise.all([
    prisma.challenge.findMany({ select: { slug: true } }),
    prisma.learningPath.findMany({ select: { slug: true } }),
  ]);

  const challenges = allChallenges.map((c) => ({
    url: `${baseUrl}/challenges/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const paths = allPaths.map((p) => ({
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
