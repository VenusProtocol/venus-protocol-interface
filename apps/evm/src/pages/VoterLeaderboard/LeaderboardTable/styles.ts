import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    inline: css`
      display: flex;

      > a {
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: ${theme.spacing(8)};
        color: ${theme.palette.interactive.primary};
      }
    `,
    address: css`
      :hover {
        color: ${theme.palette.button.medium};
      }
    `,
    cardContentGrid: css`
      .table-card-content {
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
