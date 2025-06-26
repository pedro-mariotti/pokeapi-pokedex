/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SavedPokeTeamSlot from "@/components/SavedPokeTeamSlot";
import Navbar from "@/components/Navbar";

type PokemonTypeInfo = {
  name: string;
  url: string;
};

type PokemonData = {
  name: string;
  types: PokemonTypeInfo[];
};

type Team = {
  teamId: string;
  teamName: string;
  pokemonNames: string[];
};

const getPokemonTypes = async (name: string): Promise<PokemonTypeInfo[]> => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.types.map((t: any) => t.type);
  } catch {
    return [];
  }
};

const getTypeEffectiveness = async (): Promise<
  Record<string, { double_damage_to: string[]; double_damage_from: string[] }>
> => {
  // Fetch all types and their relations
  const res = await fetch("https://pokeapi.co/api/v2/type");
  const data = await res.json();
  const types: string[] = data.results.map((t: any) => t.name);
  const typeChart: Record<
    string,
    { double_damage_to: string[]; double_damage_from: string[] }
  > = {};
  await Promise.all(
    types.map(async (type) => {
      const resType = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const dataType = await resType.json();
      typeChart[type] = {
        double_damage_to: dataType.damage_relations.double_damage_to.map(
          (t: any) => t.name,
        ),
        double_damage_from: dataType.damage_relations.double_damage_from.map(
          (t: any) => t.name,
        ),
      };
    }),
  );
  return typeChart;
};

const compareTeams = async (teamA: Team, teamB: Team) => {
  // Fetch pokemon types for both teams
  const [teamAData, teamBData] = await Promise.all([
    Promise.all(
      teamA.pokemonNames.map(async (name) => ({
        name,
        types: await getPokemonTypes(name),
      })),
    ),
    Promise.all(
      teamB.pokemonNames.map(async (name) => ({
        name,
        types: await getPokemonTypes(name),
      })),
    ),
  ]);

  // Fetch type effectiveness chart
  const typeChart = await getTypeEffectiveness();

  // Score calculation
  let teamAScore = 0;
  let teamBScore = 0;

  // For detailed breakdown
  const details: {
    teamA: { name: string; types: string[] }[];
    teamB: { name: string; types: string[] }[];
    effectiveness: {
      attacker: string;
      attackerTypes: string[];
      defender: string;
      defenderTypes: string[];
      result: string;
      team: "A" | "B";
    }[];
  } = {
    teamA: teamAData.map((p) => ({
      name: p.name,
      types: p.types.map((t) => t.name),
    })),
    teamB: teamBData.map((p) => ({
      name: p.name,
      types: p.types.map((t) => t.name),
    })),
    effectiveness: [],
  };

  // Compare each pokemon in A to each in B
  for (const pokeA of teamAData) {
    for (const pokeB of teamBData) {
      // For each type in pokeA, check if it is strong against any type in pokeB
      for (const typeA of pokeA.types) {
        if (
          typeChart[typeA.name]?.double_damage_to.some((t) =>
            pokeB.types.map((tt) => tt.name).includes(t),
          )
        ) {
          teamAScore++;
          details.effectiveness.push({
            attacker: pokeA.name,
            attackerTypes: pokeA.types.map((t) => t.name),
            defender: pokeB.name,
            defenderTypes: pokeB.types.map((t) => t.name),
            result: "super effective (A)",
            team: "A",
          });
        }
        if (
          typeChart[typeA.name]?.double_damage_from.some((t) =>
            pokeB.types.map((tt) => tt.name).includes(t),
          )
        ) {
          teamBScore++;
          details.effectiveness.push({
            attacker: pokeB.name,
            attackerTypes: pokeB.types.map((t) => t.name),
            defender: pokeA.name,
            defenderTypes: pokeA.types.map((t) => t.name),
            result: "super effective (B)",
            team: "B",
          });
        }
      }
      // For each type in pokeB, check if it is strong against any type in pokeA
      for (const typeB of pokeB.types) {
        if (
          typeChart[typeB.name]?.double_damage_to.some((t) =>
            pokeA.types.map((tt) => tt.name).includes(t),
          )
        ) {
          teamBScore++;
          details.effectiveness.push({
            attacker: pokeB.name,
            attackerTypes: pokeB.types.map((t) => t.name),
            defender: pokeA.name,
            defenderTypes: pokeA.types.map((t) => t.name),
            result: "super effective (B)",
            team: "B",
          });
        }
        if (
          typeChart[typeB.name]?.double_damage_from.some((t) =>
            pokeA.types.map((tt) => tt.name).includes(t),
          )
        ) {
          teamAScore++;
          details.effectiveness.push({
            attacker: pokeA.name,
            attackerTypes: pokeA.types.map((t) => t.name),
            defender: pokeB.name,
            defenderTypes: pokeB.types.map((t) => t.name),
            result: "super effective (A)",
            team: "A",
          });
        }
      }
    }
  }

  // Bonus for more pokemon
  if (teamA.pokemonNames.length > teamB.pokemonNames.length) teamAScore += 2;
  if (teamB.pokemonNames.length > teamA.pokemonNames.length) teamBScore += 2;

  let winner: "A" | "B" | "draw" = "draw";
  if (teamAScore > teamBScore) winner = "A";
  else if (teamBScore > teamAScore) winner = "B";

  return {
    teamAScore,
    teamBScore,
    winner,
    teamAData,
    teamBData,
    details,
  };
};

export default function TeamPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<(any | null)[]>([
    null,
    null,
  ]);
  const [comparisonResult, setComparisonResult] = useState<{
    teamAScore: number;
    teamBScore: number;
    winner: "A" | "B" | "draw";
    teamAData?: PokemonData[];
    teamBData?: PokemonData[];
    details?: {
      teamA: { name: string; types: string[] }[];
      teamB: { name: string; types: string[] }[];
      effectiveness: {
        attacker: string;
        attackerTypes: string[];
        defender: string;
        defenderTypes: string[];
        result: string;
        team: "A" | "B";
      }[];
    };
  } | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.replace("/");
      return;
    }
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/poketeams/user/${userId}`,
        );
        if (response.ok) {
          const data = await response.json();
          const formattedTeams = Array.isArray(data)
            ? data.map((teamObj: any) => ({
                teamId: teamObj._id || teamObj.teamId,
                teamName: teamObj.teamName || "",
                pokemonNames: teamObj.pokemonNames || [],
              }))
            : [];
          setTeams(formattedTeams);
          console.log("Fetched teams:", formattedTeams);
        }
      } catch {}
    };
    fetchTeams();
  }, [router]);

  const handleDeleteTeam = async (teamId: string) => {
    if (!teamId) return;
    try {
      const response = await fetch(
        `https://pokedex-backend-woad.vercel.app/api/poketeams/${teamId}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        setTeams((prev) => prev.filter((team) => team.teamId !== teamId));
        setSelectedTeams((prev) =>
          prev.map((team) => (team?.teamId === teamId ? null : team)),
        );
      }
    } catch {}
  };

  const handleCompareTeams = () => {
    setCompareMode((prev) => {
      if (prev) {
        setSelectedTeams([null, null]);
        setComparisonResult(null);
      }
      return !prev;
    });
  };

  const handleSelectTeam = (team: any) => {
    setComparisonResult(null);
    setSelectedTeams((prev) => {
      if (!prev[0]) return [team, null];
      if (!prev[1] && prev[0].teamId !== team.teamId) return [prev[0], team];
      if (prev[0]?.teamId === team.teamId) return [null, prev[1]];
      if (prev[1]?.teamId === team.teamId) return [prev[0], null];
      return [team, prev[1]];
    });
  };

  const handleRunComparison = async () => {
    if (!selectedTeams[0] || !selectedTeams[1]) return;
    setLoadingComparison(true);
    const result = await compareTeams(selectedTeams[0], selectedTeams[1]);
    setComparisonResult(result);
    setLoadingComparison(false);
  };

  return (
    <div className="max-h-max min-h-screen w-screen bg-gray-50 font-sans">
      <header>
        <Navbar />
      </header>

      <main className="px-4 py-8 md:px-16">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Teams</h2>
            <button
              className={`rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 ${
                compareMode ? "bg-blue-700" : ""
              }`}
              onClick={handleCompareTeams}
            >
              {compareMode ? "Cancelar comparação" : "Comparar times"}
            </button>
          </div>

          {compareMode && (
            <div className="mb-8 flex flex-col gap-4 md:flex-row">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="flex min-h-[250px] flex-1 flex-col items-center justify-center rounded-lg border-2 border-blue-400 bg-white p-6 shadow-lg"
                >
                  {selectedTeams[idx] ? (
                    <>
                      <h3 className="mb-2 text-xl font-bold text-gray-700">
                        {selectedTeams[idx].teamName || `Team`}
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedTeams[idx].pokemonNames.map(
                          (pokemonName: string, slotIndex: number) =>
                            pokemonName ? (
                              <SavedPokeTeamSlot
                                key={slotIndex}
                                name={pokemonName}
                              />
                            ) : (
                              <div key={slotIndex} />
                            ),
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">Selecione um time</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {compareMode && selectedTeams[0] && selectedTeams[1] && (
            <div className="mb-8 flex flex-col items-center">
              <button
                className="mb-4 rounded bg-purple-600 px-6 py-2 font-bold text-white hover:bg-purple-800"
                onClick={handleRunComparison}
                disabled={loadingComparison}
              >
                {loadingComparison ? "Comparando..." : "Comparar Selecionados"}
              </button>
              {comparisonResult && (
                <div className="w-full max-w-xl rounded bg-gray-100 p-4 text-center shadow-md">
                  <h4 className="mb-2 text-lg font-bold text-gray-700">
                    Resultado da Comparação
                  </h4>
                  <div className="mb-2 flex justify-around">
                    <div>
                      <span className="font-semibold">
                        {selectedTeams[0].teamName || "Time 1"}
                      </span>
                      <div>
                        Pontuação:{" "}
                        <span className="font-bold">
                          {comparisonResult.teamAScore}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {selectedTeams[1].teamName || "Time 2"}
                      </span>
                      <div>
                        Pontuação:{" "}
                        <span className="font-bold">
                          {comparisonResult.teamBScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xl font-bold">
                    {comparisonResult.winner === "draw"
                      ? "Empate!"
                      : comparisonResult.winner === "A"
                        ? `Vencedor: ${selectedTeams[0].teamName || "Time 1"}`
                        : `Vencedor: ${selectedTeams[1].teamName || "Time 2"}`}
                  </div>

                  {/* --- Detailed Comparison Breakdown --- */}
                  {comparisonResult.details && (
                    <div className="mt-6 text-left">
                      <h5 className="mb-2 text-base font-semibold text-gray-700">
                        Tipos dos Pokémons de cada time
                      </h5>
                      <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                          <div className="mb-1 font-bold text-blue-700">
                            {selectedTeams[0].teamName || "Time 1"}
                          </div>
                          <ul className="text-sm">
                            {comparisonResult.details.teamA.map((poke) => (
                              <li key={poke.name}>
                                <span className="font-semibold">
                                  {poke.name}
                                </span>
                                :{" "}
                                {poke.types.map((type) => (
                                  <span
                                    key={type}
                                    className="mr-1 inline-block rounded bg-blue-200 px-2 py-0.5 text-xs text-blue-900"
                                  >
                                    {type}
                                  </span>
                                ))}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 font-bold text-green-700">
                            {selectedTeams[1].teamName || "Time 2"}
                          </div>
                          <ul className="text-sm">
                            {comparisonResult.details.teamB.map((poke) => (
                              <li key={poke.name}>
                                <span className="font-semibold">
                                  {poke.name}
                                </span>
                                :{" "}
                                {poke.types.map((type) => (
                                  <span
                                    key={type}
                                    className="mr-1 inline-block rounded bg-green-200 px-2 py-0.5 text-xs text-green-900"
                                  >
                                    {type}
                                  </span>
                                ))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <h5 className="mt-4 mb-2 text-base font-semibold text-gray-700">
                        Detalhes dos cálculos de efetividade
                      </h5>
                      <div className="max-h-40 overflow-y-auto rounded border bg-white p-2 text-xs">
                        {comparisonResult.details.effectiveness.length ===
                          0 && (
                          <div className="text-gray-500">
                            Nenhuma vantagem de tipo encontrada.
                          </div>
                        )}
                        {comparisonResult.details.effectiveness.map(
                          (eff, idx) => (
                            <div key={idx} className="mb-1">
                              <span
                                className={
                                  eff.team === "A"
                                    ? "text-blue-700"
                                    : "text-green-700"
                                }
                              >
                                <b>{eff.attacker}</b> (
                                {eff.attackerTypes.join(", ")})
                              </span>{" "}
                              foi super efetivo contra{" "}
                              <span
                                className={
                                  eff.team === "A"
                                    ? "text-green-700"
                                    : "text-blue-700"
                                }
                              >
                                <b>{eff.defender}</b> (
                                {eff.defenderTypes.join(", ")})
                              </span>{" "}
                              <span className="text-gray-500 italic">
                                [{eff.result}]
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {/* --- End Detailed Comparison Breakdown --- */}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, teamIndex) => (
              <div
                key={team.teamId || teamIndex}
                className="rounded-lg bg-white p-4 shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {team.teamName || `Team ${teamIndex + 1}`}
                  </h3>
                  <div className="flex items-center">
                    {compareMode && (
                      <button
                        className={`mr-2 rounded px-3 py-1 text-sm font-semibold text-white ${
                          selectedTeams
                            .filter(Boolean)
                            .some((t) => t.teamId === team.teamId)
                            ? "bg-green-700"
                            : "bg-green-500 hover:bg-green-700"
                        }`}
                        onClick={() => handleSelectTeam(team)}
                      >
                        {selectedTeams
                          .filter(Boolean)
                          .some((t) => t.teamId === team.teamId)
                          ? "Selecionado"
                          : "Selecionar time"}
                      </button>
                    )}
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
