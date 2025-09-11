// /components/Menu/nav-main.tsx

"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link"; // Importe o Link do Next.js

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  activePathname,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  activePathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegação</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = !!(item.items && item.items.length > 0);
          const isActive =
            item.url === activePathname ||
            (item.items?.some((s) => s.url === activePathname) ?? false);
          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`rounded-xl transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:pl-1 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                      : ""
                  }`}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span className="font-medium group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={
                item.isActive ||
                item.items?.some((s) => s.url === activePathname)
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`rounded-xl transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:pl-1 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                        : ""
                    }`}
                  >
                    {item.icon && <item.icon />}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = subItem.url === activePathname;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={`${isSubActive ? "bg-blue-50 text-blue-700 rounded-lg" : ""}`}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
