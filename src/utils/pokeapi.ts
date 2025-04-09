export async function fetchPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
  const data = await response.json();

  const pokemonList = await Promise.all(
    data.results.map(async (pokemon: any) => {
      const pokemonDetails = await fetch(pokemon.url).then((res) => res.json());
      return {
        id: pokemonDetails.id,
        name: pokemon.name,
        sprite: pokemonDetails.sprites.front_default,
        types: pokemonDetails.types.map((t: any) => t.type.name),
      };
    }),
  );
  return pokemonList;
}

export async function fetchTypeAdvantages(types: string[]) {
  const weaknesses = new Set<string>();
  const strengths = new Set<string>();

  for (const type of types) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();

    // Adiciona fraquezas (double_damage_from)
    data.damage_relations.double_damage_from.forEach((t: any) =>
      weaknesses.add(t.name),
    );

    // Adiciona vantagens (double_damage_to)
    data.damage_relations.double_damage_to.forEach((t: any) =>
      strengths.add(t.name),
    );
  }

  // Remove tipos que são tanto fraquezas quanto vantagens
  strengths.forEach((type) => {
    if (weaknesses.has(type)) {
      weaknesses.delete(type);
      strengths.delete(type);
    }
  });

  return {
    weaknesses: Array.from(weaknesses),
    strengths: Array.from(strengths),
  };
}
