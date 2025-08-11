// /components/Eventos/EventoCriar/index.tsx

"use client";
import { useState } from "react";
import axios from "axios";

export function EventoCriar() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [local, setLocal] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Estado para controlar a mensagem de sucesso

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se todos os campos estão preenchidos
    if (
      !nome ||
      !descricao ||
      !dataInicio ||
      !horaInicio ||
      !horaFim ||
      !local
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await axios.post("/api/eventos", {
        nome,
        descricao,
        dataInicio,
        horaInicio,
        horaFim,
        local,
      });

      if (response.status === 201) {
        setSuccess(true);
        setError("");
      } else {
        setError("Ocorreu um erro ao criar o evento.");
      }
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      setError("Erro ao criar evento. Tente novamente.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md m-4">
      <h1 className="text-2xl font-bold mb-6">Criar Evento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="time"
          value={horaFim}
          onChange={(e) => setHoraFim(e.target.value)}
        />

        {/* Radio buttons para os locais */}
        <div className="space-y-2">
          <p className="font-semibold">Escolha o local</p>
          <label className="block">
            <input
              type="radio"
              name="local"
              value="Mosteiro Projeto Mais Vida"
              checked={local === "Mosteiro Projeto Mais Vida"}
              onChange={(e) => setLocal(e.target.value)}
              className="mr-2"
            />
            Mosteiro Projeto Mais Vida
          </label>
          <label className="block">
            <input
              type="radio"
              name="local"
              value="Dona Guilhermina"
              checked={local === "Dona Guilhermina"}
              onChange={(e) => setLocal(e.target.value)}
              className="mr-2"
            />
            Dona Guilhermina
          </label>
          <label className="block">
            <input
              type="radio"
              name="local"
              value="Catedral - Maringá"
              checked={local === "Catedral - Maringá"}
              onChange={(e) => setLocal(e.target.value)}
              className="mr-2"
            />
            Catedral - Maringá
          </label>
          <label className="block">
            <input
              type="radio"
              name="local"
              value="Fazenda Astroga"
              checked={local === "Fazenda Astroga"}
              onChange={(e) => setLocal(e.target.value)}
              className="mr-2"
            />
            Fazenda Astroga
          </label>
        </div>

        {/* Exibe a mensagem de erro se houver algum campo vazio */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Criar Evento
        </button>

        {/* Exibe mensagem de sucesso após criação */}
        {success && (
          <div className="mt-4 text-green-500">
            <p>Evento criado com sucesso!</p>
          </div>
        )}
      </form>
    </div>
  );
}
