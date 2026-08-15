import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Strict 4-color palette
        smoky: "#11120D",
        "smoky-black": "#11120D",
        olive: "#565449",
        "olive-drab": "#565449",
        bone: "#D8CFBC",
        floral: "#FFFBF4",
        "floral-white": "#FFFBF4",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "22px",
        btn: "12px",
      },
      keyframes: {
        "trace-flow": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "trace-flow": "trace-flow 2s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
