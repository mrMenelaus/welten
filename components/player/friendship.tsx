"use client";

import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { answerFriendship, startFriendship } from "./player-actions";

export function FriendshipAccept({ friendshipId }: { friendshipId: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => answerFriendship(friendshipId, "ACCEPTED")}
    >
      <Check /> Принять
    </Button>
  );
}

export function FriendshipDecline({ friendshipId }: { friendshipId: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => answerFriendship(friendshipId, "DECLINED")}
    >
      <X /> Отклонить
    </Button>
  );
}

export function FriendshipStart({ playerId }: { playerId: string }) {
  return (
    <Button variant="outline" onClick={() => startFriendship(playerId)}>
      Добавить в друзья
    </Button>
  );
}
