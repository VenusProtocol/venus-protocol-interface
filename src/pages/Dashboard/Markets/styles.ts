import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    balance: css`
      display: flex;
      flex-direction: column;

      > :first-of-type {
        color: ${theme.palette.text.primary};
      }
    `,
    percentOfLimit: css`
      display: flex;
      align-items: center;
      justify-content: flex-end;

      > :first-of-type {
        margin-right: ${theme.spacing(2)};
      }
    `,
    percentOfLimitProgressBar: css`
      width: ${theme.spacing(13)};
    `,
    white: css`
      color: ${theme.palette.text.primary};
    `,
    marketTable: css`
      padding: 0;

      ${theme.breakpoints.down('lg')} {
        background-color: transparent;
      }
    `,
    table: css`
      display: block;

      ${theme.breakpoints.down('lg')} {
        display: none;
      }
    `,
    cards: css`
      display: none;

      ${theme.breakpoints.down('lg')} {
        display: block;
      }
    `,
  };
};
