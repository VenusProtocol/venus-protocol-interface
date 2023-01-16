import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      flex-direction: row;
      ${theme.breakpoints.down('lg')} {
        flex-direction: column-reverse;
      }
    `,
  };
};
