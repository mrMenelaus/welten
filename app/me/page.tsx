import { ProfileCard } from "@/components/profile/profile-card";
import { getSession } from "@/lib/auth/get-session";
import { CreatePost } from "@/components/profile/create-post";
import { PostList } from "@/components/profile/post-list";
import { getPlayer } from "@/components/profile/get-player";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Profile() {
  const session = await getSession();
  if (!session) throw new Error();

  const profile = await getPlayer(session.name);

  if (!profile) return null;

  const lastPublished =
    profile.posts.at(0)?.createdAt.toDateString() ?? "Неизвестно";

  return (
    <div>
      <div className="flex-1 flex flex-col-reverse lg:flex-row gap-3">
        <div className="flex flex-col flex-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ваши посты</CardTitle>
              <CardDescription>
                Последняя запись была {lastPublished}
              </CardDescription>
                <CardAction>
                  <CreatePost />
                </CardAction>
            </CardHeader>
          </Card>
          <PostList posts={profile.posts} />
        </div>
        <div className="lg:w-sm">
          <ProfileCard player={profile} />
        </div>
      </div>
    </div>
  );
}
