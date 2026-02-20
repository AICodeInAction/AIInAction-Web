"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Github,
  ExternalLink,
  Heart,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signIn } from "next-auth/react";
import { SubmitProjectForm } from "./submit-form";

const sampleProjects = [
  {
    id: "1",
    title: "Neon Portfolio",
    description:
      "A cyberpunk-themed portfolio with neon glow effects, particle backgrounds, and smooth page transitions.",
    githubUrl: "https://github.com/demo/neon-portfolio",
    demoUrl: "https://neon-portfolio.vercel.app",
    tags: ["portfolio", "css", "animation"],
    likes: 42,
    challenge: "Personal Portfolio",
    user: { name: "Alex Chen", image: null },
  },
  {
    id: "2",
    title: "AI Chat Pro",
    description:
      "Full-featured AI chat interface with streaming responses, multiple model support, conversation branching, and dark mode.",
    githubUrl: "https://github.com/demo/ai-chat-pro",
    demoUrl: "https://ai-chat-pro.vercel.app",
    tags: ["ai", "chat", "streaming", "nextjs"],
    likes: 89,
    challenge: "AI Chat Interface",
    user: { name: "Sarah Kim", image: null },
  },
  {
    id: "3",
    title: "Retro Snake",
    description:
      "Classic Snake game with retro pixel art, power-ups, online leaderboard, and a level editor. Built with Canvas API.",
    githubUrl: "https://github.com/demo/retro-snake",
    demoUrl: null,
    tags: ["game", "canvas", "snake", "retro"],
    likes: 31,
    challenge: "Snake Game",
    user: { name: "Mike Johnson", image: null },
  },
  {
    id: "4",
    title: "RAG Docs Assistant",
    description:
      "Upload PDFs and ask questions. Uses OpenAI embeddings with Pinecone vector store. Shows source citations.",
    githubUrl: "https://github.com/demo/rag-docs",
    demoUrl: "https://rag-docs.vercel.app",
    tags: ["rag", "ai", "embeddings", "pinecone"],
    likes: 67,
    challenge: "RAG Knowledge Base",
    user: { name: "Priya Patel", image: null },
  },
  {
    id: "5",
    title: "Expense Tracker Mobile",
    description:
      "Beautiful expense tracker built with Expo. Features category charts, budget alerts, and CSV export.",
    githubUrl: "https://github.com/demo/expense-mobile",
    demoUrl: null,
    tags: ["mobile", "expo", "finance", "charts"],
    likes: 23,
    challenge: "Expense Tracker",
    user: { name: "Tom Liu", image: null },
  },
  {
    id: "6",
    title: "Wordle Plus",
    description:
      "Enhanced Wordle clone with 6-letter mode, timed challenges, multiplayer, and a comprehensive stats dashboard.",
    githubUrl: "https://github.com/demo/wordle-plus",
    demoUrl: "https://wordle-plus.vercel.app",
    tags: ["game", "wordle", "puzzle", "multiplayer"],
    likes: 55,
    challenge: "Wordle Clone",
    user: { name: "Emma Wilson", image: null },
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function ShowcasePage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = search.trim()
    ? sampleProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some((t) => t.includes(search.toLowerCase()))
      )
    : sampleProjects;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Community Showcase
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Projects built by the community. Get inspired and share yours.
          </p>
        </div>
        {session ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Share Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Share Your Project</DialogTitle>
              </DialogHeader>
              <SubmitProjectForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="gap-2" onClick={() => signIn("github")}>
            <Github className="h-4 w-4" />
            Sign in to Share
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mt-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Projects grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project) => (
          <motion.div key={project.id} variants={fadeUp}>
            <div className="group h-full rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-border hover:bg-card hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={project.user.image || ""} />
                    <AvatarFallback className="text-xs">
                      {project.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {project.user.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="h-3.5 w-3.5" />
                  {project.likes}
                </div>
              </div>

              <h3 className="mt-4 font-semibold">{project.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {project.challenge && (
                <Badge variant="secondary" className="mt-3 text-[10px]">
                  {project.challenge}
                </Badge>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                  Source
                </a>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">No projects found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or be the first to share!
          </p>
        </div>
      )}
    </div>
  );
}
