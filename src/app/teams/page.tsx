/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import SavedPokeTeamSlot from "@/components/SavedPokeTeamSlot";

export default function TeamPage() {
  // Carrega os times do localStorage ao iniciar
  const [teams, setTeams] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("teams");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Salva os times no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const [editingTeam, setEditingTeam] = useState<any | null>(null);
  const [teamName, setTeamName] = useState("");
  const [pokemons, setPokemons] = useState<string[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/";
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `https://pokedex-backend-woad.vercel.app/api/poketeams/user/${userId}`,
        );
        if (response.ok) {
          const data = await response.json();
          const formattedTeams = Array.isArray(data)
            ? data.map((teamObj: any) => ({
                teamId: teamObj._id || teamObj.teamId, // Ensure teamId is present
                teamName: teamObj.teamName || "",
                pokemonNames: teamObj.pokemonNames || [],
              }))
            : [];
          setTeams(formattedTeams);
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch teams:", errorText);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  const handleDeleteTeam = async (teamId: string) => {
    console.log("Deleting team with ID:", teamId);
    if (!teamId) return;
    try {
      const response = await fetch(
        `https://pokedex-backend-woad.vercel.app/api/poketeams/${teamId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setTeams((prev) => prev.filter((team) => team.teamId !== teamId));
      } else {
        const errorText = await response.text();
        console.error("Failed to delete team:", errorText);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  // Função para iniciar edição
  const handleEditTeam = (team: any) => {
    setEditingTeam(team);
    setTeamName(team.teamName);
    setPokemons(team.pokemonNames);
  };

  // Função para cancelar edição
  const handleNewTeam = () => {
    setEditingTeam(null);
    setTeamName("");
    setPokemons([]);
  };

  // Salvar time (novo ou editado)
  const handleSaveTeam = async () => {
    if (editingTeam) {
      // Editando: atualiza o time na lista
      setTeams((prev) =>
        prev.map((t) =>
          t.teamId === editingTeam.teamId
            ? { ...t, teamName, pokemonNames: pokemons }
            : t
        )
      );
    } else {
      // Novo: adiciona à lista
      setTeams((prev) => [
        ...prev,
        {
          teamId: Date.now(),
          teamName,
          pokemonNames: pokemons,
        },
      ]);
    }
    setEditingTeam(null);
    setTeamName("");
    setPokemons([]);
  };

  // Remover pokémon do time
  const handleRemovePokemon = (index: number) => {
    setPokemons((prev) => prev.filter((_, i) => i !== index));
  };

  // Adicionar pokémon (exemplo simples, adapte conforme seu fluxo)
  const handleAddPokemon = (pokemon: { name: string }) => {
    if (pokemons.length < 6) {
      setPokemons((prev) => [...prev, pokemon.name]);
    }
  };

  return (
    <div className="max-h-max min-h-screen w-screen bg-gray-50 font-sans">
      <header className="bg-gradient-to-r from-red-500 to-red-700 p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h1
            className="cursor-pointer text-3xl font-bold text-white"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Pokémon Teams
          </h1>
        </div>
      </header>

      <main className="px-4 py-8 md:px-16">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Teams</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Formulário de criar/editar time */}
            <div className="mb-6 rounded border p-4 shadow">
              <h2 className="mb-2 text-xl font-bold">
                { "Editar Time" }
              </h2>
              <input
                className="mb-2 w-full rounded border px-2 py-1"
                placeholder="Nome do time"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <div className="mb-2">
                <span className="font-semibold">Pokémons:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pokemons.map((poke, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                    >
                      <span>{poke}</span>
                      <button
                        className="text-xs text-red-500 ml-1"
                        onClick={() => handleRemovePokemon(idx)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  {pokemons.length < 6 && (
                    <button
                      className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-700"
                      onClick={() => {
                        // Exemplo: adicionar um pokémon fictício
                        const nome = prompt("Nome do Pokémon a adicionar:");
                        if (nome) handleAddPokemon({ name: nome });
                      }}
                    >
                      + Adicionar Pokémon
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="rounded bg-blue-500 px-4 py-1 text-white font-semibold hover:bg-blue-700"
                  onClick={handleSaveTeam}
                  disabled={!teamName || pokemons.length === 0}
                >
                  {"Salvar Alterações"}
                </button>
                {editingTeam && (
                  <button
                    className="rounded bg-gray-300 px-4 py-1 text-gray-700 font-semibold hover:bg-gray-400"
                    onClick={handleNewTeam}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {teams.map((team, teamIndex) => (
              <div
                key={team.teamId || teamIndex}
                className="rounded-lg bg-white p-4 shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {team.teamName || `Team ${teamIndex + 1}`}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      className="rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                      onClick={() => handleEditTeam(team)}
                    >
                      Editar
                    </button>
                    <button
                      className="ml-2 rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                      onClick={() => handleDeleteTeam(team.teamId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {team.pokemonNames.map(
                    (pokemonName: string, slotIndex: number) =>
                      pokemonName ? (
                        <SavedPokeTeamSlot key={slotIndex} name={pokemonName} />
                      ) : (
                        <div key={slotIndex} />
                      ),
                  )}
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No teams available.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
