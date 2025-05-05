// file: src/app/api/biblia-test/route.ts
import { NextResponse } from "next/server";

const LIVRO_MAPA: Record<string, string> = {
  genesis: "gn", exodo: "ex", levitico: "lv", numeros: "nm",
  deuteronomio: "dt", josue: "js", juizes: "jz", rute: "rt",
  "1 samuel": "1sm", "2 samuel": "2sm", "1 reis": "1rs", "2 reis": "2rs",
  "1 cronicas": "1cr", "2 cronicas": "2cr", esdras: "ed", neemias: "ne",
  ester: "et", jo: "job", salmos: "sl", proverbios: "pv", eclesiastes: "ec",
  cantares: "ct", isaias: "is", jeremias: "jr", lamentacoes: "lm",
  ezequiel: "ez", daniel: "dn", oseias: "os", joel: "jl", amos: "am",
  obadias: "ob", jonas: "jn", miqueias: "mq", naum: "na", habacuque: "hc",
  sofonias: "sf", ageu: "ag", zacarias: "zc", malaquias: "ml",
  mateus: "mt", marcos: "mc", lucas: "lc", joao: "jo", atos: "at",
  romanos: "rm", "1 corintios": "1co", "2 corintios": "2co", galatas: "gl",
  efesios: "ef", filipenses: "fp", colossenses: "cl", "1 tessalonicenses": "1ts",
  "2 tessalonicenses": "2ts", "1 timoteo": "1tm", "2 timoteo": "2tm",
  tito: "tt", filemom: "fm", hebreus: "hb", tiago: "tg", "1 pedro": "1pe",
  "2 pedro": "2pe", "1 joao": "1jo", "2 joao": "2jo", "3 joao": "3jo",
  judas: "jd", apocalipse: "ap"
};

const ORDEM_LIVROS = Object.keys(LIVRO_MAPA);

function normalizar(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const referencia = searchParams.get("versiculo");

    if (!referencia) {
      return NextResponse.json({ erro: "Parâmetro 'versiculo' obrigatório." }, { status: 400 });
    }

    const match = referencia.match(/^(.+?)\s+(\d+):(\d+)$/i);
    if (!match) {
      return NextResponse.json({ erro: "Formato inválido. Use 'Livro Capítulo:Versículo'" }, { status: 400 });
    }

    const [, livro, cap, vers] = match;
    const livroKey = normalizar(livro);
    const livroId = LIVRO_MAPA[livroKey];

    if (!livroId) {
      return NextResponse.json({ erro: `Livro '${livro}' não reconhecido.` }, { status: 404 });
    }

    const token = process.env.ABIBLIA_TOKEN;
    if (!token) {
      return NextResponse.json({ erro: "Token da Bíblia Digital não configurado." }, { status: 500 });
    }

    const url = `https://www.abibliadigital.com.br/api/verses/nvi/${livroId}/${cap}/${vers}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json; charset=utf-8"
      }
    });

    if (!response.ok) {
      // Tenta pegar o próximo livro
      if (response.status === 404) {
        const indexAtual = ORDEM_LIVROS.indexOf(livroKey);
        if (indexAtual !== -1 && indexAtual + 1 < ORDEM_LIVROS.length) {
          const proximoLivroKey = ORDEM_LIVROS[indexAtual + 1];
          const proximoLivroId = LIVRO_MAPA[proximoLivroKey];

          const novaResponse = await fetch(`https://www.abibliadigital.com.br/api/verses/nvi/${proximoLivroId}/1/1`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json; charset=utf-8"
            }
          });

          if (novaResponse.ok) {
            const data = await novaResponse.json();
            return NextResponse.json({
              livro: data.book.name,
              capitulo: data.chapter,
              numero_versiculo: data.number,
              versiculo: data.text
            });
          }
        }
      }

      const msg = await response.text();
      return NextResponse.json({ erro: msg }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      livro: data.book.name,
      capitulo: data.chapter,
      numero_versiculo: data.number,
      versiculo: data.text
    });
  } catch (e: any) {
    console.error("Erro ao consultar API externa:", e?.message ?? e);
    return NextResponse.json({ erro: "Erro ao consultar API externa." }, { status: 500 });
  }
}
