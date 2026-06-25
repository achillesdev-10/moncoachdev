import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#39FF14", // Neon Green for Matrix/Tech look
          dark: "#00cc00",
        },
        secondary: {
          DEFAULT: "#FF8200", // Orange inspired by Cote d'Ivoire flag
          dark: "#e67500",
        },
        neon: {
          green: "#39FF14",
          cyan: "#00F5FF",
        },
        "off-white": "#E2E8F0",
      },
    },
  },
  plugins: [],
};
export default config;
