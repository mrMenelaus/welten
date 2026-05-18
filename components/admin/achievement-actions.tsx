"use client";

import { Achievement, Image as ImageType } from "@/lib/generated/prisma/client";
import { useTransition, useMemo, useOptimistic, startTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import Image from "next/image";
import { Toggle } from "../ui/toggle";
import { Book, Pen } from "lucide-react";
import { grantAchievement, revokeAchievement } from "./actions";

export function AchievementActions({
  playerAchievements,
  achievements,
  playerId,
}: {
  playerAchievements: Achievement[];
  achievements: (Achievement & { image: ImageType })[];
  playerId: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(playerAchievements);

  const ids = useMemo(() => new Set(optimistic.map((a) => a.id)), [optimistic]);

  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={
            <Button variant="outline" className="w-full">
              <Pen /> Редактировать
            </Button>
          }
        />
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Редактировать достижения</DialogTitle>
            <DialogDescription>
              Переключайте достижения игрока
            </DialogDescription>
          </DialogHeader>
          <ItemGroup>
            {achievements.map((e) => (
              <Item key={e.id} variant="outline" size="sm">
                <ItemMedia className="size-16 rounded-sm">
                  <Image
                    src={e.image.ufsUrl}
                    alt={e.image.name}
                    fill
                    className="object-cover"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{e.name}</ItemTitle>
                  <ItemDescription>{e.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Toggle
                    pressed={ids.has(e.id)}
                    onPressedChange={(pressed) => {
                      if (pressed) {
                        startTransition(async () => {
                          setOptimistic((state) => [e, ...state]);
                          await grantAchievement(playerId, e.id);
                        });
                      } else {
                        startTransition(async () => {
                          setOptimistic((state) =>
                            state.filter((a) => a.id !== e.id),
                          );
                          await revokeAchievement(playerId, e.id);
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Book />
                  </Toggle>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </DialogContent>
      </form>
    </Dialog>
  );
}
