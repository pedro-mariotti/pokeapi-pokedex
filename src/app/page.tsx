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
  return (
    <div className="max-h-max min-h-screen w-screen">
      <PokeDetailsModal
        poke_number={modalPokeNumber}
        poke_name={modalPokeName}
        poke_types={modalTypeArray}
        poke_image={EeveePlaceholder}
        show_modal={openModal}
        setOpenModal={setOpenModal}
        poke_desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam quam voluptatibus fuga architecto repudiandae non, consectetur quidem placeat optio expedita dolore eum suscipit eligendi esse explicabo! Minima asperiores impedit eveniet."
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
          <ul className="grid w-[85%] grid-cols-6 gap-4">
            <PokeCardSearch
              poke_name="Pokemon 2"
              poke_number={1}
              setModalTypeArray={setModalTypeArray}
              poke_types={["normal", "fire"]}
              setOpenModal={setOpenModal}
              setModalPokeName={setmodalPokeName}
              setmodalPokeNumber={setmodalPokeNumber}
              poke_image={EeveePlaceholder}
            />
            <PokeCardSearch
              poke_name="Pokemon 1"
              poke_number={2}
              setModalTypeArray={setModalTypeArray}
              poke_types={["water", "flying"]}
              setOpenModal={setOpenModal}
              setModalPokeName={setmodalPokeName}
              setmodalPokeNumber={setmodalPokeNumber}
              poke_image={EeveePlaceholder}
            />
          </ul>
        </section>
      </main>
      <footer className=""></footer>
    </div>
  );
}
