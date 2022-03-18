import {
  PaletteColor as MuiPaletteColor,
  TypeBackground as MuiTypeBackground,
} from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface PaletteColor extends MuiPaletteColor {
    slider?: string;
  }

  // Add v2 colors
  interface Palette {
    button: {
      light: React.CSSProperties['color'];
      main: React.CSSProperties['color'];
      dark: React.CSSProperties['color'];
    };
    interactive: {
      primary: React.CSSProperties['color'];
      success: React.CSSProperties['color'];
      error: React.CSSProperties['color'];
      error50: React.CSSProperties['color'];
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
