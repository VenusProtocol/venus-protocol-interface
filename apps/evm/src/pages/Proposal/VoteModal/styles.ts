import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      > div:first-of-type {
        margin-bottom: ${theme.spacing(8)};
      }
    `,
    votingPower: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    comment: css`
      margin-bottom: ${theme.spacing(8)};
    `,
  };
};
