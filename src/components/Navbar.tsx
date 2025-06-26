"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-gradient-to-r from-red-500 to-red-700 p-6 shadow-md">
      <h1
        className="cursor-pointer text-3xl font-bold text-white"
        onClick={() => router.push("/dashboard")}
      >
        Pokémon Team Builder
      </h1>
      {/* Hamburger menu button */}
      <button
        className="ml-auto block text-white md:hidden"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          )}
        </svg>
      </button>
      {/* Menu items */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } w-full flex-col items-center gap-4 md:flex md:w-auto md:flex-row md:items-center`}
      >
        <button
          className="mt-4 rounded bg-white px-4 py-2 font-semibold text-red-600 hover:bg-gray-100 md:mt-0"
          onClick={() => {
            setMenuOpen(false);
            router.push("/teambrowser");
          }}
        >
          Buscar times
        </button>
        <button
          className="rounded bg-white px-4 py-2 font-semibold text-red-600 hover:bg-gray-100"
          onClick={() => {
            setMenuOpen(false);
            router.push("/teams");
          }}
        >
          Ver meus times
        </button>
        <p className="text-sm text-gray-200 md:mx-2">
          Breno de Moura | Lucas Breda | Pedro Mariotti
        </p>
        <button
          className="mt-2 ml-0 rounded bg-white px-4 py-2 font-semibold text-red-600 hover:bg-gray-100 md:mt-0 md:ml-4"
          onClick={() => {
            setMenuOpen(false);
            handleLogout();
          }}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
