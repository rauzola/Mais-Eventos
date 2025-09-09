// /components/Menu/app-sidebar.tsx

"use client";

import * as React from "react";
import {
  Home,
  Settings,
  User,
  Calendar,
  Users,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { NavUser } from "./nav-user";

// Navegação principal (flat) semelhante ao exemplo enviado
const navigationFlat = [
  { title: "Início", url: "/dashboard", icon: Home },
  { title: "Eventos", url: "/eventos", icon: Calendar },
  { title: "Minhas Inscrições", url: "/inscricoes", icon: Users },
];

type AppRole = "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";

function can(role: AppRole, required: AppRole): boolean {
  const order: AppRole[] = ["USER", "STAFF", "COORD", "CONCELHO", "ADMIN"];
  return order.indexOf(role) >= order.indexOf(required);
}

export function AppSidebar({
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & { role: AppRole }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<{ name?: string; email: string; avatar?: string } | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) return;
        const me = await res.json();
        if (!mounted) return;
        setCurrentUser({ email: me.email, name: me.nomeCompleto || undefined });
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const adminGroup = {
    title: "Administração",
    url: "#",
    icon: Settings,
    items: [
      { title: "Dashboard Admin", url: "/admin" },
      { title: "Usuários", url: "/admin/usuarios" },
    ],
  };

  type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  };

  // Cada item da navigationFlat vira um item de primeiro nível no menu
  const navItems: NavItem[] = [
    ...navigationFlat.map((item) => ({
      title: item.title,
      url: item.url,
      icon: item.icon,
    })),

    ...(can(role, "ADMIN") ? [adminGroup] : []),
  ];

  const data = {
    user: currentUser || {
      name: "Projeto Mais Vida",
      email: "site@projetomaisvida.com.br",
    },
  }

  // Header estilizado e card de missão no conteúdo
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-blue-100 p-6 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">
              Projeto Mais Vida
            </h2>
            <p className="text-[10px] text-blue-600 leading-tight">
              Igreja Católica de Maringá
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <NavMain items={navItems} activePathname={pathname} />

        {/* <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-[11px] font-semibold text-gray-700">Nossa Missão</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Promover um encontro profundo com Deus, consigo mesmo e com o outro
            através do autoconhecimento e formação espiritual.
          </p>
        </div> */}
      </SidebarContent>

      <SidebarFooter className="border-t border-blue-100 p-3">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
