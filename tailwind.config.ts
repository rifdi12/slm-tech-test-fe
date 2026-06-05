import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#006a61',
          foreground: '#ffffff',
          light: '#86f2e4',
          dim: '#6bd8cb',
        },
        surface: {
          DEFAULT: '#f0edef',
          lowest: '#ffffff',
          low: '#f6f3f5',
          high: '#eae7e9',
          highest: '#e4e2e4',
          dim: '#dcd9db',
          bright: '#fcf8fa',
        },
        background: '#fcf8fa',
        'on-surface': '#1b1b1d',
        'on-surface-variant': '#45464d',
        outline: '#76777d',
        'outline-variant': '#c6c6cd',
        sidebar: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          active: '#006a61',
          text: '#94a3b8',
          'text-active': '#ffffff',
        },
        status: {
          paid: '#059669',
          'paid-bg': '#d1fae5',
          pending: '#d97706',
          'pending-bg': '#fef3c7',
          overdue: '#dc2626',
          'overdue-bg': '#fee2e2',
          draft: '#64748b',
          'draft-bg': '#f1f5f9',
          sent: '#2563eb',
          'sent-bg': '#dbeafe',
          active: '#059669',
          'active-bg': '#d1fae5',
          inactive: '#64748b',
          'inactive-bg': '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'headline-lg': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'data-mono': ['13px', { lineHeight: '20px', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05)',
        dropdown: '0 4px 6px rgba(0,0,0,0.10)',
        modal: '0 10px 15px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};

export default config;
