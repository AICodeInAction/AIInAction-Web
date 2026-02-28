import { jsonSuccess } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isOfficial: true },
    select: { id: true, slug: true, name: true, description: true, icon: true },
    orderBy: { order: "asc" },
  });

  return jsonSuccess(categories);
}
