/* https://mui.com/customization/theming/ */
import { type ThemeOptions, createTheme } from '@mui/material/styles';
import { theme } from '@venusprotocol/ui';

const fontFamily = theme.fontFamily.sans.join(',');

export const FONTS = {
  primary: fontFamily,
  secondary: fontFamily,
};

export const PALETTE = {
  mode: 'dark',
  background: {
    default: theme.colors.background,
    paper: theme.colors.cards,
  },
  secondary: {
    light: theme.colors.lightGrey,
    main: theme.colors.background,
  },
  text: {
    primary: theme.colors.white,
    secondary: theme.colors.grey,
  },
  button: {
    main: theme.colors.blue,
    medium: theme.colors.mediumBlue,
    dark: theme.colors.darkBlue,
  },
  interactive: {
    primary: theme.colors.blue,
    success: theme.colors.green,
    error: theme.colors.red,
    error50: 'rgba(233, 61, 68, 0.5)',
    warning: theme.colors.orange,
    hover: theme.colors['background-hover'],
  },
};

export const BREAKPOINTS = {
  values: {
    xs: 375,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1440,
  },
};

export const SPACING = 4;

export type TypographyVariant =
  | 'button'
  | 'caption'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'inherit'
  | 'overline'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'small1'
  | 'small2'
  | undefined;

export const SHAPE = {
  borderRadius: {
    verySmall: SPACING,
    small: SPACING * 2,
    medium: SPACING * 4,
    large: SPACING * 6,
  } as any, // our custom types seem to clash with the default MUI types
  iconSize: {
    small: SPACING * 3,
    medium: SPACING * 4,
    large: SPACING * 5,
    xLarge: SPACING * 6,
    xxLarge: SPACING * 10,
  },
  footerHeight: '56px',
  drawerWidthDesktop: '224px',
  drawerWidthTablet: '80px',
};

export default createTheme({
  spacing: SPACING,
  palette: PALETTE,
  breakpoints: BREAKPOINTS,
  shape: SHAPE,
  typography: {
    fontFamily: FONTS.primary,
    color: PALETTE.text.primary,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.3px',
      lineHeight: 1.5,
    },
    small1: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: PALETTE.text.secondary,
      lineHeight: 1.5,
    },
    small2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: PALETTE.text.secondary,
      lineHeight: 1.5,
    },
    tiny: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: PALETTE.background.paper,
          borderRadius: SPACING * 3,
          padding: SPACING * 6,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        paper: {
          padding: 0,
          borderRadius: 0,
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
