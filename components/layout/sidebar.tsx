"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bell, Bookmark, Coins, Handshake, Home, Landmark, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    href: "/me",
    icon: User,
    name: "Профиль",
  },
  {
    href: "/bank",
    icon: Landmark,
    name: "Банк",
  },
  {
    href: "/friends",
    icon: Handshake,
    name: "Друзья",
  },
  {
    href: "/donate",
    icon: Coins,
    name: "Донат",
  },
  {
    href: "#",
    icon: Bell,
    name: "Уведомления",
  },
  {
    href: "#",
    icon: Bookmark,
    name: "Форумы",
  },
] as const;

export function AppSidebar() {

  // const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
                <SidebarMenuButton  asChild>
                  <Link href="/">
                  <Home />
                    <span>Главная</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((e) => (
              <SidebarMenuItem key={e.name}>
                <SidebarMenuButton asChild>
                  <Link href={e.href}>
                    <e.icon />
                    <span>{e.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
