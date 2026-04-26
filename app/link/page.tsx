import { Animated } from "@/components/layout/animated";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { FingerprintPattern } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LinkPage({ searchParams }: PageProps<"/link">) {
  const { key } = await searchParams;
  if (!key) {
    return <div>Invalid page</div>;
  }

  const verified = jwt.verify(key as string, process.env.JWT_SECRET!) as {
    name: string;
  };

  async function claimPlayer() {
    "use server";

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return;
    }

    await prisma.player.update({
      data: { userId: session.user.id },
      where: { name: verified.name },
    });

    redirect("/me");
  }

  return (
    <Animated>
      <Card>
        <CardHeader>
          <CardTitle>Осталось совсем немного</CardTitle>
          <CardDescription>
            Нажмите кнопку рядом, чтобы забрать аккаунт
          </CardDescription>
          <CardAction>
            <form action={claimPlayer}>
              <Button type="submit" size={"lg"}>
                <FingerprintPattern />
              </Button>
            </form>
          </CardAction>
        </CardHeader>
      </Card>
    </Animated>
  );
}
