import { PaletteColor as MuiPaletteColor } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface PaletteColor extends MuiPaletteColor {
    slider?: string;
  }

  // Add v2 colors
  interface Palette {
    button: {
      main: React.CSSProperties['color'];
      medium: React.CSSProperties['color'];
      dark: React.CSSProperties['color'];
    };
    interactive: {
      primary: React.CSSProperties['color'];
      success: React.CSSProperties['color'];
      error: React.CSSProperties['color'];
      error50: React.CSSProperties['color'];
      tan: React.CSSProperties['color'];
    };
  }

  // Add custom typography variants
  interface TypographyVariants {
    small1: React.CSSProperties;
    small2: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    small1?: React.CSSProperties;
    small2?: React.CSSProperties;
  }

  interface Shape {
    borderRadius: {
      small: number;
      medium: number;
      large: number;
    };
    iconSize: {
      medium: number;
      large: number;
    };
    footerHeight: string;
    bannerHeight: string;
    drawerWidthDesktop: string;
    drawerWidthTablet: string;
  }

  interface Theme extends Muitheme {
    shape: Shape;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    small1: true;
    small2: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    button: true;
  }
}
