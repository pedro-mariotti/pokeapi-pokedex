/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import SavedPokeTeamSlot from "@/components/SavedPokeTeamSlot";

export default function TeamPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<(any | null)[]>([
    null,
    null,
  ]);

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
                teamId: teamObj._id || teamObj.teamId,
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
        setSelectedTeams((prev) =>
          prev.map((team) => (team && team.teamId === teamId ? null : team)),
        );
      } else {
        const errorText = await response.text();
        console.error("Failed to delete team:", errorText);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  // Handler for "Comparar times"
  const handleCompareTeams = () => {
    setCompareMode((prev) => {
      if (prev) setSelectedTeams([null, null]);
      return !prev;
    });
  };

  // Handler for selecting a team for comparison
  const handleSelectTeam = (team: any) => {
    setSelectedTeams((prev) => {
      // If both slots are empty, insert in the first
      if (!prev[0]) return [team, null];
      // If first is filled and second is empty, insert in the second (if not same team)
      if (!prev[1] && prev[0].teamId !== team.teamId) return [prev[0], team];
      // If clicking the same team, remove it from the slot
      if (prev[0]?.teamId === team.teamId) return [null, prev[1]];
      if (prev[1]?.teamId === team.teamId) return [prev[0], null];
      // If both are filled, replace the first with the new selection
      return [team, prev[1]];
    });
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

          {/* Comparison View */}
          {compareMode && (
            <div className="mb-8 flex flex-col gap-4 md:flex-row">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="flex min-h-[250px] flex-1 flex-col items-center justify-center rounded-lg border-2 border-blue-400 bg-white p-6 shadow-lg"
                  style={{ minHeight: 250 }}
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
                                compareMode={compareMode}
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
                          selectedTeams[0]?.teamId === team.teamId ||
                          selectedTeams[1]?.teamId === team.teamId
                            ? "bg-green-700"
                            : "bg-green-500 hover:bg-green-700"
                        }`}
                        onClick={() => handleSelectTeam(team)}
                      >
                        {selectedTeams[0]?.teamId === team.teamId ||
                        selectedTeams[1]?.teamId === team.teamId
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
                        <SavedPokeTeamSlot
                          key={slotIndex}
                          name={pokemonName}
                          compareMode={compareMode}
                        />
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
