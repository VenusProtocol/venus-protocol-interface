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
      primary: React.CSSProperties['color'];
      success: React.CSSProperties['color'];
      success50: React.CSSProperties['color'];
      error: React.CSSProperties['color'];
      error50: React.CSSProperties['color'];
      tan: React.CSSProperties['color'];
      delimiter: React.CSSProperties['color'];
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
      small: number;
      medium: number;
      large: number;
    };
    iconSize: {
      medium: number;
      large: number;
      xLarge: number;
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
    tiny: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    button: true;
  }
}
