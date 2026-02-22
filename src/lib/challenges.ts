import { prisma } from "./prisma";
import type { Difficulty, Prisma } from "@prisma/client";

export type ChallengeFilters = {
  categorySlug?: string;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
  official?: boolean;
  page?: number;
  pageSize?: number;
};

export async function getChallenges(filters: ChallengeFilters = {}) {
  const { categorySlug, difficulty, tag, search, official, page = 1, pageSize = 30 } = filters;

  const where: Prisma.ChallengeWhereInput = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (difficulty) {
    where.difficulty = difficulty;
  }
  if (official !== undefined) {
    where.isOfficial = official;
  }
  if (tag) {
    where.tags = { some: { tag: { name: tag.toLowerCase() } } };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      include: {
        category: true,
        tags: { include: { tag: true } },
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: [{ isOfficial: "desc" }, { likesCount: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.challenge.count({ where }),
  ]);

  return { challenges, total, page, pageSize };
}

export async function getChallengeBySlug(slug: string) {
  return prisma.challenge.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true, image: true, githubUrl: true } },
      forkedFrom: { select: { id: true, slug: true, title: true } },
      path: true,
      _count: { select: { forks: true, comments: true } },
    },
  });
}

export async function getChallengeComments(challengeId: string, page = 1, pageSize = 20) {
  const [comments, total] = await Promise.all([
    prisma.challengeComment.findMany({
      where: { challengeId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.challengeComment.count({ where: { challengeId } }),
  ]);
  return { comments, total, page, pageSize };
}

export async function getChallengesByPath(pathSlug: string) {
  return prisma.challenge.findMany({
    where: { path: { slug: pathSlug } },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { order: "asc" },
  });
}

export async function getAllPaths() {
  return prisma.learningPath.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getPathBySlug(slug: string) {
  return prisma.learningPath.findUnique({
    where: { slug },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isOfficial: true },
    orderBy: { order: "asc" },
  });
}

export async function getPopularTags(limit = 20) {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { challenges: true } } },
    orderBy: { challenges: { _count: "desc" } },
    take: limit,
  });
  return tags.map((t) => ({ name: t.name, count: t._count.challenges }));
}

export async function getUserChallenges(userId: string) {
  return prisma.challenge.findMany({
    where: { authorId: userId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function hasUserLiked(userId: string, challengeId: string) {
  const like = await prisma.challengeLike.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });
  return !!like;
}

export async function getStats() {
  const [challengeCount, categoryCount, userCount, projectCount] = await Promise.all([
    prisma.challenge.count(),
    prisma.category.count({ where: { isOfficial: true } }),
    prisma.user.count(),
    prisma.sharedProject.count(),
  ]);
  return { challengeCount, categoryCount, userCount, projectCount };
}

export { difficultyConfig } from "./constants";
