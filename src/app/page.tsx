"use client";
import { useState, useEffect } from "react";
import PokeTeamSlot from "@/components/PokeTeamSlot";
import PokeEvolution from "@/components/PokeEvolution";
import { fetchPokemonList, fetchTypeAdvantages } from "@/utils/pokeapi";

export default function Home() {
  const [team, setTeam] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [typeAdvantages, setTypeAdvantages] = useState<any>(null);

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
      <header className="bg-red-600 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Pokémon Team Builder</h1>
        </div>
      </header>

      <main className="container mx-auto mt-8">
        <section className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
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
            </div>

            {selectedSlot !== null && (
              <div className="mt-4">
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
                      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((pokemon) => (
                      <li
                        key={pokemon.name}
                        className="cursor-pointer rounded border p-2 hover:bg-gray-200"
                        onClick={() => handleAddPokemon(pokemon.name)}
                      >
                        <img
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="h-16 w-16 mx-auto"
                        />
                        <p className="text-center capitalize">{pokemon.name}</p>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Cadeia de Evolução */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Cadeia de Evolução</h2>
          <div className="grid grid-cols-2 gap-8">
            {team.map((pokemon, index) =>
              pokemon ? <PokeEvolution key={index} pokemonName={pokemon} /> : null
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
