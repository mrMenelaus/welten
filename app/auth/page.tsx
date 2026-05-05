import { Animated } from "@/components/layout/animated";
import { Avatar } from "@/components/profile/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    include: { roles: true },
  });
  if (!player) return null;

  const token = jwt.sign(
    {
      sub: player.id,
      name: player.name,
      roles: player.roles.map((e) => e.value),
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  async function claimPlayer() {
    "use server";
    (await cookies()).set({ name: "token", value: token });
    redirect("/me");
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Animated
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 1, 0.8, 1] }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.7, 1],
        }}
        className="flex p-16 rounded-4xl border-border border flex-col items-center text-center gap-4"
      >
        <Avatar className="size-64 rounded-2xl" player={player} />
        <div>
          <div className="leading-12 font-black text-3xl">{player.name}</div>
          <div className="text-lg">
            {player.roles.map((role) => (
              <Badge key={role.id}>{role.value}</Badge>
            ))}
          </div>
        </div>
        <form action={claimPlayer}>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="hover:bg-primary ease-in-out duration-1000"
          >
            <FingerprintPattern />
            Войти в аккаунт
          </Button>
        </form>
      </Animated>
    </div>
  );
}
