import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff", 100: "#d9eaff", 200: "#bcd9ff", 300: "#8ec0ff",
          400: "#599cff", 500: "#3377ff", 600: "#1f5af0", 700: "#1947d0",
          800: "#1b3da8", 900: "#1c3884", 950: "#152352",
        },
        ink: { DEFAULT: "#0b1120", soft: "#334155", faint: "#64748b" },
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
      container: { center: true, padding: "1.25rem", screens: { "2xl": "1180px" } },
    },
  },
  plugins: [],
};
export default config;
