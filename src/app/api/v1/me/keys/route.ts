import { requireAuth, jsonSuccess, jsonError, generateApiKey, hashApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const keys = await prisma.apiKey.findMany({
    where: { userId: user!.id },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: "desc" },
  });

  return jsonSuccess(keys);
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const name = (body as { name?: string }).name || "Default";

  // Limit to 5 keys per user
  const count = await prisma.apiKey.count({ where: { userId: user!.id } });
  if (count >= 5) {
    return jsonError("LIMIT_REACHED", "Maximum 5 API keys per user", 400);
  }

  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: { key: hashedKey, name, userId: user!.id },
  });

  // Return the raw key only on creation — it won't be retrievable again
  return jsonSuccess({ id: apiKey.id, name: apiKey.name, key: rawKey }, 201);
}
