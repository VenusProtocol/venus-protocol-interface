import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();

  return {
    supplyChartColor: theme.palette.interactive.success,
    borrowChartColor: theme.palette.interactive.error,
    areaActiveDot: { r: SPACING * 2, strokeWidth: SPACING },
    container: css`
      width: 100%;
      height: ${theme.spacing(62)};
    `,
  };
};
