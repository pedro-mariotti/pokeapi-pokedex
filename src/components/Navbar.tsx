"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-red-500 to-red-700 p-6 shadow-md">
      <h1
        className="cursor-pointer text-3xl font-bold text-white"
        onClick={() => router.push("/dashboard")}
      >
        Pokémon Team Builder
      </h1>
      <div className="flex items-center gap-4">
        <button
          className="rounded bg-white px-4 py-2 font-semibold text-red-600 hover:bg-gray-100"
          onClick={() => router.push("/teambrowser")}
        >
          Buscar times
        </button>{" "}
        <button
          className="rounded bg-white px-4 py-2 font-semibold text-red-600 hover:bg-gray-100"
          onClick={() => router.push("/teams")}
        >
          Ver meus times
        </button>
        <p className="text-sm text-gray-200">
          Breno de Moura | Lucas Breda | Pedro Mariotti
        </p>
        <button
          className="ml-4 rounded bg-white px-4 py-2 font-semibold text-red-600 hover:bg-gray-100"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
