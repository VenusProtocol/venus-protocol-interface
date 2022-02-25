import {
  PaletteColor as MuiPaletteColor,
  TypeBackground as MuiTypeBackground,
} from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface PaletteColor extends MuiPaletteColor {
    slider?: string;
  }

  interface TypeBackground extends MuiTypeBackground {
    black?: string;
  }
}
