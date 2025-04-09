import React from "react";
import Image from "next/image";

export default function PokeTeamSlot({
  pokemonName,
  onAdd,
  onRemove,
  pokemonList,
}: {
  pokemonName: string | null;
  onAdd: () => void;
  onRemove: () => void;
  pokemonList: any[];
}) {
  const pokemonData = pokemonList.find((p) => p.name === pokemonName);

  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded border bg-gray-100">
      {pokemonName && pokemonData ? (
        <div className="flex flex-col items-center">
          {pokemonData.sprite ? (
            <Image
              src={pokemonData.sprite}
              alt={pokemonName}
              width={64}
              height={64}
              className="h-16 w-16"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">Sem imagem</span>
            </div>
          )}
          <span className="mt-2 text-sm capitalize">{pokemonName}</span>
          <div className="flex gap-1">
            {pokemonData.types?.map((type: string) => (
              <span
                key={type}
                className="rounded bg-gray-200 px-2 py-1 text-xs capitalize"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <button
          className="text-2xl font-bold text-gray-500"
          onClick={onAdd}
        >
          +
        </button>
      )}
      {pokemonName && (
        <button
          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white"
          onClick={onRemove}
        >
          x
        </button>
      )}
    </div>
  );
}