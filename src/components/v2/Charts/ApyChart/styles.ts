import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();

  return {
    supplyChartColor: theme.palette.interactive.success,
    borrowChartColor: theme.palette.interactive.error,
    chartMargin: {
      top: SPACING * 3,
      right: SPACING * 2.5,
      left: -SPACING * 4,
    },
    areaActiveDot: { r: SPACING * 2, strokeWidth: SPACING },
    container: css`
      width: 100%;
      height: ${theme.spacing(62)};
    `,
  };
};
