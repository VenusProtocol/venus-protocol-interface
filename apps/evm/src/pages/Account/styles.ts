import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    section: css`
      :not(:last-child) {
        margin-bottom: ${theme.spacing(14)};
      }

      ${theme.breakpoints.down('lg')} {
        :not(:last-child) {
          margin-bottom: ${theme.spacing(10)};
        }
      }
    `,
    getNetApyColor: ({ netApyPercentage }: { netApyPercentage: number }) =>
      netApyPercentage >= 0 ? theme.palette.interactive.success : theme.palette.interactive.error,
  };
};
