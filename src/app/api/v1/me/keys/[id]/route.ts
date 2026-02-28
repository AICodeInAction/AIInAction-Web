import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const { id } = await params;

  const apiKey = await prisma.apiKey.findUnique({ where: { id } });
  if (!apiKey || apiKey.userId !== user!.id) {
    return jsonError("NOT_FOUND", "API key not found", 404);
  }

  await prisma.apiKey.delete({ where: { id } });

  return jsonSuccess({ deleted: true });
}
