import { Heart, MessageCircleCheck } from "lucide-react";
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
import { Comment, Post } from "@/lib/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";

export function PlayerPost({
  post,
}: {
  post: Post & { _count: { comments: number } };
}) {
  return (
    <Card className="pt-0">
      <div className="aspect-video relative">
        <Image src={post.image} alt="photo" fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{post.createdAt.toLocaleDateString()}</CardTitle>
        <CardDescription>10 просмотров</CardDescription>
        <CardAction>
          <Badge variant="outline">Новый</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="leading-7 not-first:mt-6 line-clamp-6">{post.content}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <Heart />
          1213
        </Button>
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
