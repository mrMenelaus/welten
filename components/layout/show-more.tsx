"use client";

import React, { Children, useState } from "react";
import { ItemGroup } from "../ui/item";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  children: React.ReactNode;
  className?: string;
  initial?: number;
};

export default function ShowMore({ children, initial = 5 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const items = expanded
    ? children
    : Children.toArray(children).slice(0, initial);
  const remaining = Children.count(children) - initial;

  return (
    <div className="space-y-2">
      <ItemGroup>{items}</ItemGroup>
      {remaining > 0 && (
        <Button
          onClick={() => {
            return setExpanded(!expanded);
          }}
          variant="ghost"
        >
          {expanded ? (
            <>
              <ChevronUp /> Свернуть
            </>
          ) : (
            <>
              <ChevronDown /> Развернуть ({remaining})
            </>
          )}
        </Button>
      )}
    </div>
  );
}
