"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Crown, ArrowLeft, Heart, Edit, Save, X, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_KEY = "dd17ef7221344934b36b6620dcf092e7";
const BASE_URL = "https://app.base44.com/api/apps/68517c13e045c1681c30f703/entities";

type CorTema = 'blue' | 'green' | 'purple' | 'red' | 'amber' | 'pink' | 'indigo' | 'teal';

type Comunidade = {
  id: string;
  nome: string;
  brasao_url?: string;
  foto_comunidade_url?: string;
  data_primeiro_acampa: string;
  primeiro_nome: string;
  data_segundo_acampa?: string;
  segundo_nome?: string;
  data_envio?: string;
  assessores?: string;
  descricao?: string;
  cor_tema: CorTema;
};

type Membro = {
  id: string;
  nome: string;
  foto_url?: string;
  comunidade_id: string;
  tipo_participacao: string;
  data_participacao: string;
  cargo?: string;
};

export default function ComunidadeDetalhes() {
  const params = useParams();

  const id = params?.id as string;
  
  const [comunidade, setComunidade] = useState<Comunidade | null>(null);
  const [comunidadeEditada, setComunidadeEditada] = useState<Partial<Comunidade>>({});
  const [editandoComunidade, setEditandoComunidade] = useState(false);
  
  const [membros, setMembros] = useState<Membro[]>([]);
  const [membroEditado, setMembroEditado] = useState<Partial<Membro>>({});
  const [editandoMembro, setEditandoMembro] = useState<string | null>(null);
  
  const [novoMembroModal, setNovoMembroModal] = useState(false);
  const [novoMembro, setNovoMembro] = useState<Omit<Membro, 'id'>>({
    nome: "",
    foto_url: "",
    comunidade_id: id,
    tipo_participacao: "campista_acampa1",
    data_participacao: new Date().toISOString(),
    cargo: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        // Buscar dados da comunidade
        const comunidadeRes = await fetch(`${BASE_URL}/Comunidade/${id}`, {
          headers: {
            api_key: API_KEY,
            "Content-Type": "application/json",
          },
        });
        const comunidadeData = await comunidadeRes.json();
        setComunidade(comunidadeData);
        setComunidadeEditada(comunidadeData);

        // Buscar membros da comunidade
        const membrosRes = await fetch(`${BASE_URL}/Membro?comunidade_id=${id}`, {
          headers: {
            api_key: API_KEY,
            "Content-Type": "application/json",
          },
        });
        const membrosData = await membrosRes.json();
        setMembros(membrosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Funções para edição da comunidade
  const entrarModoEdicaoComunidade = () => {
    setEditandoComunidade(true);
  };

  const cancelarEdicaoComunidade = () => {
    setEditandoComunidade(false);
    setComunidadeEditada(comunidade || {});
  };

  const salvarEdicaoComunidade = async () => {
    if (!comunidade) return;
    
    try {
      const response = await fetch(`${BASE_URL}/Comunidade/${comunidade.id}`, {
        method: "PUT",
        headers: {
          api_key: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comunidadeEditada),
      });

      if (!response.ok) throw new Error("Erro ao atualizar comunidade");

      const data = await response.json();
      setComunidade(data);
      setEditandoComunidade(false);
    } catch (error) {
      console.error("Erro ao atualizar comunidade:", error);
    }
  };

  const handleComunidadeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setComunidadeEditada(prev => ({ ...prev, [name]: value }));
  };

  const handleComunidadeDateChange = (date: Date | null, field: keyof Comunidade) => {
    setComunidadeEditada(prev => ({
      ...prev,
      [field]: date?.toISOString(),
    }));
  };

  // Funções para CRUD de membros
  const entrarModoEdicaoMembro = (membro: Membro) => {
    setEditandoMembro(membro.id);
    setMembroEditado({ ...membro });
  };

  const cancelarEdicaoMembro = () => {
    setEditandoMembro(null);
    setMembroEditado({});
  };

  const salvarEdicaoMembro = async () => {
    if (!membroEditado.id) return;
    
    try {
      const response = await fetch(`${BASE_URL}/Membro/${membroEditado.id}`, {
        method: "PUT",
        headers: {
          api_key: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(membroEditado),
      });

      if (!response.ok) throw new Error("Erro ao atualizar membro");

      const data = await response.json();
      setMembros(membros.map(m => m.id === membroEditado.id ? data : m));
      setEditandoMembro(null);
      setMembroEditado({});
    } catch (error) {
      console.error("Erro ao atualizar membro:", error);
    }
  };

  const criarNovoMembro = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Membro`, {
        method: "POST",
        headers: {
          api_key: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoMembro),
      });

      if (!response.ok) throw new Error("Erro ao criar membro");

      const data = await response.json();
      setMembros([...membros, data]);
      setNovoMembroModal(false);
      setNovoMembro({
        nome: "",
        foto_url: "",
        comunidade_id: id,
        tipo_participacao: "campista_acampa1",
        data_participacao: new Date().toISOString(),
        cargo: ""
      });
    } catch (error) {
      console.error("Erro ao criar membro:", error);
    }
  };

  const excluirMembro = async (membroId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/Membro/${membroId}`, {
        method: "DELETE",
        headers: {
          api_key: API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erro ao excluir membro");

      setMembros(membros.filter(m => m.id !== membroId));
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
    }
  };

  const handleMembroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMembroEditado(prev => ({ ...prev, [name]: value }));
  };

  const handleNovoMembroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoMembro(prev => ({ ...prev, [name]: value }));
  };

  const handleMembroDateChange = (date: Date | null) => {
    if (date) {
      setMembroEditado(prev => ({ ...prev, data_participacao: date.toISOString() }));
    }
  };

  const handleNovoMembroDateChange = (date: Date | null) => {
    if (date) {
      setNovoMembro(prev => ({ ...prev, data_participacao: date.toISOString() }));
    }
  };

  // Agrupamento de membros por tipo
  const groupMembersByType = () => {
    const groups: Record<string, Membro[]> = {
      campista_acampa1: [],
      servo_acampa1: [],
      campista_acampa2: [],
      servo_acampa2: [],
      campista_envio: [],
      servo_envio: [],
    };
    membros.forEach((m) => {
      if (groups[m.tipo_participacao]) groups[m.tipo_participacao].push(m);
    });
    return groups;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      campista_acampa1: "Campistas - Acampa 1º",
      servo_acampa1: "Servos - Acampa 1º",
      campista_acampa2: "Campistas - Acampa 2º",
      servo_acampa2: "Servos - Acampa 2º",
      campista_envio: "Campistas - Envio",
      servo_envio: "Servos - Envio",
    };
    return labels[type] || type;
  };

  // Imagem fallback
  const fallbackImage = "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ccc"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>`);

  if (loading) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  if (!comunidade) {
    return <div className="p-10 text-center text-red-500">Comunidade não encontrada.</div>;
  }

  const memberGroups = groupMembersByType();

  return (
    <>
      <title>{comunidade.nome}</title>
      <div className="min-h-screen py-12 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/comunidades">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </Link>

          {/* Seção de edição da comunidade */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                {editandoComunidade ? (
                  <Input
                    name="nome"
                    value={comunidadeEditada.nome || ''}
                    onChange={handleComunidadeChange}
                    className="text-2xl font-bold"
                  />
                ) : (
                  <CardTitle className="text-2xl font-bold">{comunidade.nome}</CardTitle>
                )}
                <div>
                  {editandoComunidade ? (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={salvarEdicaoComunidade}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Save className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={cancelarEdicaoComunidade}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={entrarModoEdicaoComunidade}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Imagens da comunidade */}
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    {editandoComunidade ? (
                      <>
                        <label className="block text-sm font-medium mb-2">URL do Brasão</label>
                        <Input
                          name="brasao_url"
                          value={comunidadeEditada.brasao_url || ''}
                          onChange={handleComunidadeChange}
                          className="mb-4"
                        />
                      </>
                    ) : (
                      comunidade.brasao_url && (
                        <Image
                          src={comunidade.brasao_url}
                          alt="Brasão"
                          width={120}
                          height={120}
                          className="w-24 h-24 object-contain"
                        />
                      )
                    )}
                  </div>

                  <div>
                    {editandoComunidade ? (
                      <>
                        <label className="block text-sm font-medium mb-2">URL da Foto da Comunidade</label>
                        <Input
                          name="foto_comunidade_url"
                          value={comunidadeEditada.foto_comunidade_url || ''}
                          onChange={handleComunidadeChange}
                        />
                      </>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden w-full h-48">
                        <Image
                          src={comunidade.foto_comunidade_url || '/default-community.jpg'}
                          alt="Foto da Comunidade"
                          fill
                          className="object-cover"
                        />
                      </div>
                    //   <div className="relative rounded-xl overflow-hidden w-full h-48 flex items-center justify-center bg-gray-100">
                    //   <img
                    //     src={comunidade.foto_comunidade_url || '/default-community.jpg'}
                    //     alt="Foto da Comunidade"
                    //     className="max-h-full max-w-full object-contain"
                    //     style={{
                    //       width: 'auto',
                    //       height: 'auto',
                    //       display: 'block',
                    //       margin: 'auto'
                    //     }}
                    //   />
                    // </div>
                    )}
                  </div>
                </div>

                {/* Informações da comunidade */}
                <div className="space-y-4">
                  {editandoComunidade ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Descrição</label>
                        <Textarea
                          name="descricao"
                          value={comunidadeEditada.descricao || ''}
                          onChange={handleComunidadeChange}
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Assessores</label>
                        <Input
                          name="assessores"
                          value={comunidadeEditada.assessores || ''}
                          onChange={handleComunidadeChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">1º Acampa</label>
                          <DatePicker
                            selected={comunidadeEditada.data_primeiro_acampa ? new Date(comunidadeEditada.data_primeiro_acampa) : null}
                            onChange={(date) => handleComunidadeDateChange(date, 'data_primeiro_acampa')}
                            dateFormat="dd/MM/yyyy"
                            className="w-full border rounded-md p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">2º Acampa</label>
                          <DatePicker
                            selected={comunidadeEditada.data_segundo_acampa ? new Date(comunidadeEditada.data_segundo_acampa) : null}
                            onChange={(date) => handleComunidadeDateChange(date, 'data_segundo_acampa')}
                            dateFormat="dd/MM/yyyy"
                            className="w-full border rounded-md p-2"
                            isClearable
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Envio</label>
                          <DatePicker
                            selected={comunidadeEditada.data_envio ? new Date(comunidadeEditada.data_envio) : null}
                            onChange={(date) => handleComunidadeDateChange(date, 'data_envio')}
                            dateFormat="dd/MM/yyyy"
                            className="w-full border rounded-md p-2"
                            isClearable
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {comunidade.descricao && <p className="text-gray-700">{comunidade.descricao}</p>}
                      
                      {comunidade.assessores && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium flex items-center gap-2 mb-2">
                            <Heart className="w-5 h-5 text-pink-500" /> Assessores
                          </h3>
                          <p>{comunidade.assessores}</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Calendar className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                            <p className="text-gray-800">
                              1º Acampa: {new Date(comunidade.data_primeiro_acampa).toLocaleDateString('pt-BR')}
                            </p>
                          </CardContent>
                        </Card>

                        {comunidade.data_segundo_acampa && (
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Calendar className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                              <p className="text-gray-800">
                                2º Acampa: {new Date(comunidade.data_segundo_acampa).toLocaleDateString('pt-BR')}
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {comunidade.data_envio && (
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Crown className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                              <p className="text-gray-800">
                                Envio: {new Date(comunidade.data_envio).toLocaleDateString('pt-BR')}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção de membros */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Membros</h2>
            <Button onClick={() => setNovoMembroModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Novo Membro
            </Button>
          </div>

          {/* Modal Novo Membro */}
          {novoMembroModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Adicionar Membro</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setNovoMembroModal(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome</label>
                      <Input
                        name="nome"
                        value={novoMembro.nome}
                        onChange={handleNovoMembroChange}
                        placeholder="Nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Cargo</label>
                      <Input
                        name="cargo"
                        value={novoMembro.cargo}
                        onChange={handleNovoMembroChange}
                        placeholder="Ex: Líder de Música"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Participação</label>
                      <select
                        name="tipo_participacao"
                        value={novoMembro.tipo_participacao}
                        onChange={handleNovoMembroChange}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="campista_acampa1">Campista - Acampa 1º</option>
                        <option value="servo_acampa1">Servo - Acampa 1º</option>
                        <option value="campista_acampa2">Campista - Acampa 2º</option>
                        <option value="servo_acampa2">Servo - Acampa 2º</option>
                        <option value="campista_envio">Campista - Envio</option>
                        <option value="servo_envio">Servo - Envio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Data de Participação</label>
                      <DatePicker
                        selected={new Date(novoMembro.data_participacao)}
                        onChange={handleNovoMembroDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full border rounded-md p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">URL da Foto</label>
                      <Input
                        name="foto_url"
                        value={novoMembro.foto_url}
                        onChange={handleNovoMembroChange}
                        placeholder="https://exemplo.com/foto.jpg"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setNovoMembroModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={criarNovoMembro}>
                        <Save className="w-4 h-4 mr-2" /> Salvar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Listagem de membros */}
          {membros.length > 0 ? (
            Object.entries(memberGroups).map(([tipo, list]) =>
              list.length ? (
                <Card key={tipo} className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                      <Users className="w-5 h-5 text-blue-600" />
                      {getTypeLabel(tipo)}
                      <Badge variant="secondary">{list.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {list.map((membro) => (
                        <Card key={membro.id}>
                          <CardContent className="p-4">
                            {editandoMembro === membro.id ? (
                              <div className="space-y-3">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={salvarEdicaoMembro}
                                    className="text-green-600 hover:bg-green-50"
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={cancelarEdicaoMembro}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="text-center">
                                  <Image
                                    src={membroEditado.foto_url || fallbackImage}
                                    alt={membroEditado.nome || ''}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                                  />
                                  <Input
                                    name="nome"
                                    value={membroEditado.nome || ''}
                                    onChange={handleMembroChange}
                                    className="mb-2"
                                  />
                                  <Input
                                    name="cargo"
                                    value={membroEditado.cargo || ''}
                                    onChange={handleMembroChange}
                                    className="mb-2"
                                    placeholder="Cargo"
                                  />
                                  <select
                                    name="tipo_participacao"
                                    value={membroEditado.tipo_participacao || ''}
                                    onChange={handleMembroChange}
                                    className="w-full border rounded-md p-2 mb-2"
                                  >
                                    <option value="campista_acampa1">Campista - Acampa 1º</option>
                                    <option value="servo_acampa1">Servo - Acampa 1º</option>
                                    <option value="campista_acampa2">Campista - Acampa 2º</option>
                                    <option value="servo_acampa2">Servo - Acampa 2º</option>
                                    <option value="campista_envio">Campista - Envio</option>
                                    <option value="servo_envio">Servo - Envio</option>
                                  </select>
                                  <DatePicker
                                    selected={membroEditado.data_participacao ? new Date(membroEditado.data_participacao) : null}
                                    onChange={handleMembroDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full border rounded-md p-2 mb-2"
                                  />
                                  <Input
                                    name="foto_url"
                                    value={membroEditado.foto_url || ''}
                                    onChange={handleMembroChange}
                                    placeholder="URL da foto"
                                    className="mb-2"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Image
                                  src={membro.foto_url || fallbackImage}
                                  alt={membro.nome}
                                  width={80}
                                  height={80}
                                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                                />
                                <h3 className="font-medium">{membro.nome}</h3>
                                {membro.cargo && (
                                  <Badge className="mt-1">{membro.cargo}</Badge>
                                )}
                                <p className="text-sm text-gray-600 mt-2">
                                  {new Date(membro.data_participacao).toLocaleDateString("pt-BR")}
                                </p>
                                <div className="flex justify-center gap-2 mt-3">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => entrarModoEdicaoMembro(membro)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => excluirMembro(membro.id)}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null
            )
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum membro cadastrado</h3>
                <p className="text-gray-600 mb-4">
                  Esta comunidade ainda não possui membros cadastrados.
                </p>
                <Button onClick={() => setNovoMembroModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Primeiro Membro
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}