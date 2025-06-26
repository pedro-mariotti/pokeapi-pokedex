/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import PlaceholderImage from "../../../public/klipartz.com.png";

// Helper hook to fetch pokemon images by name
const usePokemonImages = (pokemonNames: string[] = []) => {
  const [images, setImages] = useState<(string | null)[]>([]);
  const [lastNames, setLastNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      pokemonNames.length === lastNames.length &&
      pokemonNames.every((name, i) => name === lastNames[i])
    ) {
      return;
    }
    let isMounted = true;
    async function fetchImages() {
      if (!pokemonNames.length) {
        setImages([]);
        setLastNames([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        pokemonNames.map(async (name) => {
          if (!name) return null;
          try {
            const res = await fetch(
              `https://pokedex-backend-woad.vercel.app/api/pokemon/${name.toLowerCase()}`,
            );
            if (!res.ok) return null;
            const data = await res.json();
            return data?.sprite || data?.sprites?.front_default || null;
          } catch {
            return null;
          }
        }),
      );
      if (isMounted) {
        setImages(results);
        setLastNames([...pokemonNames]);
        setLoading(false);
      }
    }
    fetchImages();
    return () => {
      isMounted = false;
    };
  }, [pokemonNames, lastNames]);

  return [images, loading] as const;
};

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

const TeamCard = ({ team, onClick }: { team: any; onClick: () => void }) => {
  const firstPokemonName =
    Array.isArray(team.pokemonNames) && team.pokemonNames.length > 0
      ? team.pokemonNames[0]
      : null;
  const [images, loading] = usePokemonImages(
    firstPokemonName ? [firstPokemonName] : [],
  );
  const imageUrl = images[0];

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Abrir detalhes do time ${team.name}`}
    >
      <div className="h-40 w-full">
        {loading ? (
          <div className="h-full w-full animate-pulse bg-gray-200" />
        ) : (
          <Image
            src={imageUrl || team.imageUrl || PlaceholderImage}
            alt={team.name}
            width={300}
            height={160}
            className="h-40 w-full object-cover"
            unoptimized={!!imageUrl}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-800">{team.name}</h3>
        <div className="mb-1 flex flex-wrap items-center text-xs text-gray-500">
          {Array.isArray(team.types) ? (
            team.types.map((type: string, index: number) => (
              <span
                key={index}
                className="mr-1 mb-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
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
};

const TeamModal = ({ team, onClose }: { team: any; onClose: () => void }) => {
  const pokemonNames: string[] = (team.pokemonNames || []).filter(Boolean);
  const [images, loading] = usePokemonImages(pokemonNames);

  return (
    <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black px-2">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          &times;
        </button>
        <h2 className="mb-4 text-2xl font-bold text-gray-800">{team.name}</h2>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">Pokémons</h3>
          <div className="xs:grid-cols-2 grid grid-cols-3 gap-4 sm:grid-cols-3">
            {[...Array(6)].map((_, idx) => {
              const pokemonName = pokemonNames[idx];
              const imageUrl = images[idx];
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 p-2"
                >
                  {pokemonName ? (
                    <>
                      <div className="mb-1 flex h-16 w-16 items-center justify-center">
                        {loading ? (
                          <div className="h-16 w-16 animate-pulse rounded bg-gray-200" />
                        ) : imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={pokemonName}
                            className="h-16 w-16 object-contain"
                          />
                        ) : (
                          <span className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-xl font-bold text-gray-700 uppercase">
                            {pokemonName.charAt(0)}
                          </span>
                        )}
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
};

export default function TeamBrowserPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const router = useRouter();

  // Check for token on mount
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  const handleSelectTeam = (team?: any) => {
    setSelectedTeam(team ?? null);
  };

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true);
      try {
        const res = await fetch(
          "https://pokedex-backend-woad.vercel.app/api/poketeams/search",
        );
        const data = await res.json();

        const mappedTeams = data.map((team: any) => ({
          id: team.id || team._id || team.teamId,
          name: team.teamName,
          pokemon: team.pokemonNames,
          pokemonNames: team.pokemonNames,
        })).reverse();

        setTeams(mappedTeams);
      } catch (e) {
        setTeams([]);
      }
      setLoading(false);
    }
    fetchTeams();
  }, []);

  // Responsive: show/hide sidebar filter
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky shadow-sm">
        <Navbar />
      </header>

      <div className="mx-auto max-w-screen-2xl">
        <main className="flex flex-col md:flex-row">
          {/* Mobile filter button */}
          <div className="flex justify-end p-4 md:hidden">
            <button
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm"
              onClick={() => setShowFilters(true)}
            >
              Filtros
            </button>
          </div>

          {/* Sidebar filters */}
          <aside
            className={`w-full p-6 md:w-80 ${showFilters ? "bg-opacity-40 fixed inset-0 z-40 block bg-black" : "hidden"} md:static md:z-auto md:block md:bg-transparent`}
            style={showFilters ? { maxWidth: "100vw" } : {}}
          >
            <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:max-w-none">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-bold">Filtros</h2>
                {/* Close button for mobile */}
                <button
                  className="text-2xl text-gray-400 hover:text-gray-700 md:hidden"
                  onClick={() => setShowFilters(false)}
                  aria-label="Fechar filtros"
                >
                  &times;
                </button>
              </div>
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
                Limpar Filtros
              </button>
            </div>
          </aside>

          {/* Overlay for mobile filter */}
          {showFilters && (
            <div
              className="bg-opacity-40 fixed inset-0 z-30 bg-black md:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          <section className="flex-1 p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Explore times
              </h1>
              <button
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 font-bold text-white transition-colors hover:bg-red-600 sm:px-5"
                onClick={() => router.push("/dashboard")}
              >
                <span className="text-lg">+</span>
                <span className="hidden sm:inline">Construa um novo time</span>
                <span className="sm:hidden">Novo time</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center text-gray-500">
                Carregando times...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => setSelectedTeam(team)}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
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
