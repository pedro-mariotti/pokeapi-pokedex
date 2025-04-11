import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PokeType from "./aux components/type";
import CloseIcon from "../../public/material-symbols--close-rounded.svg";

export default function PokeDetailsModal(props: {
  poke_name: string;
  poke_number: number;
  poke_image: string;
  show_modal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  handleAddPokemon: (pokemonName: string) => void;
  poke_types: Array<string>;
  poke_desc: string;
}) {
  const [description, setDescription] = useState<string>(""); // Estado para a descrição

  // Função para buscar a descrição do Pokémon
  const fetchDescription = async (name: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      const data = await response.json();
      const flavorText = data.flavor_text_entries.find(
        (entry: any) => entry.language.name === "en"
      );
      setDescription(flavorText ? flavorText.flavor_text.replace(/\n|\f/g, " ") : "No description available.");
    } catch (error) {
      console.error("Error fetching Pokémon description:", error);
      setDescription("Failed to load description.");
    }
  };

  // Buscar a descrição sempre que o modal for aberto
  useEffect(() => {
    if (props.show_modal) {
      fetchDescription(props.poke_name.toLowerCase());
    }
  }, [props.show_modal, props.poke_name]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        props.show_modal ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="relative flex h-1/2 w-[64rem] items-center justify-center rounded-xl bg-[url('/pokedex-modal.png')] bg-cover bg-center bg-no-repeat p-4">
        <button
          className="absolute top-4 right-56"
          onClick={() => props.setOpenModal(false)}
        >
          <Image alt="close icon" src={CloseIcon} className="w-10" />
        </button>

        <div className="flex w-96 gap-8">
          <Image
            src={props.poke_image}
            alt="pokemon image"
            className="w-64"
            width={96}
            height={96}
          />
          <div className="flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold uppercase">
                <span>#{props.poke_number} </span>
                {props.poke_name}
              </h2>
              <ul className="flex gap-2">
                {props.poke_types.map((type, index) => (
                  <PokeType key={index} type={type} />
                ))}
              </ul>
            </div>
            {/* Exibir a descrição dinâmica */}
            <p className="text-justify">{description || props.poke_desc}</p>
            <button
              className="rounded-3xl border-1 border-black bg-red-50 p-2"
              onClick={() => {
                props.handleAddPokemon(props.poke_name);
                props.setOpenModal(false);
              }}
            >
              Add to team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
