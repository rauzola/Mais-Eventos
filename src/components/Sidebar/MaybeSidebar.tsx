"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";

type AppRole = "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";

export function MaybeSidebar({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const hideMenuRoutes = ["/login", "/cadastro", "/acampa/acampa-novembro-2025", "/acampa/acampa-novembro-2025-servos", "/acampa/acampa-novembro-2025-campista-espera", "/acampa/[id]"];
  const shouldShowMenu = !hideMenuRoutes.includes(pathname);

  if (!shouldShowMenu) return null;
  return <AppSidebar role={role} />;
}


