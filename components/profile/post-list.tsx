import { UnderDevelopment } from "../layout/under-development";
import { getPlayer } from "./get-player";
import { PlayerPost } from "./player-post";

export async function PostList({ name }: { name: string }) {
  const player = await getPlayer(name);
  if (!player) return <UnderDevelopment />;
  return (
    <div className="flex-1 flex flex-col gap-4">
      {player.posts.map((e) => (
        <PlayerPost key={e.id} post={e} />
      ))}
    </div>
  );
}
