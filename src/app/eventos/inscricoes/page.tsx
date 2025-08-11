import { cookies } from "next/headers";
import { PrismaGetInstance } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ListaEventosInscritos from "@/components/Eventos/Inscritos/ListaEventosInscritos";
import { AppSidebar } from "@/components/Menu/app-sidebar";
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

export default async function EventosInscritosPage() {
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
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/eventos">Eventos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbPage>Eventos Inscritos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Eventos Inscritos</h1>
      <ListaEventosInscritos userId={session.userId} />
    </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
   
  );
}
