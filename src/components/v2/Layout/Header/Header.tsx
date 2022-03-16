/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { Toolbar } from '../Toolbar';
import { useStyles } from './styles';

interface IHeaderProps {
  pageTitle: string;
}

export const Header = ({ pageTitle }: IHeaderProps) => {
  const style = useStyles();
  return (
    <AppBar css={style} position="fixed">
      <Toolbar>
        <Typography variant="h2" noWrap component="div">
          {pageTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
