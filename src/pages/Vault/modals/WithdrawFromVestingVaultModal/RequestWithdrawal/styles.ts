import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    displayWithdrawalRequestListButton: css`
      margin: ${theme.spacing(3, 'auto', -3)};
    `,
  };
};
