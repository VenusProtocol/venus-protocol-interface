import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    title: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(4)};
    `,
    marketName: css`
      margin-right: ${theme.spacing(3)};
    `,
    summary: css`
      margin-bottom: ${theme.spacing(6)};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(10)};
      }
    `,
  };
};
