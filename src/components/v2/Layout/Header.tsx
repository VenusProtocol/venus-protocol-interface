import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';

interface IHeaderProps {
  offsetStyles?: Record<string, string>;
  pageTitle: string;
}

export const Header = ({ offsetStyles, pageTitle }: IHeaderProps) => (
  <AppBar position="fixed" sx={offsetStyles}>
    <Toolbar>
      <Typography variant="h2" noWrap component="div">
        {pageTitle}
      </Typography>
    </Toolbar>
  </AppBar>
);
