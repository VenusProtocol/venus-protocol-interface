import { css } from '@emotion/react';
import { Theme, useTheme } from '@mui/material';
import { PoolRiskLevel } from 'types';

const getColor = ({ variant, theme }: { variant: PoolRiskLevel; theme: Theme }) => {
  if (variant === 'MINIMAL' || variant === 'LOW') {
    return theme.palette.interactive.success;
  }

  if (variant === 'MEDIUM') {
    return theme.palette.interactive.warning;
  }

  return theme.palette.interactive.error;
};

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: inline-flex;
    `,
    content: css`
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: help;
    `,
    getDot: ({ variant }: { variant: PoolRiskLevel }) => css`
      flex-shrink: 0;
      width: ${theme.spacing(1)};
      height: ${theme.spacing(1)};
      border-radius: ${theme.spacing(1)};
      background-color: ${getColor({ variant, theme })};
      margin-right: ${theme.spacing(1)};
    `,
    getText: ({ variant }: { variant: PoolRiskLevel }) => css`
      color: ${getColor({ variant, theme })};
      text-decoration: underline dotted ${getColor({ variant, theme })} 1px;
    `,
  };
};
