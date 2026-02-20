"use client";

import Link from "next/link";
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
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signIn, useSession } from "next-auth/react";

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

const paths = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Build modern web apps from portfolio sites to full-stack platforms",
    count: 25,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/paths/web-development",
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    desc: "Create games from Snake to multiplayer worlds with physics engines",
    count: 25,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    href: "/paths/game-development",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    desc: "Ship cross-platform mobile apps with React Native and Expo",
    count: 25,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    href: "/paths/mobile-development",
  },
  {
    icon: Bot,
    title: "AI Agents",
    desc: "Build intelligent agents, RAG systems, and AI-powered products",
    count: 25,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    href: "/paths/ai-agents",
  },
];

const featuredChallenges = [
  {
    num: "01",
    title: "Personal Portfolio",
    difficulty: "Beginner",
    category: "Web",
    time: "2-4 hours",
  },
  {
    num: "26",
    title: "Snake Game",
    difficulty: "Beginner",
    category: "Game",
    time: "3-5 hours",
  },
  {
    num: "76",
    title: "AI Chat Interface",
    difficulty: "Beginner",
    category: "AI Agent",
    time: "3-5 hours",
  },
  {
    num: "86",
    title: "RAG Knowledge Base",
    difficulty: "Intermediate",
    category: "AI Agent",
    time: "6-10 hours",
  },
  {
    num: "47",
    title: "Roguelike Dungeon",
    difficulty: "Advanced",
    category: "Game",
    time: "15-25 hours",
  },
  {
    num: "100",
    title: "Full AI SaaS Product",
    difficulty: "Expert",
    category: "AI Agent",
    time: "40+ hours",
  },
];

const stats = [
  { value: "100", label: "Challenges", icon: Trophy },
  { value: "4", label: "Learning Paths", icon: Sparkles },
  { value: "Open", label: "Source Projects", icon: Github },
  { value: "∞", label: "Community Vibes", icon: Users },
];

function DifficultyColor(d: string) {
  switch (d) {
    case "Beginner":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "Intermediate":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "Advanced":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "Expert":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "";
  }
}

export default function HomePage() {
  const { data: session } = useSession();

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
                100 Vibe Coding Challenges
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Learn{" "}
              <span className="bg-linear-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                Vibe Coding
              </span>
              <br />
              by Building Real Projects
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl"
            >
              From web apps to AI agents, master modern development through
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
              {!session && (
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

          {/* Terminal Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            className="mx-auto mt-16 max-w-2xl"
          >
            <div className="rounded-xl border border-border/60 bg-card/50 shadow-2xl shadow-primary/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Terminal className="h-3 w-3" />
                  vibe-coding
                </span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="text-muted-foreground">
                  <span className="text-emerald-500">$</span> npx create-vibe-project my-app
                </div>
                <div className="mt-2 text-muted-foreground">
                  <span className="text-primary">&#10003;</span> Scaffolded project structure
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary">&#10003;</span> Installed dependencies
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary">&#10003;</span> AI pair programming ready
                </div>
                <div className="mt-2 text-muted-foreground">
                  <span className="text-emerald-500">$</span> vibe build --challenge &quot;AI Chat Interface&quot;
                </div>
                <div className="mt-1 text-foreground">
                  Building something amazing...{" "}
                  <span className="animate-pulse text-primary">|</span>
                </div>
              </div>
            </div>
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
            {stats.map((stat) => (
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

      {/* Learning Paths */}
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
                Four Paths to Mastery
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                Choose your path or explore freely. Each track takes you from
                fundamentals to expert-level projects.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {paths.map((path) => (
                <motion.div key={path.title} variants={fadeUp}>
                  <Link href={path.href} className="group block">
                    <div className="rounded-xl border border-border/60 bg-card/50 p-6 transition-all hover:border-border hover:bg-card hover:shadow-lg">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${path.bg}`}
                      >
                        <path.icon className={`h-5 w-5 ${path.color}`} />
                      </div>
                      <h3 className="mt-4 font-semibold">{path.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {path.desc}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">
                          {path.count} challenges
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
                  Featured Challenges
                </h2>
                <p className="mt-3 text-muted-foreground text-lg">
                  Start with beginner-friendly projects or dive into expert builds.
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
              {featuredChallenges.map((c) => (
                <motion.div key={c.num} variants={fadeUp}>
                  <Link
                    href={`/challenges/${c.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group block"
                  >
                    <div className="rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-border hover:bg-card hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{c.num}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${DifficultyColor(c.difficulty)}`}
                        >
                          {c.difficulty}
                        </Badge>
                      </div>
                      <h3 className="mt-3 font-semibold group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{c.category}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span>{c.time}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
                Ready to Start Vibing?
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
                  <Link href="/showcase">
                    View Showcase
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
