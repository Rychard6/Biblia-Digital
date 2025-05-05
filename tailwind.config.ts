/** @type {import('tailwindcss').Config} */
const config = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
        },
      },
    },
    darkMode: "class", // Importante!
  };
  
  export default config;
  