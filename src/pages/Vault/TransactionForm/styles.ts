import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    tokenTextField: css`
      margin-bottom: ${theme.spacing(8)};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(7)};
      }
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 12 : 3)};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(8)};
      }
    `,
  };
};
