import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    separator: css`
      color: ${theme.palette.text.secondary};
      margin: ${theme.spacing(0, 3)};
    `,
  };
};
