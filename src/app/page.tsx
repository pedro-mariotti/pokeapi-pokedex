"use client";
import { useState, useEffect } from "react";
import PokeTeamSlot from "@/components/PokeTeamSlot";
import PokeEvolution from "@/components/PokeEvolution";
import {
  fetchPokemonList,
  fetchTypeAdvantages,
  fetchPokemonSpecies,
} from "@/utils/pokeapi";
import PokeCardSearch from "../components/PokeCardSearch";
import PokeDetailsModal from "@/components/PokeDetailsModal";

export default function Home() {
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

  // Busca o pokemon
  useEffect(() => {
    const loadPokemonList = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    loadPokemonList();
  }, []);

  // Calcula as vantagens e fraquezas do time
  useEffect(() => {
    const calculateAdvantages = async () => {
      const types = team
        .filter(Boolean) // Remove slots vazios
        .map((pokemonName) => {
          const pokemon = pokemonList.find((p) => p.name === pokemonName);
          return pokemon?.types || [];
        })
        .flat(); // Combina todos os tipos em um único array

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
      <header className="bg-gradient-to-r from-red-500 to-red-700 p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Pokémon Team Builder
          </h1>
          <p className="text-sm text-gray-200">
            Breno de Moura | Lucas Breda | Pedro Mariotti
          </p>
        </div>
      </header>

      <main className="px-4 pt-8 md:px-16">
        <section className="flex flex-col gap-8 lg:flex-row">
          {/* Retângulo do Time */}
          <div className="flex-1 rounded-4xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Seu Time</h2>
            <div className="grid grid-cols-3 gap-4">
              {team.map((pokemon, index) => (
                <PokeTeamSlot
                  key={index}
                  pokemonName={pokemon}
                  onAdd={() => setSelectedSlot(index)}
                  onRemove={() => handleRemovePokemon(index)}
                  pokemonList={pokemonList}
                />
              ))}
              {team.every((slot) => slot === null) && (
                <p className="col-span-3 text-center text-gray-500">
                  Seu time está vazio. Adicione Pokémon para começar!
                </p>
              )}
            </div>
          </div>

          {/* Retângulo das Estatísticas */}
          <div className="flex-1 rounded-4xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Estatísticas</h2>
            {typeAdvantages && typeAdvantages.strongAgainst ? (
              <div>
                <h3 className="text-lg font-semibold text-green-600">Vantagens:</h3>
                <ul className="mt-2 space-y-1">
                  {typeAdvantages.strongAgainst.map((type: string) => (
                    <li key={type} className="capitalize text-gray-700">
                      {type}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-4 text-lg font-semibold text-red-600">Desvantagens:</h3>
                <ul className="mt-2 space-y-1">
                  {typeAdvantages.weakAgainst.map((type: string) => (
                    <li key={type} className="capitalize text-gray-700">
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">
                Adicione Pokémon para calcular vantagens de tipos.
              </p>
            )}
          </div>
        </section>

        {/* Barra de Busca */}
        {selectedSlot !== null && (
          <section className="mt-8">
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Pesquisar Pokémon..."
                  className="mb-4 w-full rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="ml-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  onClick={() => setSelectedSlot(null)}
                >
                  Cancelar
                </button>
              </div>
              <ul className="grid grid-cols-3 gap-4">
                {pokemonList
                  .filter((pokemon) =>
                    pokemon.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((pokemon) => (
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
                {pokemonList.filter((pokemon) =>
                  pokemon.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                ).length === 0 && (
                  <p className="col-span-3 text-center text-gray-500">
                    Nenhum Pokémon encontrado.
                  </p>
                )}
              </ul>
            </div>
          </section>
        )}

        {/* Cadeia de Evolução */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Cadeia de Evolução</h2>
          <div className="grid grid-cols-2 gap-8">
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
