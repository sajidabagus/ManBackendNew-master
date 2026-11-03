import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F766E",
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0F766E",
          700: "#0D9488",
          800: "#115E59",
          900: "#134E4A",
        },
        secondary: {
          DEFAULT: "#134E4A",
          light: "#115E59",
          dark: "#042F2E",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 118, 110, 0.12)",
        "soft-lg": "0 12px 40px -8px rgba(15, 118, 110, 0.18)",
        glass: "0 8px 32px rgba(15, 118, 110, 0.08)",
        premium: "0 20px 60px -15px rgba(19, 78, 74, 0.25)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgba(19, 78, 74, 0.92) 0%, rgba(15, 118, 110, 0.85) 50%, rgba(4, 47, 46, 0.95) 100%)",
        "gold-shine":
          "linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #D97706 100%)",
        "emerald-mesh":
          "radial-gradient(at 40% 20%, rgba(45, 212, 191, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(245, 158, 11, 0.08) 0px, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
