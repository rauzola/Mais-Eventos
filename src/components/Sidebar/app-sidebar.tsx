// /components/Menu/app-sidebar.tsx

"use client";

import * as React from "react";
import { Frame, GalleryVerticalEnd, SquareTerminal, TentTree, type LucideIcon } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Base data; itens serão filtrados por permissão
const data = {
  user: {
    name: "Projeto Mais Vida",
    email: "site@projetomaisvida.com.br",
    avatar:
      "https://images.prismic.io/projetomaisvida/Z5JPe5bqstJ99yTn_icon.png?auto=format,compress",
  },
  // teams: [
  //   {
  //     name: "Projeto Mais Vida",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  // ],
  navMain: [
    {
      title: "Acampa Corpus Christi",
      url: "#",
      icon: TentTree,
      isActive: false,
      items: [
        {
          title: "Inscrições no Acampa",
          url: "/acampa-corpus-christi",
        },
        {
          title: "Lista de Espera",
          url: "/acampa-corpus-christi/lista-espera",
        },
        {
          title: "Lista de Servos",
          url: "/acampa-corpus-christi/lista-servos",
        },
      ],
    },
   
    {
      title: "Comunidades",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Comunidades",
          url: "/comunidades",
        }, 
      
      ],
    },
    // {
    //   title: "Eventos",
    //   url: "#",
    //   icon: SquareTerminal,
    //   items: [
    //     {
    //       title: "Eventos",
    //       url: "/eventos",
    //     },
    //     {
    //       title: "Presença",
    //       url: "/eventos/inscricoes",
    //     },
    //     {
    //       title: "Settings",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "Perfil",
    //       url: "/perfil",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Formulario Acampa",
      url: "https://www.projetomaisvida.com.br/inscricoes-acampa1-corpus-christi",
      icon: Frame,
    },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
};

type AppRole = "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";

function can(role: AppRole, required: AppRole): boolean {
  const order: AppRole[] = ["USER", "STAFF", "COORD", "CONCELHO", "ADMIN"];
  return order.indexOf(role) >= order.indexOf(required);
}

export function AppSidebar({ role, ...props }: React.ComponentProps<typeof Sidebar> & { role: AppRole }) {

  const adminOnly = {
    title: "Administração",
    url: "/admin",
    icon: SquareTerminal,
    items: [
      { title: "Admin", url: "/admin" },
      { title: "Usuários", url: "/admin/usuarios" },
    ],
  };
  

  type NavItem = { title: string; url: string; icon?: LucideIcon; items?: { title: string; url: string }[] };
  const navMain: NavItem[] = [
    ...data.navMain,
    ...(can(role, "ADMIN") ? [adminOnly] : []),
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
