import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { FONTS } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();

  return {
    iconSize: theme.shape.iconSize.large,
    btnClose: css`
      position: absolute;
      padding: 0;
      right: ${theme.spacing(5)};
      top: ${theme.spacing(2)};
      color: ${theme.palette.text.secondary};

      &:hover:not(:disabled) svg,
      &:active:not(:disabled) svg {
        color: ${theme.palette.text.primary};
      }
    `,
    /* extra padding for placing the close button */
    noticeContainer: css`
      max-width: ${theme.spacing(140)};
      padding-right: ${theme.spacing(9)};

      ${theme.breakpoints.down('md')} {
        padding-right: ${theme.spacing(8)};
      }
    `,
  };
};

export const customToastGlobalStyles = {
  '.Toastify__toast-container': {
    width: 'auto',
    maxWidth: 'calc(100vw - 40px)',
    '.Toastify__toast': {
      fontFamily: FONTS.primary,
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },
};
