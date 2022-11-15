import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    mobileSelect: css`
      margin-bottom: ${theme.spacing(6)};
      width: ${theme.spacing(56)};
    `,
    noWrap: css`
      > span {
        white-space: nowrap;
      }
    `,
    cardContentGrid: css`
      ${theme.breakpoints.down('xxl')} {
        background-color: initial;
        padding-top: 0;
        padding-bottom: 0;
      }

      .table__table-cards__card-content {
        ${theme.breakpoints.down('xxl')} {
          grid-template-columns: 1fr 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          row-gap: ${theme.spacing(5)};
        }

        ${theme.breakpoints.down('md')} {
          grid-template-columns: 1fr 1fr;
        }
      }
    `,
  };
};
