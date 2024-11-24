import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(220, 13%, 91%)",
        input: "hsl(220, 13%, 91%)",
        ring: "hsl(224, 71%, 45%)",
        background: "hsl(222, 47%, 11%)",
        foreground: "hsl(213, 31%, 91%)",
        primary: {
          DEFAULT: "hsl(142, 71%, 45%)",
          foreground: "hsl(222, 47%, 11%)",
        },
        secondary: {
          DEFAULT: "hsl(142, 71%, 35%)",
          foreground: "hsl(222, 47%, 11%)",
        },
        alert: {
          safe: "#22C55E",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(220, 13%, 91%)",
          foreground: "hsl(216, 12%, 84%)",
        },
        accent: {
          DEFAULT: "hsl(142, 71%, 45%)",
          foreground: "hsl(222, 47%, 11%)",
        },
        popover: {
          DEFAULT: "hsl(222, 47%, 11%)",
          foreground: "hsl(213, 31%, 91%)",
        },
        card: {
          DEFAULT: "hsl(222, 47%, 11%)",
          foreground: "hsl(213, 31%, 91%)",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;