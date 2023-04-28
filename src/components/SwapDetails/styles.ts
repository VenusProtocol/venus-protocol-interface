import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    row: css`
      margin-bottom: ${theme.spacing(3)};

      ${theme.breakpoints.down('md')} {
        span {
          font-size: ${theme.typography.small1.fontSize};
        }
      }
    `,
  };
};
