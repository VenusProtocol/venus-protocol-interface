import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    tableContainer: css`
      width: 100%;
      padding: 0;

      ${theme.breakpoints.down('sm')} {
        background-color: transparent;
      }
    `,
    delimiter: css`
      margin: ${theme.spacing(6)};

      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
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

      h4 {
        display: block;

        ${theme.breakpoints.down('lg')} {
          display: none;
        }

        ${theme.breakpoints.down('sm')} {
          display: block;
        }
      }
    `,
    generalMarketTable: css`
      h4 {
        display: block;
      }
    `,
    table: css`
      display: block;

      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    cards: css`
      display: none;

      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
  };
};
