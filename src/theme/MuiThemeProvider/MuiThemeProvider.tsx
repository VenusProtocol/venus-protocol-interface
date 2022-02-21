import React, { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import mainTheme from './muiTheme';

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    // https://mui.com/guides/interoperability/#css-injection-order-3
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
