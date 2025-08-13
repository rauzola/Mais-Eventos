import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MaybeSidebar } from "@/components/Sidebar/MaybeSidebar";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma-vercel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mais Eventos - Projeto Mais Vida",
  description: "Projeto para o Projeto Mais Vida",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Busca role do usuário no servidor para evitar fetch em client
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-session")?.value;
  let role: "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN" = "USER";
  if (token) {
    try {
      const session = await prisma.sessions.findFirst({
        where: { token, valid: true, expiresAt: { gt: new Date() } },
        include: { User: true },
      });
      // @ts-expect-error role existe no schema
      role = (session?.User?.role as typeof role) || "USER";
    } catch {}
  }
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`}>
        <SidebarProvider>
          <MaybeSidebar role={role} />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
