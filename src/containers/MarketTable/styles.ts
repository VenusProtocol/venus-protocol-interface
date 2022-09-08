import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
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
    percentOfLimit: css`
      display: flex;
      align-items: center;
      justify-content: flex-end;

      > :first-of-type {
        margin-right: ${theme.spacing(2)};
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
