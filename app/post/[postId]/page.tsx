import { Comment } from "@/components/comment/comment";
import { CommentForm } from "@/components/comment/comment-form";
import { PlayerPost } from "@/components/profile/player-post";
import { ItemGroup } from "@/components/ui/item";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: PageProps<"/post/[postId]">) {
  const { postId } = await params;
  const session = await getSession();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      images: true,
      likes: { where: { authorId: session?.sub } },
      comments: {
        include: {
          likes: { where: { authorId: session?.sub } },
          author: true,
          _count: { select: { likes: true } },
        },
      },
      _count: { select: { comments: true, likes: true, views: true } },
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
