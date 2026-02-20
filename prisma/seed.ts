import { PrismaClient } from "@prisma/client";
import { learningPaths, challenges } from "../src/data/challenges";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (const path of learningPaths) {
    await prisma.learningPath.upsert({
      where: { slug: path.slug },
      update: {
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        order: path.order,
      },
      create: {
        slug: path.slug,
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        order: path.order,
      },
    });
    console.log(`  Path: ${path.title}`);
  }

  const pathMap = new Map<string, string>();
  const allPaths = await prisma.learningPath.findMany();
  for (const p of allPaths) {
    pathMap.set(p.slug, p.id);
  }

  for (const challenge of challenges) {
    const pathId = pathMap.get(challenge.pathSlug) ?? null;
    await prisma.challenge.upsert({
      where: { slug: challenge.slug },
      update: {
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        category: challenge.category,
        tags: challenge.tags,
        objectives: challenge.objectives,
        hints: challenge.hints,
        resources: challenge.resources,
        estimatedTime: challenge.estimatedTime,
        order: challenge.order,
        pathId,
      },
      create: {
        slug: challenge.slug,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        category: challenge.category,
        tags: challenge.tags,
        objectives: challenge.objectives,
        hints: challenge.hints,
        resources: challenge.resources,
        estimatedTime: challenge.estimatedTime,
        order: challenge.order,
        pathId,
      },
    });
  }

  console.log(`  Seeded ${challenges.length} challenges.`);
  console.log("Done.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
