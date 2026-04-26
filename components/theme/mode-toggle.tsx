"use client";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, themes, theme } = useTheme();

  function toggleTheme() {
    if (theme) {
      const index = themes.indexOf(theme);
      return setTheme(themes[(index + 1) % themes.length]);
    }
    setTheme(themes[0]);
  }

  return (
    <Button variant="outline" onClick={toggleTheme} size="icon-lg">
      <Palette />
    </Button>
  );
}
