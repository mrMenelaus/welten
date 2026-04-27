import { PostList } from "@/components/profile/post-list";
import { ProfileCard } from "@/components/profile/profile-card";

export default async function Player({ params }: PageProps<"/player/[name]">) {
  const { name } = await params;

  return (
    <div className="flex gap-4">
      <PostList name={name} />
      <div className="max-w-sm w-full">
        <ProfileCard name={name} />
      </div>
    </div>
  );
}
