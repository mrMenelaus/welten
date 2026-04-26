"use client";

import { ReactElement, useState } from "react";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";
import { X } from "lucide-react";
import { Button } from "../ui/button";

export function BannerWrapper({ children }: { children: ReactElement }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Card size="sm">
      <CardHeader>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => setDismissed(true)}
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
