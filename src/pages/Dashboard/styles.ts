import { css } from '@emotion/react';
import { useTheme } from '@mui/material';
import { isFeatureEnabled } from 'utilities';

export const useStyles = () => {
  const theme = useTheme();

  return {
    header: css`
      margin-bottom: ${theme.spacing(6)};

      ${!isFeatureEnabled('isolatedPools') && theme.breakpoints.down('xl')} {
        margin-bottom: 0;
      }
    `,
    headerBottomRow: css`
      display: flex;
      align-items: center;
      justify-content: space-between;

      ${theme.breakpoints.down('md')} {
        display: block;
      }
    `,
    tags: css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-right: ${theme.spacing(4)};
      margin-top: ${theme.spacing(-2)};

      ${theme.breakpoints.down('xl')} {
        margin-right: 0;
      }

      ${theme.breakpoints.down('md')} {
        flex-wrap: nowrap;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;

        ::-webkit-scrollbar {
          display: none;
        }
      }
    `,
    tag: css`
      border-radius: ${theme.spacing(6)};
      padding: ${theme.spacing(2, 5)};
      white-space: nowrap;
      margin-top: ${theme.spacing(2)};

      :not(:last-of-type) {
        margin-right: ${theme.spacing(2)};
      }
    `,
    rightColumn: css`
      display: flex;
      align-items: center;
      margin-left: auto;
      justify-self: flex-end;
    `,
    tabletButtonGroup: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    tabletSearchTextField: css`
      width: 100%;
      margin-bottom: ${theme.spacing(6)};
    `,
    desktopSearchTextField: css`
      min-width: ${theme.spacing(75)};
    `,
    banner: css`
      padding: ${theme.spacing(4)};
      margin-bottom: ${theme.spacing(4)};
    `,
    desktopMarketTables: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: ${theme.spacing(6)};
    `,
  };
};
