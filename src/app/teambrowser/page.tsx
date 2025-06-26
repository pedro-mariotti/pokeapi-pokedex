"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import PlaceholderImage from "../../../public/klipartz.com.png";

const FilterCheckbox = ({ label }: { label: string }) => (
  <li>
    <label className="flex items-center space-x-2 font-normal">
      <input
        type="checkbox"
        className="form-checkbox rounded border-gray-300 text-red-500 focus:ring-red-500"
      />
      <span>{label}</span>
    </label>
  </li>
);

const TeamCard = ({ team, onClick }: { team: any; onClick: () => void }) => (
  <div
    className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={`Abrir detalhes do time ${team.name}`}
  >
    <Image
      src={team.imageUrl || PlaceholderImage}
      alt={team.name}
      width={300}
      height={160}
      className="h-40 w-full object-cover"
    />
    <div className="p-4">
      <h3 className="mb-2 text-lg font-bold text-gray-800">{team.name}</h3>
      <div className="mb-1 flex items-center text-xs text-gray-500">
        {Array.isArray(team.types) ? (
          team.types.map((type: string, index: number) => (
            <span
              key={index}
              className="mr-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
            >
              {type}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            {team.types}
          </span>
        )}
      </div>
    </div>
  </div>
);

// Modified TeamModal to display pokemons from team.pokemonNames (array of strings)
// FIX: Accept onClose prop and use it for closing the modal
const TeamModal = ({ team, onClose }: { team: any; onClose: () => void }) => (
  <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <button
        className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
        onClick={onClose}
        aria-label="Fechar modal"
      >
        &times;
      </button>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">{team.name}</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {/* {Array.isArray(team.types) ? (
          team.types.map((type: string, idx: number) => (
            <span
              key={idx}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
            >
              {type}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            {team.types}
          </span>
        )} */}
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">Pokémons</h3>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => {
            // Use team.pokemonNames (array of strings)
            const pokemonName = team.pokemonNames?.[idx];
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 p-2"
              >
                {pokemonName ? (
                  <>
                    <div className="mb-1 flex h-16 w-16 items-center justify-center">
                      {/* Optionally, you can fetch and display an image for the pokemonName if you want */}
                      <span className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-xl font-bold text-gray-700 uppercase">
                        {pokemonName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {pokemonName}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="mb-1 flex h-16 w-16 items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-gray-400">
                        -
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">Vazio</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default function TeamBrowserPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  // FIX: handleSelectTeam can now be used for both open and close
  const handleSelectTeam = (team?: any) => {
    console.log("Selected team:", team);
    setSelectedTeam(team ?? null);
  };

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true);
      try {
        // Replace with your backend API endpoint
        const res = await fetch(
          "https://pokedex-backend-woad.vercel.app/api/poketeams/search",
        );
        const data = await res.json();

        // Map backend data to expected team shape
        const mappedTeams = data.map((team: any) => ({
          id: team.id || team._id || team.teamId,
          name: team.teamName,
          pokemon: team.pokemonNames,
          pokemonNames: team.pokemonNames, // Ensure pokemonNames is present for TeamModal
        }));

        setTeams(mappedTeams);
      } catch (e) {
        setTeams([]);
      }
      setLoading(false);
    }
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky shadow-sm">
        <Navbar />
      </header>

      <div className="mx-auto max-w-screen-2xl">
        <main className="flex">
          <aside className="w-80 p-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xl font-bold">Filtros</h2>
              <p className="mb-6 text-sm text-gray-500">Ajuste sua pesquisa.</p>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-gray-800">Type</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <FilterCheckbox label="Fire" />
                  <FilterCheckbox label="Water" />
                  <FilterCheckbox label="Grass" />
                  <FilterCheckbox label="Electric" />
                  <FilterCheckbox label="Psychic" />
                  <FilterCheckbox label="Rock" />
                  <FilterCheckbox label="Dark" />
                  <FilterCheckbox label="Ice" />
                  <FilterCheckbox label="Steel" />
                  <FilterCheckbox label="Fairy" />
                  <FilterCheckbox label="Fighting" />
                  <FilterCheckbox label="Ghost" />
                </ul>
              </div>

              <button className="w-full rounded-lg border border-gray-300 py-2 text-gray-700 transition hover:bg-gray-100">
                Reset Filters
              </button>
            </div>
          </aside>

          <section className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">
                Explore times
              </h1>
              <button className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 font-bold text-white transition-colors hover:bg-red-600">
                <span className="text-lg">+</span>
                <span>Construa um novo time</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center text-gray-500">
                Carregando times...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => setSelectedTeam(team)}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex items-center justify-center space-x-4">
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                &lt; Anterior
              </button>
              <span className="text-sm text-gray-500">Pagina 1 de 1</span>
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Next &gt;
              </button>
            </div>
          </section>
        </main>
      </div>

      {selectedTeam && (
        <TeamModal team={selectedTeam} onClose={() => handleSelectTeam()} />
      )}
    </div>
  );
}
