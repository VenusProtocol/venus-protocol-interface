import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    text: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
