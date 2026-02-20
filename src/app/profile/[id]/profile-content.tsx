"use client";

import { useSession } from "next-auth/react";
import {
  Github,
  Calendar,
  Trophy,
  Code2,
  Flame,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ContributionGrid() {
  const weeks = 20;
  const days = 7;
  const cells = Array.from({ length: weeks * days }, (_, i) => {
    const level = Math.random();
    if (level < 0.5) return 0;
    if (level < 0.7) return 1;
    if (level < 0.85) return 2;
    if (level < 0.95) return 3;
    return 4;
  });

  const intensityClass = [
    "bg-muted",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/90",
  ];

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid grid-rows-7 grid-flow-col gap-[3px]">
        {cells.map((level, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-sm ${intensityClass[level]}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ProfileContent({ userId }: { userId: string }) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === userId;

  const user = session?.user;

  if (!user && isOwnProfile) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium">Sign in to view your profile</p>
      </div>
    );
  }

  const displayName = user?.name || "Vibe Coder";
  const displayImage = user?.image || "";

  const stats = [
    { icon: Trophy, label: "Challenges Completed", value: "0" },
    { icon: Code2, label: "Projects Shared", value: "0" },
    { icon: Flame, label: "Day Streak", value: "0" },
  ];

  return (
    <div>
      {/* Profile Header */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
          <AvatarImage src={displayImage} alt={displayName} />
          <AvatarFallback className="text-2xl">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vibe Coding enthusiast
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Joined 2026
            </span>
            <a
              href="#"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
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

      {/* Activity Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Activity</h2>
        <div className="mt-4 rounded-xl border border-border/60 bg-card/50 p-4">
          <ContributionGrid />
        </div>
      </div>

      <Separator className="my-8" />

      {/* Completed Challenges */}
      <section>
        <h2 className="text-lg font-semibold">Completed Challenges</h2>
        <div className="mt-4 rounded-xl border border-border/40 bg-card/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No completed challenges yet.
          </p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/challenges">Browse Challenges</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Shared Projects */}
      <section>
        <h2 className="text-lg font-semibold">Shared Projects</h2>
        <div className="mt-4 rounded-xl border border-border/40 bg-card/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No shared projects yet.
          </p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/showcase">Visit Showcase</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
