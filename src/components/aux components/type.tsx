const getBgColor = (type: string) => {
  switch (type) {
    case "water":
      return "bg-blue-500 border-blue-800";
    case "fire":
      return "bg-[#E62829] border-[#961A1B]";
    case "grass":
      return "bg-green-500 border-green-800";
    case "flying":
      return "bg-[#81B9EF] border-[#54789B]";
  }
};
export default function PokeType(props: { type: string }) {
  return (
    <li
      className={`${getBgColor(props.type)} flex w-16 items-center justify-center rounded-4xl border-2 text-xs uppercase`}
    >
      <p>{props.type}</p>
    </li>
  );
}
