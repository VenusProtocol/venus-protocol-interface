import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 6 : 3)};

      ${theme.breakpoints.down('md')} {
        span {
          font-size: ${theme.typography.small1.fontSize};
        }
      }
    `,
  };
};
