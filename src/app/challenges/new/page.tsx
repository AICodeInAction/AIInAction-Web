import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getCategories } from "@/lib/challenges";
import { ChallengeForm } from "@/components/challenge-form";

export const metadata: Metadata = {
  title: "Create Challenge",
  description: "Create a new community challenge.",
};

export default async function NewChallengePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Create a Challenge</h1>
      <p className="mt-2 text-muted-foreground">
        Share a challenge with the community. Describe what to build and provide helpful hints.
      </p>
      <div className="mt-8">
        <ChallengeForm categories={JSON.parse(JSON.stringify(categories))} />
      </div>
    </div>
  );
}
