import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { ProfileCard } from "@/components/profile/profile-card";
import { getSession } from "@/lib/auth/get-session";

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
  const session = await getSession();
  return session && <ProfileCard name={session.name} />;
}
