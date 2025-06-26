/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PokeTeamSlot from "@/components/PokeTeamSlot";
import PokeEvolution from "@/components/PokeEvolution";
import { fetchPokemonList, fetchTypeAdvantages } from "@/utils/pokeapi";
import PokeCardSearch from "../../components/PokeCardSearch";
import PokeDetailsModal from "@/components/PokeDetailsModal";
import PokeType from "@/components/aux components/type";
import Navbar from "@/components/Navbar";

// Add your list of all possible types here
const ALL_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function Home() {
  const router = useRouter();

  // Token validation logic
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isValidToken = !!token && token.length > 10;
    if (!isValidToken) {
      router.replace("/");
    }
  }, [router]);

  const [team, setTeam] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [typeAdvantages, setTypeAdvantages] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  const [modalPokeImage, setModalPokeImage] = useState("");
  const [modalPokeName, setmodalPokeName] = useState("");
  const [modalPokeNumber, setmodalPokeNumber] = useState(1);
  const [modalPokeDesc, setModalPokeDesc] = useState(" ");
  const [modalPokeTypes, setModalPokeTypes] = useState([" "]);

  const [currentScreen, setCurrentScreen] = useState(0);

  // Pagination state for search
  const [searchPage, setSearchPage] = useState(1);
  const pageSize = 15;

  // Type filter state
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleNextScreen = () => {
    setCurrentScreen((prev) => (prev + 1) % 2);
  };

  const handlePreviousScreen = () => {
    setCurrentScreen((prev) => (prev - 1 + 2) % 2);
  };

  useEffect(() => {
    const loadPokemonList = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    loadPokemonList();
  }, []);

  useEffect(() => {
    const calculateAdvantages = async () => {
      const types = team
        .filter(Boolean)
        .map((pokemonName) => {
          const pokemon = pokemonList.find((p) => p.name === pokemonName);
          return pokemon?.types || [];
        })
        .flat();

      if (types.length > 0) {
        const advantages = await fetchTypeAdvantages(types);
        setTypeAdvantages(advantages);
      } else {
        setTypeAdvantages(null);
      }
    };
    calculateAdvantages();
  }, [team, pokemonList]);

  const handleAddPokemon = (pokemonName: string) => {
    if (selectedSlot !== null) {
      const newTeam = [...team];
      newTeam[selectedSlot] = pokemonName;
      setTeam(newTeam);
      setSelectedSlot(null);
    }
  };

  const handleRemovePokemon = (slotIndex: number) => {
    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
  };

  const [teamName, setTeamName] = useState<string>("");

  async function handleSaveTeam(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault();
    if (team.every((slot) => slot === null)) {
      alert("Seu time está vazio. Adicione Pokémon antes de salvar!");
      return;
    }

    const savedTeam = {
      UserId: localStorage.getItem("userId"),
      teamName: teamName || "Time Sem Nome",
      pokemonNames: team.filter((slot) => slot !== null),
    };

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(
        "https://pokedex-backend-woad.vercel.app/api/poketeams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(savedTeam),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar o time.");
      }

      alert(`Time "${savedTeam.teamName}" salvo com sucesso!`);
    } catch (error) {
      alert("Falha ao salvar o time. Tente novamente.");
      console.error(error);
    }
  }

  // Reset search page when search query or filters change or search is closed
  useEffect(() => {
    setSearchPage(1);
  }, [searchQuery, selectedSlot, selectedTypes]);

  // Filtered pokemon for search and type filter
  const filteredPokemon = pokemonList.filter((pokemon) => {
    const matchesQuery = pokemon.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.every((type) => pokemon.types.includes(type));
    return matchesQuery && matchesType;
  });

  const totalPages = Math.ceil(filteredPokemon.length / pageSize);
  const paginatedPokemon = filteredPokemon.slice(
    (searchPage - 1) * pageSize,
    searchPage * pageSize,
  );

  // Type filter toggle handler
  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  return (
    <div className="max-h-max min-h-screen w-screen bg-gray-50 font-sans">
      <PokeDetailsModal
        poke_name={modalPokeName}
        poke_number={modalPokeNumber}
        poke_image={modalPokeImage}
        show_modal={openModal}
        setOpenModal={setOpenModal}
        poke_types={modalPokeTypes}
        poke_desc={modalPokeDesc}
        handleAddPokemon={handleAddPokemon}
      />
      <header>
        <Navbar />
      </header>

      <main className="px-4 py-8 md:px-16">
        <section className="flex flex-col gap-8 lg:flex-row">
          {/* Retângulo do Time */}
          <div className="flex-1 rounded-4xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Seu Time</h2>
            <div className="mb-4">
              <label
                htmlFor="teamName"
                className="block text-sm font-medium text-gray-700"
              >
                Nome do Time
              </label>
              <input
                type="text"
                id="teamName"
                className="mt-1 w-full rounded border p-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {team.map((pokemon, index) => (
                <PokeTeamSlot
                  key={index}
                  pokemonName={pokemon}
                  onAdd={() => setSelectedSlot(index)}
                  onRemove={() => handleRemovePokemon(index)}
                />
              ))}
              {team.every((slot) => slot === null) && (
                <p className="col-span-3 text-center text-gray-500">
                  Seu time está vazio. Adicione Pokémon para começar!
                </p>
              )}
            </div>
            <button
              className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={handleSaveTeam}
            >
              Salvar Time
            </button>
          </div>

          {/* Retângulo das Estatísticas */}
          <div className="relative flex-1 overflow-hidden rounded-4xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Estatísticas
            </h2>

            <div className="h-auto">
              <div
                className={`lg:transition-transform lg:duration-500 ${
                  currentScreen === 0
                    ? "lg:translate-x-0"
                    : "lg:-translate-x-full"
                }`}
              >
                {/* Tela 1: Defesa do Time */}
                <div className="inset-0 h-64 overflow-y-auto lg:absolute">
                  <h3 className="text-lg font-semibold text-green-600">
                    Defesas
                  </h3>
                  <ul className="mt-4 grid grid-cols-5 gap-2 lg:grid-cols-6">
                    {typeAdvantages?.strongAgainst?.map((type: string) => (
                      <PokeType key={type} type={type} />
                    ))}
                  </ul>
                  <h3 className="mt-4 text-lg font-semibold text-red-600">
                    Fraquezas
                  </h3>
                  <ul className="mt-4 grid grid-cols-5 gap-2 lg:grid-cols-6">
                    {typeAdvantages?.weakAgainst?.map((type: string) => (
                      <PokeType key={type} type={type} />
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`lg:transition-transform lg:duration-500 ${
                  currentScreen === 1
                    ? "lg:translate-x-0"
                    : "lg:-translate-x-full"
                }`}
              >
                {/* Tela 2: Cobertura */}
                <div className="inset-0">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Vantagens
                  </h3>
                  <ul className="mt-4 grid grid-cols-6 gap-4">
                    {typeAdvantages?.strongAgainst?.map((type: string) => (
                      <PokeType key={type} type={type} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de navegação */}
            <button
              className="absolute top-1/2 left-2 hidden -translate-y-1/2 transform rounded-full bg-gray-200 p-2 shadow hover:bg-gray-300 lg:block"
              onClick={handlePreviousScreen}
            >
              {"<"}
            </button>
            <button
              className="absolute top-1/2 right-2 hidden -translate-y-1/2 transform rounded-full bg-gray-200 p-2 shadow hover:bg-gray-300 lg:block"
              onClick={handleNextScreen}
            >
              {">"}
            </button>
          </div>
        </section>

        {/* Barra de Busca */}
        {selectedSlot !== null && (
          <section className="mt-8">
            <div className="flex w-full flex-col">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Pesquisar Pokémon..."
                  className="flex-1 rounded border p-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  onClick={() => setSelectedSlot(null)}
                >
                  Cancelar
                </button>
              </div>
              {/* Type Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {ALL_TYPES.map((type) => (
                  <button
                    key={type}
                    className={`rounded border px-3 py-1 text-sm font-semibold ${
                      selectedTypes.includes(type)
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    } hover:bg-red-100`}
                    onClick={() => toggleType(type)}
                    type="button"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
                {selectedTypes.length > 0 && (
                  <button
                    className="rounded border border-gray-300 bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                    onClick={() => setSelectedTypes([])}
                    type="button"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
              <ul className="flex flex-col gap-4 md:grid md:grid-cols-3">
                {paginatedPokemon.map((pokemon) => (
                  <PokeCardSearch
                    key={pokemon.name}
                    poke_name={pokemon.name}
                    poke_types={pokemon.types}
                    poke_image={pokemon.sprite}
                    poke_number={pokemon.id}
                    setOpenModal={setOpenModal}
                    setModalPokeDesc={setModalPokeDesc}
                    setModalPokeImage={setModalPokeImage}
                    setModalTypeArray={setModalPokeTypes}
                    setmodalPokeNumber={setmodalPokeNumber}
                    setModalPokeName={setmodalPokeName}
                    poke_desc={""}
                  />
                ))}
                {filteredPokemon.length === 0 && (
                  <p className="col-span-3 text-center text-gray-500">
                    Nenhum Pokémon encontrado.
                  </p>
                )}
              </ul>
              {/* Pagination controls */}
              {filteredPokemon.length > pageSize && (
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    className="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setSearchPage((p) => Math.max(1, p - 1))}
                    disabled={searchPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="px-2 py-1 text-gray-700">
                    Página {searchPage} de {totalPages}
                  </span>
                  <button
                    className="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() =>
                      setSearchPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={searchPage === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Cadeia de Evolução */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Cadeia de Evolução</h2>
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
            {team.map((pokemon, index) =>
              pokemon ? (
                <PokeEvolution key={index} pokemonName={pokemon} />
              ) : null,
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
