/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        hvac: {
          cooling: '#3b82f6',
          heating: '#ea580c',
          emergency: '#dc2626',
          maintenance: '#16a34a',
          commercial: '#374151',
          residential: '#2563eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'hvac': '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
        'emergency': '0 4px 6px -1px rgba(220, 38, 38, 0.1), 0 2px 4px -1px rgba(220, 38, 38, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      backgroundImage: {
        'cooling-gradient': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        'heating-gradient': 'linear-gradient(135deg, #ea580c, #c2410c)',
        'emergency-gradient': 'linear-gradient(135deg, #dc2626, #b91c1c)',
      },
    },
  },
  plugins: [
    // Custom plugin for HVAC-specific utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-phone': {
          color: '#ea580c',
          fontWeight: '600',
          '&:hover': {
            color: '#c2410c',
          },
        },
        '.btn-emergency': {
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '600',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #b91c1c, #991b1b)',
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.2)',
          },
          '&:focus': {
            outline: '2px solid #dc2626',
            outlineOffset: '2px',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-primary': {
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '600',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)',
          },
          '&:focus': {
            outline: '2px solid #3b82f6',
            outlineOffset: '2px',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-secondary': {
          background: 'linear-gradient(135deg, #ea580c, #c2410c)',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '600',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #c2410c, #9a3412)',
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.2)',
          },
          '&:focus': {
            outline: '2px solid #ea580c',
            outlineOffset: '2px',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.service-card': {
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}