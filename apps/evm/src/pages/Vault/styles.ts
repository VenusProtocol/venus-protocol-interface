import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: ${theme.spacing(6)};

      ${theme.breakpoints.down('xl')} {
        grid-template-columns: 1fr;
      }
    `,
  };
};
