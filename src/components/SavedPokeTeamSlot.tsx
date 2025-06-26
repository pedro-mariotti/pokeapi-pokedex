import { useEffect, useState } from "react";
import Image from "next/image";
import PlaceholderEevee from "../../public/klipartz.com.png"; // Placeholder image for loading state

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return null;

  return (
    <div className="w-[150px] rounded-lg border border-gray-300 bg-white p-4 text-center shadow-md">
      <Image
        src={pokemon.sprites.front_default || PlaceholderEevee}
        alt={name}
        width={64}
        height={64}
        className="mx-auto mb-2 rounded-lg"
      />
      <div
        style={{
          marginTop: 8,
          fontWeight: "bold",
          textTransform: "capitalize",
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default SavedPokeTeamSlot;
