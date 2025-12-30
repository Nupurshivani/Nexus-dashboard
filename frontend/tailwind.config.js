/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary Purple
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                // Dark theme surfaces
                dark: {
                    bg: '#0a0a0f',
                    surface: '#12121a',
                    'surface-elevated': '#1a1a24',
                    'surface-hover': '#22222e',
                    border: 'rgba(255, 255, 255, 0.06)',
                    'border-hover': 'rgba(255, 255, 255, 0.12)',
                },
                // Accent colors
                accent: {
                    cyan: '#06b6d4',
                    emerald: '#10b981',
                    amber: '#f59e0b',
                    rose: '#f43f5e',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 40px rgba(139, 92, 246, 0.15)',
                'glow-sm': '0 0 20px rgba(139, 92, 246, 0.1)',
                'glow-lg': '0 0 60px rgba(139, 92, 246, 0.2)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'fade-in-up': 'fadeInUp 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'pulse-slow': 'pulse 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(100%)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
