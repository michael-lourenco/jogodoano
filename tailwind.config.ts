import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          '900': 'var(--slate-900)'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        // Novas cores semânticas para status
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))'
        },
        error: {
          DEFAULT: 'hsl(var(--destructive))', // Alias para destructive
          foreground: 'hsl(var(--destructive-foreground))'
        },
        // Cores para dados/gráficos existentes
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Cores do sidebar existentes
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      table: {
        DEFAULT: {
          borderCollapse: 'collapse',
          width: '100%',
          borderWidth: '1px',
          borderColor: 'var(--border)'
        },
        th: {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          textAlign: 'left',
          padding: '0.5rem'
        },
        td: {
          padding: '0.5rem',
          borderBottomWidth: '1px',
          borderColor: 'var(--border)'
        }
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin personalizado para adicionar classes de status com tipagem correta
    plugin(function({ addComponents }) {
      addComponents({
        '.status-success': {
          '@apply bg-success/10 text-success border-success/30': {}
        },
        '.status-warning': {
          '@apply bg-warning/10 text-warning border-warning/30': {}
        },
        '.status-info': {
          '@apply bg-info/10 text-info border-info/30': {}
        },
        '.status-error': {
          '@apply bg-error/10 text-error border-error/30': {}
        },
        '.status-primary': {
          '@apply bg-primary/10 text-primary border-primary/30': {}
        },
        '.status-secondary': {
          '@apply bg-secondary/10 text-secondary border-secondary/30': {}
        },
        '.status-muted': {
          '@apply bg-muted text-muted-foreground border-muted/50': {}
        }
      })
    })
  ]
};

export default config;