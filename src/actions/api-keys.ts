"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";

export async function createApiKey(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const count = await prisma.apiKey.count({ where: { userId: session.user.id } });
  if (count >= 5) throw new Error("Maximum 5 API keys");

  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: { key: hashedKey, name: name || "Default", userId: session.user.id },
  });

  return { id: apiKey.id, name: apiKey.name, key: rawKey };
}

export async function listApiKeys() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.apiKey.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteApiKey(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const apiKey = await prisma.apiKey.findUnique({ where: { id } });
  if (!apiKey || apiKey.userId !== session.user.id) throw new Error("Not found");

  await prisma.apiKey.delete({ where: { id } });
}
