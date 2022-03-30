import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    main: css`
      flex-grow: 1;
      margin: ${theme.spacing(6)} ${theme.spacing(6)} ${theme.shape.footerHeight}
        ${theme.spacing(6)};
    `,
    footer: css`
      position: fixed;
      bottom: 0;
      right: 0;
      width: calc(100vw - ${theme.shape.drawerWidthDesktop});
      ${theme.breakpoints.down('lg')} {
        width: calc(100vw - ${theme.shape.drawerWidthTablet});
      }
    `,
  };
};
