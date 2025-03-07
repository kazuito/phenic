import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        BebasNeue: ["var(--font-BebasNeue)"],
      },
      colors: {
        concept: {
          "50": "#fdffe7",
          "100": "#f9ffc1",
          "200": "#f8ff86",
          "300": "#fbff41",
          "400": "#fff80d",
          "500": "#ffea00",
          "600": "#d1ae00",
          "700": "#a67d02",
          "800": "#89610a",
          "900": "#744f0f",
          "950": "#442a04",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "run-loop": "run 1.95s ease infinite",
        "fade-in": "fade-in 0.3s ease forwards",
        "fade-in-up": "fade-in-up 0.3s ease forwards",
        "fade-in-down": "fade-in-down 0.3s ease forwards",
        "fade-out": "fade-out 0.3s ease forwards",
        "fade-out-down": "fade-out-down 0.3s ease forwards",
        "grow-in-h": "grow-in-h 0.3s ease forwards",
        "new-item": "new-item 0.5s ease",
      },
      keyframes: {
        run: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "scale(0.95) translateY(1rem)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "scale(0.95) translateY(-1rem)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "fade-out-down": {
          from: { opacity: "1", transform: "scale(1) translateY(0)" },
          to: { opacity: "0", transform: "scale(0.95) translateY(1rem)" },
        },
        "grow-in-h": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "new-item": {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0) scale(1)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
