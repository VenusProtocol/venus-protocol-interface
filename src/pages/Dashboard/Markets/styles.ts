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

      > :first-child {
        color: ${theme.palette.text.primary};
      }
    `,
    percentOfLimit: css`
      display: flex;
      width: 100%;
      align-items: center;
      > :first-child {
        margin-right: ${theme.spacing(2)};
      }
    `,
    white: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
