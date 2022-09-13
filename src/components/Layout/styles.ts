import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    layout: css`
      display: flex;
      flex: 1;
      flex-direction: row;
      height: 100vh;
      ${theme.breakpoints.down('lg')} {
        flex-direction: column;
      }
    `,
  };
};
