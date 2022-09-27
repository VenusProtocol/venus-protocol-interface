import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    notice: css`
      padding: ${theme.spacing(3)};
      border-radius: ${theme.spacing(3)};
    `,
  };
};
