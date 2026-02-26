import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateChallenge } from "../src/lib/ai";
import * as readline from "readline";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const CATEGORY_SLUGS = [
  "web",
  "game",
  "mobile",
  "ai-agents",
  "ai-writing",
  "ai-image",
  "ai-video",
  "ai-data",
  "ai-audio",
  "ai-coding",
];

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (await prisma.challenge.findUnique({ where: { slug } })) {
    suffix++;
    slug = `${slugify(base)}-${suffix}`;
  }
  return slug;
}

async function syncTags(challengeId: string, tagNames: string[]) {
  for (const name of tagNames) {
    const normalized = name.toLowerCase().trim();
    if (!normalized) continue;
    const tag = await prisma.tag.upsert({
      where: { name: normalized },
      update: {},
      create: { name: normalized },
    });
    await prisma.challengeTag.create({
      data: { challengeId, tagId: tag.id },
    });
  }
}

async function main() {
  const topic = process.argv.slice(2).join(" ");
  if (!topic) {
    console.error("Usage: pnpm challenge:generate <topic>");
    console.error('Example: pnpm challenge:generate "Build a recipe recommendation app"');
    process.exit(1);
  }

  console.log(`\nGenerating challenge for: "${topic}"...\n`);

  const result = await generateChallenge(topic);

  // Display generated content
  console.log("=== Generated Challenge ===");
  console.log(`Title (EN): ${result.en.title}`);
  console.log(`Title (ZH): ${result.zh.title}`);
  console.log(`Difficulty: ${result.difficulty}`);
  console.log(`Category: ${result.categorySlug}`);
  console.log(`Tags: ${result.tags.join(", ")}`);
  console.log(`Estimated Time: ${result.estimatedTime}`);
  console.log(`\nDescription (EN): ${result.en.description}`);
  console.log(`\nObjectives (EN):`);
  result.en.objectives.forEach((o, i) => console.log(`  ${i + 1}. ${o}`));
  console.log(`\nHints (EN):`);
  result.en.hints.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));
  console.log();

  // Confirm category
  let categorySlug = result.categorySlug;
  if (!CATEGORY_SLUGS.includes(categorySlug)) {
    console.log(`AI suggested category "${categorySlug}" is not valid.`);
    console.log(`Available: ${CATEGORY_SLUGS.join(", ")}`);
    categorySlug = await prompt("Enter category slug: ");
  } else {
    const override = await prompt(
      `Category: ${categorySlug} — press Enter to accept, or type a new one: `,
    );
    if (override) categorySlug = override;
  }

  // Confirm difficulty
  const diffOverride = await prompt(
    `Difficulty: ${result.difficulty} — press Enter to accept, or type (BEGINNER/INTERMEDIATE/ADVANCED/EXPERT): `,
  );
  const difficulty = diffOverride
    ? (diffOverride.toUpperCase() as typeof result.difficulty)
    : result.difficulty;

  // Select learning path (optional)
  const paths = await prisma.learningPath.findMany({ orderBy: { order: "asc" } });
  console.log("\nAvailable learning paths:");
  console.log("  0. None");
  paths.forEach((p, i) => console.log(`  ${i + 1}. ${p.title} (${p.slug})`));
  const pathChoice = await prompt("Select path number (0 for none): ");
  const selectedPath = pathChoice && parseInt(pathChoice) > 0
    ? paths[parseInt(pathChoice) - 1]
    : null;

  // Confirm creation
  const confirm = await prompt("\nCreate this challenge? (y/n): ");
  if (confirm.toLowerCase() !== "y") {
    console.log("Aborted.");
    process.exit(0);
  }

  // Find category
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  // Determine order (next in sequence for the path or category)
  let order = 0;
  if (selectedPath) {
    const lastInPath = await prisma.challenge.findFirst({
      where: { pathId: selectedPath.id },
      orderBy: { order: "desc" },
    });
    order = (lastInPath?.order ?? 0) + 1;
  }

  // Create challenge
  const slug = await generateUniqueSlug(result.en.title);
  const challenge = await prisma.challenge.create({
    data: {
      slug,
      title: result.en.title,
      description: result.en.description,
      difficulty,
      objectives: result.en.objectives,
      hints: result.en.hints,
      resources: result.resources,
      estimatedTime: result.estimatedTime,
      order,
      isOfficial: true,
      categoryId: category?.id ?? null,
      pathId: selectedPath?.id ?? null,
    },
  });

  console.log(`\nCreated challenge: ${challenge.slug} (${challenge.id})`);

  // Create translations
  await prisma.challengeTranslation.create({
    data: {
      challengeId: challenge.id,
      locale: "en",
      title: result.en.title,
      description: result.en.description,
      objectives: result.en.objectives,
      hints: result.en.hints,
    },
  });

  await prisma.challengeTranslation.create({
    data: {
      challengeId: challenge.id,
      locale: "zh",
      title: result.zh.title,
      description: result.zh.description,
      objectives: result.zh.objectives,
      hints: result.zh.hints,
    },
  });

  console.log("Created EN and ZH translations.");

  // Sync tags
  await syncTags(challenge.id, result.tags);
  console.log(`Synced ${result.tags.length} tags.`);

  console.log("\nDone! Challenge created successfully.");
  console.log(`View at: /challenges/${challenge.slug}`);
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
