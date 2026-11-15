/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#FFFFFF',
        'surface-subtle': '#FAFAFA',
        'surface-zinc': '#F4F4F5',
        charcoal: '#18181B',
        'charcoal-light': '#27272A',
        'muted-gray': '#71717A',
        'slate-line': '#E4E4E7',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

