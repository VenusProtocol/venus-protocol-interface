import { css } from '@emotion/react';

export const useStyles = () => ({
  collateralCell: css`
    display: flex;
    justify-content: flex-end;
    padding-right: 24px;
  `,
  loadingIcon: css`
    height: 68px;
    width: 68px;
  `,
  collateralModalContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  `,
});
