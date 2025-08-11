// /app/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaGetInstance } from "@/lib/prisma";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Menu/app-sidebar";
import { Acampa2Stats } from "@/components/Dashboard/Acampa2Stats";

export default async function Autenticado() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  if (!authCookie?.value) {
    redirect("/login");
  }

  const sessionToken = authCookie.value;
  const prisma = PrismaGetInstance();
  const session = await prisma.sessions.findFirst({
    where: { token: sessionToken },
  });

  if (!session || !session.valid || session.expiresAt < new Date()) {
    redirect("/login");
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-width transition-heightease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Home</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                  <p className="text-slate-600 mt-1">Estatísticas do Acampa 2 Comunidade Naftali</p>
                </div>
              </div>
              
              <Acampa2Stats />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
