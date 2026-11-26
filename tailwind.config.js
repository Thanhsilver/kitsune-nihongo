/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sakura: { DEFAULT: '#FFB7C5', 50: '#FFF1F4', 100: '#FFE3EA', 200: '#FFCDD8', 300: '#FFB7C5' },
        primary: { DEFAULT: '#E85D75', 600: '#D4475F', 700: '#B83A50' },
        matcha: { DEFAULT: '#BFE3D0', 50: '#EEF8F2', 600: '#5FA886', 700: '#3F8566' },
        cream: '#FFF8EF',
        ink: { DEFAULT: '#303345', soft: '#6B6E80' },
        night: { DEFAULT: '#1C1B26', card: '#262533', line: '#383747' },
        fox: { DEFAULT: '#F08A4B', light: '#FFD3B0' },
      },
      fontFamily: {
        head: ['Nunito', 'Be Vietnam Pro', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        jp: ['"Noto Sans JP"', '"Hiragino Sans"', '"Yu Gothic"', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem' },
      boxShadow: {
        soft: '0 2px 0 rgba(48,51,69,.06), 0 10px 24px -12px rgba(48,51,69,.18)',
        pop: '0 4px 0 rgba(48,51,69,.10)',
        btn: '0 4px 0 #B83A50',
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(.85)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        fall: { '0%': { transform: 'translate3d(0,-10vh,0) rotate(0)' }, '100%': { transform: 'translate3d(var(--dx),105vh,0) rotate(540deg)' } },
        wiggle: { '0%,100%': { transform: 'rotate(0)' }, '25%': { transform: 'rotate(-6deg)' }, '75%': { transform: 'rotate(6deg)' } },
      },
      animation: { pop: 'pop .35s cubic-bezier(.2,.9,.3,1.3) both', floaty: 'floaty 3.2s ease-in-out infinite', wiggle: 'wiggle .5s ease-in-out' },
    },
  },
  plugins: [],
}
