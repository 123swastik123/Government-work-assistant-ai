import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d8ff",
          300: "#a5bdff",
          400: "#7c97ff",
          500: "#4f6ef7",
          600: "#3b52ed",
          700: "#2f3fd9",
          800: "#2b36b0",
          900: "#29338b",
          950: "#1a2060",
        },
        saffron: {
          50:  "#fff8ed",
          100: "#ffefd5",
          200: "#ffdba9",
          300: "#ffc173",
          400: "#ff9d3a",
          500: "#ff7f12",
          600: "#f06207",
          700: "#c74808",
          800: "#9e390f",
          900: "#7f3010",
          950: "#451506",
        },
        slate: {
          850: "#1a2133",
        },
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "system-ui", "sans-serif"],
        display: ["Inter var", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card:  "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 12px 0 rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 16px 0 rgb(0 0 0 / 0.10), 0 1px 3px 0 rgb(0 0 0 / 0.04)",
        glow:  "0 0 0 3px rgb(79 110 247 / 0.15)",
        "glow-lg": "0 0 32px 0 rgb(79 110 247 / 0.20)",
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":   "scaleIn 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "shimmer":    "shimmer 1.5s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { transform: "translateY(12px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        slideDown: { from: { transform: "translateY(-12px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        scaleIn:   { from: { transform: "scale(0.94)", opacity: "0" }, to: { transform: "scale(1)", opacity: "1" } },
        pulseSoft: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.6" } },
        shimmer:   { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

export default config;
