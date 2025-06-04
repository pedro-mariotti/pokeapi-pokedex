"use client";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Placeholder backend connection
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      alert("Login successful!");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50">
      {/* Left Pokémon Image */}
      <div className="absolute top-0 left-0 flex h-full w-1/4 items-center justify-center">
        <Image
          width={200}
          height={200}
          src="/images/pokemon-left.png"
          alt="Pokemon Left"
          className="max-h-full object-contain"
        />
      </div>

      {/* Right Pokémon Image */}
      <div className="absolute top-0 right-0 flex h-full w-1/4 items-center justify-center">
        <Image
          width={200}
          height={200}
          src="/images/pokemon-right.png"
          alt="Pokemon Right"
          className="max-h-full object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full rounded border p-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full rounded border p-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
