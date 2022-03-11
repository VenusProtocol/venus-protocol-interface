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
    default: 'rgba(31, 32, 40, 1)',
    paper: 'rgba(40, 41, 49, 1)',
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
export const layoutOffset = { width: `calc(100% - ${SIDEBAR_WIDTH}px)`, ml: `${SIDEBAR_WIDTH}px` };

export const defaultTheme = createTheme({
  breakpoints: BREAKPOINTS,
  palette: PALETTE as PaletteOptions,
});

export default createTheme({
  spacing: 8,
  palette: defaultTheme.palette,
  breakpoints: BREAKPOINTS,
  typography: {
    fontFamily: FONTS.primary,
    color: defaultTheme.palette.text.primary,
    h1: {
      fontSize: '28px',
      // line height is defined globally and has default value 1.5
      // lineHeight: 1.5,
    },
    h2: {
      fontSize: '25px',
      // line height is defined globally and has default value 1.5
      // lineHeight: 1.5,
    },
    h3: {
      fontSize: '20px',
      // line height is defined globally and has default value 1.5
      // lineHeight: 1.5,
    },
    h4: {},
    h5: {},
    h6: {},
    subtitle1: {
      fontSize: '17px',
      // line height is defined globally and has default value 1.5
      // lineHeight: 1.5,
    },
    subtitle2: {},
    body1: {
      fontSize: '16px',
      // line height is defined globally and has default value 1.5
      // lineHeight: 1.5,
    },
    body2: {},
    small1: {
      fontSize: '0.875rem',
      // line height is defined globally and has default value 1.5',
      // lineHeight: 1.5,
      fontWeight: 600,
    },
    small2: {
      fontSize: '0.875rem',
      // line height is defined globally and has default value 1.5',
      // lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontSize: '14px',
      // line height is defined globally and has default value 1.5
      // lineHeight: 1.5,
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...layoutOffset,
          backgroundColor: defaultTheme.palette.background.default,
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
          backgroundColor: defaultTheme.palette.background.paper,
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
          color: defaultTheme.palette.text.disabled,
          '&.Mui-checked': {
            color: defaultTheme.palette.error.main,
          },
          '&+.MuiSwitch-track': {
            backgroundColor: defaultTheme.palette.background.default,
          },
          '&.Mui-checked+.MuiSwitch-track': {
            backgroundColor: defaultTheme.palette.background.default,
          },
        },
      },
    },
  },
} as ThemeOptions);
