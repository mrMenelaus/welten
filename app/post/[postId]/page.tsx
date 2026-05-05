import { Comment } from "@/components/comment/comment";
import { CommentForm } from "@/components/comment/comment-form";
import { UnderDevelopment } from "@/components/layout/under-development";
import { PlayerPost } from "@/components/profile/player-post";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: PageProps<"/post/[postId]">) {
  const { postId } = await params;
  const session = await getSession();

  if (!session) throw new Error();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      images: true,
      likes: { where: { authorId: session.sub } },
      views: { where: { playerId: session.sub } },
      comments: {
        include: {
          likes: { where: { authorId: session.sub } },
          author: true,
          _count: { select: { likes: true } },
        },
      },
      _count: { select: { comments: true, likes: true, views: true } },
    },
  });

  if (!post) return notFound();

  const mappedPost = {
    ...post,
    isLiked: post.likes.length > 0,
    isViewed: post.views.length > 0,
    comments: post.comments.map((c) => ({
      ...c,
      isLiked: c.likes.length > 0,
    })),
  };

  return (
    <div className="space-y-4">
      <PlayerPost post={mappedPost} />
      <Card>
        <CardHeader>
          <CardTitle>Комментарии ({mappedPost.comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {mappedPost.comments.length ? (
              mappedPost.comments.map((comment) => (
                <Comment comment={comment} key={comment.id} />
              ))
            ) : (
              <UnderDevelopment />
            )}
          </ItemGroup>
        </CardContent>
        <CardFooter className="block">
          <CommentForm entityId={postId} type="post" />
        </CardFooter>
      </Card>
    </div>
  );
}
