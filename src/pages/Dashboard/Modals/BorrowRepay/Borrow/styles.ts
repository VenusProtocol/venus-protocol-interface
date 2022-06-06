import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    liquidationWarning: css`
      margin-top: ${theme.spacing(3)};
      padding: ${theme.spacing(4)};
    `,
  };
};
