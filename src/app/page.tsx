"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bibleBooks } from "../app/components/bibleBooks";
import Doc from "./doc/page";

export default function Home() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const filtered = bibleBooks.filter((book) =>
        book.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // mostra no máximo 5 sugestões
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    router.push(`/display?search=${encodeURIComponent(input)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 p-4">
      <div className="mt-[-10vh] flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-foreground dark:text-white">Procurar Versículo</h1>
        <form onSubmit={handleSearch} className="flex flex-col items-center gap-4 relative">
          <input
            type="text"
            placeholder="Ex: João 3:16"
            value={input}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 rounded-md bg-transparent text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-70 sm:w-66"
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-[72px] w-70 sm:w-66 bg-white border border-gray-300 rounded-md shadow-md z-10">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="px-10 py-1.5 rounded-md bg-gradient-to-r hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            Buscar
          </button>
        </form>

        {/* Botão para a documentação */}
        <button
          onClick={() => router.push("/doc")}
          className="mt-4 px-10 py-1.5 rounded-md bg-orange-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg"
        >
          Documentação
        </button>
      </div>
    </main>
  );
}