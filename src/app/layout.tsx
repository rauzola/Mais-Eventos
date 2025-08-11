// /app/layout.tsx

"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Menu } from "@/components/Menu"; // Importando o Menu (componente cliente)
import { usePathname } from "next/navigation"; // Importando usePathname para verificar a rota atual
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Obtendo a rota atual

  // Definindo as rotas onde o Menu não deve ser exibido
  const hideMenuRoutes = ["/login", "/cadastro"];

  // Verificando se o Menu deve ser exibido
  const shouldShowMenu = !hideMenuRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
      <title>SaaS - Projeto Mais Vida</title>
    </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {shouldShowMenu && <Menu />} {/* Renderiza o Menu apenas se shouldShowMenu for true */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}