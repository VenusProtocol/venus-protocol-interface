import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { FONTS } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();
  return {
    btnClose: css`
      position: absolute;
      padding: 0;
      right: ${theme.spacing(6)};
      top: ${theme.spacing(6)};
    `,
    /* extra padding for placing the close button */
    noticeContainer: css`
      padding-right: ${theme.spacing(10)};
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
