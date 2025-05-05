"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Sun, Moon} from "lucide-react";
import Link from "next/link";



const LIVROS = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
  "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
  "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
  "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
  "Eclesiastes", "Cantares de Salomão", "Isaías", "Jeremias", "Lamentações",
  "Ezequiel", "Daniel", "Oseias", "Joel", "Amós",
  "Obadias", "Jonas", "Miqueias", "Naum", "Habacuque",
  "Provérbios", "Ageu", "Zacarias", "Malaquias",
  "Mateus", "Marcos", "Lucas", "João", "Atos",
  "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
  "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo",
  "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago",
  "1 Pedro", "2 Pedro", "1 João", "2 João", "3 João",
  "Judas", "Apocalipse"
];

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDarkMode);
  }, []);
  

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/display?search=${encodeURIComponent(query)}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  
    if (value.length > 0) {
      const filteredSuggestions = LIVROS.filter((livro) =>
        livro
          .toLowerCase()
          .normalize("NFD") // Remove acentos
          .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas
          .startsWith(
            value
              .toLowerCase()
              .normalize("NFD") // Remove acentos
              .replace(/[\u0300-\u036f]/g, "")
          )
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-8 bg-background/80 backdrop-blur-md cursor-pointer">
      {/* Logo */}
      <div suppressHydrationWarning>
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Barra de pesquisa */}
      {pathname !== "/" && (
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-6">
          <input
            type="text"
            name="query"
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="Buscar versículo..."
            className="w-full p-2 rounded-md border border-border bg-background text-foreground placeholder-gray-400 text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-muted"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </form>
      )}
      

      {/* Botão Dark Mode */}
      {mounted && (
  <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-muted transition cursor-pointer"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? <Sun size={25} /> : <Moon size={25} />}
    </button>
  )}
    </header>
  );
}