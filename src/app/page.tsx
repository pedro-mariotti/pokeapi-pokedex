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
import { StaticImageData } from "next/image";

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
      const types = team.filter(Boolean) as string[];
      if (types.length > 0) {
        const advantages = await fetchTypeAdvantages(types);
        setTypeAdvantages(advantages);
      } else {
        setTypeAdvantages(null);
      }
    };
    calculateAdvantages();
  }, [team]);

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
    <div className="max-h-max min-h-screen w-screen">
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
      <header className="bg-red-600 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Pokémon Team Builder
          </h1>
        </div>
      </header>

      <main className="px-16 pt-8">
        <section className="flex flex-col gap-8">
          <div className="grid grid-cols-3">
            <div className="col-span-2 grid grid-cols-2 rounded-4xl bg-red-50 p-8">
              <div className="grid grid-cols-3 gap-6">
                {team.map((pokemon, index) => (
                  <PokeTeamSlot
                    key={index}
                    pokemonName={pokemon}
                    onAdd={() => setSelectedSlot(index)}
                    onRemove={() => handleRemovePokemon(index)}
                    pokemonList={pokemonList}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2>Estatisticas</h2>
            </div>
          </div>

          {selectedSlot !== null && (
            <div className="flex w-full flex-col">
              <input
                type="text"
                placeholder="Pesquisar Pokémon..."
                className="mb-4 w-full rounded border p-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                      // onClick={() => handleAddPokemon(pokemon.name)}
                    ></PokeCardSearch>
                  ))}
              </ul>
            </div>
          )}
        </section>

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
