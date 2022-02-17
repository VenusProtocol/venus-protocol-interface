/* https://mui.com/customization/theming/ */
import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles';

const fontFamily = ['AvenirNext', 'Arial', 'sans-serif'].join(',');

export const FONTS = {
  primary: fontFamily,
  secondary: fontFamily,
};

export const PALETTE = {
  mode: 'dark',
  background: {
    default: '#090D27',
    paper: '#181C3A',
  },
  primary: {
    light: '#EBBF6E',
    main: '#EBBF6E',
    dark: '#D99D43',
  },
  secondary: {
    light: '#252A4A',
    main: '#181C3A',
    dark: '#090D27',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1A1',
  },
  success: {
    main: '#9DD562',
  },
  error: {
    main: '#F9053E',
  },
};

const BREAKPOINTS = {
  values: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1280,
    xxl: 1440,
  },
};

export const defaultTheme = createTheme({
  breakpoints: BREAKPOINTS,
  palette: PALETTE as PaletteOptions,
});

export default createTheme({
  spacing: 8,
  palette: PALETTE as PaletteOptions,
  breakpoints: BREAKPOINTS,
  typography: {
    fontFamily: FONTS.primary,
    color: PALETTE.text.primary,
    h1: {
      fontSize: '28px',
      lineHeight: '42px',
    },
    h2: {
      fontSize: '25px',
      lineHeight: '37px',
    },
    h3: {
      fontSize: '20px',
      lineHeight: '30px',
    },
    h4: {},
    h5: {},
    h6: {},
    subtitle1: {
      fontSize: '17px',
      lineHeight: '25px',
    },
    subtitle2: {},
    body1: {
      fontSize: '16px',
      lineHeight: '24px',
    },
    body2: {},
    caption: {
      fontSize: '14px',
      lineHeight: '21px',
    },
    button: {
      fontSize: '14px',
      lineHeight: '21px',
      fontWeight: 400,
    },
    overline: {},
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
          },
        },
        contained: {
          color: defaultTheme.palette.text.primary,
        },
      },
    },
  },
} as ThemeOptions);
