"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="text-center">
        <p className="font-mono text-7xl font-bold text-muted-foreground/30">
          {t("code")}
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
        <Button variant="outline" className="mt-6 gap-2" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            {t("backHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
