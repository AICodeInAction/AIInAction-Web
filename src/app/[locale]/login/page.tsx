"use client";

import { signIn } from "next-auth/react";
import { Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("login");

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-8">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <Github className="h-5 w-5" />
            {t("continueGithub")}
          </Button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("terms")}
        </p>
      </div>
    </div>
  );
}
