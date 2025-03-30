import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#3f51b5',
          light: '#7986cb',
          dark: '#303f9f',
        },
        secondary: {
          main: '#f50057',
          light: '#ff4081',
          dark: '#c51162',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
  important: true, // Isso garante que os estilos do Tailwind tenham prioridade sobre o Material UI
};

export default config; 