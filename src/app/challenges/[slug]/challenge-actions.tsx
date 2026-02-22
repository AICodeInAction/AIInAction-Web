"use client";

import { useTransition } from "react";
import { Github, Share2, CheckCircle, Heart, GitFork, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { toggleLike } from "@/actions/likes";
import { forkChallenge, deleteChallenge } from "@/actions/challenges";
import { markComplete } from "@/actions/completions";

type Props = {
  challengeId: string;
  slug: string;
  likesCount: number;
  liked: boolean;
  isAuthor: boolean;
};

export function ChallengeActions({ challengeId, slug, likesCount, liked, isAuthor }: Props) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "AI In Action Challenge",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleLike = () => {
    startTransition(() => toggleLike(challengeId));
  };

  const handleFork = () => {
    startTransition(() => forkChallenge(slug));
  };

  const handleComplete = () => {
    startTransition(() => markComplete(challengeId));
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this challenge? This cannot be undone.")) return;
    startTransition(() => deleteChallenge(challengeId));
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {session ? (
        <>
          <Button
            variant={liked ? "default" : "outline"}
            className="gap-2"
            onClick={handleLike}
            disabled={isPending}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {likesCount}
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleFork} disabled={isPending}>
            <GitFork className="h-4 w-4" />
            Fork
          </Button>
          <Button className="gap-2" onClick={handleComplete} disabled={isPending}>
            <CheckCircle className="h-4 w-4" />
            Mark as Complete
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href={`/showcase/submit?challenge=${slug}`}>
              <Github className="h-4 w-4" />
              Share Your Solution
            </Link>
          </Button>
          {isAuthor && (
            <>
              <Button variant="outline" className="gap-2" asChild>
                <Link href={`/challenges/${slug}/edit`}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Button variant="outline" className="gap-2" disabled>
            <Heart className="h-4 w-4" />
            {likesCount}
          </Button>
          <Button className="gap-2" onClick={() => signIn("github")}>
            <Github className="h-4 w-4" />
            Sign in to Track Progress
          </Button>
        </>
      )}
      <Button variant="ghost" size="icon" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
