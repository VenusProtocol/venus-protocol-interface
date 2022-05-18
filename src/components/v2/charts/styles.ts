import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();
  const accessoryColor = theme.palette.text.secondary;

  return {
    chartMargin: {
      top: SPACING * 5,
      right: SPACING * 2.5,
      left: -SPACING * 3,
    },
    supplyChartColor: theme.palette.interactive.success,
    borrowChartColor: theme.palette.interactive.error,
    gridLineColor: theme.palette.secondary.light,
    accessoryColor,
    cursor: { strokeDasharray: `${SPACING} ${SPACING}`, stroke: accessoryColor },
    lineStrokeWidth: theme.spacing(0.5),
    axis: theme.typography.tiny,
    tickMargin: SPACING * 2,
    container: css`
      width: 100%;
      height: ${theme.spacing(62)};
    `,
  };
};
