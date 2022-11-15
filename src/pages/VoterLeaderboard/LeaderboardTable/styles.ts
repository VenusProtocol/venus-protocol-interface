import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    inline: css`
      display: flex;
    `,
    address: css`
      padding-left: ${theme.spacing(7)};
      color: ${theme.palette.interactive.primary};

      :hover {
        color: ${theme.palette.button.medium};
      }
    `,
    cardContentGrid: css`
      .MuiTableCell-root:first-of-type {
        overflow: visible;
      }

      .table__table-cards__card-content {
        ${theme.breakpoints.down('xl')} {
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr;
        }

        ${theme.breakpoints.down('md')} {
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr;
        }
      }
    `,
  };
};
