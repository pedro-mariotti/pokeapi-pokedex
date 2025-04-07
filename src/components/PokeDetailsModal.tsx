import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function PokeDetailsModal(props: {
  poke_name: string;
  poke_image: string | StaticImageData;
  show_modal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`fixed inset-0 h-screen w-screen bg-[#0000001a] ${props.show_modal ? "visible" : "hidden"} flex items-center justify-center`}
    >
      <div className="bg-white">
        <Image src={props.poke_image} alt="pokemon image" />
        <div>
          <button
            onClick={() => {
              props.setOpenModal(false);
            }}
          >
            Fechar
          </button>
          <div>
            <h2>Pokemon name</h2>
          </div>
          <ul>
            <li>Info 1</li>
            <li>Info 2</li>
            <li>Info 3</li>
            <li>Info 4</li>
            <li>Info 5</li>
            <li>Info 6</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
