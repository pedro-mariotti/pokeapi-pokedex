/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Image from "next/image";

interface Evolution {
  id: number;
  name: string;
  sprite: string;
  method?: string;
  item?: { name: string; sprite: string };
}

interface PokeEvolutionProps {
  pokemonName: string;
}

export default function PokeEvolution({ pokemonName }: PokeEvolutionProps) {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvolutions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const speciesResponse = await fetch(
          `https://pokedex-backend-woad.vercel.app/api/pokemon/${pokemonName}/species`,
        );
        const speciesData = await speciesResponse.json();

        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        const processedEvolutions: Evolution[] = [];
        let currentEvolution = evolutionData.chain;

        while (currentEvolution) {
          const pokemonResponse = await fetch(
            `https://pokedex-backend-woad.vercel.app/api/pokemon/${currentEvolution.species.name}`,
          );
          const pokemonData = await pokemonResponse.json();

          const evolutionDetails = currentEvolution.evolution_details[0];
          let method = "N/A";
          let item = undefined;

          if (evolutionDetails) {
            if (evolutionDetails.min_level) {
              method = `Nível ${evolutionDetails.min_level}`;
            } else if (evolutionDetails.item) {
              const itemResponse = await fetch(evolutionDetails.item.url);
              const itemData = await itemResponse.json();
              method = `Item: ${itemData.name}`;
              item = {
                name: itemData.name,
                sprite: itemData.sprites.default,
              };
            }
          }

          processedEvolutions.push({
            id: pokemonData.id,
            name: currentEvolution.species.name,
            sprite: pokemonData.sprites.front_default,
            method,
            item,
          });

          currentEvolution = currentEvolution.evolves_to[0] || null;
        }

        setEvolutions(processedEvolutions);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar a cadeia de evolução.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvolutions();
  }, [pokemonName]);

  if (isLoading) {
    return <div>Carregando cadeia de evolução...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center rounded-lg border bg-gray-100 p-4">
      <h3 className="mb-4 text-lg font-bold capitalize">{pokemonName}</h3>
      <div className="flex items-center gap-4">
        {evolutions.map((evolution, index) => (
          <div key={evolution.id} className="flex items-center">
            {/* Pokémon Sprite */}
            <div className="flex flex-col items-center">
              <Image
                src={evolution.sprite}
                alt={evolution.name}
                width={64}
                height={64}
                className="h-16 w-16"
                unoptimized
              />
              <p className="font-bold capitalize">{evolution.name}</p>
              <p className="text-sm">{evolution.method}</p>
              {evolution.item && (
                <div className="flex items-center gap-2">
                  <Image
                    src={evolution.item.sprite}
                    alt={evolution.item.name}
                    width={32}
                    height={32}
                    className="h-8 w-8"
                    unoptimized
                  />
                  <span className="text-xs capitalize">
                    {evolution.item.name}
                  </span>
                </div>
              )}
            </div>

            {/* Setinha entre os Pokémon */}
            {index < evolutions.length - 1 && (
              <span className="mx-4 text-2xl font-bold">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
