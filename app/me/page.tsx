import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { ProfileCard } from "@/components/profile/profile-card";
import { getSession } from "@/lib/auth/get-session";
import { PlayerPost } from "@/components/profile/player-post";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { CreatePost } from "@/components/profile/create-post";
import { PostList } from "@/components/profile/post-list";

export default function Me() {
  return (
    <div className="flex gap-4 flex-col">
      <Suspense>
        <Profile />
      </Suspense>
    </div>
  );
}

async function Profile() {
  const session = await getSession();
  return (
    session && (
      <div className="flex-1 flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col flex-1 gap-4">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Ваши посты</ItemTitle>
              <ItemDescription>Последняя запись была (неразборчиво)</ItemDescription>
            </ItemContent>
            <ItemActions>
              <CreatePost />
            </ItemActions>
          </Item>
          <PostList name={session.name} />
        </div>
        <div className="lg:w-sm">
          <ProfileCard name={session.name} />
        </div>
      </div>
    )
  );
}
