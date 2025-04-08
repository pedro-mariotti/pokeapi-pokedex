const getBgColor = (type: string) => {
  switch (type) {
    case "water":
      return "bg-blue-500";
    case "fire":
      return "bg-red-500";
    case "grass":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
export default function PokeType(props: { type: string }) {
  return (
    <li
      className={`${getBgColor(props.type)} flex w-16 items-center justify-center rounded-4xl border-2 border-black`}
    >
      <p>{props.type}</p>
    </li>
  );
}
