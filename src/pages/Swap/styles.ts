import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    container: css`
      max-width: ${theme.spacing(136)};
      width: 100%;
      padding: ${theme.spacing(10)};
      margin: ${theme.spacing(34, 'auto', 0)};

      ${theme.breakpoints.down('md')} {
        max-width: 100%;
        padding: ${theme.spacing(4)};
        margin-top: ${theme.spacing(0)};
      }
    `,
  };
};
