import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pokeapi.co",
        pathname: "/media/sprites/**", // Para sprites do PokeAPI
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/master/sprites/pokemon/**", // Para sprites do GitHub
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "assets.pokemon.com",
      },
      {
        protocol: "https",
        hostname: "www.mundodeportivo.com",
      },
      {
        protocol: "https",
        hostname: "www.vortex.gg",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;
