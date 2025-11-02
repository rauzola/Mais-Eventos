"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Plus,
  Save,
  Trash2,
  Users,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

type CorTema = "blue" | "green" | "purple" | "red" | "amber" | "pink" | "indigo" | "teal";

type ComunidadeFormValues = {
  nome: string;
  descricao: string;
  brasao_url?: string | null;
  foto_comunidade_url?: string | null;
  data_primeiro_acampa: string;
  data_segundo_acampa?: string | null;
  data_envio?: string | null;
  assessores?: string | null;
  cor_tema: CorTema;
};

type ComunidadeListItem = {
  id: string;
  nome: string;
  descricao: string;
  brasao_url?: string | null;
  foto_comunidade_url?: string | null;
  data_primeiro_acampa: string;
  data_segundo_acampa?: string | null;
  data_envio?: string | null;
  assessores?: string | null;
  cor_tema: CorTema;
  createdAt: string;
  updatedAt: string;
};

const CORES_TEMA: { value: CorTema; label: string }[] = [
  { value: "blue", label: "Azul" },
  { value: "green", label: "Verde" },
  { value: "purple", label: "Roxo" },
  { value: "red", label: "Vermelho" },
  { value: "amber", label: "Âmbar" },
  { value: "pink", label: "Rosa" },
  { value: "indigo", label: "Anil" },
  { value: "teal", label: "Turquesa" },
];

export default function ComunidadesPage() {
  const [formValues, setFormValues] = React.useState<ComunidadeFormValues>({
    nome: "",
    descricao: "",
    brasao_url: null,
    foto_comunidade_url: null,
    data_primeiro_acampa: "",
    data_segundo_acampa: null,
    data_envio: null,
    assessores: null,
    cor_tema: "blue",
  });

  const [comunidades, setComunidades] = React.useState<ComunidadeListItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [uploadingBrasao, setUploadingBrasao] = React.useState(false);
  const [uploadingFoto, setUploadingFoto] = React.useState(false);
  const [brasaoFile, setBrasaoFile] = React.useState<File | null>(null);
  const [fotoFile, setFotoFile] = React.useState<File | null>(null);
  const [brasaoPreview, setBrasaoPreview] = React.useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = React.useState<string | null>(null);

  // Carregar comunidades ao montar o componente
  React.useEffect(() => {
    fetchComunidades();
  }, []);

  const fetchComunidades = async () => {
    try {
      const res = await fetch("/api/comunidades");
      if (res.ok) {
        const data = await res.json();
        setComunidades(data.comunidades || []);
      }
    } catch (err) {
      console.error("Erro ao carregar comunidades:", err);
    }
  };

  const handleChange = (field: keyof ComunidadeFormValues, value: string | null) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        nome: formValues.nome,
        descricao: formValues.descricao || "",
        brasao_url: formValues.brasao_url || null,
        foto_comunidade_url: formValues.foto_comunidade_url || null,
        data_primeiro_acampa: formValues.data_primeiro_acampa,
        data_segundo_acampa: formValues.data_segundo_acampa || null,
        data_envio: formValues.data_envio || null,
        assessores: formValues.assessores || null,
        cor_tema: formValues.cor_tema,
      };

      const res = await fetch("/api/comunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao criar comunidade");
      }

      const createdData = await res.json();
      const novaComunidadeId = createdData.comunidade?.id;

      setSuccess("Comunidade criada com sucesso!");
      
      // Fazer upload das imagens se houver
      if (novaComunidadeId) {
        // Upload do brasão
        if (brasaoFile) {
          setUploadingBrasao(true);
          try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", brasaoFile);
            formDataUpload.append("comunidadeId", novaComunidadeId);
            formDataUpload.append("tipo", "brasao");
            formDataUpload.append("nomeComunidade", formValues.nome);

            const uploadRes = await fetch("/api/comunidades/upload", {
              method: "POST",
              body: formDataUpload,
            });

            if (!uploadRes.ok) {
              const errorData = await uploadRes.json().catch(() => ({}));
              const errorMessage = errorData.error || "Erro ao fazer upload do brasão";
              const errorDetails = errorData.details || "";
              throw new Error(`${errorMessage}${errorDetails ? `\n\n${errorDetails}` : ""}`);
            }

            const uploadData = await uploadRes.json();
            setFormValues((prev) => ({ ...prev, brasao_url: uploadData.url }));
          } catch (err) {
            console.error("Erro ao fazer upload do brasão:", err);
            setError((err as Error).message);
          } finally {
            setUploadingBrasao(false);
          }
        }

        // Upload da foto
        if (fotoFile) {
          setUploadingFoto(true);
          try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", fotoFile);
            formDataUpload.append("comunidadeId", novaComunidadeId);
            formDataUpload.append("tipo", "foto");
            formDataUpload.append("nomeComunidade", formValues.nome);

            const uploadRes = await fetch("/api/comunidades/upload", {
              method: "POST",
              body: formDataUpload,
            });

            if (!uploadRes.ok) {
              const errorData = await uploadRes.json().catch(() => ({}));
              const errorMessage = errorData.error || "Erro ao fazer upload da foto";
              const errorDetails = errorData.details || "";
              throw new Error(`${errorMessage}${errorDetails ? `\n\n${errorDetails}` : ""}`);
            }

            const uploadData = await uploadRes.json();
            setFormValues((prev) => ({ ...prev, foto_comunidade_url: uploadData.url }));
          } catch (err) {
            console.error("Erro ao fazer upload da foto:", err);
            setError((err as Error).message);
          } finally {
            setUploadingFoto(false);
          }
        }
      }
      
      // Resetar formulário
      setFormValues({
        nome: "",
        descricao: "",
        brasao_url: null,
        foto_comunidade_url: null,
        data_primeiro_acampa: "",
        data_segundo_acampa: null,
        data_envio: null,
        assessores: null,
        cor_tema: "blue",
      });

      setBrasaoFile(null);
      setFotoFile(null);
      setBrasaoPreview(null);
      setFotoPreview(null);

      // Recarregar lista
      await fetchComunidades();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta comunidade?")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/comunidades/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao deletar comunidade");
      }

      setSuccess("Comunidade deletada com sucesso!");
      await fetchComunidades();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["CONCELHO", "ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg rounded-2xl mb-8">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Gerenciar Comunidades
                  </h1>
                  <p className="text-white/90 mt-2 text-lg">
                    Projeto Mais Vida - Igreja Católica de Maringá
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="whitespace-pre-line">{error}</div>
                  {error.includes("Bucket") && (
                    <div className="mt-3 p-3 bg-red-100 rounded border border-red-200 text-sm">
                      <p className="font-semibold mb-2">📋 Instruções para resolver:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>Acesse o painel do Supabase Dashboard</li>
                        <li>Vá em <strong>Storage</strong></li>
                        <li>Clique em <strong>New bucket</strong></li>
                        <li>Nome do bucket: <strong>comunidades</strong> (minúsculo, exatamente assim)</li>
                        <li>Marque como <strong>Public bucket</strong></li>
                        <li>Clique em <strong>Create</strong></li>
                        <li>Configure as políticas RLS no SQL Editor conforme instruções acima</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Criação */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <Plus className="w-6 h-6 text-primary" />
                  Nova Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome da Comunidade *</Label>
                    <Input
                      id="nome"
                      value={formValues.nome}
                      onChange={(e) => handleChange("nome", e.target.value)}
                      required
                      placeholder="Ex: Comunidade São João"
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formValues.descricao}
                      onChange={(e) => handleChange("descricao", e.target.value)}
                      placeholder="Descreva a comunidade..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cor_tema">Cor do Tema</Label>
                    <Select
                      value={formValues.cor_tema}
                      onValueChange={(value) => handleChange("cor_tema", value as CorTema)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CORES_TEMA.map((cor) => (
                          <SelectItem key={cor.value} value={cor.value}>
                            {cor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="data_primeiro_acampa">Data Primeiro Acampa *</Label>
                    <Input
                      id="data_primeiro_acampa"
                      type="date"
                      value={formValues.data_primeiro_acampa}
                      onChange={(e) => handleChange("data_primeiro_acampa", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="data_segundo_acampa">Data Segundo Acampa</Label>
                    <Input
                      id="data_segundo_acampa"
                      type="date"
                      value={formValues.data_segundo_acampa || ""}
                      onChange={(e) => handleChange("data_segundo_acampa", e.target.value || null)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="data_envio">Data Envio</Label>
                    <Input
                      id="data_envio"
                      type="date"
                      value={formValues.data_envio || ""}
                      onChange={(e) => handleChange("data_envio", e.target.value || null)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="assessores">Assessores</Label>
                    <Input
                      id="assessores"
                      value={formValues.assessores || ""}
                      onChange={(e) => handleChange("assessores", e.target.value || null)}
                      placeholder="Ex: João Silva, Maria Santos"
                    />
                  </div>

                  <div>
                    <Label htmlFor="brasao">Brasão da Comunidade</Label>
                    <div className="space-y-2">
                      {brasaoPreview && (
                        <div className="relative inline-block">
                          <img
                            src={brasaoPreview}
                            alt="Preview do brasão"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setBrasaoFile(null);
                              setBrasaoPreview(null);
                              handleChange("brasao_url", null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {formValues.brasao_url && !brasaoPreview && (
                        <div className="relative inline-block">
                          <img
                            src={formValues.brasao_url}
                            alt="Brasão atual"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleChange("brasao_url", null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <label
                        htmlFor="brasao"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG ou GIF até 10MB</p>
                        </div>
                        <input
                          id="brasao"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                setError("Arquivo deve ser de até 10MB");
                                return;
                              }
                              setBrasaoFile(file);
                              const reader = new FileReader();
                              reader.onload = () => setBrasaoPreview(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="foto">Foto da Comunidade</Label>
                    <div className="space-y-2">
                      {fotoPreview && (
                        <div className="relative inline-block">
                          <img
                            src={fotoPreview}
                            alt="Preview da foto"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFotoFile(null);
                              setFotoPreview(null);
                              handleChange("foto_comunidade_url", null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {formValues.foto_comunidade_url && !fotoPreview && (
                        <div className="relative inline-block">
                          <img
                            src={formValues.foto_comunidade_url}
                            alt="Foto atual"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleChange("foto_comunidade_url", null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <label
                        htmlFor="foto"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG ou GIF até 10MB</p>
                        </div>
                        <input
                          id="foto"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                setError("Arquivo deve ser de até 10MB");
                                return;
                              }
                              setFotoFile(file);
                              const reader = new FileReader();
                              reader.onload = () => setFotoPreview(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || uploadingBrasao || uploadingFoto}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading || uploadingBrasao || uploadingFoto ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploadingBrasao || uploadingFoto ? "Enviando imagens..." : "Criando..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Criar Comunidade
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Comunidades */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  Comunidades Existentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {comunidades.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma comunidade cadastrada ainda.</p>
                    </div>
                  ) : (
                    comunidades.map((comunidade) => (
                      <div
                        key={comunidade.id}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {comunidade.nome}
                            </h3>
                            {comunidade.descricao && (
                              <p className="text-sm text-gray-600 mt-1">
                                {comunidade.descricao}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              {comunidade.assessores && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {comunidade.assessores}
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                {CORES_TEMA.find((c) => c.value === comunidade.cor_tema)?.label}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                              Criada em: {new Date(comunidade.createdAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(comunidade.id)}
                            disabled={deletingId === comunidade.id}
                            className="ml-2"
                          >
                            {deletingId === comunidade.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

