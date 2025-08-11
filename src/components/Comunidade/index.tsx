"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Crown,
  ArrowRight,
  Heart,
  Edit,
  Save,
  X,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Mapeamento completo de classes para cores
const badgeClasses = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  purple: "bg-purple-100 text-purple-800",
  red: "bg-red-100 text-red-800",
  amber: "bg-amber-100 text-amber-800",
  pink: "bg-pink-100 text-pink-800",
  indigo: "bg-indigo-100 text-indigo-800",
  teal: "bg-teal-100 text-teal-800",
};

const iconClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  red: "text-red-600",
  amber: "text-amber-600",
  pink: "text-pink-600",
  indigo: "text-indigo-600",
  teal: "text-teal-600",
};

const buttonClasses = {
  blue: "bg-blue-600 hover:bg-blue-700",
  green: "bg-green-600 hover:bg-green-700",
  purple: "bg-purple-600 hover:bg-purple-700",
  red: "bg-red-600 hover:bg-red-700",
  amber: "bg-amber-600 hover:bg-amber-700",
  pink: "bg-pink-600 hover:bg-pink-700",
  indigo: "bg-indigo-600 hover:bg-indigo-700",
  teal: "bg-teal-600 hover:bg-teal-700",
};

// Traduções para português
const corTemaLabels = {
  blue: "Azul",
  green: "Verde",
  purple: "Roxo",
  red: "Vermelho",
  amber: "Âmbar",
  pink: "Rosa",
  indigo: "Índigo",
  teal: "Verde-azulado",
};

type CorTema =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "amber"
  | "pink"
  | "indigo"
  | "teal";

type Comunidade = {
  id: number;
  nome: string;
  brasao_url?: string;
  foto_comunidade_url?: string;
  data_primeiro_acampa: string;
  primeiro_nome: string;
  data_segundo_acampa?: string | null;
  segundo_nome?: string | null;
  data_envio?: string | null;
  assessores?: string;
  descricao?: string;
  cor_tema: CorTema;
};

type ComunidadeFormState = {
  id?: number;
  nome?: string;
  brasao_url?: string;
  foto_comunidade_url?: string;
  primeiro_nome?: string;
  segundo_nome?: string | null;
  assessores?: string;
  descricao?: string;
  cor_tema?: CorTema;
  data_primeiro_acampa?: Date | null;
  data_segundo_acampa?: Date | null;
  data_envio?: Date | null;
};

export default function Comunidades() {
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [comunidadeEditada, setComunidadeEditada] =
    useState<ComunidadeFormState>({});
  const [novaComunidadeModal, setNovaComunidadeModal] = useState(false);
  const [novaComunidade, setNovaComunidade] = useState<ComunidadeFormState>({
    nome: "",
    primeiro_nome: "",
    cor_tema: "blue",
    data_primeiro_acampa: new Date(),
  });

  useEffect(() => {
    async function fetchComunidades() {
      try {
        const res = await fetch("/api/comunidades");
        if (!res.ok) throw new Error("Erro ao buscar comunidades");
        const data = await res.json();
        setComunidades(data);
      } catch (error) {
        console.error("Erro ao buscar comunidades:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComunidades();
  }, []);

  const entrarModoEdicao = (comunidade: Comunidade) => {
    setEditando(comunidade.id);
    const dataEditada: ComunidadeFormState = {
      ...comunidade,
      data_primeiro_acampa: new Date(comunidade.data_primeiro_acampa),
      data_segundo_acampa: comunidade.data_segundo_acampa
        ? new Date(comunidade.data_segundo_acampa)
        : null,
      data_envio: comunidade.data_envio
        ? new Date(comunidade.data_envio)
        : null,
    };
    setComunidadeEditada(dataEditada);
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setComunidadeEditada({});
  };

  const salvarEdicao = async (id: number) => {
    try {
      const dadosParaEnviar = {
        ...comunidadeEditada,
        data_primeiro_acampa:
          comunidadeEditada.data_primeiro_acampa?.toISOString(),
        data_segundo_acampa:
          comunidadeEditada.data_segundo_acampa?.toISOString(),
        data_envio: comunidadeEditada.data_envio?.toISOString(),
      };

      const res = await fetch(`/api/comunidades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!res.ok) throw new Error("Erro ao atualizar comunidade");

      const data = await res.json();
      setComunidades(
        comunidades.map((c) =>
          c.id === id
            ? {
                ...c,
                ...data,
                data_primeiro_acampa: data.data_primeiro_acampa,
                data_segundo_acampa: data.data_segundo_acampa || null,
                data_envio: data.data_envio || null,
              }
            : c
        )
      );
      setEditando(null);
      setComunidadeEditada({});
    } catch (error) {
      console.error("Erro ao atualizar comunidade:", error);
      alert("Erro ao atualizar comunidade.");
    }
  };

  const criarNovaComunidade = async () => {
    try {
      const dadosParaEnviar = {
        ...novaComunidade,
        data_primeiro_acampa:
          novaComunidade.data_primeiro_acampa?.toISOString(),
        data_segundo_acampa: novaComunidade.data_segundo_acampa?.toISOString(),
        data_envio: novaComunidade.data_envio?.toISOString(),
      };

      const res = await fetch("/api/comunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!res.ok) throw new Error("Erro ao criar comunidade");

      const data = await res.json();
      setComunidades([...comunidades, data]);
      setNovaComunidadeModal(false);
      setNovaComunidade({
        nome: "",
        primeiro_nome: "",
        cor_tema: "blue",
        data_primeiro_acampa: new Date(),
      });
    } catch (error) {
      console.error("Erro ao criar comunidade:", error);
      alert("Erro ao criar comunidade.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setComunidadeEditada((prev) => ({ ...prev, [name]: value }));
  };

  const handleNovaComunidadeChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNovaComunidade((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    date: Date | null,
    field: keyof ComunidadeFormState
  ) => {
    setComunidadeEditada((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleNovaComunidadeDateChange = (
    date: Date | null,
    field: keyof ComunidadeFormState
  ) => {
    setNovaComunidade((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const comunidadesFiltradas = comunidades.filter((comunidade) => {
    const nome = comunidade.nome.toLowerCase();
    const ano = new Date(comunidade.data_primeiro_acampa)
      .getFullYear()
      .toString();
    const busca = termoBusca.toLowerCase();
    return nome.includes(busca) || ano.includes(busca);
  });

  // Ordenar comunidades da mais recente para a mais antiga
  const comunidadesOrdenadas = [...comunidadesFiltradas].sort(
    (a, b) =>
      new Date(b.data_primeiro_acampa).getTime() -
      new Date(a.data_primeiro_acampa).getTime()
  );

  const comunidadesPorAno = comunidadesOrdenadas.reduce((acc, comunidade) => {
    const year = new Date(comunidade.data_primeiro_acampa).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(comunidade);
    return acc;
  }, {} as Record<string, Comunidade[]>);

  const anos = Object.keys(comunidadesPorAno).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <>
      <title>Comunidades - Projeto Mais Vida</title>

      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossas Comunidades
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Conheça as famílias que nasceram dos acampamentos e hoje caminham
              juntas em Cristo.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <div className="max-w-md w-full">
                <input
                  type="text"
                  placeholder="Buscar por Nome ou Ano..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 border-solid shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={() => setNovaComunidadeModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Comunidade
              </Button>
            </div>
          </div>

          {/* Modal para Nova Comunidade */}
          {novaComunidadeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Criar Nova Comunidade
                    </h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setNovaComunidadeModal(false)}
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Comunidade
                      </label>
                      <Input
                        name="nome"
                        value={novaComunidade.nome || ""}
                        onChange={handleNovaComunidadeChange}
                        placeholder="Ex: Comunidade São João"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Acampamento
                      </label>
                      <Input
                        name="primeiro_nome"
                        value={novaComunidade.primeiro_nome || ""}
                        onChange={handleNovaComunidadeChange}
                        placeholder="Ex: Alegria"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor do Tema
                      </label>
                      <select
                        name="cor_tema"
                        value={novaComunidade.cor_tema || "blue"}
                        onChange={handleNovaComunidadeChange}
                        className="w-full border rounded p-2"
                      >
                        {Object.entries(corTemaLabels).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data do 1º Acampa
                      </label>
                      <DatePicker
                        selected={
                          novaComunidade.data_primeiro_acampa
                            ? new Date(novaComunidade.data_primeiro_acampa)
                            : new Date()
                        }
                        onChange={(date) =>
                          handleNovaComunidadeDateChange(
                            date,
                            "data_primeiro_acampa"
                          )
                        }
                        dateFormat="dd/MM/yyyy"
                        className="w-full border rounded p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <Textarea
                        name="descricao"
                        value={novaComunidade.descricao || ""}
                        onChange={handleNovaComunidadeChange}
                        placeholder="Descrição da comunidade"
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setNovaComunidadeModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={criarNovaComunidade}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Criar Comunidade
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-600">
              Carregando comunidades...
            </p>
          ) : anos.length === 0 ? (
            <Card className="shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Nenhuma Comunidade Encontrada
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Nenhuma comunidade corresponde ao termo pesquisado.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-16">
              {anos.map((ano) => (
                <div key={ano} className="relative">
                  <div className="flex justify-center items-center mb-12">
                    <div
                      className="bg-white px-6 py-3 rounded-full shadow-lg border-2 border-blue-500"
                      style={{ zIndex: 1 }}
                    >
                      <h2 className="text-3xl font-bold text-blue-600">
                        {ano}
                      </h2>
                    </div>
                    <div className="absolute left-0 w-full h-0.5 bg-gray-200"></div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-1/2 w-1 bg-gradient-to-b from-blue-200 to-purple-200 h-full -translate-x-1/2 hidden md:block"></div>

                    {comunidadesPorAno[ano].map((comunidade, index) => {
                      const cor = comunidade.cor_tema;
                      const estaEditando = editando === comunidade.id;

                      // Obter datas para edição
                      const dataPrimeiroAcampa =
                        estaEditando &&
                        comunidadeEditada.data_primeiro_acampa instanceof Date
                          ? comunidadeEditada.data_primeiro_acampa
                          : new Date(comunidade.data_primeiro_acampa);

                      const dataSegundoAcampa =
                        estaEditando &&
                        comunidadeEditada.data_segundo_acampa instanceof Date
                          ? comunidadeEditada.data_segundo_acampa
                          : comunidade.data_segundo_acampa
                          ? new Date(comunidade.data_segundo_acampa)
                          : null;

                      const dataEnvio =
                        estaEditando &&
                        comunidadeEditada.data_envio instanceof Date
                          ? comunidadeEditada.data_envio
                          : comunidade.data_envio
                          ? new Date(comunidade.data_envio)
                          : null;

                      return (
                        <div key={comunidade.id} className="mb-16 md:relative">
                          <div className="md:flex md:items-center md:w-full">
                            <div
                              className={`md:w-1/2 ${
                                index % 2 === 0
                                  ? "md:pr-8"
                                  : "md:pl-8 md:order-2"
                              }`}
                            >
                              <Card className="shadow-2xl border-0 relative hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                                <div
                                  className={`${
                                    buttonClasses[comunidade.cor_tema]
                                  } absolute top-1/2 -translate-y-1/2 ${
                                    index % 2 === 0
                                      ? "md:-right-6"
                                      : "md:-left-6"
                                  } w-12 h-12 rounded-full bg-gradient-to-br from-${cor}-500 to-${cor}-600 hidden md:flex items-center justify-center text-white shadow-lg border-4 border-white border-solid`}
                                >
                                  <Heart className="w-6 h-6" />
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                  {estaEditando ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          salvarEdicao(comunidade.id)
                                        }
                                        className="text-green-600 hover:bg-green-50"
                                      >
                                        <Save className="w-5 h-5" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={cancelarEdicao}
                                        className="text-red-600 hover:bg-red-50"
                                      >
                                        <X className="w-5 h-5" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() =>
                                        entrarModoEdicao(comunidade)
                                      }
                                      className="text-gray-600 hover:bg-gray-100"
                                    >
                                      <Edit className="w-5 h-5" />
                                    </Button>
                                  )}
                                </div>

                                <CardHeader className="pb-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg shadow-md bg-gray-100 flex items-center justify-center overflow-hidden">
                                      {estaEditando ? (
                                        <div className="flex flex-col gap-1">
                                          <label className="text-xs text-gray-500">
                                            URL do Brasão
                                          </label>
                                          <Input
                                            name="brasao_url"
                                            value={
                                              comunidadeEditada.brasao_url ||
                                              comunidade.brasao_url ||
                                              ""
                                            }
                                            onChange={handleChange}
                                            className="text-xs p-1"
                                          />
                                        </div>
                                      ) : comunidade.brasao_url ? (
                                        <Image
                                          src={comunidade.brasao_url}
                                          alt={`Brasão ${comunidade.nome}`}
                                          width={64}
                                          height={64}
                                          className="object-contain w-full h-full p-1"
                                        />
                                      ) : (
                                        <div className="text-gray-400 text-xs text-center">
                                          Sem brasão
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      {estaEditando ? (
                                        <>
                                          <Input
                                            name="nome"
                                            value={
                                              comunidadeEditada.nome ||
                                              comunidade.nome
                                            }
                                            onChange={handleChange}
                                            className="text-2xl font-bold mb-2"
                                            placeholder="Nome da Comunidade"
                                          />
                                          <Input
                                            name="primeiro_nome"
                                            value={
                                              comunidadeEditada.primeiro_nome ||
                                              comunidade.primeiro_nome
                                            }
                                            onChange={handleChange}
                                            className="mb-2"
                                            placeholder="Nome do Acampamento (ex: Alegria)"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                            {comunidade.nome}
                                          </CardTitle>
                                          <Badge
                                            className={
                                              badgeClasses[comunidade.cor_tema]
                                            }
                                          >
                                            {comunidade.primeiro_nome}
                                          </Badge>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                  <div className="space-y-2">
                                    {estaEditando ? (
                                      <Input
                                        name="foto_comunidade_url"
                                        value={
                                          comunidadeEditada.foto_comunidade_url ||
                                          comunidade.foto_comunidade_url ||
                                          ""
                                        }
                                        onChange={handleChange}
                                        placeholder="URL da foto da comunidade"
                                      />
                                    ) : comunidade.foto_comunidade_url ? (
                                      <div className="relative rounded-xl overflow-hidden w-full h-48">
                                        <Image
                                          src={comunidade.foto_comunidade_url}
                                          alt={`Foto da comunidade ${comunidade.nome}`}
                                          layout="fill"
                                          objectFit="cover"
                                          className="rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                      </div>
                                    ) : (
                                      <div className="relative rounded-xl overflow-hidden w-full h-48 bg-gray-100 flex items-center justify-center">
                                        <div className="text-center p-4">
                                          <span className="text-gray-500">
                                            Nenhuma foto adicionada
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {estaEditando ? (
                                    <Textarea
                                      name="descricao"
                                      value={
                                        comunidadeEditada.descricao ||
                                        comunidade.descricao ||
                                        ""
                                      }
                                      onChange={handleChange}
                                      placeholder="Descrição da comunidade"
                                      className="min-h-[100px]"
                                    />
                                  ) : (
                                    comunidade.descricao && (
                                      <p className="text-gray-600 leading-relaxed">
                                        {comunidade.descricao}
                                      </p>
                                    )
                                  )}

                                  {/* Seletor de cor no modo de edição */}
                                  {estaEditando && (
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        Cor do Tema
                                      </label>
                                      <select
                                        name="cor_tema"
                                        value={
                                          comunidadeEditada.cor_tema ||
                                          comunidade.cor_tema
                                        }
                                        onChange={handleChange}
                                        className="w-full border rounded p-2"
                                      >
                                        {Object.entries(corTemaLabels).map(
                                          ([key, label]) => (
                                            <option key={key} value={key}>
                                              {label}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>
                                  )}

                                  <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                      <Calendar
                                        className={
                                          iconClasses[comunidade.cor_tema]
                                        }
                                      />
                                      {estaEditando ? (
                                        <DatePicker
                                          selected={dataPrimeiroAcampa}
                                          onChange={(date) =>
                                            handleDateChange(
                                              date,
                                              "data_primeiro_acampa"
                                            )
                                          }
                                          dateFormat="dd/MM/yyyy"
                                          className="border rounded p-2 w-full"
                                          required
                                        />
                                      ) : (
                                        <span className="text-gray-700">
                                          <strong>1º Acampa:</strong>{" "}
                                          {new Date(
                                            comunidade.data_primeiro_acampa
                                          ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <Calendar
                                        className={
                                          iconClasses[comunidade.cor_tema]
                                        }
                                      />
                                      {estaEditando ? (
                                        <DatePicker
                                          selected={dataSegundoAcampa}
                                          onChange={(date) =>
                                            handleDateChange(
                                              date,
                                              "data_segundo_acampa"
                                            )
                                          }
                                          dateFormat="dd/MM/yyyy"
                                          className="border rounded p-2 w-full"
                                          isClearable
                                          placeholderText="Selecione a data do 2º Acampa"
                                        />
                                      ) : comunidade.data_segundo_acampa ? (
                                        <span className="text-gray-700">
                                          <strong>2º Acampa:</strong>{" "}
                                          {new Date(
                                            comunidade.data_segundo_acampa
                                          ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </span>
                                      ) : estaEditando ? (
                                        <span className="text-gray-500">
                                          Opcional
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <Crown
                                        className={
                                          iconClasses[comunidade.cor_tema]
                                        }
                                      />
                                      {estaEditando ? (
                                        <DatePicker
                                          selected={dataEnvio}
                                          onChange={(date) =>
                                            handleDateChange(date, "data_envio")
                                          }
                                          dateFormat="dd/MM/yyyy"
                                          className="border rounded p-2 w-full"
                                          isClearable
                                          placeholderText="Selecione a data de Envio"
                                        />
                                      ) : comunidade.data_envio ? (
                                        <span className="text-gray-700">
                                          <strong>Envio:</strong>{" "}
                                          {new Date(
                                            comunidade.data_envio
                                          ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </span>
                                      ) : estaEditando ? (
                                        <span className="text-gray-500">
                                          Opcional
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>

                                  {estaEditando ? (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h4 className="font-semibold text-gray-900 mb-2">
                                        Assessores:
                                      </h4>
                                      <Input
                                        name="assessores"
                                        value={
                                          comunidadeEditada.assessores ||
                                          comunidade.assessores ||
                                          ""
                                        }
                                        onChange={handleChange}
                                        placeholder="Nomes dos assessores"
                                      />
                                    </div>
                                  ) : comunidade.assessores ? (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h4 className="font-semibold text-gray-900 mb-2">
                                        Assessores:
                                      </h4>
                                      <p className="text-gray-700">
                                        {comunidade.assessores}
                                      </p>
                                    </div>
                                  ) : null}

                                  <div className="flex justify-between">
                                    <Link href={`/comunidades/${comunidade.id}`}>
                                      <Button
                                        className={`${
                                          buttonClasses[comunidade.cor_tema]
                                        } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                                      >
                                        <Users className="w-4 h-4 mr-2" />
                                        Ver Membros
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                      </Button>
                                    </Link>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            <div className="md:w-1/2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
