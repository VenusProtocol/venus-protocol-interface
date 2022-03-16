import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    main: css`
      flex-grow: 1;
      padding: 3px 3px 6px 3px;
      min-height: 100vh;
    `,
    footer: css`
      position: fixed;
      bottom: 0;
      left: 0;
      width: ${theme.shape.layoutOffset.width};
      margin-left: ${theme.shape.layoutOffset.ml};
    `,
  };
};
