import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function PokeDetailsModal(props: {
  poke_name: string;
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
      <div className="relative flex w-1/2 flex-col items-center justify-center rounded-xl bg-white p-4">
        <button
          className="absolute top-0 right-0"
          onClick={() => {
            props.setOpenModal(false);
          }}
        >
          Fechar
        </button>
        <Image src={props.poke_image} alt="pokemon image" className="w-24" />
        <div>
          <div className="flex flex-col items-center justify-center">
            <h2>Pokemon name</h2>
            <ul className="flex">
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
          <p className="flex text-justify">{props.poke_desc}</p>
        </div>
      </div>
    </div>
  );
}
