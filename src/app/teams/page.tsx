/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import SavedPokeTeamSlot from "@/components/SavedPokeTeamSlot";

export default function TeamPage() {
  const [teams, setTeams] = useState<any[]>([]);

  // Fetch teams from backend
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/poketeams/user/${localStorage.getItem("userId")}`,
        );
        if (response.ok) {
          const data = await response.json();
          // Assuming each team object has a 'pokemonNames' array property
          // and optionally a 'teamName'
          const formattedTeams = Array.isArray(data)
            ? data.map((teamObj: any) => ({
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
            {teams.map((team, teamIndex) => (
              <div
                key={teamIndex}
                className="rounded-lg bg-white p-4 shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  {team.teamName || `Team ${teamIndex + 1}`}
                </h3>
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
