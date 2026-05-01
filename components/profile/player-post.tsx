import { MessageCircleCheck } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Image, Like as LikeType, Post } from "@/lib/generated/prisma/client";
import Link from "next/link";
import { SendView } from "../post/send-view";
import { Like } from "../like/like";
import { PostGallery } from "../post/post-gallery";
import { PostControls } from "../post/post-controls";

export function PlayerPost({
  post,
}: {
  post: Post & {
    images: Image[];
    likes: LikeType[];
    _count: { comments: number; views: number; likes: number };
  };
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{post.createdAt.toLocaleDateString()}</CardTitle>
        <CardDescription>{post._count.views} просмотров</CardDescription>
        <CardAction>
          <Badge variant="outline">Новый</Badge>
          <PostControls post={post} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        <SendView postId={post.id} />
        <p className="leading-7 not-first:mt-6 line-clamp-5 mb-4">
          {post.content}
        </p>
        <PostGallery images={post.images} />
      </CardContent>
      <CardFooter>
        <Like
          isLiked={Boolean(post.likes.length)}
          count={post._count.likes}
          entityId={post.id}
          type="post"
          size="sm"
        />
        <Button variant="outline" asChild>
          <Link href={`/post/${post.id}`}>
            <MessageCircleCheck />
            {post._count.comments}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
