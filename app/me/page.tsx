import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { ProfileCard } from "@/components/profile/profile-card";
import jwt from "jsonwebtoken";



export default function Me() {
  return (
    <div className="flex gap-4 flex-col">
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
  const token = (await cookies()).get("token")?.value
  if (!token) return null

  const player = jwt.verify(token, process.env.JWT_SECRET!) as {name: string}

  return <ProfileCard name={player.name} />;
}
