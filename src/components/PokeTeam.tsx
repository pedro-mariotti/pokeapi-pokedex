import EeveePlaceholder from "../../public/klipartz.com.png";
import PokeCardTeam from "@/components/PokeCardTeam";

export default function PokeTeam(props: { bg_color: string }) {
  return (
    <ul
      className={`grid grid-cols-2 gap-4 rounded-2xl p-8 ${props.bg_color == "red" ? "bg-red-200" : "bg-blue-200"}`}
    >
      <PokeCardTeam poke_image={EeveePlaceholder} />
      <PokeCardTeam poke_image={EeveePlaceholder} />
      <PokeCardTeam poke_image={EeveePlaceholder} />
      <PokeCardTeam poke_image={EeveePlaceholder} />
      <PokeCardTeam poke_image={EeveePlaceholder} />
      <PokeCardTeam poke_image={EeveePlaceholder} />
    </ul>
  );
}
