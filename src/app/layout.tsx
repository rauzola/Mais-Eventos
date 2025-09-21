import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalSidebar } from "@/components/Sidebar/ConditionalSidebar";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma-vercel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Eventos - Projeto Mais Vida",
  description:
    "Sistema de Eventos para o Projeto Mais Vida",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Busca role do usuário no servidor para evitar fetch em client
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-session")?.value;
  const sidebarCookie = cookieStore.get("sidebar_state")?.value;
  const sidebarDefaultOpen =
    sidebarCookie === "true" ? true : sidebarCookie === "false" ? false : true;
  let role: "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN" = "USER";
  if (token) {
    try {
      const session = await prisma.sessions.findFirst({
        where: { token, valid: true, expiresAt: { gt: new Date() } },
        include: { User: true },
      });
      role =
        (session?.User as unknown as { role?: typeof role })?.role || "USER";
    } catch {}
  }
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 `}>
        <ConditionalSidebar 
          role={role} 
          sidebarDefaultOpen={sidebarDefaultOpen}
        >
          {children}
        </ConditionalSidebar>
      </body>
    </html>
  );
}
