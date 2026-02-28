import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma";

const API_KEY_PREFIX = "aia_";

export function generateApiKey(): string {
  return API_KEY_PREFIX + randomBytes(32).toString("hex");
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export type ApiUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export async function authenticateApiKey(
  request: Request
): Promise<ApiUser | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const rawKey = authHeader.slice(7);
  if (!rawKey.startsWith(API_KEY_PREFIX)) return null;

  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  if (!apiKey) return null;

  // Update lastUsedAt (fire and forget)
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {});

  return apiKey.user;
}

export function jsonSuccess(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function jsonError(code: string, message: string, status = 400) {
  return Response.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export async function requireAuth(request: Request) {
  const user = await authenticateApiKey(request);
  if (!user) {
    return { user: null, error: jsonError("UNAUTHORIZED", "Invalid or missing API key", 401) };
  }
  return { user, error: null };
}
