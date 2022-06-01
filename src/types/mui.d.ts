import { PaletteColor as MuiPaletteColor } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface PaletteColor extends MuiPaletteColor {
    slider?: string;
  }

  // Add v2 colors
  interface Palette {
    button: {
      main: string;
      medium: string;
      dark: string;
    };
    interactive: {
      primary: string;
      success: string;
      success50: string;
      error: string;
      error50: string;
      tan: string;
      delimiter: string;
      warning: string;
      hover: string;
    };
  }

  // Add custom typography variants
  interface TypographyVariants {
    small1: React.CSSProperties;
    small2: React.CSSProperties;
    tiny: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    small1?: React.CSSProperties;
    small2?: React.CSSProperties;
    tiny?: React.CSSProperties;
  }

  interface Shape {
    borderRadius: {
      verySmall: number;
      small: number;
      medium: number;
      large: number;
    };
    iconSize: {
      small: number;
      medium: number;
      large: number;
      xLarge: number;
      xxLarge: number;
    };
    footerHeight: string;
    bannerHeight: string;
    drawerWidthDesktop: string;
    drawerWidthTablet: string;
  }

  interface Theme extends Muitheme {
    shape: Shape;
  }

  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    small1: true;
    small2: true;
    tiny: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    button: true;
  }
}
