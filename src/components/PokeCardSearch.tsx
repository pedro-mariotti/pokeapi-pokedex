import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function PokeCardSearch(props: {
  poke_name: string;
  poke_image: string | StaticImageData;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  poke_types: Array<string>;
  setModalTypeArray: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <li
      className="flex h-fit w-fit cursor-pointer rounded-xl bg-[#f1f1f1] p-4"
      onClick={() => {
        props.setOpenModal(true);
      }}
    >
      <Image alt="pokemon image" src={props.poke_image} className="w-16" />
      <div>
        <p>Pokemon Name</p>
        <div>
          <ul>
            <li className="flex gap-2">
              <Image
                alt="pokemon type 1 image"
                src={props.poke_image}
                className="w-4"
              />
              <p>{props.poke_types[0]}</p>
            </li>
            <li className="flex gap-2">
              <Image
                alt="pokemon type 1 image"
                src={props.poke_image}
                className="w-4"
              />
              <p>{props.poke_types[1]}</p>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
}
