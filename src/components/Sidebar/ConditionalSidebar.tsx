"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";

type AppRole = "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";

interface ConditionalSidebarProps {
  role: AppRole;
  children: React.ReactNode;
  sidebarDefaultOpen: boolean;
}

export function ConditionalSidebar({ 
  role, 
  children, 
  sidebarDefaultOpen 
}: ConditionalSidebarProps) {
  const pathname = usePathname();
  
  // Rotas que DEVEM mostrar o sidebar
  const showSidebarRoutes = [
    "/",
    "/dashboard",
    "/admin",
    "/eventos",
    "/coord"
  ];
  
  // Verificar se deve mostrar o sidebar
  const shouldShowSidebar = showSidebarRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  if (!shouldShowSidebar) {
    // Para rotas sem sidebar, renderiza apenas o conteúdo
    return <>{children}</>;
  }

  // Para rotas com sidebar, renderiza o layout completo
  return (
    <SidebarProvider defaultOpen={sidebarDefaultOpen}>
      <AppSidebar role={role} />
      <SidebarInset>
        <div className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
