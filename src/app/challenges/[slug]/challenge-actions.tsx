"use client";

import { Github, Share2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export function ChallengeActions({ slug }: { slug: string }) {
  const { data: session } = useSession();

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

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {session ? (
        <>
          <Button className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Mark as Complete
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href={`/showcase/submit?challenge=${slug}`}>
              <Github className="h-4 w-4" />
              Share Your Solution
            </Link>
          </Button>
        </>
      ) : (
        <Button className="gap-2" onClick={() => signIn("github")}>
          <Github className="h-4 w-4" />
          Sign in to Track Progress
        </Button>
      )}
      <Button variant="ghost" size="icon" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
