import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();

  return {
    tickMargin: SPACING * 2,
    accessoryColor: theme.palette.text.secondary,
    axis: theme.typography.tiny,
    gridLineColor: theme.palette.secondary.light,
    container: css`
      width: 100%;
      height: ${theme.spacing(62)};
    `,
  };
};
