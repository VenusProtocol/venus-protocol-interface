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
      ${theme.breakpoints.down('md')} {
        flex-direction: column;
      }
    `,
    banner: css`
      margin: ${theme.spacing(4, 12)};
      ${theme.breakpoints.down('xl')} {
        margin: ${theme.spacing(4, 10)};
      }
      ${theme.breakpoints.down('lg')} {
        margin: ${theme.spacing(6)};
      }
      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(4)};
      }
    `,
  };
};
