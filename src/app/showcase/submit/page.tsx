"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitProjectForm } from "../submit-form";

export default function SubmitProjectPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/showcase"
        className="mb-8 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Showcase
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Share Your Project</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Link your GitHub repository and share your work with the community.
      </p>
      <div className="mt-8">
        <SubmitProjectForm onSuccess={() => router.push("/showcase")} />
      </div>
    </div>
  );
}
