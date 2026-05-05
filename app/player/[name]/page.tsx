import { getPlayer } from "@/components/profile/get-player";
import { PostList } from "@/components/profile/post-list";
import { ProfileCard } from "@/components/profile/profile-card";

export default async function Player({ params }: PageProps<"/player/[name]">) {
  const { name } = await params;

  const profile = await getPlayer(name);

  if (!profile) return null;

  return (

    <div>
      <div className="flex-1 flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col flex-1 gap-4">
          <PostList posts={profile.posts} />
        </div>
        <div className="lg:w-sm">
          <ProfileCard player={profile} />
        </div>
      </div>
    </div>
  );
}
