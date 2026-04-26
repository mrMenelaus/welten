import { Animated } from "@/components/layout/animated";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { BannerWrapper } from "@/components/auth/banner-wrapper";
import { WelcomeBanner } from "@/components/auth/welcome-banner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProfileCard } from "@/components/profile/profile-card";
import { prisma } from "@/lib/prisma";
import { UnderDevelopment } from "@/components/layout/under-development";

export default function Me() {
  return (
    <div className="flex gap-4 flex-col">
      <Animated>
        <Suspense>
          <BannerWrapper>
            <WelcomeBanner />
          </BannerWrapper>
        </Suspense>
      </Animated>
      <div className="flex-1 flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Ваши записи (100+)</CardTitle>
              <CardDescription>Последняя запись была 26.04.26</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="lg:w-md">
          <Suspense>
            <Profile />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { player: true },
  });
  if (!user?.player) {
    return <UnderDevelopment />;
  }
  return <ProfileCard name={user.player.name} />;
}
