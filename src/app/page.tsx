"use client";

import PokeCardSearch from "@/components/PokeCardSearch";
import { useState } from "react";
import EeveePlaceholder from "../../public/klipartz.com.png";
import PokeDetailsModal from "@/components/PokeDetailsModal";

export default function Home() {
  const [searchPokemonName, setSearchPokemonName] = useState(
    "Pesquisar pokemon...",
  );
  const [modalTypeArray, setModalTypeArray] = useState([""]);
  const [openModal, setOpenModal] = useState(false);
  const [modalPokeName, setmodalPokeName] = useState("");
  const [modalPokeNumber, setmodalPokeNumber] = useState(1);
  const [modalPokeDesc, setModalPokeDesc] = useState(" ");
  const tempPokeData = [
    {
      poke_number: 1,
      poke_name: "Pokemon 1",
      poke_types: ["normal"],
      poke_desc:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus magni ex commodi facilis cumque quam? Numquam, cumque eum eos, porro consequatur incidunt necessitatibus a omnis praesentium neque quod, impedit aperiam!",
    },
    {
      poke_number: 2,
      poke_name: "Pokemon 2",
      poke_types: ["water", "grass"],
      poke_desc:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus magni ex commodi facilis cumque quam? Numquam, cumque eum eos, porro consequatur incidunt necessitatibus a omnis praesentium neque quod, impedit aperiam!",
    },
    {
      poke_number: 3,
      poke_name: "Pokemon 3",
      poke_types: ["poison", "flying"],
      poke_desc:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus magni ex commodi facilis cumque quam? Numquam, cumque eum eos, porro consequatur incidunt necessitatibus a omnis praesentium neque quod, impedit aperiam!",
    },
  ];
  return (
    <div className="max-h-max min-h-screen w-screen">
      <PokeDetailsModal
        poke_number={modalPokeNumber}
        poke_name={modalPokeName}
        poke_types={modalTypeArray}
        poke_image={EeveePlaceholder}
        show_modal={openModal}
        poke_desc={modalPokeDesc}
        setOpenModal={setOpenModal}
      />

      <main className="mt-16 flex flex-col gap-16">
        {/* <section className="flex items-center justify-center gap-4">
          <div className="flex gap-16">
            <PokeTeam bg_color="red" />
            <PokeTeam bg_color="blue" />
          </div>
          <div>
            <h1 className="text-5xl">Comparação de stats</h1>
          </div>
        </section> */}
        <section className="flex flex-col items-center justify-center gap-12">
          <form
            action=""
            className="flex w-full items-center justify-center gap-4"
          >
            <input
              type="text"
              name="searchbar"
              id=""
              defaultValue="Pesquisar pokemon..."
              value={searchPokemonName}
              onChange={(e) => setSearchPokemonName(e.target.value)}
              className="w-[80%] rounded-lg bg-[#cecece] p-2"
            />
            <input
              className="rounded-xl bg-red-400 p-2"
              type="submit"
              value="Pesquisar"
            />
          </form>
          <ul className="grid w-[90%] grid-cols-6 gap-8">
            {tempPokeData.map((pokemon) => (
              <PokeCardSearch
                key={pokemon.poke_number}
                poke_name={pokemon.poke_name}
                poke_number={pokemon.poke_number}
                poke_desc={pokemon.poke_desc}
                poke_types={pokemon.poke_types}
                setModalTypeArray={setModalTypeArray}
                setOpenModal={setOpenModal}
                setModalPokeName={setmodalPokeName}
                setmodalPokeNumber={setmodalPokeNumber}
                setModalPokeDesc={setModalPokeDesc}
                poke_image={EeveePlaceholder}
              />
            ))}
          </ul>
        </section>
      </main>
      <footer className=""></footer>
    </div>
  );
}
