import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {};

interface ThemeProps {
  children: React.ReactNode;
}

const Theme = ({ children }: ThemeProps) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
