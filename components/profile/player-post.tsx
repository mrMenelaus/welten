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
import Link from "next/link";
import { PostGallery } from "../post/post-gallery";
import { PostControls } from "../post/post-controls";
import { Suspense } from "react";
import { SendView } from "../post/send-view";
import { Like } from "../like/like";
import { Post } from "@/lib/generated/prisma/client";

export function PlayerPost({ post }: { post: Post }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{post.createdAt.toLocaleDateString()}</CardTitle>
        <CardDescription>
          {/* {post._count.views} */}
          10 просмотров</CardDescription>
        <CardAction>
          <Suspense>
            <PostControls post={post} />
          </Suspense>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        {/* <SendView postId={post.id} isViewed={post.isViewed} /> */}
        <p className="leading-7 not-first:mt-6 line-clamp-5 whitespace-pre-wrap mb-4">
          {post.content}
        </p>
        {/* <PostGallery images={post.images} /> */}
      </CardContent>
      <CardFooter>
        {/* <Like
          isLiked={post.isLiked}
          count={post._count.likes}
          entityId={post.id}
          type="post"
          size="sm"
        /> */}
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/post/${post.id}`} />}
        >
          <MessageCircleCheck />
          10
          {/* {post._count.comments} */}
        </Button>
      </CardFooter>
    </Card>
  );
}
