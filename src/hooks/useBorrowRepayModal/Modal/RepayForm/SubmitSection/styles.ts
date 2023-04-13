import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    swapSummary: css`
      margin-top: ${theme.spacing(4)};
      text-align: center;
    `,
  };
};
