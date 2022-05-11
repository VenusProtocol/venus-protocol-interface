import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    title: css`
      margin-bottom: ${theme.spacing(4)};
    `,
  };
};
