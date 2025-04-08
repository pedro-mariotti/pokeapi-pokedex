import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";
import PokeType from "./aux components/type";
import CloseIcon from "../../public/material-symbols--close-rounded.svg";

export default function PokeDetailsModal(props: {
  poke_name: string;
  poke_number: number;
  poke_image: string | StaticImageData;
  show_modal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  poke_types: Array<string>;
  poke_desc: string;
}) {
  return (
    <div
      className={`fixed inset-0 h-screen w-screen bg-[#0000001a] ${props.show_modal ? "visible" : "hidden"} flex items-center justify-center`}
    >
      <div
        className={`relative flex h-1/2 w-256 items-center justify-center rounded-xl bg-[url(../../public/pokedex-modal.png)] bg-cover bg-center bg-no-repeat p-4`}
      >
        <button
          className="absolute top-0 right-64"
          onClick={() => {
            props.setOpenModal(false);
          }}
        >
          <Image alt="close icon" src={CloseIcon} className="w-12" />
        </button>
        <div className="flex w-126">
          <Image src={props.poke_image} alt="pokemon image" className="w-64" />
          <div className="flex flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <h2 className="font-bold">
                <span>#{props.poke_number} </span>
                {props.poke_name}
              </h2>
              <ul className="flex">
                <PokeType type={props.poke_types[0]} />
                <PokeType type={props.poke_types[1]} />
              </ul>
            </div>
            <p className="flex text-justify">{props.poke_desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
