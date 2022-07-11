import React, { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import mainTheme from './muiTheme';

import 'assets/styles/normalize.scss';

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
