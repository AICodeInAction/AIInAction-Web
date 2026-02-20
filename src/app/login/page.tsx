"use client";

import { signIn } from "next-auth/react";
import { Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to track your progress and share projects
          </p>
        </div>
        <div className="mt-8">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
