import { UnderDevelopment } from "../layout/under-development";
import { getPlayer } from "./get-player";
import { PlayerPost } from "./player-post";

export async function PostList({ name }: { name: string }) {
  const player = await getPlayer(name);
  if (!player) return <UnderDevelopment />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black">Посты</h1>
      <div className="flex-1 grid grid-cols-2 gap-4">
        {player.posts.map((e) => (
          <PlayerPost key={e.id} post={e} />
        ))}
      </div>
    </div>
  );
}
