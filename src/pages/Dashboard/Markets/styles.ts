import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    marketTable: css`
      padding: 0;

      ${theme.breakpoints.down('lg')} {
        background-color: transparent;
      }
    `,
    table: css`
      display: block;

      ${theme.breakpoints.down('lg')} {
        display: none;
      }
    `,
    cards: css`
      display: none;

      ${theme.breakpoints.down('lg')} {
        display: block;
      }
    `,
    marketLink: css`
      text-decoration: underline;
      color: ${theme.palette.text.primary};

      > * {
        color: inherit;
      }

      :hover {
        color: ${theme.palette.interactive.primary};
      }
    `,
    cardContentGrid: css`
      .table__table-cards__card-content {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

      ${theme.breakpoints.down('sm')} {
        .table__table-cards__card-content {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
          row-gap: ${theme.spacing(5)};
        }
      }
    `,
  };
};
