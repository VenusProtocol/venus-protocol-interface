import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    preview: css`
      p {
        color: ${theme.palette.text.primary};
      }
    `,
  };
};
