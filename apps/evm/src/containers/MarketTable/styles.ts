import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    getColumnLabelInfoIcon: ({ hasRightMargin }: { hasRightMargin: boolean }) => css`
      vertical-align: sub;
      margin-left: ${theme.spacing(1)};

      ${
        hasRightMargin &&
        css`
        margin-right: ${theme.spacing(1)};
      `
      };
    `,
    cardContentGrid: css`
      .table-card-content {
        grid-template-columns: 1fr 1fr 1fr;
        row-gap: ${theme.spacing(4)};

        ${theme.breakpoints.up('md')} {
          row-gap: ${theme.spacing(5)};
        }
      }

      ${theme.breakpoints.down('sm')} {
        .table-card-content {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
        }
      }
    `,
    userBorrowLimitSharePercentage: css`
      display: flex;
      align-items: center;
      justify-content: flex-end;

      > :first-of-type {
        margin-right: ${theme.spacing(2)};
      }

      ${theme.breakpoints.down('md')} {
        justify-content: flex-start;
      }
    `,
    percentOfLimitProgressBar: css`
      width: ${theme.spacing(13)};
    `,
    white: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
