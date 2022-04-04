/* https://mui.com/customization/theming/ */
import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles';

const fontFamily = ['ProximaNova', 'Arial', 'sans-serif'].join(',');

export const FONTS = {
  primary: fontFamily,
  secondary: fontFamily,
};

export const PALETTE = {
  mode: 'dark',
  background: {
    default: 'rgba(31, 32, 40, 1)',
    paper: 'rgba(40, 41, 49, 1)',
    black: '#1F2028',
  },
  primary: {
    light: '#EBBF6E',
    main: '#EBBF6E',
    dark: 'var(--color-blue-hover)',
  },
  secondary: {
    light: 'rgba(56, 57, 68, 1)',
    main: 'rgba(40, 41, 49, 1)',
    dark: 'rgba(31, 32, 40, 1)',
  },
  text: {
    primary: 'rgba(255, 255, 255, 1)',
    secondary: 'rgba(149, 151, 161, 1)',
    disabled: 'rgba(161, 161, 161, 1)',
  },
  button: {
    main: 'rgba(58, 120, 255, 1)',
    medium: 'rgba(38, 90, 204, 1)',
    dark: 'rgba(27, 67, 152, 1)',
  },
  interactive: {
    primary: 'rgba(58, 120, 255, 1)',
    success: 'rgba(24, 223, 139, 1)',
    error: 'rgba(233, 61, 68, 1)',
    error50: 'rgba(233, 61, 68, 0.5)',
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

const SIDEBAR_WIDTH = 180;

export const defaultTheme = createTheme({
  breakpoints: BREAKPOINTS,
  palette: PALETTE as PaletteOptions,
});

const SPACING = 8;

export default createTheme({
  spacing: SPACING,
  palette: PALETTE,
  breakpoints: BREAKPOINTS,
  shape: {
    layoutOffset: { width: `calc(100% - ${SIDEBAR_WIDTH}px)`, ml: `${SIDEBAR_WIDTH}px` },
    sidebarWidth: SIDEBAR_WIDTH,
    borderRadius: {
      small: SPACING,
      medium: SPACING * 2,
      large: SPACING * 3,
    } as any, // our custom types seem to clash with the default MUI types
    iconSize: {
      medium: SPACING * 2,
      large: 20,
    },
  },
  typography: {
    fontFamily: FONTS.primary,
    color: PALETTE.text.primary,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    small1: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: PALETTE.text.secondary,
    },
    small2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: PALETTE.text.secondary,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        hiddenLabel: {
          /* fix for andtd base styles override. TODO: can be deleted when global antd styles will be removed */
          '& legend': {
            display: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          top: 0,
          border: 'none',
        },
      },
    },
  },
} as ThemeOptions);
