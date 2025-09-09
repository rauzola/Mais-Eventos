// /components/Menu/nav-user.tsx

"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import Link from "next/link"; // Importe o Link do Next.js

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name?: string;
    email: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Faz a requisição de logout
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redireciona para a página de login
        router.push("/login");
        router.refresh(); // Força a atualização do cache
      } else {
        console.error("Erro no logout:", response.statusText);
        // Em caso de erro, ainda redireciona para login
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      // Em caso de erro, redireciona para login
      router.push("/login");
    }
  };

  const getInitials = (name?: string, email?: string) => {
    const source = name && name.trim().length > 0 ? name : (email || "");
    const parts = source.replace(/@.*/, "").split(/[\s\.\_\-]+/).filter(Boolean);
    if (parts.length === 0) return "?";
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg yellow">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name || user.email} />}
                <AvatarFallback className="rounded-lg">{getInitials(user.name, user.email)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name || user.email}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name || user.email} />}
                  <AvatarFallback className="rounded-lg">{getInitials(user.name, user.email)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name || user.email}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <Link href="/perfil" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}