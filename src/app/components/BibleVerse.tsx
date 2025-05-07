import { useState, useEffect } from "react";

interface BibleVerseProps {
  search: string;
}

interface VerseData {
  versiculo: string;
  livro: string;
  capitulo: number;
  numero_versiculo: number;
}

interface Livro {
  nome: string;
  abreviacao: string;
}

export default function BibleVerse({ search }: BibleVerseProps) {
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!search) return;

    const fetchVerse = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/bible?versiculo=${encodeURIComponent(search)}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar o versículo.");
        }
        const data = await response.json();
        setVerseData(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, [search]);

  const fetchVerse = async (newSearch: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/bible?versiculo=${encodeURIComponent(search)}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar o versículo.");
      }
      const data: VerseData = await response.json();
      setVerseData(data);
    } catch (err: unknown) {
      setError((err as Error).message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextVerse = async () => {
    if (!verseData) return;

    const { livro, capitulo, numero_versiculo } = verseData;
    let nextVerse = numero_versiculo + 1;
    let nextChapter = capitulo;
    let nextBook = livro;

    let newSearch = `${nextBook} ${nextChapter}:${nextVerse}`;
    try {
      const response = await fetch(`/api/bible?versiculo=${encodeURIComponent(newSearch)}`);
      if (response.ok) {
        const data = await response.json();
        setVerseData(data);
        return;
      } else {
        // Tentar próximo capítulo
        nextVerse = 1;
        nextChapter = capitulo + 1;
        newSearch = `${nextBook} ${nextChapter}:${nextVerse}`;
        const chapterResponse = await fetch(`/api/bible?versiculo=${encodeURIComponent(newSearch)}`);
        if (chapterResponse.ok) {
          const data = await chapterResponse.json();
          setVerseData(data);
          return;
        } else {
          // Tentar próximo livro
          const currentBookIndex = livros.findIndex((l) => l.nome === livro);
          if (currentBookIndex !== -1 && currentBookIndex + 1 < livros.length) {
            nextBook = livros[currentBookIndex + 1].nome;
            nextChapter = 1;
            nextVerse = 1;
            newSearch = `${nextBook} ${nextChapter}:${nextVerse}`;
            const bookResponse = await fetch(`/api/bible?versiculo=${encodeURIComponent(newSearch)}`);
            if (bookResponse.ok) {
              const data = await bookResponse.json();
              setVerseData(data);
              return;
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido.");
    }
  };

  const handlePreviousVerse = async () => {
    if (!verseData) return;

    const { livro, capitulo, numero_versiculo } = verseData;
    let prevVerse = numero_versiculo - 1;
    let prevChapter = capitulo;
    let prevBook = livro;

    if (prevVerse < 1) {
      prevChapter = capitulo - 1;
      if (prevChapter < 1) {
        const currentBookIndex = livros.findIndex((l) => l.nome === livro);
        if (currentBookIndex > 0) {
          prevBook = livros[currentBookIndex - 1].nome;
          // Aqui você pode implementar lógica para obter o último capítulo e versículo do livro anterior
          // Por simplicidade, vamos assumir capítulo 1, versículo 1
          prevChapter = 1;
          prevVerse = 1;
        } else {
          return;
        }
      } else {
        // Aqui você pode implementar lógica para obter o último versículo do capítulo anterior
        // Por simplicidade, vamos assumir versículo 1
        prevVerse = 1;
      }
    }

    const newSearch = `${prevBook} ${prevChapter}:${prevVerse}`;
    try {
      const response = await fetch(`/api/bible?versiculo=${encodeURIComponent(newSearch)}`);
      if (response.ok) {
        const data = await response.json();
        setVerseData(data);
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido.");
    }
  };

  if (loading) return <p>Carregando versículo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!verseData) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl h-auto sm:h-96 bg-background/80 backdrop-blur-md p-4 rounded-lg shadow-lg">
      <p className="font-bold text-center mb-6 text-2xl sm:text-4xl">{verseData.versiculo}</p>
      <p className="font-medium text-base sm:text-lg">
        {verseData.livro || ""} {verseData.capitulo}:{verseData.numero_versiculo}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
        <button
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
          onClick={() => handlePreviousVerse()}
        >
          Anterior
        </button>
        <button
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
          onClick={() => handleNextVerse()}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
