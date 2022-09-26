import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;

      ${theme.breakpoints.down('xl')} {
        display: block;
      }
    `,
    column: css`
      :not(:first-of-type) {
        margin-left: ${theme.spacing(4)};
      }

      :not(:last-of-type) {
        margin-right: ${theme.spacing(4)};
      }

      ${theme.breakpoints.down('xl')} {
        :not(:first-of-type) {
          margin-left: 0;
        }

        :not(:last-of-type) {
          margin-right: 0;
        }
      }
    `,
    graphsColumn: css`
      flex: 2;
    `,
    statsColumn: css`
      flex: 1;
    `,
    statsColumnButtonContainer: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(6)};
    `,
    statsColumnButton: css`
      margin-left: ${theme.spacing(3)};
      margin-right: ${theme.spacing(3)};

      :first-of-type {
        margin-left: 0;
      }

      :last-of-type {
        margin-right: 0;
      }
    `,
    graphCard: css`
      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(6)};
      }

      ${theme.breakpoints.down('xl')} {
        :last-of-type {
          margin-bottom: ${theme.spacing(6)};
        }
      }
    `,
    legendColors: {
      supplyApy: theme.palette.interactive.success,
      borrowApy: theme.palette.interactive.error,
      utilizationRate: theme.palette.interactive.primary,
    },
    apyChart: css`
      margin-right: ${theme.spacing(-2.5)};
    `,
  };
};
