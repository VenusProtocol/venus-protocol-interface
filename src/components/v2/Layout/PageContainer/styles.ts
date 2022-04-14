import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    main: css`
      flex-grow: 1;
      margin: ${theme.spacing(8)} ${theme.spacing(10)} ${theme.shape.footerHeight};

      ${theme.breakpoints.down('lg')} {
        margin-left: ${theme.spacing(6)};
        margin-right: ${theme.spacing(6)};
      }

      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(4)} ${theme.spacing(4)} ${theme.shape.footerHeight};
      }
    `,
    footer: css`
      position: fixed;
      bottom: 0;
      right: 0;
      width: calc(100% - ${theme.shape.drawerWidthDesktop});
      ${theme.breakpoints.down('lg')} {
        width: calc(100% - ${theme.shape.drawerWidthTablet});
      }

      ${theme.breakpoints.down('md')} {
        width: 100%;
      }
    `,
  };
};
