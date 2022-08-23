import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    cellGroup: css`
      margin-bottom: ${theme.spacing(8)};

      ${theme.breakpoints.down('xxl')} {
        margin-bottom: ${theme.spacing(6)};
      }
    `,
  };
};
