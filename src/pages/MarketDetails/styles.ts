import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;

      ${theme.breakpoints.down('lg')} {
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

      ${theme.breakpoints.down('lg')} {
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
    graphCard: css`
      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(6)};
      }

      ${theme.breakpoints.down('lg')} {
        :last-of-type {
          margin-bottom: ${theme.spacing(6)};
        }
      }
    `,
  };
};
