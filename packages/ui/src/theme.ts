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
    background: 'rgb(var(--color-background-rgb))',
    'background-hover': 'rgb(var(--color-background-hover-rgb))',
    'background-active': 'rgb(var(--color-background-active-rgb))',
    'background-disabled': 'rgb(var(--color-background-disabled-rgb))',
    'dark-blue': 'rgb(var(--color-dark-blue-rgb))',
    'dark-blue-hover': 'rgb(var(--color-dark-blue-hover-rgb))',
    'dark-blue-active': 'rgb(var(--color-dark-blue-active-rgb))',
    'dark-blue-disabled': 'rgb(var(--color-dark-blue-disabled-rgb))',
    'dark-grey': 'rgb(var(--color-dark-grey-rgb))',
    'dark-grey-hover': 'rgb(var(--color-dark-grey-hover-rgb))',
    'dark-grey-active': 'rgb(var(--color-dark-grey-active-rgb))',
    'dark-grey-disabled': 'rgb(var(--color-dark-grey-disabled-rgb))',
    'light-grey': 'rgb(var(--color-light-grey-rgb))',
    'light-grey-hover': 'rgb(var(--color-light-grey-hover-rgb))',
    'light-grey-active': 'rgb(var(--color-light-grey-active-rgb))',
    'light-grey-disabled': 'rgb(var(--color-light-grey-disabled-rgb))',
    white: 'rgb(var(--color-white-rgb))',
    green: 'rgb(var(--color-green-rgb))',
    'green-hover': 'rgb(var(--color-green-hover-rgb))',
    'green-active': 'rgb(var(--color-green-active-rgb))',
    'green-disabled': 'rgb(var(--color-green-disabled-rgb))',
    red: 'rgb(var(--color-red-rgb))',
    'red-hover': 'rgb(var(--color-red-hover-rgb))',
    'red-active': 'rgb(var(--color-red-active-rgb))',
    'red-disabled': 'rgb(var(--color-red-disabled-rgb))',
    orange: 'rgb(var(--color-orange-rgb))',
    'orange-hover': 'rgb(var(--color-orange-hover-rgb))',
    'orange-active': 'rgb(var(--color-orange-active-rgb))',
    'orange-disabled': 'rgb(var(--color-orange-disabled-rgb))',
    yellow: 'rgb(var(--color-yellow-rgb))',
    'yellow-hover': 'rgb(var(--color-yellow-hover-rgb))',
    'yellow-active': 'rgb(var(--color-yellow-active-rgb))',
    'yellow-disabled': 'rgb(var(--color-yellow-disabled-rgb))',
    blue: 'rgb(var(--color-blue-rgb))',
    'blue-hover': 'rgb(var(--color-blue-hover-rgb))',
    'blue-active': 'rgb(var(--color-blue-active-rgb))',
    'blue-disabled': 'rgb(var(--color-blue-disabled-rgb))',

    // The next colors are from the old UI kit
    // TODO: remove once migration of the dApp is complete
    lightGrey: 'rgb(var(--color-lightGrey-rgb))',
    mediumBlue: 'rgb(var(--color-mediumBlue-rgb))',
    darkBlue: 'rgb(var(--color-darkBlue-rgb))',
    greyBlue: 'rgb(var(--color-greyBlue-rgb))',
    grey: 'rgb(var(--color-grey-rgb))',
    cards: 'rgb(var(--color-cards-rgb))',
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
