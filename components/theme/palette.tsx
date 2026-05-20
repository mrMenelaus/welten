"use client";

import { Color } from "@/lib/generated/prisma/client";
import { useEffect } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { setAccent, setOpacity } from "./actions";
import { PaletteIcon } from "lucide-react";

const opacities = Array.from({ length: 5 }, (_, i) => `${(i + 1) * 5}%`);

export function Palette({
  colors,
  accent,opacity
}: {
  colors: Color[];
  accent: string;
  opacity: string;
}) {
  useEffect(() => {
    document.body.style.setProperty("--primary", accent);
    document.body.style.setProperty("--opacity", opacity);
  }, [accent,opacity]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className={"bg-primary/10"} variant="outline">
            <PaletteIcon /> Настроить тему
          </Button>
        }
      />
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Цвета профиля</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Главный цвет</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                onValueChange={(value: string) => {
                  setAccent(value);
                  document.body.style.setProperty("--primary", value);
                }}
              >
                {colors.map((color) => (
                  <DropdownMenuRadioItem key={color.id} value={color.value}>
                    <div
                      className="size-8 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Прозрачность</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                onValueChange={(value: string) => {
                  setOpacity(value);
                  document.body.style.setProperty("--opacity", value);
                }}
              >
                {opacities.map((e) => (
                  <DropdownMenuRadioItem key={e} value={e}>
                    {e}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
