"use client";

export default function Doc() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">📖 Documentação de Uso</h1>
        <p className="text-lg text-muted-foreground">
          Aqui você encontrará instruções detalhadas sobre como usar o sistema de busca de versículos.
        </p>
      </header>

      <main className="space-y-8">
        {/* Seção 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">🔍 Como pesquisar um versículo</h2>
          <p className="text-base leading-relaxed">
            Para pesquisar um versículo, basta digitar o nome do livro, capítulo e versículo no campo de busca. 
            O sistema suporta buscas flexíveis, permitindo que você digite sem acentos ou em diferentes formatos.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Exemplo 1: <code>1 João 1:1</code></li>
            <li>Exemplo 2: <code>Genesis 1:1</code></li>
            <li>Exemplo 3: <code>Salmos 23</code> (sem especificar o versículo, retorna erro).</li>
          </ul>
        </section>

        {/* Seção 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">🎯 Dicas de busca</h2>
          <p className="text-base leading-relaxed">
            O sistema é inteligente e permite buscas mesmo que você não digite os acentos corretamente. 
            Veja alguns exemplos:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Digite <code>ge</code> para encontrar <strong>Gênesis</strong>.</li>
            <li>Digite <code>jo</code> para encontrar <strong>João</strong>, <strong>Jonas</strong> ou <strong>José</strong>.</li>
            <li>Digite <code>salmos</code> para encontrar o livro de <strong>Salmos</strong>.</li>
          </ul>
        </section>

        {/* Seção 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">⚙️ Funcionalidades adicionais</h2>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>
              <strong>Autocompletar:</strong> Enquanto você digita, sugestões de livros e capítulos aparecerão automaticamente.
            </li>
            <li>
              <strong>Busca sem acentos:</strong> Não se preocupe com acentos, o sistema normaliza os textos para facilitar a busca.
            </li>
            <li>
              <strong>Histórico desativado:</strong> O navegador não salva o histórico de buscas para garantir privacidade.
            </li>
          </ul>
        </section>

        {/* Seção 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">📚 Exemplos de uso</h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="font-semibold">Exemplo</p>
              <p>Digite <code>João 3:16</code> e pressione Enter. O sistema exibirá o versículo:</p>
              <blockquote className="mt-2 border-l-4 border-primary pl-4 italic">
                &quot;Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...&quot;
              </blockquote>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border pt-4 text-center text-sm text-muted-foreground">
        © 2025 Sistema de Busca de Versículos. Todos os direitos reservados. rychardryan.com.br
      </footer>
    </div>
  );
}