/** @jsxImportSource @emotion/react */
import React from 'react';
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar';
import { useStyles } from './styles';

export const Toolbar = (props: ToolbarProps) => {
  const styles = useStyles();
  return <MuiToolbar css={styles} {...props} />;
};
