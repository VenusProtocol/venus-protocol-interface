import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    cardContentGrid: css`
      .table__table-cards__card-content {
        grid-template-columns: 1fr 1fr minmax(${theme.spacing(30)}, 1fr);
        grid-template-rows: 1fr;
      }
    `,
  };
};
