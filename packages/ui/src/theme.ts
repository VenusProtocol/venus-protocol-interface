export const theme = {
  fontFamily: {
    sans: ['var(--font-proxima-nova)', 'Arial', 'sans-serif'],
  },
  screens: {
    sm: '375px',
    md: '640px',
    lg: '840px',
    xl: '1280px',
    xxl: '1440px',
  },
  colors: {
    inherit: 'inherit',
    transparent: 'transparent',
    // The next colors are taken from the UI kit in Figma
    background: 'rgb(var(--color-background))',
    cards: 'rgb(var(--color-cards))',
    grey: 'rgb(var(--color-grey))',
    lightGrey: 'rgb(var(--color-lightGrey))',
    green: 'rgb(var(--color-green))',
    red: 'rgb(var(--color-red))',
    offWhite: 'rgb(var(--color-offWhite))',
    orange: 'rgb(var(--color-orange))',
    yellow: 'rgb(var(--color-yellow))',
    blue: 'rgb(var(--color-blue))',
    // The next colors are not in the UI kit, but are used throughout the designs
    mediumBlue: 'rgb(var(--color-mediumBlue))',
    darkBlue: 'rgb(var(--color-darkBlue))',
    greyBlue: 'rgb(var(--color-greyBlue))',
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
