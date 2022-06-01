import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    noWrap: css`
      > span {
        white-space: nowrap;
      }
    `,
    cardContentGrid: `
      .table__table-cards__card-content {
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
    `,
  };
};
