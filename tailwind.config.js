/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // เพิ่ม Roboto เป็นฟอนต์หลัก
        robotoCondensed: ['"Roboto Condensed"', "sans-serif"], // สำหรับ reponsive
      },
    },
  },
  plugins: [],
};
