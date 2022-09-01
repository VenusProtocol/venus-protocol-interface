import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    section: css`
      margin-bottom: ${theme.spacing(14)};

      ${theme.breakpoints.down('lg')} {
        margin-bottom: ${theme.spacing(10)};
      }
    `,
    sectionTitle: css`
      margin-bottom: ${theme.spacing(6)};

      ${theme.breakpoints.down('lg')} {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    getNetApyColor: ({ netApyPercentage }: { netApyPercentage: number }) =>
      netApyPercentage > 0 ? theme.palette.interactive.success : theme.palette.interactive.error,
  };
};
