import Image, { StaticImageData } from "next/image";

export default function PokeCardSearch(props: {
  poke_name: string;
  poke_image: string | StaticImageData;
}) {
  return (
    <li className="flex h-fit w-fit rounded-xl bg-[#f1f1f1] p-4">
      <Image alt="pokemon image" src={props.poke_image} className="w-16" />
      <div>
        <p>Pokemon Name</p>
        <p>Type</p>
      </div>
    </li>
  );
}
