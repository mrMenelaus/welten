import { ProfileCard } from "@/components/profile/profile-card";

export default async function Player({ params }: PageProps<"/player/[name]">) {
  const { name } = await params;

  return (
    <div className="flex">
      <div className="flex-1" />
      <div className="max-w-sm w-full">
        <ProfileCard name={name} />
      </div>
    </div>
  );
}
