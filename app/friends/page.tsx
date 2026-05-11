import {
  FriendshipAccept,
  FriendshipDecline,
  FriendshipRemove,
  FriendshipStart,
} from "@/components/player/friendship";
import { PlayerCard } from "@/components/player/player-card";
import Search from "@/components/player/search";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { User } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Друзья",
};

export default async function Friends({ searchParams }: PageProps<"/friends">) {
  return (
    <div className="space-y-4">
      <Suspense>
        <FriendList />
      </Suspense>
      <Card>
        <CardHeader>
          <Suspense>
            <Search />
          </Suspense>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton />}>
            <PlayerList searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function PlayerList({
  searchParams,
}: {
  searchParams: PageProps<"/friends">["searchParams"];
}) {
  const { q = "" } = (await searchParams) as { q: string };
  const session = await getSession();
  if (!session) throw new Error();

  const players = await prisma.player.findMany({
    where: {
      name: { mode: "insensitive", contains: q },
      id: { not: session.sub },
    },
    include: { roles: true },
  });

  return (
    <div className="space-y-4">
      {players.length ? (
        players.map((e) => (
          <PlayerCard player={e} roles={e.roles} key={e.id}>
            <FriendshipStart playerId={e.id} />
          </PlayerCard>
        ))
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <User />
          </EmptyMedia>
          <EmptyTitle>Игроки не найдены</EmptyTitle>
          <EmptyDescription>67 Попробуйте снова 67 + 2</EmptyDescription>
        </Empty>
      )}
    </div>
  );
}

async function FriendList() {
  const session = await getSession();
  if (!session) throw new Error();

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ senderId: session.sub }, { receiverId: session.sub }],
    },
    include: { receiver: true, sender: true },
  });

  const acceptedFriendships = friendships.filter(
    (e) => e.answer === "ACCEPTED",
  );

  const pendingFriendships = friendships.filter(
    (e) => e.receiverId === session.sub && e.answer === "PENDING",
  );

  const declinedFriendships = friendships.filter(
    (e) => e.receiverId === session.sub && e.answer === "DECLINED",
  );

  return (
    <Card>
      <Tabs defaultValue="accepted">
        <CardHeader>
          <TabsList variant="line">
            <TabsTrigger value="accepted">
              Друзья ({acceptedFriendships.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Текущие заявки ({pendingFriendships.length})
            </TabsTrigger>
            <TabsTrigger value="declined">
              Отклонённые заявки ({declinedFriendships.length})
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="accepted">
            <ItemGroup>
              {acceptedFriendships.length ? (
                acceptedFriendships.map((friendship) => (
                  <PlayerCard
                    key={friendship.id}
                    player={
                      friendship.senderId === session.sub
                        ? friendship.receiver
                        : friendship.sender
                    }
                  >
                    <FriendshipRemove friendshipId={friendship.id} />
                  </PlayerCard>
                ))
              ) : (
                <Empty>
                  <EmptyMedia variant="icon">
                    <User />
                  </EmptyMedia>
                  <EmptyTitle>У вас нет друзей</EmptyTitle>
                  <EmptyDescription>67 67 67 67 67 67 67</EmptyDescription>
                </Empty>
              )}
            </ItemGroup>
          </TabsContent>
          <TabsContent value="pending">
            <ItemGroup>
              {pendingFriendships.map((friendship) => (
                <PlayerCard key={friendship.id} player={friendship.sender}>
                  <FriendshipAccept friendshipId={friendship.id} />
                  <FriendshipDecline friendshipId={friendship.id} />
                </PlayerCard>
              ))}
            </ItemGroup>
          </TabsContent>
          <TabsContent value="declined">
            <ItemGroup>
              {declinedFriendships.length ? (
                declinedFriendships.map((friendship) => (
                  <PlayerCard key={friendship.id} player={friendship.sender}>
                    <FriendshipAccept friendshipId={friendship.id} />
                  </PlayerCard>
                ))
              ) : (
                <Empty>
                  <EmptyMedia variant="icon">
                    <User />
                  </EmptyMedia>
                  <EmptyTitle>У вас нет отклонённых заявок</EmptyTitle>
                  <EmptyDescription>67 67 67 67 67 67 67</EmptyDescription>
                </Empty>
              )}
            </ItemGroup>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
