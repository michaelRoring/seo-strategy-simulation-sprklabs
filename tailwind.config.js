// tailwind.config.js
const { heroui } = require("@heroui/theme");
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(table|checkbox|form|spacer).js",
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line to include all JS/TS files in src
    "./components/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ... your theme extensions
      // Shadcn often adds keyframes here too, ensure they exist if you copied manually
      keyframes: {
        "accordion-down": {
          /* ... */
        },
        "accordion-up": {
          /* ... */
        },
        // Ensure keyframes needed by sheet (slide/fade) are present if not using the plugin properly
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Ensure animations needed by sheet are present if not using the plugin properly
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require("tailwindcss-animate"), animate],
};
