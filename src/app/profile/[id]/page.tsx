import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserChallenges } from "@/lib/challenges";
import { ProfileContent } from "./profile-content";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true },
  });
  return {
    title: user ? `${user.name}'s Profile` : "User Profile",
  };
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      githubUrl: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          completions: true,
          projects: true,
          authoredChallenges: true,
        },
      },
    },
  });

  if (!user) notFound();

  const publishedChallenges = await getUserChallenges(id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <ProfileContent
        user={JSON.parse(JSON.stringify(user))}
        publishedChallenges={JSON.parse(JSON.stringify(publishedChallenges))}
      />
    </div>
  );
}
