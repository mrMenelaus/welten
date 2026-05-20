import { getPlayer } from "@/components/profile/get-player";
import { PostList } from "@/components/profile/post-list";
import { ProfileCard } from "@/components/profile/profile-card";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CSSProperties } from "react";

export async function generateStaticParams(){
  return prisma.player.findMany({select: {name: true}})
} 

export const metadata: Metadata = {
  title: "Страница игрока",
};

export default async function Player({ params }: PageProps<"/player/[name]">) {
  const { name } = await params;
  // const profile = await getPlayer(name);
  // if (!profile) notFound()

  return (
    <div
      className="flex-1 flex flex-col lg:flex-row gap-3"
      // style={
      //   {
      //     "--opacity": profile.opacity,
      //     "--primary": profile.accent,
      //     "--custom":
      //       "color-mix(in oklab, var(--primary) var(--opacity), transparent)",
      //   } as CSSProperties
      // }
    >
      <div className="flex flex-col flex-1 gap-4">
        <PostList name={name} />
      </div>
      <div className="lg:w-sm">
        <ProfileCard name={name} />
      </div>
    </div>
  );
}
