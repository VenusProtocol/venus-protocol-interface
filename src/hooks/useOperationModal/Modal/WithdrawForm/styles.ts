import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    input: css`
      margin-bottom: ${theme.spacing(1)};
    `,
  };
};
