import type { Metadata } from "next";
import { Github, Calendar, Trophy, Code2, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ProfileContent } from "./profile-content";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "User Profile",
  };
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  // In production, fetch user from database
  // For now, show a placeholder profile
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <ProfileContent userId={id} />
    </div>
  );
}
