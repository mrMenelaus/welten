import { PlayerCard } from "@/components/player/player-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import Form from "next/form";
import { Suspense } from "react";

export default async function Friends({ searchParams }: PageProps<"/friends">) {
  return (
    <div>
      <Form action="/friends">
        <Input name="q" type="search" placeholder="Искать по нику..." />
      </Form>
      <Suspense fallback={
        <Skeleton/>
      }>
      <PlayerList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PlayerList({
  searchParams,
}: {
  searchParams: PageProps<"/friends">["searchParams"];
}) {
  const { q = "" } = (await searchParams) as { q: string };

  const players = await prisma.player.findMany({
    where: { name: { contains: q } },
  });

  return (
    <div className="space-y-4">
      {players.map((e) => (
        <PlayerCard player={e} key={e.id} />
      ))}
    </div>
  );
}
