"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";

type AppRole = "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";

export function MaybeSidebar({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const hideMenuRoutes = ["/login", "/cadastro", "/acampa/acampa-de-novembro", "/acampa/[id]"]; // rotas sem sidebar
  const shouldShowMenu = !hideMenuRoutes.includes(pathname);

  if (!shouldShowMenu) return null;
  return <AppSidebar role={role} />;
}


