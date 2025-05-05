'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import BibleVerse from '../../app/components/BibleVerse';

export default function DisplayPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <Suspense fallback={<p>Carregando...</p>}>
        <DisplayContent />
      </Suspense>
    </main>
  );
}

function DisplayContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || null;

  return search ? (
    <BibleVerse search={search} />
  ) : (
    <p className="text-center text-gray-500">Nenhum versículo foi pesquisado.</p>
  );
}