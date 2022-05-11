import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    lineBorrowApyColor: theme.palette.interactive.error,
    lineSupplyApyColor: theme.palette.interactive.success,
    container: css`
      width: 100%;
      height: ${theme.spacing(95)};
    `,
  };
};
