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
    sectionTitle: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: ${theme.spacing(6)};

      ${theme.breakpoints.down('lg')} {
        margin-bottom: ${theme.spacing(4)};
      }

      ${theme.breakpoints.down('md')} {
        flex-direction: column-reverse;
        align-items: flex-start;
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    sectionTitleText: css`
      ${theme.breakpoints.down('md')} {
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.h4.fontWeight};
      }
    `,
    sectionTitleToggle: css`
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(6)};
      }
    `,
    getNetApyColor: ({ netApyPercentage }: { netApyPercentage: number }) =>
      netApyPercentage >= 0 ? theme.palette.interactive.success : theme.palette.interactive.error,
  };
};
