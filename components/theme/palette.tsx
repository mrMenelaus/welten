"use client";

import { Color } from "@/lib/generated/prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { setAccent, setBackground } from "./actions";

export function Palette({
  colors,
  accent,
  background,
}: {
  colors: Color[];
  accent: string;
  background: string;
}) {
  useEffect(() => {
    document.body.style.setProperty(
      "--custom",
      `rgba(${[...accent.split(" "), 0.3].join(",")})`,
    );
    document.body.style.setProperty(
      "--custom",
      `rgba(${[...background.split(" "), 0.3].join(",")})`,
    );
  }, [accent, background]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className={"bg-primary/10"} variant="outline">
            Open
          </Button>
        }
      />
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Главный цвет</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value: string) => {
              setAccent(value);
              document.body.style.setProperty(
                "--custom",
                `rgba(${[...value.split(" "), 0.3].join(",")})`,
              );
            }}
          >
            {colors.map((color) => (
              <DropdownMenuRadioItem key={color.id} value={color.value}>
                <div
                  className="size-8 rounded-full"
                  style={{ backgroundColor: `rgb(${color.value})` }}
                />
                rgb({color.value})
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Дополнительный цвет</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value: string) => {
              setBackground(value);
              document.body.style.setProperty(
                "--custom",
                `rgba(${[...value.split(" "), 0.3].join(",")})`,
              );
            }}
          >
            {colors.map((color) => (
              <DropdownMenuRadioItem key={color.id} value={color.value}>
                <div
                  className="size-8 rounded-full"
                  style={{ backgroundColor: `rgb(${color.value})` }}
                />
                rgb({color.value})
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
