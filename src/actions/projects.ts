"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  const tagsRaw = formData.get("tags") as string;

  if (!title?.trim() || !description?.trim() || !githubUrl?.trim()) {
    throw new Error("Title, description, and GitHub URL are required");
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  await prisma.sharedProject.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      description: description.trim(),
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl?.trim() || null,
      tags,
    },
  });

  revalidatePath("/showcase");
}
