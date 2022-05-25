import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-top: ${theme.spacing(10)};
      ${theme.breakpoints.down('md')} {
        margin-top: ${theme.spacing(8)};
      }
    `,
    input: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    greyLabel: css`
      color: ${theme.palette.text.secondary};
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
    totalAndLimit: css`
      display: flex;
      justify-content: space-between;
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 8 : 3)};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(isLast ? 6 : 3)};

        span {
          font-size: 0.875rem;
        }
      }
    `,
    bottomRow: css`
      margin-bottom: ${theme.spacing(12)};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(8)};
      }
    `,
  };
};
