/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
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
      src={team.imageUrl}
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
        {Array.isArray(team.types) ? (
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
        )}
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">Pokémons</h3>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => {
            const pokemon = team.pokemon[idx];
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 p-2"
              >
                {pokemon ? (
                  <>
                    <div className="mb-1 flex h-16 w-16 items-center justify-center">
                      {pokemon.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pokemon.image}
                          alt={pokemon.name}
                          className="h-16 w-16 object-contain"
                        />
                      ) : (
                        <span className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-gray-400">
                          ?
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {pokemon.name}
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
  const teams = [
    {
      id: "#TMB-001",
      imageUrl: PlaceholderImage,
      name: "Blazing Dragons",
      types: ["Fire", "Dragon"],
      pokemon: [
        { name: "Charizard", image: "" },
        { name: "Dragonite", image: "" },
        { name: "Salamence", image: "" },
        { name: "Garchomp", image: "" },
        { name: "Reshiram", image: "" },
        { name: "Dragapult", image: "" },
      ],
    },
    {
      id: "#TMB-002",
      imageUrl: PlaceholderImage,
      name: "Aqua Defenders",
      types: "Water",
      pokemon: [
        { name: "Blastoise", image: "" },
        { name: "Gyarados", image: "" },
        { name: "Swampert", image: "" },
        { name: "Milotic", image: "" },
        { name: "Greninja", image: "" },
        { name: "Ludicolo", image: "" },
      ],
    },
    {
      id: "#TMB-003",
      imageUrl: PlaceholderImage,
      name: "Forest Guardians",
      types: "Grass",
      pokemon: [
        { name: "Venusaur", image: "" },
        { name: "Sceptile", image: "" },
        { name: "Torterra", image: "" },
        { name: "Serperior", image: "" },
        { name: "Decidueye", image: "" },
        { name: "Rillaboom", image: "" },
      ],
    },
    {
      id: "#TMB-004",
      imageUrl: PlaceholderImage,
      name: "Shocking Speedsters",
      types: "Electric",
      pokemon: [
        { name: "Raichu", image: "" },
        { name: "Jolteon", image: "" },
        { name: "Electivire", image: "" },
        { name: "Magnezone", image: "" },
        { name: "Zeraora", image: "" },
        { name: "Rotom", image: "" },
      ],
    },
  ];

  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={() => setSelectedTeam(team)}
                />
              ))}
            </div>

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
        <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  );
}
