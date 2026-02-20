import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Clock,
  Target,
  Lightbulb,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getChallengeBySlug,
  getChallengesByPath,
  getGlobalChallengeNumber,
  difficultyConfig,
  categoryConfig,
} from "@/lib/challenges";
import { ChallengeActions } from "./challenge-actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);
  if (!challenge) return { title: "Challenge Not Found" };
  return {
    title: challenge.title,
    description: challenge.description,
  };
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);
  if (!challenge) notFound();

  const num = getGlobalChallengeNumber(challenge);
  const diff = difficultyConfig[challenge.difficulty];
  const cat = categoryConfig[challenge.category];

  const pathChallenges = getChallengesByPath(challenge.pathSlug);
  const currentIndex = pathChallenges.findIndex((c) => c.slug === slug);
  const prevChallenge = currentIndex > 0 ? pathChallenges[currentIndex - 1] : null;
  const nextChallenge =
    currentIndex < pathChallenges.length - 1
      ? pathChallenges[currentIndex + 1]
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/challenges"
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Challenges
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{challenge.title}</span>
      </div>

      {/* Header */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">
            #{String(num).padStart(3, "0")}
          </span>
          <Badge variant="outline" className={diff.className}>
            {diff.label}
          </Badge>
          <Badge variant="secondary">{cat.label}</Badge>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {challenge.estimatedTime}
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {challenge.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {challenge.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <ChallengeActions slug={challenge.slug} />

      <Separator className="my-8" />

      {/* Objectives */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Target className="h-5 w-5 text-primary" />
          Objectives
        </h2>
        <ul className="mt-4 space-y-3">
          {challenge.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm leading-relaxed">{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Hints */}
      {challenge.hints.length > 0 && (
        <>
          <Separator className="my-8" />
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Hints
            </h2>
            <ul className="mt-4 space-y-3">
              {challenge.hints.map((hint, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-amber-500/10 bg-amber-500/5 px-4 py-3 text-sm leading-relaxed"
                >
                  {hint}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Resources */}
      {challenge.resources.length > 0 && (
        <>
          <Separator className="my-8" />
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <BookOpen className="h-5 w-5 text-primary" />
              Resources
            </h2>
            <ul className="mt-4 space-y-2">
              {challenge.resources.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Navigation */}
      <Separator className="my-8" />
      <div className="flex items-center justify-between">
        {prevChallenge ? (
          <Link href={`/challenges/${prevChallenge.slug}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {prevChallenge.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {nextChallenge ? (
          <Link href={`/challenges/${nextChallenge.slug}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              {nextChallenge.title}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
