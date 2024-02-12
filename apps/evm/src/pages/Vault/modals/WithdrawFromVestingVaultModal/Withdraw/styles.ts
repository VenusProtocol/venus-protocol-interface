import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    content: css`
      margin-bottom: ${theme.spacing(12)};
    `,
  };
};
