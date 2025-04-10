import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import PokeType from "./aux components/type";

export default function PokeCardSearch(props: {
  poke_name: string;
  poke_image: string;
  poke_types: Array<string>;
  poke_number: number;
  poke_desc: string;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setModalTypeArray: Dispatch<SetStateAction<string[]>>;
  setModalPokeName: Dispatch<SetStateAction<string>>;
  setmodalPokeNumber: Dispatch<SetStateAction<number>>;
  setModalPokeDesc: Dispatch<SetStateAction<string>>;
  setModalPokeImage: Dispatch<SetStateAction<string>>;
}) {
  // console.log(props.poke_image);
  useEffect(() => {
    const loadPokemonList = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    loadPokemonList();
  }, []);
  return (
    <li
      className="flex h-fit w-full cursor-pointer rounded-xl bg-[#f1f1f1] p-4"
      onClick={() => {
        props.setOpenModal(true);
        props.setModalPokeName(props.poke_name);
        props.setModalTypeArray(props.poke_types);
        props.setmodalPokeNumber(props.poke_number);
        props.setModalPokeDesc(props.poke_desc);
        props.setModalPokeImage(props.poke_image);
      }}
    >
      <Image
        alt="pokemon image"
        src={props.poke_image}
        className="h-16 w-16"
        width={120}
        height={96}
      />
      <div>
        <p className="uppercase">
          <span>#{props.poke_number} </span>
          {props.poke_name}
        </p>

        <ul className="flex flex-col gap-2">
          {props.poke_types.map((type, index) => (
            <PokeType key={index} type={type} />
          ))}
        </ul>
      </div>
    </li>
  );
}
