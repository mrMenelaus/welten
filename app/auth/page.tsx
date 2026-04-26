import { Animated } from "@/components/layout/animated";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { FingerprintPattern } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LinkPage({ searchParams }: PageProps<"/auth">) {
  const { key } = await searchParams;
  if (!key) {
    return <div>Invalid page</div>;
  }

  const verified = jwt.verify(key as string, process.env.JWT_SECRET!) as {
    name: string;
  };
  const player = await prisma.player.findUnique({
    where: { name: verified.name },
  });
  if (!player) return null;

  const token = jwt.sign(
    { sub: player.id, name: player.name },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  async function claimPlayer() {
    "use server";
    (await cookies()).set({ name: "token", value: token });
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
              <Button type="submit" size={"icon-lg"}>
                <FingerprintPattern />
              </Button>
            </form>
          </CardAction>
        </CardHeader>
      </Card>
    </Animated>
  );
}
