import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── 1. Official Core Palette Tokens ──
        'pale-blue': '#EFFAFD',
        'royal-blue': {
          DEFAULT: '#4A8BDF',
          hover: '#2459A8',
          dark: '#2459A8',
          light: '#EFFAFD',
        },
        eggplant: {
          DEFAULT: '#A0006D',
          hover: '#780052',
          dark: '#780052',
          light: '#F8EAF4',
        },
        
        // ── 2. Primary Color System (Royal Blue) ──
        primary: {
          DEFAULT: '#4A8BDF',
          50: '#EFFAFD',
          100: '#E4F2FC',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#4A8BDF',
          600: '#2459A8',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          hover: '#2459A8',
          glow: 'rgba(74, 139, 223, 0.25)',
          dim: 'rgba(74, 139, 223, 0.10)',
        },

        // ── 3. Signature AI Accent System (Eggplant / Red-Violet) ──
        accent: {
          DEFAULT: '#A0006D',
          50: '#F8EAF4',
          100: '#F8EAF4',
          200: '#F1C5E4',
          300: '#E28DC5',
          400: '#C43D96',
          500: '#A0006D',
          600: '#780052',
          700: '#5E0040',
          hover: '#780052',
          light: '#F8EAF4',
          dark: '#780052',
        },

        // ── 4. Surface & Text System ──
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#EFF7FD',
          bg: '#EFFAFD',
          border: '#DCE7F2',
        },
        slate: {
          50: '#EFFAFD',
          100: '#EFF7FD',
          200: '#DCE7F2',
          300: '#CBD5E1',
          400: '#7B8799',
          500: '#526078',
          600: '#3D4A5E',
          700: '#2C374A',
          800: '#1E293B',
          900: '#11183D',
          950: '#0B0F28',
        },

        // ── 5. Semantic Colors ──
        status: {
          success: '#168A62',
          'success-light': '#E8F5F0',
          warning: '#D99020',
          'warning-light': '#FEF7EC',
          error: '#D64545',
          'error-light': '#FDF2F2',
          info: '#4A8BDF',
          'info-light': '#EFFAFD',
        },

        // Legacy compatibility aliases mapped to new design system
        base: {
          DEFAULT: '#FFFFFF',
          50: '#EFFAFD',
          100: '#EFF7FD',
          200: '#DCE7F2',
          700: '#526078',
          800: '#2C374A',
          900: '#11183D',
        },
        secondary: {
          DEFAULT: '#2459A8',
          50: '#EFFAFD',
          100: '#EFF7FD',
          200: '#DCE7F2',
          950: '#11183D',
          card: '#FFFFFF',
          border: '#DCE7F2',
        },
        obsidian: {
          DEFAULT: '#11183D',
          950: '#0B0F28',
          900: '#11183D',
          800: '#1E293B',
          card: '#FFFFFF',
          border: '#DCE7F2',
        },
      },
      fontFamily: {
        display: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        code: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        card: '16px',
        button: '12px',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(17, 24, 61, 0.06), 0 1px 2px rgba(17, 24, 61, 0.04)',
        card: '0 4px 20px -2px rgba(17, 24, 61, 0.06), 0 2px 6px -1px rgba(17, 24, 61, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(74, 139, 223, 0.12), 0 4px 12px -2px rgba(17, 24, 61, 0.06)',
        modal: '0 20px 48px -6px rgba(17, 24, 61, 0.14)',
        royal: '0 4px 14px rgba(74, 139, 223, 0.30)',
        eggplant: '0 4px 14px rgba(160, 0, 109, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
