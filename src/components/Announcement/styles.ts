import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    banner: css`
      margin-bottom: ${theme.spacing(8)};
    `,
  };
};
