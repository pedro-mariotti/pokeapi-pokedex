import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

export default function PokeCardSearch(props: {
  poke_name: string;
  poke_image: string | StaticImageData;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  poke_types: Array<string>;
  setModalTypeArray: Dispatch<SetStateAction<string[]>>;
  setModalPokeName: Dispatch<SetStateAction<string>>;
}) {
  const [bgColor, setBgColor] = useState("#fffFFF");
  return (
    <li
      className="flex h-fit w-fit cursor-pointer rounded-xl bg-[#f1f1f1] p-4"
      onClick={() => {
        props.setOpenModal(true);
        props.setModalPokeName(props.poke_name);
        props.setModalTypeArray(props.poke_types);
      }}
    >
      <Image alt="pokemon image" src={props.poke_image} className="w-16" />
      <div>
        <p>{props.poke_name}</p>
        <div>
          <ul>
            <li className={`flex gap-2 bg-[${bgColor}]`}>
              <p>{props.poke_types[0]}</p>
            </li>
            <li className="flex gap-2">
              <p>{props.poke_types[1]}</p>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
}
