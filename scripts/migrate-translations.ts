import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import enContent from "../messages/en-content.json";
import zhContent from "../messages/zh-content.json";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type TranslationContent = {
  title: string;
  description: string;
  objectives: string[];
  hints: string[];
};

async function main() {
  const enChallenges = (enContent as Record<string, Record<string, TranslationContent>>).challengeContent;
  const zhChallenges = (zhContent as Record<string, Record<string, TranslationContent>>).challengeContent;

  const allSlugs = new Set([...Object.keys(enChallenges), ...Object.keys(zhChallenges)]);
  console.log(`Found ${allSlugs.size} unique slugs across both locales`);

  let created = 0;
  let skipped = 0;

  for (const slug of allSlugs) {
    const challenge = await prisma.challenge.findUnique({ where: { slug } });
    if (!challenge) {
      console.log(`  Skipping "${slug}" — not found in DB`);
      skipped++;
      continue;
    }

    // Upsert English translation
    const en = enChallenges[slug];
    if (en) {
      await prisma.challengeTranslation.upsert({
        where: { challengeId_locale: { challengeId: challenge.id, locale: "en" } },
        update: {
          title: en.title,
          description: en.description,
          objectives: en.objectives,
          hints: en.hints,
        },
        create: {
          challengeId: challenge.id,
          locale: "en",
          title: en.title,
          description: en.description,
          objectives: en.objectives,
          hints: en.hints,
        },
      });
    }

    // Upsert Chinese translation
    const zh = zhChallenges[slug];
    if (zh) {
      await prisma.challengeTranslation.upsert({
        where: { challengeId_locale: { challengeId: challenge.id, locale: "zh" } },
        update: {
          title: zh.title,
          description: zh.description,
          objectives: zh.objectives,
          hints: zh.hints,
        },
        create: {
          challengeId: challenge.id,
          locale: "zh",
          title: zh.title,
          description: zh.description,
          objectives: zh.objectives,
          hints: zh.hints,
        },
      });
    }

    created++;
  }

  console.log(`Done. Migrated ${created} challenges, skipped ${skipped}.`);
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
