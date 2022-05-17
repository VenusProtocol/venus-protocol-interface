import { css } from '@emotion/react';

export const useStyles = () => ({
  cardContentGrid: css`
    .table__table-cards__card-content {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
    }
  `,
});
