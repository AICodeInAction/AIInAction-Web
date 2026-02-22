"use client";

import { useSession } from "next-auth/react";
import {
  Github,
  Calendar,
  Trophy,
  Code2,
  Pencil,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { difficultyConfig } from "@/lib/constants";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  image: string | null;
  githubUrl: string | null;
  bio: string | null;
  createdAt: string;
  _count: {
    completions: number;
    projects: number;
    authoredChallenges: number;
  };
};

type PublishedChallenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: keyof typeof difficultyConfig;
  likesCount: number;
  category: { name: string } | null;
};

export function ProfileContent({
  user,
  publishedChallenges,
}: {
  user: User;
  publishedChallenges: PublishedChallenge[];
}) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === user.id;

  const displayName = user.name || "AI Builder";
  const joinYear = new Date(user.createdAt).getFullYear();

  const stats = [
    { icon: Trophy, label: "Completed", value: user._count.completions },
    { icon: Pencil, label: "Published", value: user._count.authoredChallenges },
    { icon: Code2, label: "Projects", value: user._count.projects },
  ];

  return (
    <div>
      {/* Profile Header */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
          <AvatarImage src={user.image || ""} alt={displayName} />
          <AvatarFallback className="text-2xl">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.bio || "AI builder"}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Joined {joinYear}
            </span>
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/60 bg-card/50 p-4 text-center"
          >
            <stat.icon className="mx-auto h-5 w-5 text-muted-foreground" />
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Tabs */}
      <Tabs defaultValue="completed">
        <TabsList>
          <TabsTrigger value="completed">Completed Challenges</TabsTrigger>
          <TabsTrigger value="published">Published Challenges</TabsTrigger>
          <TabsTrigger value="projects">Shared Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="mt-6">
          <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {user._count.completions === 0
                ? "No completed challenges yet."
                : `${user._count.completions} challenges completed.`}
            </p>
            {user._count.completions === 0 && (
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/challenges">Browse Challenges</Link>
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          {publishedChallenges.length > 0 ? (
            <div className="space-y-2">
              {publishedChallenges.map((challenge) => {
                const diff = difficultyConfig[challenge.difficulty];
                return (
                  <Link
                    key={challenge.id}
                    href={`/challenges/${challenge.slug}`}
                    className="group flex items-center gap-4 rounded-lg border border-border/40 bg-card/30 px-4 py-3.5 transition-all hover:border-border hover:bg-card hover:shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {challenge.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      {challenge.category && (
                        <Badge variant="secondary" className="text-[10px]">
                          {challenge.category.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-[10px] ${diff.className}`}>
                        {diff.label}
                      </Badge>
                    </div>
                    {challenge.likesCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {challenge.likesCount} likes
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No published challenges yet.
              </p>
              {isOwnProfile && (
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/challenges/new">Create a Challenge</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {user._count.projects === 0
                ? "No shared projects yet."
                : `${user._count.projects} projects shared.`}
            </p>
            {user._count.projects === 0 && (
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/showcase">Visit Showcase</Link>
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
