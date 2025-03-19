import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    desktopContainer: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: ${theme.spacing(6)};
    `,
    tabletContainer: css`
      padding-left: 0;
      padding-right: 0;

      ${theme.breakpoints.down('md')} {
        padding: 0;
        background: transparent;
      }
    `,
    tabletHeader: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: ${theme.spacing(3)};
      padding-left: ${theme.spacing(6)};
      padding-right: ${theme.spacing(6)};

      ${theme.breakpoints.down('md')} {
        display: block;
        padding: 0;
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    tabletHeaderTitle: css`
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    tabletHeaderButtonGroup: css`
      > button {
        padding-left: ${theme.spacing(5)};
        padding-right: ${theme.spacing(5)};
      }

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(4)};

        > button {
          flex: 1;
        }
      }
    `,
    tabletMarketTable: css`
      padding: 0;
    `,
  };
};
