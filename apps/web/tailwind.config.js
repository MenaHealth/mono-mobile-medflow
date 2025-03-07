// tailwind.config.js
import { Playfair_Display } from "next/font/google"

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
        darkBlue: "#120f0b",
        primaryOrange: "#FF5722",
        white: "#ffffff",
        yellow: {
          '50': '#fcfee8',
          '100': '#faffc2',
          '200': '#faff89',
          '300': '#ffff4d',
          '400': '#fdf312',
          '500': '#ecd906',
          '600': '#ccab02',
          '700': '#a37b05',
          '800': '#86600d',
          '900': '#724e11',
          '950': '#432a05',
        },
        orange: {
          50: '#fff4ed',
          100: '#ffe6d4',
          200: '#ffc8a8',
          300: '#ffa270',
          400: '#ff6f37',
          500: '#ff5722',
          600: '#f02e06',
          700: '#c71e07',
          800: '#9e1a0e',
          900: '#7f190f',
          950: '#450805',
        },
        red: {
          '50': '#FFE9E9',
          '100': '#FFD3D3',
          '200': '#FFA6A6',
          '300': '#FF7A7A',
          '400': '#FF4D4D',
          '500': '#FF2121',
          '600': '#CC1A1A',
          '700': '#991414',
          '800': '#660D0D',
          '900': '#330707',
          '950': '#290505',
        },
        green: {
          50: '#E6F3F3',
          100: '#CCE6E7',
          200: '#99CDCF',
          300: '#66B5B7',
          400: '#339C9F',
          500: '#008387',
          600: '#00696C',
          700: '#056E73',
          800: '#056e73',
          900: '#001A1B',
          950: '#001516',
        },
        grey: {
          '50': '#f7f7f7',
          '100': '#ededed',
          '200': '#dfdfdf',
          '300': '#c8c8c8',
          '400': '#a8a8a8',
          '500': '#999999',
          '600': '#888888',
          '700': '#7b7b7b',
          '800': '#676767',
          '900': '#545454',
          '950': '#363636',
        },
        gray: {
          '50': '#f7f7f7',
          '100': '#ededed',
          '200': '#dfdfdf',
          '300': '#c8c8c8',
          '400': '#a8a8a8',
          '500': '#999999',
          '600': '#888888',
          '700': '#7b7b7b',
          '800': '#676767',
          '900': '#545454',
          '950': '#363636',
        },
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
      },

      fontFamily: {
        "dm-serif-text": ["var(--font-dm-serif-text)", "serif"],
        icomoon: ["Icomoon", "sans-serif"],
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "2.25rem", fontWeight: "700", fontFamily: "var(--font-dm-serif-text)" }],
        h3: ["1.75rem", { lineHeight: "2rem", fontWeight: "600" }],
        h4: ["1.5rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        h5: ["1.25rem", { lineHeight: "1.5rem", fontWeight: "500" }],
        p: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
      },
      textDecoration: {
        underline: 'underline',
        bold: 'bold',
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
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: 'aurora 35s linear infinite',
      },
    },

  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
}

function addVariablesForColors({ addBase, theme }) {
  const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
      Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}