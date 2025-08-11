// /components/Perfil/index.tsx

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { SaudeForm } from "./SaudeForm";
import { ComunidadeForm } from "./ComunidadeForm";
import { PerfilForm } from "./PerfilForm ";

export function PerfilUser() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md m-4">
      <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="saude">Saúde</TabsTrigger>
          <TabsTrigger value="comunidade">Comunidade</TabsTrigger>
        </TabsList>
        <TabsContent value="perfil">
          <PerfilForm />
        </TabsContent>

        <TabsContent value="saude">
          <SaudeForm />
        </TabsContent>

        <TabsContent value="comunidade">
          <ComunidadeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
