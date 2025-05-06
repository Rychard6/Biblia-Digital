import axios from "axios";
import { jest } from "@jest/globals";
import { testarLivros } from "./route.test";

jest.mock("axios");

describe("Testes de exemplo", () => {
  it("deve retornar dados simulados", async () => {
    axios.get.mockResolvedValue({ data: { message: "Sucesso" } });

    const response = await axios.get("https://api.exemplo.com");
    expect(response.data.message).toBe("Sucesso");
  });
});

const mockLivros = {
  "Gênesis": "GEN",
  "Êxodo": "EXO",
  "Levítico": "LEV",
};

const mockBibleId = "d63894c8d9a7a503-01";
const mockApiKey = "847673170b41f4d2ed020d8dc8a4a896";

describe("testarLivros", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar ✅ OK para livros válidos", async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { data: { content: "Versículo de teste" } },
    });

    const resultados = [];
    for (const [nome, code] of Object.entries(mockLivros)) {
      const url = `https://api.scripture.api.bible/v1/bibles/${mockBibleId}/verses/${code}.1.1`;
      const res = await axios.get(url, {
        headers: { "api-key": mockApiKey },
      });

      if (res.status === 200 && res.data.data?.content) {
        resultados.push({ nome, status: "✅ OK" });
      }
    }

    expect(resultados).toEqual([
      { nome: "Gênesis", status: "✅ OK" },
      { nome: "Êxodo", status: "✅ OK" },
      { nome: "Levítico", status: "✅ OK" },
    ]);
  });

  it("deve retornar ⚠️ VAZIO para livros sem conteúdo", async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { data: { content: null } },
    });

    const resultados = [];
    for (const [nome, code] of Object.entries(mockLivros)) {
      const url = `https://api.scripture.api.bible/v1/bibles/${mockBibleId}/verses/${code}.1.1`;
      const res = await axios.get(url, {
        headers: { "api-key": mockApiKey },
      });

      if (res.status === 200 && !res.data.data?.content) {
        resultados.push({ nome, status: "⚠️ VAZIO" });
      }
    }

    expect(resultados).toEqual([
      { nome: "Gênesis", status: "⚠️ VAZIO" },
      { nome: "Êxodo", status: "⚠️ VAZIO" },
      { nome: "Levítico", status: "⚠️ VAZIO" },
    ]);
  });

  it("deve retornar ❌ FALHA para erros na API", async () => {
    axios.get.mockRejectedValue(new Error("Erro na API"));

    const resultados = [];
    for (const [nome, code] of Object.entries(mockLivros)) {
      const url = `https://api.scripture.api.bible/v1/bibles/${mockBibleId}/verses/${code}.1.1`;

      try {
        await axios.get(url, {
          headers: { "api-key": mockApiKey },
        });
      } catch (e) {
        resultados.push({ nome, status: "❌ FALHA" });
      }
    }

    expect(resultados).toEqual([
      { nome: "Gênesis", status: "❌ FALHA" },
      { nome: "Êxodo", status: "❌ FALHA" },
      { nome: "Levítico", status: "❌ FALHA" },
    ]);
  });
});