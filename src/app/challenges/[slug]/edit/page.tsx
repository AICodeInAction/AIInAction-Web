import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getChallengeBySlug, getCategories } from "@/lib/challenges";
import { ChallengeForm } from "@/components/challenge-form";

export const metadata: Metadata = {
  title: "Edit Challenge",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditChallengePage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);
  if (!challenge) notFound();

  if (challenge.authorId !== session.user.id) {
    redirect(`/challenges/${slug}`);
  }

  const categories = await getCategories();

  const defaultValues = {
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    categoryId: challenge.categoryId,
    tags: challenge.tags.map((ct) => ct.tag.name),
    objectives: challenge.objectives,
    hints: challenge.hints,
    resources: challenge.resources,
    estimatedTime: challenge.estimatedTime,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Edit Challenge</h1>
      <p className="mt-2 text-muted-foreground">
        Update your challenge details.
      </p>
      <div className="mt-8">
        <ChallengeForm
          categories={JSON.parse(JSON.stringify(categories))}
          defaultValues={defaultValues}
          challengeId={challenge.id}
        />
      </div>
    </div>
  );
}
