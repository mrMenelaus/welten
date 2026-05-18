import { getPlayer } from "@/components/profile/get-player";
import { PostList } from "@/components/profile/post-list";
import { ProfileCard } from "@/components/profile/profile-card";
import { Metadata } from "next";
import { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Страница игрока",
};

export default async function Player({ params }: PageProps<"/player/[name]">) {
  const { name } = await params;

  const profile = await getPlayer(name);

  if (!profile) return null;

  return (
    <div
      className="flex-1 flex flex-col lg:flex-row gap-3"
      style={
        {
          "--custom": `rgba(${[...profile.accent.split(" "), 0.3].join(",")})`,
        } as CSSProperties
      }
    >
      <div className="flex flex-col flex-1 gap-4">
        <PostList posts={profile.posts} />
      </div>
      <div className="lg:w-sm">
        <ProfileCard player={profile} />
      </div>
    </div>
  );
}
