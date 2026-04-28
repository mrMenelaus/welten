import { CommentForm } from "@/components/profile/comment-form";
import { PlayerPost } from "@/components/profile/player-post";
import { Comment } from "@/components/profile/profile-comments";
import { ItemGroup } from "@/components/ui/item";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: PageProps<"/post/[postId]">) {
  const { postId } = await params;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      comments: { include: { author: true, likes: true } },
      _count: { select: { comments: true } },
    },
  });
  if (!post) return notFound();

  return (
    <div className="space-y-4">
      <PlayerPost post={post} />
      <ItemGroup>
        {post.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </ItemGroup>
      <CommentForm entityId={postId} type="post" />
    </div>
  );
}
