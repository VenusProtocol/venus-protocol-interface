import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    table: css`
      width: calc(50% - ${theme.spacing(3)});

      ${theme.breakpoints.down('lg')} {
        width: auto;
      }
    `,
  };
};
