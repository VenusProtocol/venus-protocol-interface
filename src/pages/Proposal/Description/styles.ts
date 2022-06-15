import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      /* add custom styles for specific markdown elements if needed */
      p {
        color: ${theme.palette.text.primary};
      }
    `,
  };
};
