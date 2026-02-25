"use client";

import { ArrowLeft } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { SubmitProjectForm } from "../submit-form";

export default function SubmitProjectPage() {
  const router = useRouter();
  const t = useTranslations("showcase");

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/showcase"
        className="mb-8 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("backToShowcase")}
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">{t("sharePageTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("sharePageSubtitle")}
      </p>
      <div className="mt-8">
        <SubmitProjectForm onSuccess={() => router.push("/showcase")} />
      </div>
    </div>
  );
}
