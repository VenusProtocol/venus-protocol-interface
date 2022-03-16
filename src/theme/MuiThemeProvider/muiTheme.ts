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
    default: 'green',
    paper: 'green',
  },
  primary: {
    light: 'green',
    main: 'green',
    dark: 'green',
  },
  secondary: {
    light: 'green',
    main: 'green',
    dark: 'green',
  },
  text: {
    primary: 'green',
    secondary: 'green',
    disabled: 'green',
  },
  interactive: {
    primary: 'green',
    success: 'green',
    error: 'green',
    error50: 'green',
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
export const layoutOffset = { width: `calc(100% - ${SIDEBAR_WIDTH}px)`, ml: `${SIDEBAR_WIDTH}px` };

export const defaultTheme = createTheme({
  breakpoints: BREAKPOINTS,
  palette: PALETTE as PaletteOptions,
});

export default createTheme({
  spacing: 8,
  palette: PALETTE,
  breakpoints: BREAKPOINTS,
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
      fontWeight: 600,
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
          color: PALETTE.text.primary,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...layoutOffset,
          backgroundColor: PALETTE.background.default,
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
        },
        paper: {
          width: SIDEBAR_WIDTH,
          borderRadius: '0 16px 16px 0',
          border: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingTop: defaultTheme.spacing(3),
          paddingBottom: defaultTheme.spacing(3),
          [defaultTheme.breakpoints.up('md')]: {
            minHeight: 96,
          },
        },
      },
    },
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
    MuiSelect: {
      styleOverrides: {
        root: {
          lineHeight: '24px',
          borderRadius: 8,
          height: 32,
          boxSizing: 'border-box',
        },
        select: {
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 12,
          backgroundColor: PALETTE.background.paper,
          borderRadius: 8,
        },
        icon: {
          transition: 'transform .3s',
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
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: PALETTE.text.disabled,
          '&.Mui-checked': {
            color: PALETTE.interactive.error,
          },
          '&+.MuiSwitch-track': {
            backgroundColor: PALETTE.background.default,
          },
          '&.Mui-checked+.MuiSwitch-track': {
            backgroundColor: PALETTE.background.default,
          },
        },
      },
    },
  },
} as ThemeOptions);
