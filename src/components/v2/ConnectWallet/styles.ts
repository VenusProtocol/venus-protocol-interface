import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    notice: css`
      margin-bottom: ${theme.spacing(10)};
      margin-top: ${theme.spacing(2)};
    `,
  };
};
