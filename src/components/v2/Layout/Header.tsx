import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import styles from './Header.module.scss';

interface IHeaderProps {
  pageTitle: string;
}

export const Header = ({ pageTitle }: IHeaderProps) => (
  <AppBar position="fixed" className={styles.appBar}>
    <Toolbar>
      <Typography variant="h2" noWrap component="div">
        {pageTitle}
      </Typography>
    </Toolbar>
  </AppBar>
);
