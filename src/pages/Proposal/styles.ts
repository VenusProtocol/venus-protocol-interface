import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      flex-direction: column;
    `,
    spinner: css`
      height: 100%;
    `,
    summary: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    votes: css`
      display: flex;
      margin-bottom: ${theme.spacing(8)};

      ${theme.breakpoints.down('xl')} {
        display: block;
      }
    `,
    vote: css`
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-right: ${theme.spacing(8)};

      ${theme.breakpoints.down('xl')} {
        margin-right: 0;
        margin-bottom: ${theme.spacing(4)};

        :last-of-type {
          margin-bottom: 0;
        }
      }

      :last-of-type {
        margin-right: 0;
      }
    `,
    successColor: theme.palette.interactive.success,
    againstColor: theme.palette.interactive.error,
    abstainColor: theme.palette.text.secondary,
  };
};
