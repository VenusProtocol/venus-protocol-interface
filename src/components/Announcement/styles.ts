import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    banner: css`
      padding: ${theme.spacing(4)};
      margin-bottom: ${theme.spacing(4)};
    `,
  };
};
