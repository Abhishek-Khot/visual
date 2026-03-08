import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
                sans: ['"DM Sans"', 'Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                surface: '#0a0a0f',
                'surface-card': 'rgba(255,255,255,0.05)',
            },
            animation: {
                'dash-flow': 'dashFlow 1.5s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'typewriter': 'typewriter 0.05s steps(1) forwards',
            },
            keyframes: {
                dashFlow: {
                    to: { strokeDashoffset: '-20' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
