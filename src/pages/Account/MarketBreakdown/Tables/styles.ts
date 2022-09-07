import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    desktopContainer: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: ${theme.spacing(8)};
    `,
    tabletContainer: css`
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

      ${theme.breakpoints.down('md')} {
        display: block;
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    tabletHeaderTitle: css`
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    tabletHeaderButtonGroup: css`
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(4)};

        > button {
          flex: 1;
        }
      }
    `,
    tabletMarketTable: css`
      padding: 0;
      margin: ${theme.spacing(0, -6)};

      ${theme.breakpoints.down('md')} {
        margin: 0;
      }
    `,
    mobileSelect: css`
      width: ${theme.spacing(56)};
    `,
  };
};
