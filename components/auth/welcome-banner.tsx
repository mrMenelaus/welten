import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { Button } from "../ui/button";
import Link from "next/link";
import { Copy, LogIn } from "lucide-react";

export async function WelcomeBanner() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    return (
      <Item>
        <ItemContent>
          <ItemTitle>Привет, {session.user.name}</ItemTitle>
          <ItemDescription>
           Спасибо за регистрацию
          </ItemDescription>
        </ItemContent>
      </Item>
    );
  }

  return (
    <Item>
      <ItemContent>
        <ItemTitle>Привет</ItemTitle>
        <ItemDescription>Войди, чтобы разблокировать профиль</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button asChild variant="outline" size="icon-lg">
          <Link href="/auth">
            <LogIn />
          </Link>
        </Button>
      </ItemActions>
    </Item>
  );
}
