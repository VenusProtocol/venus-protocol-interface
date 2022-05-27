import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      margin: ${theme.spacing(6)};
      flex-direction: row;
      justify-content: space-between;
    `,
    myTransactions: css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `,
    select: css`
      width: ${theme.spacing(41)};
    `,
  };
};
