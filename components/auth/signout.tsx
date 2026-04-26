"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Animated } from "../layout/animated";

export function SignOut() {
  const router = useRouter();

  const { data } = authClient.useSession();

  return (
    data && (
      <Animated>
        <Button
          variant="outline"
          onClick={() =>
            authClient.signOut({}, { onSuccess: () => router.refresh() })
          }
          size="icon-lg"
        >
          <LogOut />
        </Button>
      </Animated>
    )
  );
}
