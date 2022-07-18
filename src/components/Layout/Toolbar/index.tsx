/** @jsxImportSource @emotion/react */
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar';
import React from 'react';

import { useStyles } from './styles';

export const Toolbar = (props: ToolbarProps) => {
  const styles = useStyles();
  return <MuiToolbar css={styles} {...props} />;
};
