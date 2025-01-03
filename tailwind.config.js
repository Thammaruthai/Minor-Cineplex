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
      animation: {
        fadeInFromRight: "fadeInFromRight 0.5s ease-in-out",
        fadeIn: "fadeIn 0.25s ease-in-out",
        
      },
      keyframes: {
        fadeInFromRight: {
          "0%": { opacity: 0, transform: "translateX(250px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(0)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      
    },
    plugins: [],
  },
};
