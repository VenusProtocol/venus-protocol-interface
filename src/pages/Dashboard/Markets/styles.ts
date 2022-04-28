import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    tableContainer: css`
      width: 100%;
      padding: 0;
    `,
    delimiter: css`
      margin: ${theme.spacing(6)};
    `,
    balance: css`
      display: flex;
      flex-direction: column;
      align-items: flex-end;
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
