import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();

  return {
    lineBorrowApyColor: theme.palette.interactive.error,
    lineSupplyApyColor: theme.palette.interactive.success,
    lineActiveDot: { r: SPACING * 1.5, strokeWidth: 0 },
    container: css`
      width: 100%;
      height: ${theme.spacing(95)};
    `,
  };
};
