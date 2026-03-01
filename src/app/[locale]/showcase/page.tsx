import { getProjects } from "@/lib/challenges";
import { ShowcaseClient } from "./showcase-client";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "showcase" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ShowcasePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { projects, total } = await getProjects();

  return (
    <ShowcaseClient
      projects={JSON.parse(JSON.stringify(projects))}
      total={total}
    />
  );
}
