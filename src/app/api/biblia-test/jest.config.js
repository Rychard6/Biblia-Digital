/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}], // Transforma arquivos TypeScript
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // Trata arquivos .ts e .tsx como módulos ESM
  globals: {
    "ts-jest": {
      useESM: true, // Habilita suporte a ESM no ts-jest
    },
  },
  moduleNameMapper: {
    // Mapeia módulos não-JS, como CSS ou imagens, para evitar erros
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};