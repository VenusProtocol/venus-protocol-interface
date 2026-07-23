import { css } from '@emotion/react';

export const useStyles = () => {
  return {
    root: css`
      display: flex;
      flex-direction: column;
    `,
    spinner: css`
      height: 100%;
    `,
  };
};
