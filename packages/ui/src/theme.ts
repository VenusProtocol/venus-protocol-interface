export const theme = {
  fontFamily: {
    sans: ['var(--font-proxima-nova)', 'Arial', 'sans-serif'],
  },
  screens: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },
  colors: {
    inherit: 'inherit',
    transparent: 'transparent',
    // The next colors are taken from the UI kit in Figma
    background: 'rgb(var(--theme-bg-surface-2))',
    'background-hover': 'rgb(var(--theme-bg-hover))',
    'background-active': 'rgb(var(--theme-bg-surface-1))',
    'background-disabled': 'rgb(var(--color-background-disabled-rgb))',
    'dark-blue': 'rgb(var(--theme-bg-surface-3))',
    'dark-blue-hover': 'rgb(var(--theme-border-default))',
    'dark-blue-active': 'rgb(var(--theme-bg-surface-4))',
    'dark-blue-disabled': 'rgb(var(--theme-bg-surface-4))',
    'dark-grey': 'rgb(var(--theme-bg-neutral-subtle))',
    'dark-grey-hover': 'rgb(var(--theme-border-strong))',
    'dark-grey-active': 'rgb(var(--color-dark-grey-active-rgb))',
    'dark-grey-disabled': 'rgb(var(--theme-bg-disabled))',
    'light-grey': 'rgb(var(--theme-fg-secondary))',
    'light-grey-hover': 'rgb(var(--theme-fg-secondary-hover))',
    'light-grey-active': 'rgb(var(--theme-fg-primary))',
    'light-grey-disabled': 'rgb(var(--theme-border-bold))',
    white: 'rgb(var(--theme-fg-primary))',
    green: 'rgb(var(--theme-fg-success))',
    'green-hover': 'rgb(var(--color-green-hover-rgb))',
    'green-active': 'rgb(var(--color-green-active-rgb))',
    'green-disabled': 'rgb(var(--color-green-disabled-rgb))',
    red: 'rgb(var(--theme-fg-danger))',
    'red-hover': 'rgb(var(--color-red-hover-rgb))',
    'red-active': 'rgb(var(--color-red-active-rgb))',
    'red-disabled': 'rgb(var(--color-red-disabled-rgb))',
    orange: 'rgb(var(--theme-fg-caution))',
    'orange-hover': 'rgb(var(--color-orange-hover-rgb))',
    'orange-active': 'rgb(var(--color-orange-active-rgb))',
    'orange-disabled': 'rgb(var(--color-orange-disabled-rgb))',
    yellow: 'rgb(var(--theme-fg-warning))',
    'yellow-hover': 'rgb(var(--color-yellow-hover-rgb))',
    'yellow-active': 'rgb(var(--color-yellow-active-rgb))',
    'yellow-disabled': 'rgb(var(--color-yellow-disabled-rgb))',
    blue: 'rgb(var(--theme-fg-brand))',
    'blue-hover': 'rgb(var(--theme-fg-brand-hover))',
    'blue-active': 'rgb(var(--theme-fg-brand-active))',
    'blue-disabled': 'rgb(var(--color-blue-disabled-rgb))',

    // The next colors are from the old UI kit
    // TODO: remove once migration of the dApp is complete
    lightGrey: 'rgb(var(--theme-border-muted))',
    mediumBlue: 'rgb(var(--theme-fg-brand-strong))',
    darkBlue: 'rgb(var(--theme-bg-brand-pressed))',
    greyBlue: 'rgb(var(--color-greyBlue-rgb))',
    grey: 'rgb(var(--theme-fg-secondary))',
    cards: 'rgb(var(--theme-bg-surface-4))',
  },
  fontSize: {
    xs: ['0.75rem', '1.5'],
    sm: ['0.875rem', '1.5'],
    base: ['1rem', '1.5'],
    lg: [
      '1.25rem',
      {
        lineHeight: '1.5',
        fontWeight: '600',
      },
    ],
    xl: [
      '1.5rem',
      {
        lineHeight: '1.5',
        fontWeight: '700',
      },
    ],
    '2xl': [
      '2rem',
      {
        lineHeight: '1.5',
        fontWeight: '600',
      },
    ],
    '3xl': [
      '2.5rem',
      {
        lineHeight: '1.2',
        fontWeight: '600',
      },
    ],
  },
  boxShadow: {
    DEFAULT: '0px 4px 15px 0px #0D1017',
  },
  // We keep Tailwind's original sizing scale but make it more granular (with 0.25rem steps) and
  // extend it to bigger values
  spacing: new Array(200).fill(undefined).map((_, index) => `${index * 0.25}rem`),
};
