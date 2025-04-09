import { useState, useEffect } from "react";

interface Evolution {
  id: number;
  name: string;
  sprite: string;
  method?: string;
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
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
        );
        const speciesData = await speciesResponse.json();

        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        const processedEvolutions: Evolution[] = [];
        let currentEvolution = evolutionData.chain;

        while (currentEvolution) {
          const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${currentEvolution.species.name}`
          );
          const pokemonData = await pokemonResponse.json();

          const evolutionDetails = currentEvolution.evolution_details[0];
          let method = "N/A";

          if (evolutionDetails) {
            if (evolutionDetails.min_level) {
              method = `Nível ${evolutionDetails.min_level}`;
            } else if (evolutionDetails.item) {
              method = `Item: ${evolutionDetails.item.name}`;
            }
          }

          processedEvolutions.push({
            id: pokemonData.id,
            name: currentEvolution.species.name,
            sprite: pokemonData.sprites.front_default,
            method,
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
    <div className="flex flex-col items-center border rounded-lg p-4 bg-gray-100">
      <h3 className="text-lg font-bold capitalize mb-4">{pokemonName}</h3>
      <div className="flex gap-4">
        {evolutions.map((evolution) => (
          <div key={evolution.id} className="flex flex-col items-center">
            <img src={evolution.sprite} alt={evolution.name} className="h-16 w-16" />
            <p className="capitalize font-bold">{evolution.name}</p>
            <p className="text-sm">{evolution.method}</p>
          </div>
        ))}
      </div>
    </div>
  );
}