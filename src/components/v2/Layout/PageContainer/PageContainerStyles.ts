import { layoutOffset } from '../../../../theme/MuiThemeProvider/muiTheme';

export const styles = {
  main: {
    flexGrow: 1,
    p: 3,
    pb: 6,
    minHeight: '100vh',
  },
  footer: { position: 'fixed', bottom: 0, left: 0, ...layoutOffset },
};
