import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom plant theme colors
        leaf: {
          50: "#f0f9f0",
          100: "#dcf0dc",
          200: "#bce3bd",
          300: "#92d093",
          400: "#68b86a",
          500: "#4a9c4c",
          600: "#3a7d3c",
          700: "#306433",
          800: "#2a502c",
          900: "#244326",
          950: "#0f2511",
        },
        moss: {
          50: "#f3f9ee",
          100: "#e5f1da",
          200: "#cce3b8",
          300: "#aed08d",
          400: "#8fb866",
          500: "#71a046",
          600: "#578035",
          700: "#44652c",
          800: "#385127",
          900: "#304523",
          950: "#182610",
        },
        sage: {
          50: "#f5f8f1",
          100: "#e9efe0",
          200: "#d3dfc3",
          300: "#b4c99d",
          400: "#94af75",
          500: "#7a9656",
          600: "#617843",
          700: "#4c5e36",
          800: "#404d2f",
          900: "#374128",
          950: "#1c2314",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "leaf-sway": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "leaf-sway": "leaf-sway 4s ease-in-out infinite",
      },
      backgroundImage: {
        "leaf-pattern": "url('/patterns/leaf-pattern.svg')",
        "plant-texture": "url('/patterns/plant-texture.svg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
