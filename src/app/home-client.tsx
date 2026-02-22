"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Gamepad2,
  Smartphone,
  Bot,
  Github,
  Users,
  Trophy,
  Sparkles,
  ChevronRight,
  Zap,
  Plus,
  Pen,
  ImageIcon,
  Video,
  BarChart3,
  AudioLines,
  Terminal,
  Shield,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signIn, useSession } from "next-auth/react";
import { difficultyConfig } from "@/lib/constants";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Gamepad2,
  Smartphone,
  Bot,
  Pen,
  Image: ImageIcon,
  Video,
  BarChart3,
  AudioLines,
  Terminal,
};

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
};

type FeaturedChallenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: keyof typeof difficultyConfig;
  estimatedTime: string | null;
  isOfficial: boolean;
  likesCount: number;
  category: { name: string } | null;
  author: { id: string; name: string | null; image: string | null } | null;
};

type Stats = {
  challengeCount: number;
  categoryCount: number;
  userCount: number;
  projectCount: number;
};

export function HomeClient({
  stats,
  categories,
  featured,
}: {
  stats: Stats;
  categories: Category[];
  featured: FeaturedChallenge[];
}) {
  const { data: session } = useSession();

  const statItems = [
    { value: String(stats.challengeCount), label: "Challenges", icon: Trophy },
    { value: String(stats.categoryCount), label: "Categories", icon: Sparkles },
    { value: String(stats.userCount || "Open"), label: stats.userCount ? "Builders" : "Source Projects", icon: stats.userCount ? Users : Github },
    { value: String(stats.projectCount || "0"), label: "Shared Projects", icon: FolderOpen },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge
                variant="outline"
                className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
              >
                <Zap className="h-3 w-3" />
                AI Practice Challenges
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Learn{" "}
              <span className="bg-linear-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                AI
              </span>
              <br />
              by Building Real Projects
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl"
            >
              From AI agents to creative tools, master modern development through
              hands-on challenges. Build, share, and grow with the community.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button size="lg" className="gap-2 px-6" asChild>
                <Link href="/challenges">
                  Start Building
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {session ? (
                <Button size="lg" variant="outline" className="gap-2 px-6" asChild>
                  <Link href="/challenges/new">
                    <Plus className="h-4 w-4" />
                    Create a Challenge
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-6"
                  onClick={() => signIn("github")}
                >
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {statItems.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                <div className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explore by Category
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                {categories.length} categories covering web development, games, mobile apps, and AI-powered tools.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon || ""] || Zap;
                return (
                  <motion.div key={cat.slug} variants={fadeUp}>
                    <Link href={`/challenges?category=${cat.slug}`} className="group block">
                      <div className="rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-border hover:bg-card hover:shadow-lg">
                        <div
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          <span style={{ color: cat.color || undefined }}>
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                        <h3 className="mt-3 font-semibold text-sm">{cat.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>
                        <div className="mt-3 flex items-center">
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="border-t border-border/40 bg-muted/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Popular Challenges
                </h2>
                <p className="mt-3 text-muted-foreground text-lg">
                  Top challenges from official content and the community.
                </p>
              </div>
              <Button variant="ghost" className="hidden gap-1 sm:flex" asChild>
                <Link href="/challenges">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((c) => {
                const diff = difficultyConfig[c.difficulty];
                return (
                  <motion.div key={c.id} variants={fadeUp}>
                    <Link href={`/challenges/${c.slug}`} className="group block">
                      <div className="rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-border hover:bg-card hover:shadow-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {c.isOfficial ? (
                              <Badge variant="secondary" className="text-[10px] gap-1">
                                <Shield className="h-3 w-3" />
                                Official
                              </Badge>
                            ) : c.author ? (
                              <div className="flex items-center gap-1.5">
                                {c.author.image && (
                                  <Image
                                    src={c.author.image}
                                    alt={c.author.name || ""}
                                    width={16}
                                    height={16}
                                    className="rounded-full"
                                  />
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {c.author.name}
                                </span>
                              </div>
                            ) : null}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${diff.className}`}
                          >
                            {diff.label}
                          </Badge>
                        </div>
                        <h3 className="mt-3 font-semibold group-hover:text-primary transition-colors">
                          {c.title}
                        </h3>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          {c.category && <span>{c.category.name}</span>}
                          {c.estimatedTime && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-border" />
                              <span>{c.estimatedTime}</span>
                            </>
                          )}
                          {c.likesCount > 0 && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-border" />
                              <span>{c.likesCount} likes</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" className="gap-1" asChild>
                <Link href="/challenges">
                  View all challenges
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 px-6 py-16 text-center sm:px-16"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
            </div>
            <div className="relative">
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Ready to Start Building?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mx-auto mt-4 max-w-md text-muted-foreground text-lg"
              >
                Join the community. Pick a challenge. Build something amazing.
                Share it with the world.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Button size="lg" className="gap-2 px-6" asChild>
                  <Link href="/challenges">
                    Browse Challenges
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 px-6" asChild>
                  <Link href="/challenges/new">
                    <Plus className="h-4 w-4" />
                    Create a Challenge
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
