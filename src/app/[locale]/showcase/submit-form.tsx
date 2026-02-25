"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function SubmitProjectForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("showcase");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // In production, this would call a server action to save to DB
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">{t("projectTitle")}</label>
        <Input
          name="title"
          placeholder={t("projectTitlePlaceholder")}
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">{t("githubUrl")}</label>
        <div className="relative mt-1.5">
          <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="githubUrl"
            placeholder={t("githubUrlPlaceholder")}
            required
            className="pl-9"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("demoUrl")}{" "}
          <span className="text-muted-foreground font-normal">{t("demoUrlOptional")}</span>
        </label>
        <Input
          name="demoUrl"
          placeholder={t("demoUrlPlaceholder")}
          className="mt-1.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">{t("description")}</label>
        <textarea
          name="description"
          placeholder={t("descriptionPlaceholder")}
          required
          rows={3}
          className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("tags")}{" "}
          <span className="text-muted-foreground font-normal">
            {t("tagsHint")}
          </span>
        </label>
        <Input
          name="tags"
          placeholder={t("tagsPlaceholder")}
          className="mt-1.5"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("sharing") : t("submitButton")}
      </Button>
    </form>
  );
}
