import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50: "#f8f6f0",
          100: "#edeade",
          200: "#d8d3c4",
          300: "#bab4a0",
          400: "#9a9280",
          500: "#7e7668",
          600: "#635d52",
          700: "#524d44",
          800: "#45403a",
          900: "#3b3832",
          950: "#1e1c18",
        },
        azure: {
          50: "#eff8ff",
          100: "#dbeffe",
          200: "#bfe2fd",
          300: "#93cffc",
          400: "#5fb4f8",
          500: "#3996f2",
          600: "#2478e7",
          700: "#1c61d4",
          800: "#1d4fac",
          900: "#1e4589",
          950: "#172b54",
        },
        rose: {
          50: "#fff1f3",
          100: "#ffe4e8",
          200: "#ffcdd5",
          300: "#ffa2b1",
          400: "#ff6982",
          500: "#ff375a",
          600: "#ed1444",
          700: "#c80d39",
          800: "#a80f36",
          900: "#8f1034",
          950: "#500318",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.22,1,0.36,1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.22,1,0.36,1)",
        "flip-page": "flipPage 0.6s cubic-bezier(0.22,1,0.36,1)",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        flipPage: {
          "0%": { transform: "rotateX(-15deg) translateY(-8px)", opacity: "0" },
          "100%": { transform: "rotateX(0deg) translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        calendar:
          "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        "day-hover": "0 4px 12px rgba(36,120,231,0.2)",
        "ring-selected": "0 0 0 3px rgba(36,120,231,0.25)",
        "ring-range": "0 0 0 2px rgba(36,120,231,0.15)",
        paper: "2px 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        "note-card": "0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
