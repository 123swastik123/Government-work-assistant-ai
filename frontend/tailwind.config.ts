import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs:  "375px",
      sm:  "640px",
      md:  "768px",
      lg:  "1024px",
      xl:  "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          50:  "#effcfb",
          100: "#d6f6f3",
          200: "#afebe5",
          300: "#7bd9d1",
          400: "#39bdb6",
          500: "#168f91",
          600: "#087477",
          700: "#075d63",
          800: "#084a51",
          900: "#073e45",
          950: "#022b32",
        },
        saffron: {
          400: "#ff9d3a",
          500: "#ff7f12",
          600: "#f06207",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card:         "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 12px 0 rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 20px 0 rgb(0 0 0 / 0.10), 0 1px 3px 0 rgb(0 0 0 / 0.04)",
        glow:         "0 0 0 3px rgb(79 110 247 / 0.15)",
        "glow-lg":    "0 0 32px 0 rgb(79 110 247 / 0.20)",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-out both",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in":   "scaleIn 0.2s ease-out both",
        shimmer:      "shimmer 1.5s linear infinite",
        spin:         "spin 1s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" },                             to: { opacity: "1" } },
        slideUp:   { from: { transform: "translateY(12px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        slideDown: { from: { transform: "translateY(-12px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        scaleIn:   { from: { transform: "scale(0.94)", opacity: "0" },   to: { transform: "scale(1)", opacity: "1" } },
        shimmer:   { from: { backgroundPosition: "-200% 0" },            to: { backgroundPosition: "200% 0" } },
        spin:      { from: { transform: "rotate(0deg)" },                 to: { transform: "rotate(360deg)" } },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
