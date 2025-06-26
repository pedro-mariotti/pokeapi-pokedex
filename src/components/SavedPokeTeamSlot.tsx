import { useEffect, useState } from "react";
import Image from "next/image";
import PlaceholderEevee from "../../public/klipartz.com.png";

interface SavedPokeTeamSlotProps {
  name: string;
}

interface PokemonData {
  sprites: {
    front_default: string;
  };
}

const SavedPokeTeamSlot: React.FC<SavedPokeTeamSlotProps> = ({ name }) => {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pokémon not found");
        return res.json();
      })
      .then((data) => {
        setPokemon(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <div className="py-4 text-center">Loading...</div>;
  if (error)
    return <div className="py-4 text-center text-red-500">Error: {error}</div>;
  if (!pokemon) return null;

  return (
    <div className="mx-auto flex w-full max-w-[180px] flex-col items-center rounded-lg border border-gray-300 bg-white p-2 text-center shadow-md sm:max-w-[150px] sm:p-4">
      <div className="flex h-20 w-20 items-center justify-center sm:h-16 sm:w-16">
        <Image
          src={pokemon.sprites.front_default || PlaceholderEevee}
          alt={name}
          width={80}
          height={80}
          className="h-full w-full rounded-lg object-contain"
        />
      </div>
      <div className="mt-2 text-base font-bold break-words capitalize sm:text-lg">
        {name}
      </div>
    </div>
  );
};

export default SavedPokeTeamSlot;
