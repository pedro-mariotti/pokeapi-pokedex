import Image from "next/image";

export default function PokeCardTeam({ poke_image }: { poke_image: string }) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={poke_image}
        alt="Pokemon"
        width={96}
        height={96}
        className="h-24 w-24"
      />
      <span className="mt-2 text-sm">Pokemon</span>
    </div>
  );
}
