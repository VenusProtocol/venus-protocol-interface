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
      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    vote: css`
      display: flex;
      flex-direction: column;
      flex: 1;
    `,
    middleVote: css`
      margin: 0 ${theme.spacing(8)};
      ${theme.breakpoints.down('sm')} {
        margin: ${theme.spacing(4)} 0;
      }
    `,
    successColor: theme.palette.interactive.success,
    againstColor: theme.palette.interactive.error,
    abstainColor: theme.palette.text.secondary,
  };
};
