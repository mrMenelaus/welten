import { PlayerPost } from "./player-post";
import { Post } from "./get-player";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Animated } from "../layout/animated";

export async function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Посты ({posts.length})</h1>
        {/* <Toggle variant="outline" size="lg">
          <Minimize />
        </Toggle> */}
      </div>
      {posts.length ? (
        <div className="flex-1 grid sm:grid-cols-2 gap-4">
          {posts.map((e, i) => (
            <Animated
              key={e.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 1, 0.8, 1] }}
              transition={{
                delay: i * 0.1,
                duration: 0.8,
                ease: "easeInOut",
                times: [0, 0.2, 0.4, 0.7, 1],
              }}
              className="*:h-full"
            >
              <PlayerPost post={e} />
            </Animated>
          ))}
        </div>
      ) : (
        <EmptyPosts />
      )}
    </div>
  );
}

function EmptyPosts() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default"></EmptyMedia>
        <EmptyTitle>Нет постов</EmptyTitle>
        <EmptyDescription>
          Этот пользователь не выложил ни одного поста. Вы увидете записи, как
          только он создаст их
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
