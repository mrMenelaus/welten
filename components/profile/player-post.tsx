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
// import Image from "next/image";
import { Post } from "@/lib/generated/prisma/client";

export function PlayerPost({ post }: { post: Post }) {
  return (
    <Card>
      {/* <div className="relative w-full aspect-video">
        <Image
          fill
          alt="lipstick"
          src="https://i.ytimg.com/vi/28rboCjfW_E/hqdefault.jpg?sqp=-oaymwEnCOADEI4CSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLATT7hbZQ36LlvDbK-6dKQsZDnKIw"
        />
      </div> */}
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
        <Button variant="outline">
          <MessageCircleCheck />
          321
        </Button>
      </CardFooter>
    </Card>
  );
}
