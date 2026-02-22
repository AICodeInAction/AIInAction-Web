import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPathBySlug,
  getChallengesByPath,
} from "@/lib/challenges";
import { PathDetail } from "./path-detail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = await getPathBySlug(slug);
  if (!path) return { title: "Path Not Found" };
  return {
    title: path.title,
    description: path.description,
  };
}

export default async function PathDetailPage({ params }: Props) {
  const { slug } = await params;
  const path = await getPathBySlug(slug);
  if (!path) notFound();

  const challenges = await getChallengesByPath(slug);

  return (
    <PathDetail
      path={JSON.parse(JSON.stringify(path))}
      challenges={JSON.parse(JSON.stringify(challenges))}
    />
  );
}
