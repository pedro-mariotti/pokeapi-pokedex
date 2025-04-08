import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";
import PokeType from "./aux components/type";

export default function PokeCardSearch(props: {
  poke_name: string;
  poke_image: string | StaticImageData;
  poke_types: Array<string>;
  poke_number: number;
  poke_desc: string;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setModalTypeArray: Dispatch<SetStateAction<string[]>>;
  setModalPokeName: Dispatch<SetStateAction<string>>;
  setmodalPokeNumber: Dispatch<SetStateAction<number>>;
  setModalPokeDesc: Dispatch<SetStateAction<string>>;
}) {
  return (
    <li
      className="flex h-fit w-full cursor-pointer rounded-xl bg-[#f1f1f1] p-4"
      onClick={() => {
        props.setOpenModal(true);
        props.setModalPokeName(props.poke_name);
        props.setModalTypeArray(props.poke_types);
        props.setmodalPokeNumber(props.poke_number);
        props.setModalPokeDesc(props.poke_desc);
      }}
    >
      <Image alt="pokemon image" src={props.poke_image} className="h-16 w-16" />
      <div>
        <p>
          <span>#{props.poke_number} </span>
          {props.poke_name}
        </p>
        <div>
          <ul className="flex flex-col gap-2">
            <PokeType type={props.poke_types[0]} />
            <PokeType type={props.poke_types[1]} />
          </ul>
        </div>
      </div>
    </li>
  );
}
