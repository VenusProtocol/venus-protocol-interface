import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    tabContainer: css`
      margin-top: ${theme.spacing(10)};

      ${theme.breakpoints.down('md')} {
        margin-top: ${theme.spacing(8)};
      }
    `,
    displayWithdrawalRequestListButton: css`
      margin: ${theme.spacing(3, 'auto', -3)};
    `,
  };
};
